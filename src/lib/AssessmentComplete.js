import { syncAssessmentToBackend } from "@/lib/syncAssessment";

export async function completeAssessment(router) {
  try {
    await syncAssessmentToBackend();
    router.push("/dashboard");
  } catch (err) {
    console.error("Assessment completion failed:", err);
    throw err;
  }
}
