import styles from "../styles/IssuesAPI.module.css";
import React, { useEffect, useState } from "react";
import { requestJira } from "@forge/bridge";

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

type issueType = {
  summary: string;
  description: string;
  iconUrl: string;
  key: string;
};

const newIssue: newIssueType = {
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

const IssuesAPI = () => {
  const [issues, setIssues] = useState<null | issueType[]>(null);
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");

  const [createIssueLoader, setCreateIssueLoader] = useState(false);

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
    if (createIssueLoader) return;
    setCreateIssueLoader(true);

    newIssue.fields.summary = summary;
    newIssue.fields.description = description;
    newIssue.fields.issuetype.name = type;

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
      getIssues();
    } catch (err) {
      console.error(err);
    } finally {
      setSummary("");
      setDescription("");
      setCreateIssueLoader(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  return (
    <>
      <form onSubmit={onSubmitIssue} className={styles.issue__form}>
        <h3 className={styles.issue__header}>Create new Issue</h3>
        <div className={styles.input__container}>
          <label htmlFor="summary">Summary</label>
          <input
            className={styles.issue__input}
            type="text"
            name="summary"
            id="summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className={styles.input__container}>
          <label htmlFor="description">Description</label>
          <input
            className={styles.issue__input}
            type="text"
            name="description"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className={styles.input__container}>
          <label className={styles.label}>Type: </label>
          <select className={styles.select} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Bug">Bug</option>
            <option value="Epic">Epic</option>
            <option value="Story">Story</option>
            <option value="Task">Task</option>
          </select>
        </div>
        <button className={`${styles.issue__button} ${styles.button__add}  ${createIssueLoader ? styles.button__loading : ""}`} type="submit">
          <span className={createIssueLoader ? styles.hidden : ""}>Create Issue</span>
        </button>
      </form>
      {issues !== null && !!issues.length && (
        <ul className={styles.container}>
          {issues.map((issue) => {
            return (
              <li className={styles.issue} key={issue.key}>
                <img className={styles.issue__img} src={issue.iconUrl} />
                <span>
                  <p>Summary: {issue.summary}</p>
                  <p>Description: {issue.description}</p>
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
};

export default IssuesAPI;
