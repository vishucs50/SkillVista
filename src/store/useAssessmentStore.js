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
          targetRole:"",
          skills: [],
        },

        aptitudeAnswers: {},

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
              targetRole:"",
              skills: [],
            },
            aptitudeAnswers: {},
          }),
      }),
      {
        name: "skillvista-assessment", // localStorage key
        version: 1,
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
          return persistedState;
        },
      },
    ),
  ),
);
