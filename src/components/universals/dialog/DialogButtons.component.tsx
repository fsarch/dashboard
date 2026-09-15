import React, { PropsWithChildren } from 'react';
import clsx from 'clsx';
import styles from './DialogButtons.module.scss';

export type TDialogButtonsAlignment = 'left' | 'center' | 'right';

type DialogButtonsProps = PropsWithChildren<{
  className?: string;
  alignment?: TDialogButtonsAlignment;
}>;

const ALIGNMENT_CLASS_NAMES: Record<TDialogButtonsAlignment, string> = {
  left: styles.alignLeft,
  center: styles.alignCenter,
  right: styles.alignRight,
};

const DialogButtons: React.FunctionComponent<DialogButtonsProps> = ({
  children,
  className,
  alignment = 'right',
}) => (
  <div className={clsx(styles.root, ALIGNMENT_CLASS_NAMES[alignment], className)}>
    {children}
  </div>
);

export default DialogButtons;
