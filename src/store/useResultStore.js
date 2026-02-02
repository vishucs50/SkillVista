import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const useResultStore = create(
  devtools(
    persist(
      (set) => ({
        // ✅ STATE (defined once)
        result: null,

        // ✅ ACTIONS
        setResult: (data) => set({ result: data }),

        resetResult: () => set({ result: null }),
      }),
      {
        name: "skillvista-result", // localStorage key
      },
    ),
  ),
);

export default useResultStore;
