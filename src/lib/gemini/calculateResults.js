export function calculateResults(assessment) {
  const { basicDetails, aptitudeAnswers } = assessment;

  /* ---------- APTITUDE SCORE ---------- */
  const aptitudeScore = Math.round(
    (Object.keys(aptitudeAnswers).length / 3) * 100,
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
      projects: basicDetails.projectExperience,
      resume: basicDetails.resumeStatus,
      interviews: basicDetails.interviewExperience,
      timeCommitment: basicDetails.weeklyHours,
    },
    employabilityIndex,
  };
}
