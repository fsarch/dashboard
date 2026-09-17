'use client';

import React, { ChangeEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/universals/forms/Button';
import { uploadAssetFile } from '@/components/apps/drive/upload/uploadAsset.util';
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

    try {
      await uploadAssetFile({ serviceId, file, parentId, existingAssetId });
      setFile(null);
      router.refresh();
    } catch (uploadError) {
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
