'use client';

import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import {
  deleteDriveAsset,
  moveDriveAsset,
  renameDriveAsset,
} from '@/components/apps/drive/context-menu/DriveTileContextMenu.server-actions';
import ContextMenuItem from '@/components/universals/context-menu/ContextMenuItem.component';
import type { TContextMenuComponent } from '@/components/universals/context-menu/contextMenu.type';
import { useOpenDialog } from '@/components/universals/dialog/DialogProvider.context';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import { useOpenDeleteDialog } from '@/components/universals/dialogs/confirm/useOpenDeleteDialog';
import PromptDialog from '@/components/universals/dialogs/prompt/PromptDialog.component';
import SelectCustomResourceDialog from '@/components/universals/dialogs/select-custom-resource/SelectCustomResourceDialog.component';
import type { TAsset } from '@/services/file-server/file-server-api.type';

type AssetTileContextMenuValue = {
  serviceId: string;
  asset: TAsset;
};

const AssetTileContextMenu: TContextMenuComponent<
  AssetTileContextMenuValue
> = ({ value, close }) => {
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

  const handleMove = useCallback(async () => {
    close();

    const dialog = openDialog(SelectCustomResourceDialog, {
      serviceId: value.serviceId,
      resourceId: 'folder',
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    const target = result.value as { id?: string } | null;
    await moveDriveAsset(value.asset.id, target?.id ?? null);
    router.refresh();
  }, [close, openDialog, value.serviceId, value.asset, router]);

  const handleMoveToRoot = useCallback(async () => {
    close();
    await moveDriveAsset(value.asset.id, null);
    router.refresh();
  }, [close, value.asset, router]);

  return (
    <>
      <ContextMenuItem icon="pen" onClick={handleRename}>
        Umbenennen
      </ContextMenuItem>
      <ContextMenuItem icon="right-left" onClick={handleMove}>
        Verschieben
      </ContextMenuItem>
      {value.asset.parentId ? (
        <ContextMenuItem icon="house" onClick={handleMoveToRoot}>
          Ins Hauptverzeichnis verschieben
        </ContextMenuItem>
      ) : null}
      <ContextMenuItem icon="trash" danger onClick={handleDelete}>
        Löschen
      </ContextMenuItem>
    </>
  );
};

export default AssetTileContextMenu;
