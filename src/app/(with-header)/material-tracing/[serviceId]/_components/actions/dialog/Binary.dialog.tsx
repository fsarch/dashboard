import React from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import Dialog from "@/components/universals/dialog/dialog.component";
import styles from './Binary.module.scss';
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Button from "@/components/universals/forms/Button";

type BinaryDialogProps = TDialogComponent<{ type: 'binary'; base64: string; mimeType: string; }, undefined>;

const BinaryDialog: BinaryDialogProps = ({
  value,
  onResult,
}) => {
  return (
    <Dialog>
      <div>
        <embed
          src={`data:${value.mimeType};base64,${value.base64}`}
          type={value.mimeType}
          className={styles.embed}
        />
      </div>
      <Button
        type="button"
        onClick={() => onResult({ status: DialogResult.CANCEL })}
      >
        Schließen
      </Button>
    </Dialog>
  );
};

export default BinaryDialog;
