import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

const useResultStore = create(
  devtools(
    persist(
      (set) => ({
        employabilityIndex: null,
        aptitudeScore: null,

        criticalSkillGaps: [],
        nextBestActions: [],

        readinessBreakdown: {
          skills: 0,
          aptitude: 0,
          experience: 0,
          consistency: 0,
        },

        generatedAt: null,

        setResults: (results) =>
          set({
            ...results,
            generatedAt: new Date().toISOString(),
          }),

        resetResults: () =>
          set({
            employabilityIndex: null,
            aptitudeScore: null,
            criticalSkillGaps: [],
            nextBestActions: [],
            readinessBreakdown: {
              skills: 0,
              aptitude: 0,
              experience: 0,
              consistency: 0,
            },
            generatedAt: null,
          }),
      }),
      { name: "skillvista-result" },
    ),
  ),
);

export default useResultStore;
