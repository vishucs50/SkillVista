import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

export async function POST(req) {
  try {
    const body = await req.json();
    const { image } = body; // base64 string

    const uploadRes = await cloudinary.uploader.upload(image, {
      folder: "profiles",
    });

    return NextResponse.json({
      url: uploadRes.secure_url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
