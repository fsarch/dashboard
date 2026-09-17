'use client';

import React, { ChangeEvent, useCallback, useState } from 'react';
import { TDialogComponent } from "@/components/universals/dialog/dialog.type";
import { DialogResult } from "@/components/universals/dialog/dialog.enum";
import Dialog from "@/components/universals/dialog/dialog.component";
import DialogTitle from "@/components/universals/dialog/DialogTitle.component";
import DialogContent from "@/components/universals/dialog/DialogContent.component";
import DialogButtons from "@/components/universals/dialog/DialogButtons.component";
import Button from "@/components/universals/forms/Button";
import {
  abortAssetUpload,
  completeAssetUpload,
  createAssetUpload,
} from '@/components/apps/drive/upload/AssetUploadForm.server-actions';
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

const UploadAssetDialog: UploadAssetDialogType = ({
  value,
  onResult,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setFile(event.target.files?.[0] ?? null);
  }, []);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    setIsUploading(true);
    setError(null);

    let uploadId: string | undefined;
    try {
      const upload = (await createAssetUpload({
        name: file.name,
        parentId: value.parentId,
        mimeType: file.type,
        size: file.size,
      })).upload;
      uploadId = upload.id;

      if (upload.uploadUrl) {
        const putRes = await fetch(upload.uploadUrl, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!putRes.ok) {
          throw new Error(`Upload zum Speicher fehlgeschlagen (${putRes.status})`);
        }
      } else {
        const putRes = await fetch(`/drive/${value.serviceId}/upload/${upload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!putRes.ok) {
          throw new Error(`Upload fehlgeschlagen (${putRes.status})`);
        }
      }

      await completeAssetUpload(upload.id);
      onResult({ status: DialogResult.SUCCESS, value: undefined });
    } catch (uploadError) {
      if (uploadId) {
        await abortAssetUpload(uploadId).catch(() => undefined);
      }
      setError(uploadError instanceof Error ? uploadError.message : 'Upload fehlgeschlagen');
      setIsUploading(false);
    }
  }, [file, value.parentId, value.serviceId, onResult]);

  return (
    <Dialog>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Datei hochladen</DialogTitle>
        <DialogContent enableBottomPadding={false}>
          <input type="file" onChange={handleFileChange} disabled={isUploading} />
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
