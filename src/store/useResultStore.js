import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useResultStore = create(
  devtools(
    persist(
      (set) => ({
        employabilityIndex: null,
        aptitudeScore: null,
        readinessBreakdown: null,
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
            readinessBreakdown: null,
            generatedAt: null,
          }),
      }),
      {
        name: "skillvista-result", // localStorage key
      },
    ),
  ),
);

export default useResultStore;
