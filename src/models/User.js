import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  profileImage: {
    type: String,
    default: "/download.jpeg",
  },
  // GitHub OAuth fields
  githubId: String,
  githubUsername: String,
  githubToken: String, // Access token for GitHub API
  githubConnected: {
    type: Boolean,
    default: false,
  },
  githubData: {
    topLanguages: [String],
    detectedFrameworks: [String],
    repositories: Number,
    followers: Number,
    contributions: Number,
    contributionLevel: String,
    strengthAreas: [String],
    fetchedAt: Date,
  },
  authProvider: {
    type: String,
    enum: ["credentials", "google", "github"],
    default: "credentials",
  },
});

// ✅ THIS LINE FIXES THE ERROR
export default mongoose.models.User || mongoose.model("User", UserSchema);
