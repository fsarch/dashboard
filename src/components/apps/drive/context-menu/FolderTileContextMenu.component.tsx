'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import ContextMenuItem from '@/components/universals/context-menu/ContextMenuItem.component';
import { TContextMenuComponent } from '@/components/universals/context-menu/contextMenu.type';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import PromptDialog from '@/components/universals/dialogs/prompt/PromptDialog.component';
import { TFolder } from '@/services/file-server/file-server-api.type';
import { deleteDriveFolder, renameDriveFolder } from '@/components/apps/drive/context-menu/DriveTileContextMenu.server-actions';

type FolderTileContextMenuValue = {
  folder: TFolder;
};

const FolderTileContextMenu: TContextMenuComponent<FolderTileContextMenuValue> = ({
  value,
  close,
}) => {
  const openDialog = useOpenDialog();
  const openDeleteDialog = useOpenDeleteDialog();
  const router = useRouter();

  const handleRename = useCallback(async () => {
    close();

    const dialog = openDialog(PromptDialog, {
      title: 'Ordner umbenennen',
      label: 'Ordner-Name',
      initialValue: value.folder.name,
      submitButtonText: 'Umbenennen',
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await renameDriveFolder(value.folder.id, result.value);
    router.refresh();
  }, [close, openDialog, value.folder, router]);

  const handleDelete = useCallback(async () => {
    close();

    const dialog = openDeleteDialog({
      text: `Ordner "${value.folder.name}" wirklich löschen?`,
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await deleteDriveFolder(value.folder.id);
    router.refresh();
  }, [close, openDeleteDialog, value.folder, router]);

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

export default FolderTileContextMenu;
