import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import AssessmentResult from "@/models/AssessmentResult";

export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = token.id;

    // Delete any cached skill-gap analyses and previous assessment results
    await SkillGapAnalysis.deleteMany({ userId });
    await AssessmentResult.findOneAndDelete({ userId });

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/user/clear-derived-data] ERROR:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
