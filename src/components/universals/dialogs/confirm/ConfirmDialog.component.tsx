import React from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import Button from "@/components/universals/forms/Button";
import styles from './ConfirmDialog.module.scss';

type ConfirmDialogType = TDialogComponent<{ text: string; successButtonText?: string; successButtonColor?: string; }, void>;

const ConfirmDialog: ConfirmDialogType = ({
  value,
  onResult,
}) => {

  return (
    <Dialog>
      <div className={styles.text}>
        {value.text}
      </div>
      <div className={styles.buttons}>
        <Button
          type="button"
          onClick={() => onResult({ status: DialogResult.SUCCESS, value: undefined })}
          color={value.successButtonColor}
        >
          {value.successButtonText ?? 'Bestätigen'}
        </Button>
        <Button
          type="button"
          onClick={() => onResult({ status: DialogResult.CANCEL })}
        >
          Abbrechen
        </Button>
      </div>
    </Dialog>
  );
};

export default ConfirmDialog;
