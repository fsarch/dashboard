'use client';

import { useRouter } from 'next/navigation';
import type React from 'react';
import { type MouseEvent, useCallback } from 'react';
import { deletePartChild } from '@/components/apps/material-tracing/short-code/part/part-children/PartChildDeleteButton.server-action';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import ListItemActionIcon from '@/components/universals/list/ListItemActionIcon';

type PartChildDeleteButtonProps = {
  partId: string;
  childPartId: string;
};

const PartChildDeleteButton: React.FunctionComponent<
  PartChildDeleteButtonProps
> = ({ partId, childPartId }) => {
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
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
    },
    [partId, childPartId, openDeleteDialog, router],
  );

  return <ListItemActionIcon icon="trash" onClick={handleClick} />;
};

export default PartChildDeleteButton;
