type newIssueType = {
  fields: {
    project: {
      key: string;
    };
    summary: string;
    description: string;
    issuetype: {
      name: string;
    };
  };
};

export type issueType = {
  summary: string;
  description: string;
  iconUrl: string;
  key: string;
};

export const newIssue: newIssueType = {
  fields: {
    project: {
      key: "",
    },
    summary: "",
    description: "",
    issuetype: {
      name: "Bug",
    },
  },
};
