import React, { Suspense, useEffect } from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import styles from './CommandCenterDialog.module.scss';
import SingleIconButton from "@/components/universals/forms/button/SingleIconButton";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Loader from "@/components/universals/loader/Loader";
import CommandCenterContent from "@/components/navigation/command-center/CommandCenterContent";

type CommandCenterDialogType = TDialogComponent<undefined, { value: string }>;

const CommandCenterDialog: CommandCenterDialogType = ({
  value,
  onResult,
}) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onResult({ status: DialogResult.CANCEL });
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onResult]);

  return (
    <>
      <div className={styles.overlay}/>
      <div className={styles.overlayColor}/>
      <div className={styles.content}>
        <Suspense fallback={<Loader/>}>
          <CommandCenterContent />
        </Suspense>
      </div>
      <SingleIconButton
        onClick={() => onResult({ status: DialogResult.CANCEL })}
        className={styles.closeButton}
        type="button"
        icon="close"
      />
    </>
  );
};

export default CommandCenterDialog;
