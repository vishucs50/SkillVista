import mongoose from "mongoose";

const LearningPathProgressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    actionKey: { type: String, required: true },
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { timestamps: true },
);

LearningPathProgressSchema.index({ userId: 1, actionKey: 1 }, { unique: true });

export default mongoose.models.LearningPathProgress ||
  mongoose.model("LearningPathProgress", LearningPathProgressSchema);
