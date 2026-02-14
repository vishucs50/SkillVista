import mongoose from "mongoose";

const AssessmentResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: true,
    },

    employabilityIndex: Number,
    aptitudeScore: Number,

    criticalSkillGaps: [String],
    nextBestActions: [String],

    readinessBreakdown: {
      skills: Number,
      aptitude: Number,
      experience: Number,
      consistency: Number,
    },

    generatedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.models.AssessmentResult ||
  mongoose.model("AssessmentResult", AssessmentResultSchema);
