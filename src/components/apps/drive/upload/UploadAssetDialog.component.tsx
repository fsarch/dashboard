'use client';

import type React from 'react';
import { type ChangeEvent, useCallback, useState } from 'react';
import { uploadAssetFile } from '@/components/apps/drive/upload/uploadAsset.util';
import DialogButtons from '@/components/universals/dialog/DialogButtons.component';
import DialogContent from '@/components/universals/dialog/DialogContent.component';
import DialogTitle from '@/components/universals/dialog/DialogTitle.component';
import Dialog from '@/components/universals/dialog/dialog.component';
import { DialogResult } from '@/components/universals/dialog/dialog.enum';
import type { TDialogComponent } from '@/components/universals/dialog/dialog.type';
import Button from '@/components/universals/forms/Button';
import styles from './UploadAssetDialog.module.scss';

export type TUploadAssetDialogValue = {
  serviceId: string;
  parentId: string | null;
};

// Same create-asset/PUT/complete flow as AssetUploadForm, but packaged as a
// dialog (see DRIVE_UPLOAD_ASSET_FLOATING_BUTTON_ID) instead of an
// always-visible inline form. Resolves once the asset has been fully
// uploaded, so the caller knows when to refresh the folder listing.
type UploadAssetDialogType = TDialogComponent<TUploadAssetDialogValue, void>;

const UploadAssetDialog: UploadAssetDialogType = ({ value, onResult }) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setFile(event.target.files?.[0] ?? null);
    },
    [],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!file) {
        return;
      }

      setIsUploading(true);
      setError(null);

      try {
        await uploadAssetFile({
          serviceId: value.serviceId,
          file,
          parentId: value.parentId,
        });
        onResult({ status: DialogResult.SUCCESS, value: undefined });
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Upload fehlgeschlagen',
        );
        setIsUploading(false);
      }
    },
    [file, value.parentId, value.serviceId, onResult],
  );

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Datei hochladen</DialogTitle>
        <DialogContent enableBottomPadding={false}>
          <input
            type="file"
            onChange={handleFileChange}
            disabled={isUploading}
          />
          {error ? <p className={styles.error}>{error}</p> : null}
        </DialogContent>
        <DialogButtons>
          <Button type="submit" disabled={!file || isUploading}>
            {isUploading ? 'Lädt hoch…' : 'Hochladen'}
          </Button>
          <Button
            type="button"
            disabled={isUploading}
            onClick={() => onResult({ status: DialogResult.CANCEL })}
          >
            Abbrechen
          </Button>
        </DialogButtons>
      </form>
    </Dialog>
  );
};

export default UploadAssetDialog;
