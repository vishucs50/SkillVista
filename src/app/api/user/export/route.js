import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import LearningPathProgress from "@/models/LearningPathProgress";
import Resume from "@/models/Resume";

export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const userId = token.id;
    const [user, assessment, results, attempts, analyses, progress, resumes] = await Promise.all([
      User.findById(userId).select("-password -githubToken").lean(),
      Assessment.findOne({ userId }).lean(),
      AssessmentResult.findOne({ userId }).lean(),
      MentalAbilityAttempt.find({ userId }).lean(),
      SkillGapAnalysis.find({ userId }).select("-inputHash").lean(),
      LearningPathProgress.find({ userId }).select("actionKey completed completedAt").lean(),
      Resume.find({ userId }).select("name contentType size createdAt").lean(),
    ]);
    const exportData = {
      exportedAt: new Date().toISOString(),
      account: user,
      assessment,
      assessmentResults: results,
      mentalAbilityAttempts: attempts,
      skillGapAnalyses: analyses,
      learningPathProgress: progress,
      resumes,
    };

    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": 'attachment; filename="skillvista-data.json"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
