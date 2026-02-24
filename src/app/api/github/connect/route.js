import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { analyzeGitHubProfile } from "@/lib/github";

/**
 * POST /api/github/connect
 * 
 * For non-GitHub users to connect their GitHub account
 * Expects: { githubUsername, githubToken }
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return Response.json(
        { error: "Unauthorized: User ID not found" },
        { status: 401 }
      );
    }

    const { githubUsername, githubToken } = await req.json();

    if (!githubUsername || !githubToken) {
      return Response.json(
        { error: "GitHub username and token are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(token.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Update user with GitHub data
    user.githubUsername = githubUsername;
    user.githubToken = githubToken;
    user.githubConnected = true;
    await user.save();

    // Analyze GitHub profile async (non-blocking)
    analyzeGitHubProfile(user._id.toString(), githubToken).catch((err) =>
      console.error("GitHub analysis failed:", err)
    );

    return Response.json(
      {
        success: true,
        message: "GitHub account connected successfully",
        githubConnected: true,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[github/connect] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * GET /api/github/connect
 * 
 * Check if user has GitHub connected
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

    const user = await User.findById(token.id).select(
      "githubConnected githubData githubUsername"
    );

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
      {
        githubConnected: user.githubConnected || false,
        githubData: user.githubData || null,
        githubUsername: user.githubUsername || null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[github/connect] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
