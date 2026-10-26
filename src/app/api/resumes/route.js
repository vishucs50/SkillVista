import crypto from "crypto";
import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import Resume from "@/models/Resume";
import { createUploadUrl, deleteS3Object } from "@/lib/s3";
import { getAppSecrets } from "@/lib/secrets";

const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);
const maxSize = 5 * 1024 * 1024;

async function getUserId(req) {
  let secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    const secrets = await getAppSecrets();
    secret = secrets.NEXTAUTH_SECRET;
  }
  const token = await getToken({ req, secret });
  return token?.id || null;
}

export async function GET(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const resumes = await Resume.find({ userId })
      .select("name contentType size createdAt")
      .sort({ createdAt: -1 })
      .lean();
    return Response.json({ resumes });
  } catch (error) {
    console.error("[api/resumes] GET error:", error);
    return Response.json({ error: "Failed to load resumes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { name, contentType, size } = await req.json();
    if (
      !name?.trim() ||
      !allowedTypes.has(contentType) ||
      !Number.isInteger(size) ||
      size <= 0 ||
      size > maxSize
    ) {
      return Response.json(
        { error: "Use a PDF, DOCX, or TXT resume smaller than 5 MB" },
        { status: 400 },
      );
    }

    await connectDB();
    const safeName = name.trim().replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = `users/${userId}/resumes/${crypto.randomUUID()}-${safeName}`;
    const uploadUrl = await createUploadUrl({ key, contentType });
    const resume = await Resume.create({
      userId,
      name: name.trim(),
      key,
      contentType,
      size,
    });

    return Response.json(
      { resume: { id: resume._id, name: resume.name }, uploadUrl },
      { status: 201 },
    );
  } catch (error) {
    console.error("[api/resumes] POST error:", error);
    return Response.json({ error: "Failed to prepare resume upload" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const userId = await getUserId(req);
    if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });
    const { id } = await req.json();
    await connectDB();
    const resume = await Resume.findOne({ _id: id, userId });
    if (!resume) return Response.json({ error: "Resume not found" }, { status: 404 });
    try {
      await deleteS3Object(resume.key);
    } catch (s3Err) {
      console.warn("[api/resumes] S3 deletion error (file might not exist):", s3Err.message);
    }
    await resume.deleteOne();
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/resumes] DELETE error:", error);
    return Response.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
