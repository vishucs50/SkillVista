import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import AssessmentResult from "@/models/AssessmentResult";

export async function GET(req) {
  await connectDB();

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const result = await AssessmentResult.findOne({
    userId: token.id,
  }).lean();

  return Response.json(result);
}
