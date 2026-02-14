import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Assessment from "@/models/Assessment";

export async function GET(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  await connectDB();

  const assessment = await Assessment.findOne({
    userId: token.id,
  }).lean();

  return Response.json({ assessment });
}
