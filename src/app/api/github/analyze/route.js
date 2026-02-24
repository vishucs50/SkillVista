import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { getGitHubSkills } from "@/lib/github";

/**
 * GET /api/github/analyze
 * 
 * Retrieve analyzed GitHub data for the current user
 */
export async function GET(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return Response.json(
        { error: "Unauthorized: User ID not found" },
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(token.id).select("githubData githubConnected");

    if (!user || !user.githubConnected) {
      return Response.json(
        {
          githubConnected: false,
          message: "GitHub not connected",
        },
        { status: 200 }
      );
    }

    // Extract skills from analyzed GitHub data
    const skills = await getGitHubSkills(user.githubData);

    return Response.json(
      {
        githubConnected: true,
        githubData: user.githubData,
        detectedSkills: skills,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[github/analyze] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
