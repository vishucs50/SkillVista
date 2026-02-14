import { useAssessmentStore } from "@/store/useAssessmentStore";

export const syncAssessmentToBackend = async () => {
  const { basicDetails, aptitudeAnswers } =
    useAssessmentStore.getState();

  if (
    !basicDetails ||
    Object.keys(basicDetails).length === 0 ||
    Object.keys(aptitudeAnswers || {}).length === 0
  ) {
    console.warn("Assessment sync skipped: empty data");
    return;
  }

  console.debug("[syncAssessment] payload", { basicDetails, aptitudeAnswers });

  const res = await fetch("/api/assessment/sync", {
    method: "POST",
    headers : { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      basicDetails,
      aptitudeAnswers,
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
