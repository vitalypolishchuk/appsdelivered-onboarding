import styles from "./Storage.module.css";
import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { issueType, storeType } from "./store/storeTypes";
import store from "./store/store";

const Storage = () => {
  const { issues, setIssues, deleteIssue, updateIssue, addIssue } = store((state: unknown) => state as storeType);
  const [recievedIssuesFromStorage, setRecievedIssuesFromStorage] = useState(false);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");
  const [edit, setEdit] = useState("");

  const [updatedSummary, setUpdatedSummary] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedType, setUpdatedType] = useState("");

  const [createIssueLoader, setCreateIssueLoader] = useState(true);

  const getIssuesFromStorage = async () => {
    const newIssues: issueType[] = await invoke("getIssues");
    return newIssues;
  };

  const setIssuesInStorage = async (newIssues: issueType[]) => {
    await invoke("setIssues", { issues: newIssues });
  };

  useEffect(() => {
    if (!recievedIssuesFromStorage) {
      const getIssues = async () => {
        const newIssues: issueType[] = await getIssuesFromStorage();
        setRecievedIssuesFromStorage(true);
        setIssues(newIssues);
        setCreateIssueLoader(false);
      };
      getIssues();
      return;
    }

    setIssuesInStorage(issues);
  }, [issues]);

  const handleDelete = async (id: string) => {
    deleteIssue(id);
  };

  const handleUpdate = async (id: string) => {
    if (!updatedSummary || !updatedDescription) return;

    const updatedIssue = {
      summary: updatedSummary,
      description: updatedDescription,
      type: updatedType,
      id: id,
    };

    updateIssue(updatedIssue);
    setEdit("");
  };

  const handleEdit = (issue: issueType) => {
    setEdit(issue.id);
    setUpdatedSummary(issue.summary);
    setUpdatedDescription(issue.description);
    setUpdatedType(issue.type);
  };

  const onIssueSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newIssue = {
      summary: summary,
      description: description,
      type: type,
      id: new Date().valueOf().toString(),
    };

    setSummary("");
    setDescription("");

    addIssue(newIssue);
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
        {[...issues].reverse().map(({ summary, description, type, id }: issueType) => {
          return (
            <li className={styles.issue} key={id}>
              <span className={`${styles.issue__info} ${edit === id ? styles.none : ""}`}>
                <p className={styles.issue__text}>Summary: {summary}</p>
                <p className={styles.issue__text}>Description: {description}</p>
                <p className={styles.issue__text}>Type: {type}</p>
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
                <button className={styles.issue__button} onClick={() => handleDelete(id)}>
                  Delete
                </button>
              </span>
              <span>
                <button className={`${styles.issue__button} ${edit === id ? "" : styles.none}`} onClick={() => handleUpdate(id)}>
                  Update
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
