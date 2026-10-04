import { getToken } from "next-auth/jwt";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "AI service is not configured" }, { status: 500 });
    }

    const { resumeText, jobDescription } = await req.json();
    if (!resumeText?.trim() || !jobDescription?.trim()) {
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
${resumeText}
Job description:
${jobDescription}`;
    const result = await model.generateContent(prompt);
    return Response.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("[api/career-match] Error:", error);
    return Response.json({ error: "Failed to analyze career match" }, { status: 500 });
  }
}
