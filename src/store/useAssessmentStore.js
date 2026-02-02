import { create } from "zustand";

export const useAssessmentStore = create((set) => ({
  basicDetails: {
    skills: [], // 👈 initialize skills array
  },
  skillAssessment: {},
  aptitudeAnswers: {},

  /* ---------- BASIC DETAILS ---------- */
  setBasicDetails: (data) =>
    set((state) => ({
      basicDetails: { ...state.basicDetails, ...data },
    })),

  /* ---------- SKILLS (NEW) ---------- */
  addSkill: (skill) =>
    set((state) => {
      const existingSkills = state.basicDetails.skills || [];

      if (existingSkills.includes(skill)) return state;

      return {
        basicDetails: {
          ...state.basicDetails,
          skills: [...existingSkills, skill],
        },
      };
    }),

  removeSkill: (skill) =>
    set((state) => ({
      basicDetails: {
        ...state.basicDetails,
        skills: state.basicDetails.skills.filter((s) => s !== skill),
      },
    })),

  /* ---------- SKILL ASSESSMENT ---------- */
  setSkillAssessment: (data) =>
    set((state) => ({
      skillAssessment: { ...state.skillAssessment, ...data },
    })),

  /* ---------- APTITUDE ---------- */
  setAptitudeAnswers: (data) =>
    set((state) => ({
      aptitudeAnswers: { ...state.aptitudeAnswers, ...data },
    })),

  /* ---------- RESET ---------- */
  resetAll: () =>
    set({
      basicDetails: { skills: [] },
      skillAssessment: {},
      aptitudeAnswers: {},
    }),
}));
