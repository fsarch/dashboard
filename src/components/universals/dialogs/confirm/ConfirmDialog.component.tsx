import React from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import DialogContent from "@/components/universals/dialog/DialogContent.component";
import DialogButtons from "@/components/universals/dialog/DialogButtons.component";
import Button from "@/components/universals/forms/Button";
import styles from './ConfirmDialog.module.scss';

type ConfirmDialogType = TDialogComponent<{ text: string; successButtonText?: string; successButtonColor?: string; }, void>;

const ConfirmDialog: ConfirmDialogType = ({
  value,
  onResult,
}) => {

  return (
    <Dialog>
      <DialogContent className={styles.content}>
        {value.text}
      </DialogContent>
      <DialogButtons>
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
      </DialogButtons>
    </Dialog>
  );
};

export default ConfirmDialog;
