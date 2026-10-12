import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { getS3Object } from "@/lib/s3";

export async function GET(req) {
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });
    const key = new URL(req.url).searchParams.get("key");

    if (!token?.id || !key || !key.startsWith(`users/${token.id}/`)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const object = await getS3Object(key);
    if (!object.Body) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return new Response(object.Body, {
      headers: {
        "Cache-Control": "private, max-age=300",
        "Content-Type": object.ContentType || "application/octet-stream",
        ...(object.ContentLength
          ? { "Content-Length": String(object.ContentLength) }
          : {}),
      },
    });
  } catch (error) {
    console.error("[api/files] Download failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Could not download file" }, { status: 404 });
  }
}
