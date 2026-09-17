'use client';

import React, { ChangeEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import {
  abortAssetUpload,
  completeAssetUpload,
  createAssetUpload,
  createAssetVersionUpload,
} from '@/components/apps/drive/upload/AssetUploadForm.server-actions';
import styles from './AssetUploadForm.module.scss';

type AssetUploadFormProps = {
  serviceId: string;
  // Create a new asset in this folder (null = root) ...
  parentId?: string | null;
  // ... or upload a new version of this existing asset instead.
  existingAssetId?: string;
};

const AssetUploadForm: React.FunctionComponent<AssetUploadFormProps> = ({
  serviceId,
  parentId = null,
  existingAssetId,
}) => {
  const router = useRouter();
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
      const upload = existingAssetId
        ? await createAssetVersionUpload(existingAssetId, { mimeType: file.type, size: file.size })
        : (await createAssetUpload({
            name: file.name,
            parentId,
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
        const putRes = await fetch(`/drive/${serviceId}/upload/${upload.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': file.type || 'application/octet-stream' },
          body: file,
        });
        if (!putRes.ok) {
          throw new Error(`Upload fehlgeschlagen (${putRes.status})`);
        }
      }

      await completeAssetUpload(upload.id);
      setFile(null);
      router.refresh();
    } catch (uploadError) {
      if (uploadId) {
        await abortAssetUpload(uploadId).catch(() => undefined);
      }
      setError(uploadError instanceof Error ? uploadError.message : 'Upload fehlgeschlagen');
    } finally {
      setIsUploading(false);
    }
  }, [file, existingAssetId, parentId, serviceId, router]);

  return (
    <form onSubmit={handleSubmit} className={styles.root}>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      <Button type="submit" disabled={!file || isUploading}>
        {isUploading ? 'Lädt hoch…' : existingAssetId ? 'Neue Version hochladen' : 'Hochladen'}
      </Button>
      {error ? <p className={styles.error}>{error}</p> : null}
    </form>
  );
};

export default AssetUploadForm;
