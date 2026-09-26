import clsx from 'clsx';
import type React from 'react';
import Loader from '@/components/universals/loader/Loader';
import styles from './InlineLoadingWrapper.module.scss';

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
          <Loader size={32} />
        </div>
      )}
    </div>
  );
};

export default InlineLoadingWrapper;
