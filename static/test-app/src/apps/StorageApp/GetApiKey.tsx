import styles from "./styles/GetApiKey.module.css";
import React, { useEffect, useState } from "react";
import { apiStoreType } from "./store/storeTypes";
import { apiStore } from "./store/store";

type propsType = {
  setOpenaiKeyMenu: (isDisplayed: boolean) => void;
  apiKeyInput: string;
  setApiKeyInput: (apiKey: string) => void;
  organizationIDInput: string;
  setOrganizationIDInput: (orgID: string) => void;
};

const GetApiKey = ({ setOpenaiKeyMenu, apiKeyInput, setApiKeyInput, organizationIDInput, setOrganizationIDInput }: propsType) => {
  const { setOpenAIData } = apiStore((state: unknown) => state as apiStoreType);
  const [isSubmitEnabled, setIsSubmitEnabled] = useState(false);

  useEffect(() => {
    if (apiKeyInput && organizationIDInput) {
      setIsSubmitEnabled(true);
    } else {
      setIsSubmitEnabled(false);
    }
  }, [apiKeyInput, organizationIDInput]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOpenAIData({ openaiKey: apiKeyInput, organizationID: organizationIDInput });

    setOpenaiKeyMenu(false);
    setApiKeyInput("");
    setOrganizationIDInput("");
  };

  const handleCloseMenu = () => {
    setOpenaiKeyMenu(false);
  };

  return (
    <div className={styles.overlay}>
      <form onSubmit={handleSubmit} className={styles.container}>
        <h4 className={styles.header}>
          Provide OpenAI Info (
          <a href="https://platform.openai.com/" target="_blank" rel="noreferrer">
            Get Info
          </a>
          )
        </h4>
        <div>
          <label className={styles.label}>Api Key</label>
          <input
            className={styles.input}
            type="text"
            id="openai-key"
            name="openai-key"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
          />
        </div>
        <div>
          <label className={styles.label}>Organization ID</label>
          <input
            className={styles.input}
            type="text"
            id="organization"
            name="organization"
            value={organizationIDInput}
            onChange={(e) => setOrganizationIDInput(e.target.value)}
          />
        </div>
        <div className={styles.button__container}>
          <button onClick={handleCloseMenu} className={styles.button} type="button">
            Cancel
          </button>
          <button className={styles.button} disabled={!isSubmitEnabled} type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default GetApiKey;
