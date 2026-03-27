import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Question from "@/models/Question";
import { mentalAbilityQuestions } from "@/lib/seedQuestions";

export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const limit = parseInt(searchParams.get("limit")) || 15;

    if (!type) {
      return NextResponse.json(
        { error: "Type parameter is required" },
        { status: 400 }
      );
    }

    let questions = await Question.find({ type }).limit(limit);

    // Seed questions if none exist
    if (questions.length === 0 && type === "mental_ability") {
      await Question.insertMany(mentalAbilityQuestions);
      questions = await Question.find({ type }).limit(limit);
    }

    // Shuffle questions
    const shuffled = questions.sort(() => Math.random() - 0.5);

    // Remove correctAnswer from response
    const sanitized = shuffled.map(({ _id, type, question, options, category, difficulty }) => ({
      _id: _id.toString(),
      type,
      question,
      options,
      category,
      difficulty,
    }));

    return NextResponse.json({ questions: sanitized });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
