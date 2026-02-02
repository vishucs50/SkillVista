import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
const StudentStore = (set) => ({
  setBasicDetails: (data) => set({ basicDetails: data }),
}); 

const useStudentStore = create(
  devtools(
    persist(StudentStore, {
      name: "basicDetails", //localStorage Key
    }),
  ),
);
export default useStudentStore;