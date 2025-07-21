'use client';

import React, { MouseEvent, useCallback } from 'react';
import ListItemActionIcon from "@/components/universals/list/ListItemActionIcon";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import ConfirmDialog from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import {
  deletePartChild
} from "@/components/apps/material-tracing/short-code/part/part-children/PartChildDeleteButton.server-action";
import { useRouter } from "next/navigation";

type PartChildDeleteButtonProps = {
  partId: string;
  childPartId: string;
};

const PartChildDeleteButton: React.FunctionComponent<PartChildDeleteButtonProps> = ({
  partId,
  childPartId,
}) => {
  const openDialog = useOpenDialog();
  const router = useRouter();

  const handleClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    console.log('Delete child part', partId, childPartId);

    const dialog = openDialog(ConfirmDialog, {
      text: 'Möchten Sie dieses Bauteil wirklich entfernen?',
    });

    const result = await dialog.result;

    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deletePartChild(partId, childPartId);

    router.refresh();
  }, [partId, childPartId, openDialog, router]);

  return (
    <ListItemActionIcon
      icon="trash"
      onClick={handleClick}
    />
  );
};

export default PartChildDeleteButton;
