import { create } from "zustand";
import { storeType, issueType } from "./storeTypes";

const store = create((set) => ({
  issues: [],
  setIssues: (issues: issueType) => {
    set((state: storeType) => {
      return { ...state, issues: issues };
    });
  },
  deleteIssue: (id: string) => {
    set((state: storeType) => {
      const updatedIssues = state.issues.filter((issue) => issue.id !== id);
      return { ...state, issues: updatedIssues };
    });
  },
  updateIssue: (updatedIssue: issueType) => {
    set((state: storeType) => {
      const updatedIssues = state.issues.map((issue: issueType) => {
        if (updatedIssue.id === issue.id) return updatedIssue;
        return issue;
      });
      return { ...state, issues: updatedIssues };
    });
  },
  addIssue: (issue: issueType) => {
    set((state: storeType) => {
      const updatedIssues = [...state.issues, issue];
      return { ...state, issues: updatedIssues };
    });
  },
}));

export default store;
