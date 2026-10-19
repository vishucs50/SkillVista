import { useAssessmentStore } from "@/store/useAssessmentStore";

export const syncAssessmentToBackend = async () => {
  const {
    basicDetails,
    aptitudeAnswers,
    aptitudeQuestionIds,
    aptitudeQuestionVersion,
  } = useAssessmentStore.getState();

  if (
    !basicDetails ||
    Object.keys(basicDetails).length === 0
  ) {
    console.warn("Assessment sync skipped: empty basic details");
    return;
  }

  console.debug("[syncAssessment] payload", {
    basicDetails,
    aptitudeAnswers,
    aptitudeQuestionIds,
    aptitudeQuestionVersion,
  });

  const res = await fetch("/api/assessment/sync", {
    method: "POST",
    headers : { "Content-Type": "application/json" },
    credentials: "include",
    keepalive: true,
    body: JSON.stringify({
      basicDetails,
      aptitudeAnswers,
      aptitudeQuestionIds,
      aptitudeQuestionVersion,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("Assessment sync failed:", text);
    throw new Error("Assessment sync failed");
  }

  const data = await res.json();
  return data;
};
