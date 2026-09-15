import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './DialogTitle.module.scss';

type DialogTitleProps = PropsWithChildren<{
  className?: string;
}>;

const DialogTitle: React.FunctionComponent<DialogTitleProps> = ({ children, className }) => (
  <div className={clsx(styles.root, className)}>
    {children}
  </div>
);

export default DialogTitle;
