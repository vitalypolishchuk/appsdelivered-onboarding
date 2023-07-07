export type issueType = {
  summary: string;
  description: string;
  type: string;
  id: string;
};

export type issueStoreType = {
  issues: issueType[];
  setIssues: (issues: issueType[]) => void;
  deleteIssue: (id: string) => void;
  updateIssue: (issue: issueType) => void;
  addIssue: (issue: issueType) => void;
};

export type apiKeyType = string;
export type organizationIDType = string;

export type openAIDataType = {
  openaiKey: apiKeyType;
  organizationID: organizationIDType;
};

export type apiStoreType = {
  openAIData: openAIDataType;
  setOpenAIData: (openAIData: openAIDataType) => void;
};
