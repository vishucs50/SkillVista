import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "userId parameter is required" },
        { status: 400 }
      );
    }

    const attempts = await MentalAbilityAttempt.find({ userId })
      .sort({ createdAt: 1 })
      .select("percentage score totalQuestions createdAt")
      .lean();

    if (attempts.length === 0) {
      return NextResponse.json({
        totalAttempts: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        trend: [],
      });
    }

    const scores = attempts.map((a) => a.percentage);
    const averageScore = Math.round(
      scores.reduce((sum, score) => sum + score, 0) / scores.length
    );
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    const trend = attempts.map((a) => ({
      date: a.createdAt,
      score: a.percentage,
    }));

    return NextResponse.json({
      totalAttempts: attempts.length,
      averageScore,
      highestScore,
      lowestScore,
      trend,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
