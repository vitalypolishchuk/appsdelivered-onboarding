import styles from "./styles/Storage.module.css";
import React, { useEffect, useState } from "react";
import { invoke } from "@forge/bridge";
import { issueType, issueStoreType, apiStoreType, openAIDataType } from "./store/storeTypes";
import { issuesStore, apiStore } from "./store/store";
import GetApiKey from "./GetApiKey";

const Storage = () => {
  const { issues, setIssues, deleteIssue, updateIssue, addIssue } = issuesStore(
    (state: unknown) => state as issueStoreType
  );
  const { openAIData, setOpenAIData } = apiStore((state: unknown) => state as apiStoreType);

  const [recievedIssuesFromStorage, setRecievedIssuesFromStorage] = useState(false);
  const [openaiKeyMenu, setOpenaiKeyMenu] = useState(false);

  const [recievedAIDataFromStorage, setRecievedAIDataFromStorage] = useState(false);

  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("Bug");
  const [edit, setEdit] = useState("");

  const [descriptionWords, setDescriptionWords] = useState(0);
  const [isGenerateEnabled, setIsGenerateEnabled] = useState(false);

  const [updatedSummary, setUpdatedSummary] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");
  const [updatedType, setUpdatedType] = useState("");

  const [createIssueLoader, setCreateIssueLoader] = useState(true);
  const [generateSummaryLoader, setGenerateSummaryLoader] = useState(false);

  const [apiKeyInput, setApiKeyInput] = useState("");
  const [organizationIDInput, setOrganizationIDInput] = useState("");

  const MIN_NUM_OF_WORDS = 5;

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

  const getAIDataFromStorage = async () => {
    const newAIData: openAIDataType = await invoke("getOpenAIData");
    return newAIData;
  };

  const setAIDataInStorage = async (newOpenAIData: openAIDataType) => {
    await invoke("setOpenAIData", { openAIData: newOpenAIData });
  };

  useEffect(() => {
    if (!recievedAIDataFromStorage) {
      const getAIData = async () => {
        const newData: openAIDataType = await getAIDataFromStorage();
        setRecievedAIDataFromStorage(true);
        setOpenAIData(newData);
      };
      getAIData();
      return;
    }

    setAIDataInStorage(openAIData);
  }, [openAIData]);

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

    if (generateSummaryLoader) return;

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

  const handleGenerateSummary = async () => {
    if (createIssueLoader) return;
    if (!openAIData.openaiKey || !openAIData.organizationID) {
      setOpenaiKeyMenu(true);
      return;
    }

    setGenerateSummaryLoader(true);
    const data: string = await invoke("generateSummary", {
      openAIData,
      description,
      issueType: type,
    });
    console.log(data);
    setSummary(data);
    setGenerateSummaryLoader(false);
  };

  useEffect(() => {
    const wordsArr = description.split(" ");
    const numWords = wordsArr.filter((word) => word !== "").length;
    setDescriptionWords(numWords);
  }, [description]);

  useEffect(() => {
    console.log(descriptionWords, MIN_NUM_OF_WORDS);
    if (descriptionWords >= MIN_NUM_OF_WORDS) {
      setIsGenerateEnabled(true);
      return;
    }
    setIsGenerateEnabled(false);
  }, [descriptionWords]);

  const handleEditOpenAIData = () => {
    setApiKeyInput(openAIData.openaiKey);
    setOrganizationIDInput(openAIData.organizationID);
    setOpenaiKeyMenu(true);
  };

  return (
    <>
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
            <button
              onClick={handleGenerateSummary}
              className={`${styles.issue__button} ${
                generateSummaryLoader ? styles.button__loading : ""
              }`}
              type="button"
              disabled={!isGenerateEnabled}
            >
              <span className={generateSummaryLoader ? styles.hidden : ""}>Generate</span>
            </button>
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
            <button className={styles.issue__button} type="button" onClick={handleEditOpenAIData}>
              OpenAI Data
            </button>
          </div>
          <div className={styles.input__container}>
            <label className={styles.issue__label}>Type: </label>
            <select
              className={styles.select__issue}
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Bug">Bug</option>
              <option value="Epic">Epic</option>
              <option value="Story">Story</option>
              <option value="Task">Task</option>
            </select>
          </div>
          <button
            className={`${styles.newIssue__button} ${styles.issue__button} ${
              createIssueLoader ? styles.button__loading : ""
            }`}
          >
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
                  <input
                    className={styles.issue__input}
                    type="text"
                    value={updatedSummary}
                    onChange={(e) => setUpdatedSummary(e.target.value)}
                  />
                  <input
                    className={styles.issue__input}
                    type="text"
                    value={updatedDescription}
                    onChange={(e) => setUpdatedDescription(e.target.value)}
                  />
                  <select
                    className={styles.select__issue}
                    value={updatedType}
                    onChange={(e) => setUpdatedType(e.target.value)}
                  >
                    <option value="Bug">Bug</option>
                    <option value="Epic">Epic</option>
                    <option value="Story">Story</option>
                    <option value="Task">Task</option>
                  </select>
                </span>
                <span className={`${edit === id ? styles.none : ""} ${styles.issue__buttons}`}>
                  <button
                    className={styles.issue__button}
                    onClick={() => handleEdit({ id, summary, description, type })}
                  >
                    Edit
                  </button>
                  <button className={styles.issue__button} onClick={() => handleDelete(id)}>
                    Delete
                  </button>
                </span>
                <span>
                  <button
                    className={`${styles.issue__button} ${edit === id ? "" : styles.none}`}
                    onClick={() => handleUpdate(id)}
                  >
                    Update
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </section>
      {openaiKeyMenu && (
        <GetApiKey
          setOpenaiKeyMenu={setOpenaiKeyMenu}
          apiKeyInput={apiKeyInput}
          setApiKeyInput={setApiKeyInput}
          organizationIDInput={organizationIDInput}
          setOrganizationIDInput={setOrganizationIDInput}
        />
      )}
    </>
  );
};

export default Storage;
