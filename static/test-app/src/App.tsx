import "./styles/main.css";
import styles from "./styles/App.module.css";
import React, { useState } from "react";
import IssuesAPI from "./components/IssuesAPI";
import Storage from "./components/Storage";

function App() {
  const [isShowIssueAPI, setIsShowIssueApi] = useState(true);
  const [isShowStorage, setIsShowStorage] = useState(false);

  const handleShowIssueAPI = () => {
    setIsShowIssueApi(true);
    setIsShowStorage(false);
  };

  const handleShowStorage = () => {
    setIsShowIssueApi(false);
    setIsShowStorage(true);
  };

  return (
    <>
      <div className={styles.buttons}>
        <button className={`${styles.button} ${isShowIssueAPI ? styles.button__selected : ""}`} onClick={handleShowIssueAPI}>
          IssueAPI app
        </button>
        <button className={`${styles.button} ${isShowStorage ? styles.button__selected : ""}`} onClick={handleShowStorage}>
          Storage App
        </button>
      </div>

      {isShowIssueAPI && <IssuesAPI />}
      {isShowStorage && <Storage />}
    </>
  );
}

export default App;
