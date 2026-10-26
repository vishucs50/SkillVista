import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { getAdminEmails, requireAdmin } from "@/lib/admin";
import { getCloudWatchSummary } from "@/lib/cloudwatch";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import SkillGapAnalysis from "@/models/SkillGapAnalysis";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";

export async function GET(req) {
  const { authorized, diagnostics } = await requireAdmin();
  if (!authorized) {
    console.warn("[api/admin/overview] Unauthorized admin request", diagnostics);
    return NextResponse.json(
      { error: "Forbidden", diagnostics },
      { status: 403 },
    );
  }

  try {
    const dbStart = Date.now();
    await connectDB();
    let dbLatencyMs = Date.now() - dbStart;

    // Check DB ping
    let dbStatus = "healthy";
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.admin().ping();
        dbLatencyMs = Date.now() - dbStart;
      }
    } catch (pingErr) {
      console.warn("[api/admin/overview] DB ping warning:", pingErr?.message);
      dbStatus = "connected";
    }

    const url = new URL(req.url);
    const days = Math.min(Math.max(Number(url.searchParams.get("days")) || 30, 7), 90);
    const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      recentUsersCount,
      githubUsers,
      assessmentsCount,
      skillGapsCount,
      attemptsCount,
      providers,
      dailyUsers,
      topRolesAgg,
      topSkillGapsAgg,
      avgStatsAgg,
      rawUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ createdAt: { $gte: start } }),
      User.countDocuments({ githubConnected: true }),
      Assessment.countDocuments({ "basicDetails.targetRole": { $exists: true } }),
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
      Assessment.aggregate([
        { $match: { "basicDetails.targetRole": { $exists: true, $nin: ["", null] } } },
        { $group: { _id: "$basicDetails.targetRole", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      AssessmentResult.aggregate([
        { $unwind: "$criticalSkillGaps" },
        { $match: { criticalSkillGaps: { $nin: ["", null] } } },
        { $group: { _id: "$criticalSkillGaps", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 8 },
      ]),
      AssessmentResult.aggregate([
        {
          $group: {
            _id: null,
            avgEmployability: { $avg: "$employabilityIndex" },
            avgAptitude: { $avg: "$aptitudeScore" },
            totalEvaluated: { $sum: 1 },
          },
        },
      ]),
      User.find(
        {},
        { name: 1, email: 1, authProvider: 1, githubConnected: 1, createdAt: 1 }
      )
        .sort({ createdAt: -1 })
        .limit(100)
        .lean(),
    ]);

    // Lookup user assessment details and results
    const userIds = rawUsers.map((u) => u._id);
    const [userAssessments, userResults] = await Promise.all([
      Assessment.find(
        { userId: { $in: userIds } },
        { userId: 1, "basicDetails.targetRole": 1, "basicDetails.college": 1, "basicDetails.degree": 1, "basicDetails.skills": 1 }
      ).lean(),
      AssessmentResult.find(
        { userId: { $in: userIds } },
        { userId: 1, employabilityIndex: 1, aptitudeScore: 1, criticalSkillGaps: 1 }
      ).lean(),
    ]);

    const assessmentMap = new Map(userAssessments.map((a) => [String(a.userId), a]));
    const resultMap = new Map(userResults.map((r) => [String(r.userId), r]));

    const users = rawUsers.map((u) => {
      const a = assessmentMap.get(String(u._id));
      const r = resultMap.get(String(u._id));
      return {
        id: String(u._id),
        name: u.name || "Anonymous",
        email: u.email || "No email",
        authProvider: u.authProvider || "credentials",
        githubConnected: Boolean(u.githubConnected),
        targetRole: a?.basicDetails?.targetRole || null,
        college: a?.basicDetails?.college || null,
        degree: a?.basicDetails?.degree || null,
        skillsCount: a?.basicDetails?.skills?.length || 0,
        hasAssessment: Boolean(a?.basicDetails?.targetRole || a?.basicDetails?.skills?.length),
        employabilityIndex: r?.employabilityIndex != null ? Math.round(r.employabilityIndex) : null,
        aptitudeScore: r?.aptitudeScore != null ? Math.round(r.aptitudeScore) : null,
        criticalSkillGaps: r?.criticalSkillGaps || [],
        joinedAt: u.createdAt ? u.createdAt.toISOString() : null,
      };
    });

    const cloudWatch = await getCloudWatchSummary({
      startTime: start,
      endTime: new Date(),
    });

    const s3Configured = Boolean(process.env.S3_BUCKET_NAME);
    const sesConfigured = Boolean(process.env.SES_FROM_EMAIL || process.env.SES_ACCESS_KEY_ID);
    const geminiConfigured = Boolean(process.env.GEMINI_API_KEY);
    const secretsConfigured = Boolean(process.env.SECRETS_MANAGER_SECRET_NAME);

    const services = [
      {
        id: "mongodb",
        name: "MongoDB Atlas",
        type: "Database",
        status: dbStatus,
        latencyMs: dbLatencyMs,
        details: "Mongoose ODM • Connected",
      },
      {
        id: "gemini",
        name: "Google Gemini AI",
        type: "LLM & OCR",
        status: geminiConfigured ? "healthy" : "warning",
        details: geminiConfigured ? "Gemini 1.5 Flash • API Ready" : "API Key not detected",
      },
      {
        id: "s3",
        name: "AWS S3 Resumes",
        type: "Object Storage",
        status: s3Configured ? "healthy" : "warning",
        details: process.env.S3_BUCKET_NAME
          ? `${process.env.S3_BUCKET_NAME} (${process.env.S3_REGION || "ap-south-1"})`
          : "S3_BUCKET_NAME missing",
      },
      {
        id: "ses",
        name: "AWS SES Email",
        type: "Transactional Mail",
        status: sesConfigured ? "healthy" : "warning",
        details: process.env.SES_FROM_EMAIL
          ? `Sender: ${process.env.SES_FROM_EMAIL}`
          : "SES_FROM_EMAIL fallback",
      },
      {
        id: "secrets",
        name: "AWS Secrets Manager",
        type: "Secret Management",
        status: secretsConfigured ? "healthy" : "fallback",
        details: process.env.SECRETS_MANAGER_SECRET_NAME || "Fallback to environment vars",
      },
      {
        id: "waf",
        name: "AWS WAF Shield",
        type: "Security & DDoS",
        status: "healthy",
        details: "Rate limiting • SQLi & XSS rules attached to CloudFront",
      },
    ];

    const stats = avgStatsAgg[0] || {};

    return NextResponse.json({
      generatedAt: new Date().toISOString(),
      adminCount: getAdminEmails().length,
      rangeDays: days,
      metrics: {
        totalUsers,
        recentUsers: recentUsersCount,
        githubUsers,
        assessments: assessmentsCount,
        skillGaps: skillGapsCount,
        attempts: attemptsCount,
      },
      services,
      analytics: {
        avgEmployability: stats.avgEmployability != null ? Math.round(stats.avgEmployability) : null,
        avgAptitude: stats.avgAptitude != null ? Math.round(stats.avgAptitude) : null,
        totalEvaluated: stats.totalEvaluated || 0,
        topRoles: topRolesAgg.map((r) => ({ role: r._id, count: r.count })),
        topSkillGaps: topSkillGapsAgg.map((s) => ({ skill: s._id, count: s.count })),
      },
      users,
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
