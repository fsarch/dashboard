import React, { PropsWithChildren } from 'react';
import styles from './dialog.module.scss';

type DialogProps = PropsWithChildren<{

}>;

const Dialog: React.FunctionComponent<DialogProps> = ({
  children,
}) => {
  return (
    <>
      <div className={styles.overlay} />
      <div className={styles.dialog}>
        {children}
      </div>
    </>
  );
};

export default Dialog;
