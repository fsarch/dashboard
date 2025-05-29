import React, { useCallback, useEffect, useRef } from 'react';
import { TReducerDialog } from "@/components/universals/dialog/DialogProvider.reducer";
import { TDialogResult } from "@/components/universals/dialog/dialog.type";
import styles from './DialogProviderDialog.module.scss';

type DialogProviderDialogProps = {
  value: TReducerDialog<unknown, unknown>;
  onResult: (id: string, result: TDialogResult<unknown>) => void;
};

const DialogProviderDialog: React.FunctionComponent<DialogProviderDialogProps> = ({
  value,
  onResult,
}) => {
  const handleResult = useCallback((result: TDialogResult<unknown>) => {
    onResult(
      value.id,
      result,
    );
  }, [value?.id, onResult]);

  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (value) {
      dialogRef.current?.show();

      return () => {
        dialogRef.current?.close();
      };
    }
  }, [value]);

  if (!value) {
    return null;
  }

  const Component = value.component;

  return (
    <dialog ref={dialogRef} className={styles.root}>
      <Component
        value={value.value}
        onResult={handleResult}
      />
    </dialog>
  );
};

export default DialogProviderDialog;
