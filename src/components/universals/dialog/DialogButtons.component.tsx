import clsx from 'clsx';
import type React from 'react';
import type { PropsWithChildren } from 'react';
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
  <div
    className={clsx(styles.root, ALIGNMENT_CLASS_NAMES[alignment], className)}
  >
    {children}
  </div>
);

export default DialogButtons;
