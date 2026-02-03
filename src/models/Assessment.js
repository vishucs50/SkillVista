import mongoose from "mongoose";

const BasicDetailsSchema = new mongoose.Schema(
  {
    name: String,
    college: String,
    degree: String,
    year: String,
    goalType: String,
    targetRole: String,
    interviewExperience: String,
    projectExperience: String,
    resumeStatus: String,
    timeline: String,
    weeklyHours: String,
    skills: [String],
  },
  { _id: false },
);

const AssessmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
    },

    basicDetails: BasicDetailsSchema,

    aptitudeAnswers: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true },
);

export default mongoose.models.Assessment ||
  mongoose.model("Assessment", AssessmentSchema);
