import "@/lib/polyfills";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { getS3Object } from "@/lib/s3";
import { extractResumeText } from "@/lib/extractResumeText";
import { getAppSecrets } from "@/lib/secrets";

export const runtime = "nodejs";

export async function GET(req, { params }) {
  try {
    let nextAuthSecret = process.env.NEXTAUTH_SECRET;
    if (!nextAuthSecret) {
      const secrets = await getAppSecrets();
      nextAuthSecret = secrets.NEXTAUTH_SECRET;
    }

    const token = await getToken({ req, secret: nextAuthSecret });
    if (!token?.id) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    const resume = await Resume.findOne({ _id: id, userId: token.id }).lean();
    if (!resume) return Response.json({ error: "Resume not found" }, { status: 404 });

    let buffer;
    try {
      const object = await getS3Object(resume.key);
      if (!object.Body) return Response.json({ error: "Resume file is unavailable" }, { status: 404 });
      buffer = Buffer.from(await object.Body.transformToByteArray());
    } catch (s3Err) {
      console.error("[api/resumes/text] S3 error:", s3Err);
      return Response.json(
        { error: "Resume file could not be found in storage." },
        { status: 404 },
      );
    }

    let text;
    try {
      text = await extractResumeText({
        buffer,
        contentType: resume.contentType,
      });
    } catch (extractErr) {
      console.error("[api/resumes/text] Extract error:", extractErr);
      return Response.json(
        { error: "Could not extract readable text from this file." },
        { status: 422 },
      );
    }

    if (!text?.trim()) {
      return Response.json({ error: "Could not extract text from this resume" }, { status: 422 });
    }

    return Response.json({ text: text.trim() });
  } catch (error) {
    console.error("[api/resumes/text] Error:", error);
    return Response.json({ error: "Failed to read resume text" }, { status: 500 });
  }
}
