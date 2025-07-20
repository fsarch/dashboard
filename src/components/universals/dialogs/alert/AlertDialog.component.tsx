import React from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import Button from "@/components/universals/forms/Button";
import styles from './AlertDialog.module.scss';

type AlertDialogType = TDialogComponent<{ text: string; buttonText?: string; buttonColor?: string; }, void>;

const AlertDialog: AlertDialogType = ({
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
          color={value.buttonColor}
        >
          {value.buttonText ?? 'Bestätigen'}
        </Button>
      </div>
    </Dialog>
  );
};

export default AlertDialog;
