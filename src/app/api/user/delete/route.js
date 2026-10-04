import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import LearningPathProgress from "@/models/LearningPathProgress";

export async function DELETE(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { confirmation } = await req.json().catch(() => ({}));
    if (confirmation !== "DELETE") {
      return Response.json({ error: 'Type "DELETE" to confirm account deletion' }, { status: 400 });
    }
    await connectDB();
    const userId = token.id;
    await Promise.all([
      Assessment.deleteOne({ userId }),
      AssessmentResult.deleteOne({ userId }),
      MentalAbilityAttempt.deleteMany({ userId }),
      SkillGapAnalysis.deleteMany({ userId }),
      LearningPathProgress.deleteMany({ userId }),
      User.deleteOne({ _id: userId }),
    ]);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
