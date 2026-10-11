import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI?.trim();

  if (!mongoUri) {
    throw new Error(
      "MONGODB_URI is not available at runtime. Add it to the deployed Amplify branch and redeploy.",
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
