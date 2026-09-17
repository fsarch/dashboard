'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ContextMenuItem from '@/components/universals/context-menu/ContextMenuItem.component';
import { TContextMenuComponent } from '@/components/universals/context-menu/contextMenu.type';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import PromptDialog from '@/components/universals/dialogs/prompt/PromptDialog.component';
import { TAsset } from '@/services/file-server/file-server-api.type';
import { deleteDriveAsset, renameDriveAsset } from '@/components/apps/drive/context-menu/DriveTileContextMenu.server-actions';

type AssetTileContextMenuValue = {
  asset: TAsset;
};

const AssetTileContextMenu: TContextMenuComponent<AssetTileContextMenuValue> = ({
  value,
  close,
}) => {
  const openDialog = useOpenDialog();
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleRename = useCallback(async () => {
    close();

    const dialog = openDialog(PromptDialog, {
      title: 'Datei umbenennen',
      label: 'Datei-Name',
      initialValue: value.asset.name,
      submitButtonText: 'Umbenennen',
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await renameDriveAsset(value.asset.id, result.value);
    router.refresh();
  }, [close, openDialog, value.asset, router]);

  const handleDelete = useCallback(async () => {
    close();

    const dialog = openDeleteDialog({
      text: `Datei "${value.asset.name}" wirklich löschen?`,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deleteDriveAsset(value.asset.id);
    router.refresh();
  }, [close, openDeleteDialog, value.asset, router]);

  return (
    <>
      <ContextMenuItem icon="pen" onClick={handleRename}>
        Umbenennen
      </ContextMenuItem>
      <ContextMenuItem icon="trash" danger onClick={handleDelete}>
        Löschen
      </ContextMenuItem>
    </>
  );
};

export default AssetTileContextMenu;
