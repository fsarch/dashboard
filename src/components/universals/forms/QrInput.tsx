import React, { useCallback } from 'react';
import Input from "@/components/universals/forms/Input";
import Button from "@/components/universals/forms/Button";
import { useDialog, useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import CodeScannerDialog from "@/components/universals/dialogs/code-scanner/CodeScannerDialog.component";
import { useFormikContext } from "formik";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";

type QrInputProps = {
  name: string;
};

const QrInput: React.FunctionComponent<QrInputProps> = ({
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
    <div>
      <Input
        type="text"
        name={name}
      />
      <Button type="button" onClick={handleClick}>
        Scannen
      </Button>
    </div>
  );
};

export default QrInput;
