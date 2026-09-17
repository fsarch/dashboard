'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useOpenDialog } from "@/components/universals/dialog/DialogProvider.context";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import { useFloatingButtonClick } from "@/components/universals/floating-button/FloatingButtonProvider.context";
import PromptDialog from "@/components/universals/dialogs/prompt/PromptDialog.component";
import UploadAssetDialog from "@/components/apps/drive/upload/UploadAssetDialog.component";
import { createDriveFolder } from "@/components/apps/drive/floating-button/DriveFloatingButtonListener.server-actions";
import {
  DRIVE_CREATE_FOLDER_FLOATING_BUTTON_ID,
  DRIVE_UPLOAD_ASSET_FLOATING_BUTTON_ID,
} from "@/constants/apps/drive/drive.floating-button.const";

type DriveFloatingButtonListenerProps = {
  serviceId: string;
  folderId: string | null;
};

// Renders nothing - just registers the click behaviour for the two floating
// buttons configured on the drive folder view (see DriveAppDefinition),
// which are rendered generically by DefaultPage via AutoFloatingButton.
const DriveFloatingButtonListener: React.FunctionComponent<DriveFloatingButtonListenerProps> = ({
  serviceId,
  folderId,
}) => {
  const openDialog = useOpenDialog();
  const router = useRouter();

  const handleCreateFolder = useCallback(async () => {
    const dialog = openDialog(PromptDialog, {
      title: 'Neuer Ordner',
      label: 'Ordner-Name',
      submitButtonText: 'Ordner erstellen',
    });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    await createDriveFolder(result.value, folderId);
    router.refresh();
  }, [openDialog, folderId, router]);

  const handleUploadAsset = useCallback(async () => {
    const dialog = openDialog(UploadAssetDialog, { serviceId, parentId: folderId });

    const result = await dialog.result;
    if (result.status !== DialogResult.SUCCESS) {
      return;
    }

    router.refresh();
  }, [openDialog, serviceId, folderId, router]);

  useFloatingButtonClick(DRIVE_CREATE_FOLDER_FLOATING_BUTTON_ID, handleCreateFolder);
  useFloatingButtonClick(DRIVE_UPLOAD_ASSET_FLOATING_BUTTON_ID, handleUploadAsset);

  return null;
};

export default DriveFloatingButtonListener;
