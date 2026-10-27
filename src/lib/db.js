import mongoose from "mongoose";
import { getAppSecrets } from "@/lib/secrets";

export const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    const secrets = await getAppSecrets();
    mongoUri = secrets?.MONGODB_URI?.trim();
  }

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not available at runtime. Ensure it is configured in AWS Secrets Manager or environment variables.",
    );
  }

  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};