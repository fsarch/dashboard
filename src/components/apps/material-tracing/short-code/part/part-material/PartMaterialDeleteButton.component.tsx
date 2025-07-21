'use client';

import React, { MouseEvent, useCallback } from 'react';
import ListItemActionIcon from "@/components/universals/list/ListItemActionIcon";
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import ConfirmDialog from "@/components/universals/dialogs/confirm/ConfirmDialog.component";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import { useRouter } from "next/navigation";
import {
  deletePartMaterial
} from "@/components/apps/material-tracing/short-code/part/part-material/PartMaterialDeleteButton.server-action";

type PartMaterialDeleteButtonProps = {
  partId: string;
  materialId: string;
};

const PartMaterialDeleteButton: React.FunctionComponent<PartMaterialDeleteButtonProps> = ({
  partId,
  materialId,
}) => {
  const openDialog = useOpenDialog();
  const router = useRouter();

  const handleClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    const dialog = openDialog(ConfirmDialog, {
      text: 'Möchten Sie dieses Material wirklich vom Bauteil entfernen?',
    });

    const result = await dialog.result;

    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deletePartMaterial(partId, materialId);

    router.refresh();
  }, [partId, materialId, openDialog, router]);

  return (
    <ListItemActionIcon
      icon="trash"
      onClick={handleClick}
    />
  );
};

export default PartMaterialDeleteButton;
