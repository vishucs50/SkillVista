import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";

/**
 * GET /api/skill-gap/history
 * 
 * Get all saved skill gap analyses for current user only
 * Shows: role, experienceLevel, createdAt, matchPercentage
 */
export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return Response.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectDB();

    // ✅ Get analyses for THIS USER ONLY
    const analyses = await SkillGapAnalysis.find({ userId: token.id })
      .select("targetRole experienceLevel analysisJSON createdAt")
      .sort({ createdAt: -1 })
      .lean();

    // Format the response to include match percentage
    const formattedAnalyses = analyses.map(analysis => ({
      role: analysis.targetRole,
      level: analysis.experienceLevel,
      matchPercentage: analysis.analysisJSON?.matchPercentage || 0,
      createdAt: analysis.createdAt,
      gapBreakdown: analysis.analysisJSON?.gapBreakdown || {},
      fullAnalysis: analysis.analysisJSON,
    }));

    console.log(`[skill-gap/history] Found ${formattedAnalyses.length} analyses for user ${token.id}`);

    return Response.json({
      success: true,
      count: formattedAnalyses.length,
      analyses: formattedAnalyses,
    });
  } catch (err) {
    console.error("[skill-gap/history] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
