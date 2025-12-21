import React, { Suspense } from 'react';
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
