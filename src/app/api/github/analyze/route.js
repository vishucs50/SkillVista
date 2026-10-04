import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { analyzeGitHubProfile, getGitHubSkills } from "@/lib/github";

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

    const user = await User.findById(token.id).select(
      "githubData githubConnected githubUsername githubToken",
    );

    if (!user || !user.githubConnected) {
      return Response.json(
        {
          githubConnected: false,
          message: "GitHub not connected",
        },
        { status: 200 }
      );
    }

    // Older snapshots do not contain repository details, so refresh them once
    // before returning the analysis used by the repository search UI.
    let githubData = user.githubData;
    if (
      user.githubToken &&
      (!Array.isArray(githubData?.repositoryList) || githubData.repositoryList.length === 0)
    ) {
      githubData =
        (await analyzeGitHubProfile(token.id, user.githubToken)) || user.githubData;
    }

    // Extract skills from analyzed GitHub data
    const skills = await getGitHubSkills(githubData);

    return Response.json(
      {
        githubConnected: true,
        githubUsername: user.githubUsername,
        githubData,
        detectedSkills: skills,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[github/analyze] Error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}

/**
 * POST /api/github/analyze
 *
 * Refresh the stored GitHub snapshot for the current user.
 */
export async function POST(req) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token?.id) {
      return Response.json({ error: "Unauthorized: User ID not found" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(token.id).select(
      "githubConnected githubUsername githubToken",
    );

    if (!user || !user.githubConnected || !user.githubUsername || !user.githubToken) {
      return Response.json({ error: "GitHub is not connected" }, { status: 400 });
    }

    const githubData = await analyzeGitHubProfile(token.id, user.githubToken);

    if (!githubData) {
      return Response.json({ error: "GitHub analysis could not be refreshed" }, { status: 502 });
    }

    return Response.json({
      githubConnected: true,
      githubUsername: user.githubUsername,
      githubData,
    });
  } catch (err) {
    console.error("[github/analyze] Refresh error:", err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
