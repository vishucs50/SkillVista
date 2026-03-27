import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "@/lib/db";
import MentalAbilityAttempt from "@/models/MentalAbilityAttempt";
import Question from "@/models/Question";

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
      .sort({ createdAt: -1 })
      .select("-answers")
      .lean();

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Error fetching attempts:", error);
    return NextResponse.json(
      { error: "Failed to fetch attempts" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { userId, answers, timeTaken } = body;

    if (!userId || !answers || !Array.isArray(answers)) {
      return NextResponse.json(
        { error: "Invalid request data" },
        { status: 400 }
      );
    }

    // Fetch correct answers from database
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q.correctAnswer;
    });

    // Evaluate answers
    const evaluatedAnswers = answers.map((answer) => {
      const correctAnswer = questionMap[answer.questionId];
      const isCorrect = answer.selectedAnswer === correctAnswer;

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer,
        isCorrect,
      };
    });

    const score = evaluatedAnswers.filter((a) => a.isCorrect).length;
    const totalQuestions = answers.length;
    const percentage = Math.round((score / totalQuestions) * 100);

    // Create attempt record
    const attempt = await MentalAbilityAttempt.create({
      userId,
      score,
      totalQuestions,
      percentage,
      answers: evaluatedAnswers,
      timeTaken,
    });

    // Get previous attempt for comparison
    const previousAttempts = await MentalAbilityAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .skip(1)
      .limit(1);

    let improvement = null;
    if (previousAttempts.length > 0) {
      const previousScore = previousAttempts[0].percentage;
      improvement = percentage - previousScore;
    }

    return NextResponse.json({
      attempt: {
        _id: attempt._id,
        score,
        totalQuestions,
        percentage,
        createdAt: attempt.createdAt,
      },
      improvement,
      answers: evaluatedAnswers,
    });
  } catch (error) {
    console.error("Error creating attempt:", error);
    return NextResponse.json(
      { error: "Failed to create attempt" },
      { status: 500 }
    );
  }
}
