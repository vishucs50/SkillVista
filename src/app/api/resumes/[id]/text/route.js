import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getS3Object } from "@/lib/s3";
import { extractResumeText } from "@/lib/extractResumeText";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId: token.id }).lean();
    if (!resume) return Response.json({ error: "Resume not found" }, { status: 404 });

    const object = await getS3Object(resume.key);
    if (!object.Body) return Response.json({ error: "Resume file is unavailable" }, { status: 404 });
    const buffer = Buffer.from(await object.Body.transformToByteArray());
    let text;

    text = await extractResumeText({
      buffer,
      contentType: resume.contentType,
    });

    if (!text?.trim()) {
      return Response.json({ error: "Could not extract text from this resume" }, { status: 422 });
    }

    return Response.json({ text: text.trim() });
  } catch (error) {
    console.error("[api/resumes/text] Error:", error);
    return Response.json({ error: "Failed to read resume text" }, { status: 500 });
  }
}
