import { getToken } from "next-auth/jwt";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getS3Object } from "@/lib/s3";
import { extractResumeText } from "@/lib/extractResumeText";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
export const runtime = "nodejs";

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "AI service is not configured" }, { status: 500 });
    }

    const { resumeText, resumeId, jobDescription } = await req.json();
    let resolvedResumeText = resumeText?.trim() || "";

    if (!resolvedResumeText && resumeId) {
      await connectDB();
      const resume = await Resume.findOne({ _id: resumeId, userId: token.id }).lean();
      if (!resume) return Response.json({ error: "Resume not found" }, { status: 404 });
      const object = await getS3Object(resume.key);
      if (!object.Body) return Response.json({ error: "Resume file is unavailable" }, { status: 404 });
      const buffer = Buffer.from(await object.Body.transformToByteArray());
      resolvedResumeText = await extractResumeText({
        buffer,
        contentType: resume.contentType,
      });
    }

    if (!resolvedResumeText.trim() || !jobDescription?.trim()) {
      return Response.json(
        { error: "Resume text and job description are required" },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = `Compare this candidate resume with the job description. Return only JSON:
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
    const result = await model.generateContent(prompt);
    return Response.json(JSON.parse(result.response.text()));
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
