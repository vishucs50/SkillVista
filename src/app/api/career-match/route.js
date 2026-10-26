import "@/lib/polyfills";
import { getToken } from "next-auth/jwt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import User from "@/models/User";
import { getS3Object } from "@/lib/s3";
import { extractResumeText } from "@/lib/extractResumeText";
import { getAppSecrets } from "@/lib/secrets";
import { sendCareerMatchEmail } from "@/lib/email";

export const runtime = "nodejs";

// Duplicate email protection: 5-minute cooldown per user
const recentCareerEmails = new Map();
const COOLDOWN_MS = 5 * 60 * 1000;

function parseAiJson(raw) {
  if (!raw || typeof raw !== "string") return null;
  let text = raw.trim();

  if (text.startsWith("```json")) {
    text = text.replace(/^```json\s*/i, "").replace(/\s*```$/i, "");
  } else if (text.startsWith("```")) {
    text = text.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }
  text = text.trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    try {
      const repaired = text.replace(/,\s*([\]}])/g, "$1");
      return JSON.parse(repaired);
    } catch {}

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
          `[api/career-match] Transient error (${msg}), retrying attempt ${attempt}...`,
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

    const { resumeText, resumeId, jobDescription } = await req.json();
    let resolvedResumeText = resumeText?.trim() || "";

    if (!resolvedResumeText && resumeId) {
      await connectDB();
      const resume = await Resume.findOne({
        _id: resumeId,
        userId: token.id,
      }).lean();

      if (!resume) {
        return Response.json(
          { error: "Selected resume could not be found in your account." },
          { status: 404 },
        );
      }

      let buffer;
      try {
        const object = await getS3Object(resume.key);
        if (!object.Body) {
          return Response.json(
            { error: "Resume file is currently unavailable in storage." },
            { status: 404 },
          );
        }
        buffer = Buffer.from(await object.Body.transformToByteArray());
      } catch (s3Error) {
        console.error("[api/career-match] S3 read error:", s3Error);
        return Response.json(
          {
            error:
              "Unable to load the saved resume from cloud storage. Please re-upload your resume or paste the text directly.",
          },
          { status: 404 },
        );
      }

      try {
        resolvedResumeText = await extractResumeText({
          buffer,
          contentType: resume.contentType,
        });
      } catch (extractError) {
        console.error("[api/career-match] Extract error:", extractError);
        return Response.json(
          {
            error:
              "Could not extract text from this resume format. Please ensure it is a readable PDF, DOCX, or TXT file.",
          },
          { status: 422 },
        );
      }
    }

    if (!resolvedResumeText.trim() || !jobDescription?.trim()) {
      return Response.json(
        { error: "Resume text and job description are both required." },
        { status: 400 },
      );
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });

    const prompt = `Compare this candidate resume with the target job description. Return only a valid JSON object matching this schema:
{
  "matchPercentage": number,
  "strengths": ["..."],
  "missingSkills": ["..."],
  "keywordsToAdd": ["..."],
  "recommendations": ["..."]
}

Resume:
${resolvedResumeText}

Job description:
${jobDescription}`;

    const aiResult = await generateWithRetry(model, prompt);
    const parsedData = parseAiJson(aiResult.response.text());

    // Phase 3: Send summary email asynchronously with duplicate-send protection
    if (token.email) {
      const cacheKey = `${token.id}`;
      const lastSent = recentCareerEmails.get(cacheKey);
      const now = Date.now();

      if (!lastSent || now - lastSent > COOLDOWN_MS) {
        recentCareerEmails.set(cacheKey, now);

        connectDB()
          .then(() => User.findById(token.id).select("name email").lean())
          .then((user) => {
            const recipientEmail = user?.email || token.email;
            const recipientName = user?.name || token.name || "there";

            return sendCareerMatchEmail({
              name: recipientName,
              email: recipientEmail,
              result: parsedData,
            });
          })
          .then(() => {
            console.log(
              `[api/career-match] Career match result email dispatched for user ${token.id}`,
            );
          })
          .catch((emailErr) => {
            console.warn(
              "[api/career-match] Career match email delivery failed (non-blocking):",
              emailErr instanceof Error ? emailErr.message : String(emailErr),
            );
          });
      }
    }

    return Response.json(parsedData);
  } catch (error) {
    console.error("[api/career-match] Error:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    return Response.json(
      { error: "Failed to analyze career match. Please try again." },
      { status: 500 },
    );
  }
}
