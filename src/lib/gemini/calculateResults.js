import {
  assessmentQuestionVersion,
  getQuestionsForRole,
  readinessThresholds,
  readinessWeights,
} from "@/lib/assessmentQuestions";

export function calculateResults(assessment) {
  const { basicDetails, aptitudeAnswers } = assessment;
  const questionSet = getQuestionsForRole(basicDetails?.targetRole);
  const selectedQuestionIds =
    assessment.aptitudeQuestionVersion === assessmentQuestionVersion &&
    Array.isArray(assessment.aptitudeQuestionIds) &&
    assessment.aptitudeQuestionIds.length > 0
      ? assessment.aptitudeQuestionIds
      : questionSet.map((question) => question.id);
  const questionsById = new Map(
    questionSet.map((question) => [question.id, question]),
  );
  const scoredQuestions = selectedQuestionIds
    .map((id) => questionsById.get(id))
    .filter(Boolean);

  /* ---------- APTITUDE SCORE ---------- */
  const correctCount = scoredQuestions.filter(
    (question) => aptitudeAnswers?.[question.id] === question.correct,
  ).length;
  const aptitudeScore = Math.round(
    (correctCount / Math.max(scoredQuestions.length, 1)) * 100,
  );

  /* ---------- READINESS ---------- */
  const readinessFactors = {
    projectExperience:
      readinessThresholds.projectExperience[basicDetails.projectExperience] || 0,
    resumeStatus: readinessThresholds.resumeStatus[basicDetails.resumeStatus] || 0,
    interviewExperience:
      readinessThresholds.interviewExperience[basicDetails.interviewExperience] || 0,
    weeklyHours: readinessThresholds.weeklyHours[basicDetails.weeklyHours] || 0,
  };
  const readiness = Math.round(
    Object.entries(readinessFactors).reduce(
      (total, [factor, score]) =>
        total + (score / 100) * readinessWeights[factor],
      0,
    ),
  );

  /* ---------- EMPLOYABILITY INDEX ---------- */
  const employabilityIndex = Math.round(aptitudeScore * 0.4 + readiness * 0.6);

  return {
    aptitudeScore,
    readinessBreakdown: {
      skills: Math.min((basicDetails.skills?.length || 0) * 10, 100),
      aptitude: aptitudeScore,
      experience: readinessFactors.projectExperience,
      consistency: readinessFactors.weeklyHours,
    },
    employabilityIndex,
  };
}
