export type issueType = {
  summary: string;
  description: string;
  iconUrl: string;
  key: string;
};

export type storeType = {
  issues: issueType[];
  setIssues: (issues: issueType[]) => void;
};
