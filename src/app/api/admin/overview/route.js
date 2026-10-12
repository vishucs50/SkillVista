import { NextResponse } from "next/server";
import { getAdminEmails, requireAdmin } from "@/lib/admin";
import { getCloudWatchSummary } from "@/lib/cloudwatch";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Assessment from "@/models/Assessment";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";

export async function GET(req) {
  const { authorized } = await requireAdmin();
  if (!authorized) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    await connectDB();
    const url = new URL(req.url);
    const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 30, 7), 90);
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      recentUsers,
      githubUsers,
      assessments,
      skillGaps,
      attempts,
      providers,
      dailyUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: start } }),
      User.countDocuments({ githubConnected: true }),
      Assessment.countDocuments({ basicDetails: { $exists: true } }),
      SkillGapAnalysis.countDocuments(),
      MentalAbilityAttempt.countDocuments(),
      User.aggregate([{ $group: { _id: "$authProvider", count: { $sum: 1 } } }]),
      User.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    const cloudWatch = await getCloudWatchSummary({
      startTime: start,
      endTime: new Date(),
    });

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      adminCount: getAdminEmails().length,
      rangeDays: days,
      metrics: {
        totalUsers,
        recentUsers,
        githubUsers,
        assessments,
        skillGaps,
        attempts,
      },
      providers: providers.map((item) => ({
        name: item._id || "unknown",
        count: item.count,
      })),
      dailyUsers: dailyUsers.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      cloudWatch,
    });
  } catch (error) {
    console.error("[api/admin/overview] Failed", {
      message: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Could not load admin overview" }, { status: 500 });
  }
}
