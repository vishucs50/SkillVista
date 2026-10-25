import { getToken } from "next-auth/jwt";
import { connectDB } from "@/lib/db";

import User from "@/models/User";
import Assessment from "@/models/Assessment";
import AssessmentResult from "@/models/AssessmentResult";
import { analyzeAssessment } from "@/lib/gemini/analyzeAssessment";
import { sendAssessmentResultEmail } from "@/lib/email";

export async function POST(req) {
  try {
    await connectDB();

    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = token.id;

    const assessment = await Assessment.findOne({ userId }).lean();
    if (!assessment) {
      return new Response("Assessment not found", { status: 404 });
    }

    const result = await analyzeAssessment(assessment);

    // Prevent duplicate emails if the same assessment result is regenerated within 10 minutes
    const existingResult = await AssessmentResult.findOne({ userId }).select("emailSentAt").lean();
    const shouldSendEmail =
      !existingResult?.emailSentAt ||
      Date.now() - new Date(existingResult.emailSentAt).getTime() > 10 * 60 * 1000;

    await AssessmentResult.findOneAndUpdate(
      { userId },
      {
        userId,
        ...result,
        ...(shouldSendEmail ? { emailSentAt: new Date() } : {}),
        generatedAt: new Date(),
      },
      { upsert: true, new: true },
    );

    console.log("[api/results/generate] Result saved successfully");

    // Asynchronously dispatch result email without blocking client response
    if (shouldSendEmail) {
      (async () => {
        try {
          const user = await User.findById(userId).select("name email").lean();
          const targetEmail = user?.email || token.email;
          const targetName = user?.name || token.name || "there";

          if (targetEmail) {
            await sendAssessmentResultEmail({
              name: targetName,
              email: targetEmail,
              result,
            });
            console.log(`[api/results/generate] Assessment result email dispatched for user ${userId}`);
          }
        } catch (emailError) {
          console.error("[api/results/generate] Email notification error:", {
            userId,
            message: emailError instanceof Error ? emailError.message : String(emailError),
          });
        }
      })();
    }

    return Response.json(result);
  } catch (error) {
    console.error("[api/results/generate] ERROR:", error.message);
    console.error("[api/results/generate] Stack:", error.stack);
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      { status: 500 },
    );
  }
}
