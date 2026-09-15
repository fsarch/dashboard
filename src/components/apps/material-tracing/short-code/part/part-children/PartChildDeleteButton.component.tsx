'use client';

import React, { MouseEvent, useCallback } from 'react';
import ListItemActionIcon from "@/components/universals/list/ListItemActionIcon";
import { useOpenDeleteDialog } from "@/components/universals/dialogs/confirm/useOpenDeleteDialog";
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
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    const dialog = openDeleteDialog({
      text: 'Möchten Sie dieses Bauteil wirklich entfernen?',
      successButtonText: 'Entfernen',
    });

    const result = await dialog.result;

    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deletePartChild(partId, childPartId);

    router.refresh();
  }, [partId, childPartId, openDeleteDialog, router]);

  return (
    <ListItemActionIcon
      icon="trash"
      onClick={handleClick}
    />
  );
};

export default PartChildDeleteButton;
