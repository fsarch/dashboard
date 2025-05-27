import React, { PropsWithChildren } from 'react';
import styles from './FieldsetRow.module.scss';

type FieldsetRowProps = PropsWithChildren<{
  label: React.ReactNode
}>;

const FieldsetRow: React.FunctionComponent<FieldsetRowProps> = ({
  children,
  label
}) => {
  return (
    <div className={styles.root}>
      <div className={styles.label}>
        {label}
      </div>
      <div className={styles.children}>
        {children}
      </div>
    </div>
  );
};

export default FieldsetRow;
