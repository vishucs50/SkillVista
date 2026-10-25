import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    key: { type: String, required: true, unique: true },
    contentType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true },
);

export default mongoose.models.Resume || mongoose.model("Resume", ResumeSchema);
