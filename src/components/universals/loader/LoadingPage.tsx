import React from 'react';
import Loader from "@/components/universals/loader/Loader";
import styles from "./LoadingPage.module.scss";

type LoadingPageProps = {
  text?: string;
};

const LoadingPage: React.FunctionComponent<LoadingPageProps> = ({
  text = 'Lade Daten...',
}) => {
  return (
    <>
      <div className={styles.backdrop}/>
      <div
        className={styles.modal}
      >
        <div className={styles.loader}>
          <Loader/>
        </div>

        <div className={styles.text}>
          {text}
        </div>
      </div>
    </>
  );
};

export default LoadingPage;
