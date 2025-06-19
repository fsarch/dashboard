import React from 'react';
import styles from "./InlineLoadingWrapper.module.scss";
import Loader from "@/components/universals/loader/Loader";

type LoadingWrapperProps = {
  isLoading: boolean;
  children: React.ReactElement;
};

const InlineLoadingWrapper: React.FunctionComponent<LoadingWrapperProps> = ({
  isLoading,
  children,
}) => {
  return (
    <div className={styles.root}>
      {children}
      {isLoading && (
        <div className={styles.loader}>
          <Loader
            size={32}
          />
        </div>
      )}
    </div>
  );
};

export default InlineLoadingWrapper;
