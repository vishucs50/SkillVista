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
});

// ✅ THIS LINE FIXES THE ERROR
export default mongoose.models.User || mongoose.model("User", UserSchema);
