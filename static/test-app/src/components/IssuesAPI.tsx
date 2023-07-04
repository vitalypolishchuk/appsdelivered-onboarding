import styles from "../styles/IssuesAPI.module.css";
import React, { useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";
import Avatar from "@atlaskit/avatar";
import Comment from "@atlaskit/comment";
import { newIssue, issueType } from "../issueData";

const IssuesAPI = () => {
  const [issues, setIssues] = useState<null | issueType[]>(null);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");

  const getIssues = async () => {
    try {
      const response = await requestJira(`/rest/api/2/search?`);
      const { issues } = await response.json();
      const issuesList = issues.map((issue: any) => {
        return {
          summary: issue.fields.summary,
          description: issue.fields.issuetype.description,
          iconUrl: issue.fields.issuetype.iconUrl,
          key: issue.key,
        };
      });
      setIssues(issuesList);
    } catch (err) {
      console.error("Error fetching issues:", err);
    }
  };

  const onSubmitIssue = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    newIssue.fields.summary = summary;
    newIssue.fields.description = description;

    try {
      const metaResponse = await requestJira(`/rest/api/2/issue/createmeta`);
      const metadata = await metaResponse.json();
      newIssue.fields.project.key = metadata.projects[0].key;
      const response = await requestJira(`/rest/api/2/issue`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newIssue),
      });

      setSummary("");
      setDescription("");

      getIssues();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <>
      {issues !== null && !!issues.length && (
        <div className={styles.container}>
          {issues.map((issue) => {
            return (
              <div key={issue.key}>
                <Comment
                  avatar={<Avatar name="issue" src={issue.iconUrl} />}
                  content={
                    <span>
                      <p>Summary: {issue.summary}</p>
                      <p>Description: {issue.description}</p>
                    </span>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
      <form onSubmit={onSubmitIssue}>
        <h3>Create new Issue</h3>
        <div>
          <label htmlFor="summary">Summary</label>
          <input type="text" name="summary" id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <button type="submit">Add New Issue</button>
      </form>
    </>
  );
};

export default IssuesAPI;
