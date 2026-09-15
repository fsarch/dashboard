'use client';

import React, { MouseEvent, useCallback } from 'react';
import ListItemActionIcon from "@/components/universals/list/ListItemActionIcon";
import { useOpenDeleteDialog } from "@/components/universals/dialogs/confirm/useOpenDeleteDialog";
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
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleClick = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    const dialog = openDeleteDialog({
      text: 'Möchten Sie dieses Material wirklich vom Bauteil entfernen?',
      successButtonText: 'Entfernen',
    });

    const result = await dialog.result;

    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deletePartMaterial(partId, materialId);

    router.refresh();
  }, [partId, materialId, openDeleteDialog, router]);

  return (
    <ListItemActionIcon
      icon="trash"
      onClick={handleClick}
    />
  );
};

export default PartMaterialDeleteButton;
