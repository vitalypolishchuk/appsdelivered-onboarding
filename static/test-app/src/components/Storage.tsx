import styles from "../styles/Storage.module.css";
import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";

type issueType = {
  summary: string;
  description: string;
  type: string;
  id: string;
};

const Storage = () => {
  const [issues, setIssues] = useState<issueType[]>([]);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");
  const [edit, setEdit] = useState("");

  const [updatedSummary, setUpdatedSummary] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedType, setUpdatedType] = useState("");

  const [updateIssueLoader, setUpdateIssueLoader] = useState(false);
  const [createIssueLoader, setCreateIssueLoader] = useState(false);
  const [deleteIssueLoader, setDeleteIssueLoader] = useState("");

  const getIssuesFromStorage = async () => {
    const newIssues: issueType[] = await invoke("getIssues");
    return newIssues;
  };

  const setIssuesInStorage = async (newIssues: issueType[]) => {
    await invoke("setIssues", { issues: newIssues });
  };

  useEffect(() => {
    const getIssues = async () => {
      const newIssues: issueType[] = await getIssuesFromStorage();
      setIssues(newIssues);
    };
    getIssues();
  }, []);

  const handleDelete = async (id: string) => {
    if (updateIssueLoader || createIssueLoader || deleteIssueLoader) return;
    setDeleteIssueLoader(id);

    const newIssues: issueType[] = await getIssuesFromStorage();
    const filteredIssues = newIssues.filter((issue) => issue.id !== id);
    setIssuesInStorage(filteredIssues);
    setIssues(filteredIssues);
    setDeleteIssueLoader("");
  };

  const handleUpdate = async (id: string) => {
    if (!updatedSummary || !updatedDescription) return;
    if (updateIssueLoader || createIssueLoader || deleteIssueLoader) return;
    setUpdateIssueLoader(true);

    const updatedIssue = {
      summary: updatedSummary,
      description: updatedDescription,
      type: updatedType,
      id: id,
    };
    const newIssues: issueType[] = await getIssuesFromStorage();
    const updatedIssues = newIssues.map((issue: issueType) => {
      if (id === issue.id) return updatedIssue;
      return issue;
    });
    setIssuesInStorage(updatedIssues);
    setIssues(updatedIssues);

    setUpdateIssueLoader(false);
    setEdit("");
  };

  const handleEdit = (issue: issueType) => {
    if (updateIssueLoader || deleteIssueLoader) return;
    setEdit(issue.id);
    setUpdatedSummary(issue.summary);
    setUpdatedDescription(issue.description);
    setUpdatedType(issue.type);
  };

  const onIssueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (updateIssueLoader || createIssueLoader || deleteIssueLoader) return;
    setCreateIssueLoader(true);

    const newIssue = {
      summary: summary,
      description: description,
      type: type,
      id: new Date().valueOf().toString(),
    };

    const newIssues: issueType[] = await getIssuesFromStorage();
    newIssues.push(newIssue);
    setIssuesInStorage(newIssues);

    setIssues(newIssues);
    setSummary("");
    setDescription("");
    setCreateIssueLoader(false);
  };

  return (
    <section className={styles.main__container}>
      <form onSubmit={onIssueSubmit} className={styles.newIssue__form}>
        <h3 className={styles.issue__header}>Create new Issue</h3>
        <div className={styles.input__container}>
          <label className={styles.issue__label} htmlFor="summary">
            Summary:
          </label>
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
          <label className={styles.issue__label} htmlFor="description">
            Description:
          </label>
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
          <label className={styles.issue__label}>Type: </label>
          <select className={styles.select__issue} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="Bug">Bug</option>
            <option value="Epic">Epic</option>
            <option value="Story">Story</option>
            <option value="Task">Task</option>
          </select>
        </div>
        <button className={`${styles.newIssue__button} ${styles.issue__button} ${createIssueLoader ? styles.button__loading : ""}`}>
          <span className={createIssueLoader ? styles.hidden : ""}>Create Issue</span>
        </button>
      </form>
      <ul>
        {issues.map(({ summary, description, type, id }: issueType) => {
          return (
            <li className={styles.issue} key={id}>
              <span className={`${styles.issue__info} ${edit === id ? styles.none : ""}`}>
                <p className={styles.issue__text}>Summary: {summary}</p>
                <p className={styles.issue__text}>Description: {description}</p>
                <p className={styles.issueType}>Type: {type}</p>
              </span>
              <span className={`${styles.issue__inputs} ${edit === id ? "" : styles.none}`}>
                <input className={styles.issue__input} type="text" value={updatedSummary} onChange={(e) => setUpdatedSummary(e.target.value)} />
                <input
                  className={styles.issue__input}
                  type="text"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                />
                <select className={styles.select__issue} value={updatedType} onChange={(e) => setUpdatedType(e.target.value)}>
                  <option value="Bug">Bug</option>
                  <option value="Epic">Epic</option>
                  <option value="Story">Story</option>
                  <option value="Task">Task</option>
                </select>
              </span>
              <span className={`${edit === id ? styles.none : ""} ${styles.issue__buttons}`}>
                <button className={styles.issue__button} onClick={() => handleEdit({ id, summary, description, type })}>
                  Edit
                </button>
                <button
                  className={`${styles.issue__button} ${deleteIssueLoader === id ? styles.button__loading : ""}`}
                  onClick={() => handleDelete(id)}
                >
                  <span className={deleteIssueLoader === id ? styles.hidden : ""}>Delete</span>
                </button>
              </span>
              <span>
                <button
                  className={`${styles.issue__button} ${edit === id ? "" : styles.none} ${updateIssueLoader ? styles.button__loading : ""}`}
                  onClick={() => handleUpdate(id)}
                >
                  <span className={updateIssueLoader ? styles.hidden : ""}>Update</span>
                </button>
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Storage;
