import "@/lib/polyfills";
import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { extractResumeText } from "@/lib/extractResumeText";
import { getS3Object, putS3Object } from "@/lib/s3";
import { getAppSecrets } from "@/lib/secrets";

export const runtime = "nodejs";

const VALID_DEGREES = [
  "B.Tech / B.E",
  "BCA",
  "MCA",
  "B.Sc (CS / IT)",
  "M.Tech",
  "Other",
];

const VALID_YEARS = [
  "1st Year",
  "2nd Year",
  "3rd Year",
  "Final Year",
  "Graduated",
];

const VALID_ROLES = [
  "Software Developer",
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Data Analyst",
  "ML Engineer",
  "UI/UX Designer",
];

const VALID_PROJECT_EXPERIENCE = [
  "None yet",
  "Mini / tutorial projects",
  "End-to-end projects",
];

function parseAiJson(raw) {
  if (!raw || typeof raw !== "string") return null;
  let text = raw.trim();

  // Strip markdown code fences
  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    // 1. Remove trailing commas before } or ]
    try {
      const repaired = text.replace(/,\s*([\]}])/g, "$1");
      return JSON.parse(repaired);
    } catch {}

    // 2. Extract outermost JSON object { ... }
    const firstBrace = text.indexOf("{");
    const lastBrace = text.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      try {
        const sliced = text
          .substring(firstBrace, lastBrace + 1)
          .replace(/,\s*([\]}])/g, "$1");
        return JSON.parse(sliced);
      } catch {}
    }

    // 3. Fallback: Parse individual fields via regex if json is truncated or malformed
    const result = {};

    const nameMatch = text.match(/"name"\s*:\s*"([^"]+)"/i);
    if (nameMatch) result.name = nameMatch[1];

    const collegeMatch = text.match(/"college"\s*:\s*"([^"]+)"/i);
    if (collegeMatch) result.college = collegeMatch[1];

    const degreeMatch = text.match(/"degree"\s*:\s*"([^"]+)"/i);
    if (degreeMatch) result.degree = degreeMatch[1];

    const yearMatch = text.match(/"year"\s*:\s*"([^"]+)"/i);
    if (yearMatch) result.year = yearMatch[1];

    const roleMatch = text.match(/"targetRole"\s*:\s*"([^"]+)"/i);
    if (roleMatch) result.targetRole = roleMatch[1];

    const projMatch = text.match(/"projectExperience"\s*:\s*"([^"]+)"/i);
    if (projMatch) result.projectExperience = projMatch[1];

    const skillsSection = text.match(/"skills"\s*:\s*\[([\s\S]*?)(\]|$)/i);
    if (skillsSection) {
      const skillMatches = [...skillsSection[1].matchAll(/"([^"]+)"/g)];
      result.skills = skillMatches.map((m) => m[1]);
    }

    if (Object.keys(result).length > 0) {
      return result;
    }

    throw err;
  }
}

async function generateWithRetry(model, prompt, maxRetries = 2) {
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await model.generateContent(prompt);
    } catch (err) {
      const msg = err?.message || "";
      const isTransient =
        msg.includes("503") ||
        msg.includes("429") ||
        msg.includes("high demand") ||
        msg.includes("Service Unavailable") ||
        msg.includes("ResourceExhausted");
      if (isTransient && attempt < maxRetries) {
        attempt++;
        console.warn(
          `[api/assessment/extract-resume] Transient error (${msg}), retrying attempt ${attempt}...`,
        );
        await new Promise((r) => setTimeout(r, 1200 * attempt));
        continue;
      }
      throw err;
    }
  }
}

export async function POST(req) {
  try {
    let nextAuthSecret = process.env.NEXTAUTH_SECRET;
    let geminiApiKey = process.env.GEMINI_API_KEY;

    if (!nextAuthSecret || !geminiApiKey) {
      const secrets = await getAppSecrets();
      nextAuthSecret = nextAuthSecret || secrets.NEXTAUTH_SECRET;
      geminiApiKey = geminiApiKey || secrets.GEMINI_API_KEY;
    }

    const token = await getToken({ req, secret: nextAuthSecret });
    if (!token?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!geminiApiKey) {
      return Response.json(
        { error: "AI service is not configured" },
        { status: 500 },
      );
    }

    const contentTypeHeader = req.headers.get("content-type") || "";
    let extractedText = "";
    let uploadedResumeDoc = null;

    if (contentTypeHeader.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");

      if (!file || typeof file === "string") {
        return Response.json(
          { error: "Please attach a valid resume file (PDF, DOCX, or TXT)." },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const contentType = file.type || "application/pdf";
      const fileName = file.name || "Resume.pdf";

      try {
        extractedText = await extractResumeText({ buffer, contentType });
      } catch (extractErr) {
        console.error("[api/assessment/extract-resume] Extract error:", extractErr);
        return Response.json(
          { error: "Could not read text from this file. Please verify it is a readable PDF, DOCX, or TXT document." },
          { status: 422 },
        );
      }

      // Persist resume to S3 and MongoDB
      try {
        await connectDB();
        const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `users/${token.id}/resumes/${crypto.randomUUID()}-${safeName}`;
        await putS3Object({ key, buffer, contentType });
        uploadedResumeDoc = await Resume.create({
          userId: token.id,
          name: fileName,
          key,
          contentType,
          size: buffer.length,
        });
      } catch (storageErr) {
        console.warn(
          "[api/assessment/extract-resume] Optional S3 storage skipped:",
          storageErr.message,
        );
      }
    } else {
      const body = await req.json();

      if (body.resumeId) {
        await connectDB();
        const resume = await Resume.findOne({
          _id: body.resumeId,
          userId: token.id,
        }).lean();

        if (!resume) {
          return Response.json(
            { error: "Selected resume could not be found." },
            { status: 404 },
          );
        }

        const object = await getS3Object(resume.key);
        if (!object.Body) {
          return Response.json(
            { error: "Resume file is currently unavailable in storage." },
            { status: 404 },
          );
        }

        const buffer = Buffer.from(await object.Body.transformToByteArray());
        extractedText = await extractResumeText({
          buffer,
          contentType: resume.contentType,
        });
        uploadedResumeDoc = resume;
      } else if (body.resumeText?.trim()) {
        extractedText = body.resumeText.trim();
      } else {
        return Response.json(
          { error: "Resume file, resumeId, or resumeText is required." },
          { status: 400 },
        );
      }
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return Response.json(
        {
          error:
            "The resume text appears to be empty or unreadable. Please upload a clear text or standard PDF resume.",
        },
        { status: 422 },
      );
    }

    // Call Gemini to parse and structure the profile details
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Analyze this candidate resume and accurately extract their profile and academic details for an onboarding assessment form.
Return only valid JSON matching this exact structure:
{
  "name": string (Full Name of the candidate, or empty string if not found),
  "college": string (College, University, or Institute name, or empty string),
  "degree": string (Must match the closest option from: "B.Tech / B.E", "BCA", "MCA", "B.Sc (CS / IT)", "M.Tech", "Other"),
  "year": string (Must match the closest option based on graduation date or current year: "1st Year", "2nd Year", "3rd Year", "Final Year", "Graduated"),
  "targetRole": string (Identify the primary career target from: "Software Developer", "Software Engineer", "Frontend Developer", "Backend Developer", "Data Analyst", "ML Engineer", "UI/UX Designer"),
  "skills": string[] (Array of specific technical skills, programming languages, and tools found in the resume),
  "projectExperience": string (Evaluate projects listed: "None yet", "Mini / tutorial projects", or "End-to-end projects"),
  "resumeStatus": string (Always return "ATS-ready resume")
}

Resume content:
${extractedText.substring(0, 8000)}`;

    const aiResult = await generateWithRetry(model, prompt);
    const parsed = parseAiJson(aiResult.response.text());

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Could not parse AI response into structured data");
    }

    // Sanitize values against allowed options
    const degree = VALID_DEGREES.includes(parsed.degree)
      ? parsed.degree
      : "Other";

    const year = VALID_YEARS.includes(parsed.year)
      ? parsed.year
      : "Final Year";

    const targetRole = VALID_ROLES.includes(parsed.targetRole)
      ? parsed.targetRole
      : "Software Developer";

    const projectExperience = VALID_PROJECT_EXPERIENCE.includes(
      parsed.projectExperience,
    )
      ? parsed.projectExperience
      : "End-to-end projects";

    const skills = Array.isArray(parsed.skills)
      ? parsed.skills.filter(
          (s) => typeof s === "string" && s.trim().length > 0,
        )
      : [];

    return Response.json({
      success: true,
      data: {
        name: parsed.name?.trim() || "",
        college: parsed.college?.trim() || "",
        degree,
        year,
        targetRole,
        skills,
        projectExperience,
        resumeStatus: "ATS-ready resume",
        resumeId: uploadedResumeDoc?._id || uploadedResumeDoc?.id || undefined,
        resumeName: uploadedResumeDoc?.name || undefined,
      },
    });
  } catch (error) {
    console.error("[api/assessment/extract-resume] Error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return Response.json(
      { error: "Failed to extract details from resume. Please try again or fill in manually." },
      { status: 500 },
    );
  }
}
