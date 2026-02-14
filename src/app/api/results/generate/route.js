import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";

import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import { analyzeAssessment } from "@/lib/gemini/analyzeAssessment";

export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = token.id;
    console.log("[api/results/generate] userId:", userId);

    const assessment = await Assessment.findOne({ userId }).lean();
    if (!assessment) {
      console.error("[api/results/generate] Assessment not found for userId:", userId);
      return new Response("Assessment not found", { status: 404 });
    }

    console.log("[api/results/generate] Assessment found, calling analyzeAssessment...");

    // 🔥 Gemini analysis
    const result = await analyzeAssessment(assessment);
    
    console.log("[api/results/generate] Analysis result:", result);

    // 🔐 Save result (UPSERT)
    await AssessmentResult.findOneAndUpdate(
      { userId },
      {
        userId,
        ...result,
        generatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log("[api/results/generate] Result saved successfully");

    return Response.json(result);
  } catch (error) {
    console.error("[api/results/generate] ERROR:", error.message);
    console.error("[api/results/generate] Stack:", error.stack);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      { status: 500 }
    );
  }
}
