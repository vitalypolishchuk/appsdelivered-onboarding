export type issueType = {
  summary: string;
  description: string;
  type: string;
  id: string;
};

export type storeType = {
  issues: issueType[];
  setIssues: (issues: issueType[]) => void;
  deleteIssue: (id: string) => void;
  updateIssue: (issue: issueType) => void;
  addIssue: (issue: issueType) => void;
};
