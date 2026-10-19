import { GoogleGenerativeAI } from "@google/generative-ai";
import { getToken } from "next-auth/jwt";
import crypto from "crypto";
import { connectDB } from "@/lib/db";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function parseModelJson(text) {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "");
  return JSON.parse(cleaned);
}

export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      console.error("[skill-gap/analyze] Error: token.id is missing", {
        token,
      });
      return Response.json(
        { error: "Unauthorized: User ID not found" },
        { status: 401 },
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 },
      );
    }

    await connectDB();

    const { targetRole, experienceLevel, userSkills } =
      await req.json();

    if (
      typeof targetRole !== "string" ||
      !targetRole.trim() ||
      typeof experienceLevel !== "string" ||
      !experienceLevel.trim()
    ) {
      return Response.json(
        { error: "Target role and experience level are required" },
        { status: 400 },
      );
    }
    if (!Array.isArray(userSkills)) {
      return Response.json(
        { error: "User skills must be an array" },
        { status: 400 },
      );
    }

    // ✅ CREATE HASH - per-user caching with skills included
    // Each user gets their own cached analysis based on their skills
    const inputHash = crypto
      .createHash("sha256")
      .update(
        JSON.stringify({
          targetRole,
          experienceLevel,
          userSkills,
        }),
      )
      .digest("hex");

    console.log(
      `[skill-gap/analyze] Looking for cached analysis for user ${token.id}`
    );

    // ✅ CHECK CACHE FIRST - per-user cache lookup
    const existing = await SkillGapAnalysis.findOne({
      userId: token.id,
      inputHash,
    }).lean();

    if (existing) {
      console.log("✅ Returning cached analysis (backend cache hit)");
      return Response.json({
        success: true,
        fromCache: true,
        cached: true,
        ...existing.analysisJSON,
      });
    }

    console.log("⏳ Cache miss - calling Gemini API...");

    // ================= GEMINI CALL =================
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const prompt = `You are a career analysis assistant inside SkillVista.

Given:
- Target Role: ${targetRole}
- Experience Level: ${experienceLevel}
- User Skills: ${JSON.stringify(userSkills || [])}

Analyze and return STRICT JSON in this exact format:
{
  "matchPercentage": <number 0-100>,
  "requiredSkills": {
    "frontend": [
      { "name": "<skill>", "status": "strong" | "basic" | "missing", "category": "frontend" }
    ],
    "backend": [
      { "name": "<skill>", "status": "strong" | "basic" | "missing", "category": "backend" }
    ],
    "tools": [
      { "name": "<skill>", "status": "strong" | "basic" | "missing", "category": "tools" }
    ],
    "softSkills": [
      { "name": "<skill>", "status": "strong" | "basic" | "missing", "category": "softSkills" }
    ]
  },
  "skillComparison": [
    { "skill": "<name>", "required": true, "userHas": true | false, "gapStatus": "No Gap" | "Critical Gap" | "Moderate Gap" | "Optional Enhancement" }
  ],
  "gapBreakdown": {
    "critical": ["<skill1>", "<skill2>"],
    "moderate": ["<skill1>", "<skill2>"],
    "optional": ["<skill1>", "<skill2>"]
  },
  "actionPlan": [
    {
      "title": "<action title>",
      "description": "<brief description>",
      "estimatedTime": "<e.g., 1 week>",
      "resourceUrl": "<URL to a learning resource>",
      "priority": "high" | "medium" | "low"
    }
  ],
  "roadmap": {
    "week1": "<focus area>",
    "week2": "<focus area>",
    "week3": "<focus area>",
    "week4": "<focus area>"
  },
  "projectIdea": {
    "title": "<project name>",
    "description": "<what to build>",
    "skillsCovered": ["<skill1>", "<skill2>"]
  }
}

Rules:
- Compare user skills with required skills for the role at the given experience level.
- Calculate match percentage based on how many required skills the user has.
- Identify ALL missing skills and categorize them as Critical Gap, Moderate Gap, or Optional Enhancement.
- Generate a practical 30-day improvement roadmap broken into 4 weeks.
- Suggest 1 project idea to close major gaps.
- Include 3-5 actionable next steps with real resource URLs.
- Keep response structured and concise.
- Professional tone.
- Only return JSON, no markdown, no explanation.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    let analysis;
    try {
      analysis = parseModelJson(text);
    } catch {
      throw new Error("The AI returned an invalid analysis response");
    }

    if (
      typeof analysis !== "object" ||
      analysis === null ||
      typeof analysis.matchPercentage !== "number" ||
      !Array.isArray(analysis.skillComparison)
    ) {
      throw new Error("The AI returned an incomplete analysis response");
    }

    // ✅ SAVE TO MONGODB - per-user caching
    await SkillGapAnalysis.create({
      userId: token.id,
      targetRole,
      experienceLevel,
      inputHash,
      analysisJSON: analysis,
    });

    console.log("💾 Saved new analysis for user");

    return Response.json({
      success: true,
      fromCache: false,
      ...analysis,
    });
  } catch (error) {
    console.error("[skill-gap/analyze] Error:", error.message);
    return Response.json(
      { error: `Failed to analyze skill gap: ${error.message}` },
      { status: 500 },
    );
  }
}
