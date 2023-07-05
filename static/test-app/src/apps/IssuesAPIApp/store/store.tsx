import { create } from "zustand";
import { storeType, issueType } from "./storeTypes";

export const store = create((set) => ({
  issues: [],
  setIssues: (issues: issueType[]) => {
    set((state: storeType) => {
      return { ...state, issues: issues };
    });
  },
}));
