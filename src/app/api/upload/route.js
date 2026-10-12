import { randomUUID } from "node:crypto";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { createUploadUrl } from "@/lib/s3";

const allowedImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const maxImageSize = 5 * 1024 * 1024;

export async function POST(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileName, contentType, size } = await req.json();

    if (
      typeof fileName !== "string" ||
      typeof contentType !== "string" ||
      !Number.isInteger(size) ||
      size <= 0
    ) {
      return NextResponse.json({ error: "Invalid file metadata" }, { status: 400 });
    }

    if (!allowedImageTypes.has(contentType) || size > maxImageSize) {
      return NextResponse.json(
        { error: "Profile images must be JPEG, PNG, or WebP files under 5 MB" },
        { status: 400 },
      );
    }

    const extension = contentType.split("/")[1];
    const key = `users/${token.id}/profile/${randomUUID()}.${extension}`;
    const uploadUrl = await createUploadUrl({ key, contentType });

    return NextResponse.json({
      uploadUrl,
      fileUrl: `/api/files?key=${encodeURIComponent(key)}`,
    });
  } catch (error) {
    console.error("[api/upload] Presign failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Could not prepare upload" }, { status: 500 });
  }
}
