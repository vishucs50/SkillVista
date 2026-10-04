import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import LearningPathProgress from "@/models/LearningPathProgress";

async function getUser(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  return token?.id;
}

export async function GET(req) {
  try {
    const userId = await getUser(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const progress = await LearningPathProgress.find({ userId }).select("actionKey completed").lean();
    return Response.json({ progress });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const userId = await getUser(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { actionKey, completed } = await req.json();
    if (!actionKey || typeof completed !== "boolean") {
      return Response.json({ error: "actionKey and completed are required" }, { status: 400 });
    }
    await connectDB();
    const progress = await LearningPathProgress.findOneAndUpdate(
      { userId, actionKey },
      { completed, completedAt: completed ? new Date() : null },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();
    return Response.json({ progress });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
