import "./styles/main.css";
import styles from "./styles/App.module.css";
import React, { useState } from "react";
import IssuesAPIApp from "./apps/IssuesAPIApp/IssuesAPIApp";
import StorageApp from "./apps/StorageApp/StorageApp";

function App() {
  const [isShowIssueAPIApp, setIsShowIssueAPIApp] = useState(true);
  const [isShowStorageApp, setIsShowStorageApp] = useState(false);

  const handleShowIssueAPI = () => {
    setIsShowIssueAPIApp(true);
    setIsShowStorageApp(false);
  };

  const handleShowStorage = () => {
    setIsShowIssueAPIApp(false);
    setIsShowStorageApp(true);
  };

  return (
    <>
      <div className={styles.buttons}>
        <button
          className={`${styles.button} ${
            isShowIssueAPIApp ? styles.button__selected : ""
          }`}
          onClick={handleShowIssueAPI}
        >
          IssueAPI app
        </button>
        <button
          className={`${styles.button} ${
            isShowStorageApp ? styles.button__selected : ""
          }`}
          onClick={handleShowStorage}
        >
          Storage App
        </button>
      </div>

      {isShowIssueAPIApp && <IssuesAPIApp />}
      {isShowStorageApp && <StorageApp />}
    </>
  );
}

export default App;
