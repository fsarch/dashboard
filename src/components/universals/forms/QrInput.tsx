import React, { useCallback } from 'react';
import Button from "@/components/universals/forms/Button";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import CodeScannerDialog from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.component";
import { Field, useFormikContext } from "formik";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import styles from './QrInput.module.scss';

type QrInputProps = {
  id?: string;
  name: string;
};

const QrInput: React.FunctionComponent<QrInputProps> = ({
  id,
  name,
}) => {
  const openDialog = useOpenDialog();

  const formik = useFormikContext();

  const handleClick = useCallback(async () => {
    const dialog = openDialog(CodeScannerDialog, {
      enableQRCode: true,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await formik.setFieldValue(name, result.value.value);
  }, [openDialog]);

  return (
    <div className={styles.root}>
      <Field
        id={id}
        className={styles.input}
        type="text"
        name={name}
      />
      <Button className={styles.button} type="button" onClick={handleClick}>
        Scannen
      </Button>
    </div>
  );
};

export default QrInput;
