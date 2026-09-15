import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './DialogContent.module.scss';

type DialogContentProps = PropsWithChildren<{
  className?: string;
}>;

const DialogContent: React.FunctionComponent<DialogContentProps> = ({ children, className }) => (
  <div className={clsx(styles.root, className)}>
    {children}
  </div>
);

export default DialogContent;
