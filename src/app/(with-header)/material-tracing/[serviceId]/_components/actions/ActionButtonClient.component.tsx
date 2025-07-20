'use client';

import React, { useCallback } from 'react';
import { TActionResponse } from "@/services/material-tracing/action.type";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import BinaryDialog from "@/app/(with-header)/material-tracing/[serviceId]/_components/actions/dialog/Binary.dialog";
import ActionButton from "@/components/universals/forms/button/ActionButton";
import AlertDialog from "@/components/universals/dialogs/alert/AlertDialog.component";

type ActionButtonClientProps = {
  onClick: () => Promise<TActionResponse>;
  name: string;
};

const ActionButtonClient: React.FunctionComponent<ActionButtonClientProps> = ({
  name,
  onClick,
}) => {
  const openDialog = useOpenDialog();

  const handleClick = useCallback(async () => {
    const res = await onClick();

    for (const element of res.actions) {
      const action = element;

      if (action.$type === 'show-modal') {
        const value = action.value;

        if (value.$type === 'binary') {
          const dialogRes = openDialog(BinaryDialog, {
            base64: value.base64,
            mimeType: value.mimeType,
            type: 'binary',
          });

          await dialogRes.result;
        }
      } else if (action.$type === 'dialog') {
        const value = action.value;

        if (value.$type === 'confirm') {
          const dialogRes = openDialog(AlertDialog, {
            text: value.text,
          });

          await dialogRes.result;
        }
      } else {
        console.info('unknown action type', action);
      }
    }

  }, [openDialog, onClick]);

  return (
    <ActionButton
      type="button"
      onClick={handleClick}
    >
      {name}
    </ActionButton>
  );
};

export default ActionButtonClient;
