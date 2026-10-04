export function calculateResults(assessment) {
  const { basicDetails, aptitudeAnswers } = assessment;

  /* ---------- APTITUDE SCORE ---------- */
  const correctAnswers = { q1: 2, q2: 2, q3: 1 };
  const aptitudeQuestionIds = Object.keys(correctAnswers);
  const correctCount = aptitudeQuestionIds.filter(
    (questionId) => aptitudeAnswers?.[questionId] === correctAnswers[questionId],
  ).length;
  const aptitudeScore = Math.round(
    (correctCount / aptitudeQuestionIds.length) * 100,
  );

  /* ---------- READINESS ---------- */
  let readiness = 0;

  if (basicDetails.projectExperience === "End-to-end projects") readiness += 25;
  if (basicDetails.resumeStatus === "ATS-ready resume") readiness += 25;
  if (basicDetails.interviewExperience !== "0 interviews") readiness += 25;
  if (basicDetails.weeklyHours !== "5–7 hours") readiness += 25;

  /* ---------- EMPLOYABILITY INDEX ---------- */
  const employabilityIndex = Math.round(aptitudeScore * 0.4 + readiness * 0.6);

  return {
    aptitudeScore,
    readinessBreakdown: {
      skills: Math.min((basicDetails.skills?.length || 0) * 10, 100),
      aptitude: aptitudeScore,
      experience: basicDetails.projectExperience === "End-to-end projects" ? 100 : 50,
      consistency: basicDetails.weeklyHours === "5–7 hours" ? 100 : 50,
    },
    employabilityIndex,
  };
}
