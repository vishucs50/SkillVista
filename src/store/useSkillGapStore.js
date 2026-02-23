import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSkillGapStore = create(
  persist(
    (set) => ({
      analysis: null,

      setAnalysis: (data) => set({ analysis: data }),
      clearAnalysis: () => set({ analysis: null }),
    }),
    {
      name: "skill-gap-storage", // localStorage key
    },
  ),
);
