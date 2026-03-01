import React from 'react';
import styles from "./InlineLoadingWrapper.module.scss";
import Loader from "@/components/universals/loader/Loader";
import clsx from "clsx";

type LoadingWrapperProps = {
  isLoading: boolean;
  children: React.ReactElement;
  className?: string;
};

const InlineLoadingWrapper: React.FunctionComponent<LoadingWrapperProps> = ({
  isLoading,
  children,
  className,
}) => {
  return (
    <div className={clsx(styles.root, className)}>
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
