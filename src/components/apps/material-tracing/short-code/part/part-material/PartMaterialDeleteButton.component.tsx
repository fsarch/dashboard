'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { type MouseEvent, useCallback } from 'react';
import { deletePartMaterial } from '@/components/apps/material-tracing/short-code/part/part-material/PartMaterialDeleteButton.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import ListItemActionIcon from '@/components/universals/list/ListItemActionIcon';

type PartMaterialDeleteButtonProps = {
  partId: string;
  materialId: string;
};

const PartMaterialDeleteButton: React.FunctionComponent<
  PartMaterialDeleteButtonProps
> = ({ partId, materialId }) => {
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
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
    },
    [partId, materialId, openDeleteDialog, router],
  );

  return <ListItemActionIcon icon="trash" onClick={handleClick} />;
};

export default PartMaterialDeleteButton;
