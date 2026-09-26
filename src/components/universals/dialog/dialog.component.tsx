import type React from 'react';
import type { PropsWithChildren } from 'react';
import { useDialogOverlayColor } from './DialogOverlayColor.context';
import styles from './dialog.module.scss';

type DialogProps = PropsWithChildren<{}>;

const Dialog: React.FunctionComponent<DialogProps> = ({ children }) => {
  // Von openDialog(component, value, { color }) gesetzt - undefined lässt
  // die Standardfarbe aus dialog.module.scss unangetastet.
  const overlayColor = useDialogOverlayColor();

  return (
    <>
      <div
        className={styles.overlay}
        style={overlayColor ? { backgroundColor: overlayColor } : undefined}
      />
      <div className={styles.dialog}>{children}</div>
    </>
  );
};

export default Dialog;
