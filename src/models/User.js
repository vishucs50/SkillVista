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
    username: String,
    avatarUrl: String,
    bio: String,
    profileUrl: String,
    topLanguages: [String],
    languageStats: [{
      name: String,
      repositories: Number,
      percentage: Number,
    }],
    detectedFrameworks: [String],
    repositories: Number,
    repositoryList: [{
      name: String,
      description: String,
      url: String,
      language: String,
      stars: Number,
      forks: Number,
      updatedAt: Date,
      topics: [String],
    }],
    totalStars: Number,
    totalForks: Number,
    activeRepositories: Number,
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
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", UserSchema);
