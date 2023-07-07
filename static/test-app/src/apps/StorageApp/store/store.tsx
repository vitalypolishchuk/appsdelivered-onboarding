import { create } from "zustand";
import { issueStoreType, issueType, apiStoreType, openAIDataType } from "./storeTypes";

export const issuesStore = create((set) => ({
  issues: [],
  setIssues: (issues: issueType) => {
    set((state: issueStoreType) => {
      return { ...state, issues: issues };
    });
  },
  deleteIssue: (id: string) => {
    set((state: issueStoreType) => {
      const updatedIssues = state.issues.filter((issue) => issue.id !== id);
      return { ...state, issues: updatedIssues };
    });
  },
  updateIssue: (updatedIssue: issueType) => {
    set((state: issueStoreType) => {
      const updatedIssues = state.issues.map((issue: issueType) => {
        if (updatedIssue.id === issue.id) return updatedIssue;
        return issue;
      });
      return { ...state, issues: updatedIssues };
    });
  },
  addIssue: (issue: issueType) => {
    set((state: issueStoreType) => {
      const updatedIssues = [...state.issues, issue];
      return { ...state, issues: updatedIssues };
    });
  },
}));

export const apiStore = create((set) => ({
  openAIData: {
    openaiKey: "",
    organizationID: "",
  },
  setOpenAIData: (openAIData: openAIDataType) => {
    set((state: apiStoreType) => {
      return { ...state, openAIData };
    });
  },
}));
