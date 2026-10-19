import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export const useAssessmentStore = create(
  devtools(
    persist(
      (set) => ({
        /* ---------- STATE ---------- */
        basicDetails: {
          name: "",
          college: "",
          degree: "",
          year: "",
          goalType: "",
          interviewExperience: "",
          projectExperience: "",
          resumeStatus: "",
          timeline: "",
          weeklyHours: "",
          targetRole: "",
          skills: [],
        },

        aptitudeAnswers: {},
        aptitudeQuestionIds: [],
        aptitudeQuestionVersion: 0,

        /* ---------- BASIC DETAILS ---------- */
        setBasicDetails: (data) =>
          set((state) => ({
            basicDetails: { ...state.basicDetails, ...data },
          })),

        /* ---------- SKILLS ---------- */
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

        /* ---------- APTITUDE ---------- */
        setAptitudeAnswers: (data) =>
          set((state) => ({
            aptitudeAnswers: { ...state.aptitudeAnswers, ...data },
          })),

        clearAptitudeAnswers: () => set({ aptitudeAnswers: {} }),

        setAptitudeQuestionSet: (ids, version) =>
          set({
            aptitudeQuestionIds: ids,
            aptitudeQuestionVersion: version,
          }),

        /* ---------- RESET ---------- */
        resetAll: () =>
          set({
            basicDetails: {
              name: "",
              college: "",
              degree: "",
              year: "",
              goalType: "",
              interviewExperience: "",
              projectExperience: "",
              resumeStatus: "",
              timeline: "",
              weeklyHours: "",
              targetRole: "",
              skills: [],
            },
            aptitudeAnswers: {},
            aptitudeQuestionIds: [],
            aptitudeQuestionVersion: 0,
          }),
      }),
      {
        name: "skillvista-assessment", // localStorage key
        version: 2,
        migrate: (persistedState, version) => {
          // Ensure all required basicDetails fields exist
          if (persistedState && persistedState.basicDetails) {
            persistedState.basicDetails = {
              name: "",
              college: "",
              degree: "",
              year: "",
              goalType: "",
              interviewExperience: "",
              projectExperience: "",
              resumeStatus: "",
              timeline: "",
              weeklyHours: "",
              targetRole: "",
              skills: [],
              ...persistedState.basicDetails,
            };
          }
          if (persistedState) {
            persistedState.aptitudeQuestionIds =
              persistedState.aptitudeQuestionIds || [];
            persistedState.aptitudeQuestionVersion =
              persistedState.aptitudeQuestionVersion || 0;
          }
          return persistedState;
        },
      },
    ),
  ),
);
