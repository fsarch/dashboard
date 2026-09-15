import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './DialogContent.module.scss';

type DialogContentProps = PropsWithChildren<{
  className?: string;
  // Standardmäßig aktiv (unteres Padding wie bei DialogTitle/DialogButtons).
  // Auf false setzen, wenn direkt danach ein Block folgt, der die untere
  // Kante selbst übernimmt (z. B. DialogButtons), um doppelten Abstand zu
  // vermeiden.
  enableBottomPadding?: boolean;
}>;

const DialogContent: React.FunctionComponent<DialogContentProps> = ({
  children,
  className,
  enableBottomPadding = true,
}) => (
  <div className={clsx(styles.root, !enableBottomPadding && styles.noBottomPadding, className)}>
    {children}
  </div>
);

export default DialogContent;
