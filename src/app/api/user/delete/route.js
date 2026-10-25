import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import LearningPathProgress from "@/models/LearningPathProgress";
import Resume from "@/models/Resume";
import { deleteS3Object } from "@/lib/s3";

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
    const resumes = await Resume.find({ userId }).select("key").lean();
    await Promise.all(resumes.map((resume) => deleteS3Object(resume.key)));
    await Promise.all([
      Assessment.deleteOne({ userId }),
      AssessmentResult.deleteOne({ userId }),
      MentalAbilityAttempt.deleteMany({ userId }),
      SkillGapAnalysis.deleteMany({ userId }),
      LearningPathProgress.deleteMany({ userId }),
      Resume.deleteMany({ userId }),
      User.deleteOne({ _id: userId }),
    ]);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
