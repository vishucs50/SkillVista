import mongoose from "mongoose";

const SkillGapAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: String,
      required: true,
    },
    analysisJSON: {
      type: Object,
      required: true,
    },
    inputHash: {
      type: String,
      required: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.SkillGapAnalysis ||
  mongoose.model("SkillGapAnalysis", SkillGapAnalysisSchema);
