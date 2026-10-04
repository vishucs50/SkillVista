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

    const { role, skills, gaps } = await req.json();
    if (!role?.trim()) return Response.json({ error: "Target role is required" }, { status: 400 });

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" },
    });
    const prompt = `Create interview preparation for a candidate targeting ${role}.
Candidate skills: ${JSON.stringify(skills || [])}
Known gaps: ${JSON.stringify(gaps || [])}
Return only JSON:
{
  "questions": [
    { "question": "...", "category": "technical|behavioral|scenario", "whatToCover": ["..."] }
  ],
  "tips": ["..."],
  "mockPlan": ["..."]
}
Generate 8 varied questions and concise practical guidance.`;
    const result = await model.generateContent(prompt);
    return Response.json(JSON.parse(result.response.text()));
  } catch (error) {
    console.error("[api/interview/generate] Error:", error);
    return Response.json({ error: "Failed to generate interview preparation" }, { status: 500 });
  }
}
