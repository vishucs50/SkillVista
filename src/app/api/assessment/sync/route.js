import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";

export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();

    const userId = token.id;

    const incoming = body.basicDetails || {};

    const allowed = [
      "name",
      "college",
      "degree",
      "year",
      "goalType",
      "targetRole",
      "interviewExperience",
      "projectExperience",
      "resumeStatus",
      "timeline",
      "weeklyHours",
      "skills",
      "profileImage",
    ];

    const sanitized = {};
    for (const key of allowed) {
      if (Object.prototype.hasOwnProperty.call(incoming, key)) {
        sanitized[key] = incoming[key];
      }
    }


    const existing = await Assessment.findOne({ userId }).lean();
    const mergedBasic = {
      ...(existing?.basicDetails || {}),
      ...sanitized,
    };


    await Assessment.findOneAndUpdate(
      { userId },
      {
        userId,
        basicDetails: mergedBasic,
        aptitudeAnswers: body.aptitudeAnswers,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("[api/assessment/sync] ERROR:", error.message, error.stack);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
