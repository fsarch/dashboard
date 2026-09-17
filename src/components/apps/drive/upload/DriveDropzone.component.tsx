'use client';

import React, { DragEvent, PropsWithChildren, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createDriveUploadFolder } from '@/components/apps/drive/upload/AssetUploadForm.server-actions';
import { resolveDroppedFiles, TDroppedFile } from '@/components/apps/drive/upload/dataTransfer.util';
import { uploadAssetFile } from '@/components/apps/drive/upload/uploadAsset.util';
import styles from './DriveDropzone.module.scss';

type DriveDropzoneProps = PropsWithChildren<{
  serviceId: string;
  folderId: string | null;
}>;

type TUploadStatus = 'pending' | 'uploading' | 'done' | 'error';

type TUploadItem = {
  key: string;
  name: string;
  status: TUploadStatus;
  error?: string;
};

// At most this many uploads run at the same time; the rest wait in the queue.
const MAX_CONCURRENT_UPLOADS = 3;

const DriveDropzone: React.FunctionComponent<DriveDropzoneProps> = ({ serviceId, folderId, children }) => {
  const router = useRouter();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [items, setItems] = useState<TUploadItem[] | null>(null);
  const dragCounter = useRef(0);

  const handleDragEnter = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!event.dataTransfer.types.includes('Files')) {
      return;
    }
    dragCounter.current += 1;
    setIsDraggingOver(true);
  }, []);

  const handleDragOver = useCallback((event: DragEvent<HTMLDivElement>) => {
    if (event.dataTransfer.types.includes('Files')) {
      event.preventDefault();
    }
  }, []);

  const handleDragLeave = useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) {
      setIsDraggingOver(false);
    }
  }, []);

  const handleDrop = useCallback(async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current = 0;
    setIsDraggingOver(false);

    const dropped = await resolveDroppedFiles(event.dataTransfer);
    if (dropped.length === 0) {
      return;
    }

    setItems(dropped.map((entry, index) => ({
      key: `${index}-${entry.file.name}`,
      name: entry.folderPath.length > 0 ? `${entry.folderPath.join('/')}/${entry.file.name}` : entry.file.name,
      status: 'pending',
    })));

    // Caches folder-path -> created folder id, so a subfolder shared by
    // multiple dropped files is only created once.
    const folderCache = new Map<string, Promise<string | null>>();
    const resolveFolder = (path: string[]): Promise<string | null> => {
      if (path.length === 0) {
        return Promise.resolve(folderId);
      }
      const cacheKey = path.join('/');
      let promise = folderCache.get(cacheKey);
      if (!promise) {
        promise = (async () => {
          const parentId = await resolveFolder(path.slice(0, -1));
          const folder = await createDriveUploadFolder(path[path.length - 1], parentId);
          return folder.id;
        })();
        folderCache.set(cacheKey, promise);
      }
      return promise;
    };

    const setItemStatus = (key: string, status: TUploadStatus, error?: string) => {
      setItems((current) => current?.map((item) => (item.key === key ? { ...item, status, error } : item)) ?? current);
    };

    const uploadOne = async (entry: TDroppedFile, key: string) => {
      setItemStatus(key, 'uploading');
      try {
        const parentId = await resolveFolder(entry.folderPath);
        await uploadAssetFile({ serviceId, file: entry.file, parentId });
        setItemStatus(key, 'done');
      } catch (uploadError) {
        setItemStatus(key, 'error', uploadError instanceof Error ? uploadError.message : 'Upload fehlgeschlagen');
      }
    };

    const queue = dropped.map((entry, index) => ({ entry, key: `${index}-${entry.file.name}` }));
    let nextIndex = 0;
    const runWorker = async () => {
      while (nextIndex < queue.length) {
        const { entry, key } = queue[nextIndex];
        nextIndex += 1;
        await uploadOne(entry, key);
      }
    };
    await Promise.all(
      Array.from({ length: Math.min(MAX_CONCURRENT_UPLOADS, queue.length) }, () => runWorker()),
    );

    router.refresh();
  }, [serviceId, folderId, router]);

  const handleClosePanel = useCallback(() => setItems(null), []);

  return (
    <div
      className={styles.root}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {children}

      {isDraggingOver ? (
        <div className={styles.overlay}>
          <p>Dateien hier ablegen zum Hochladen</p>
        </div>
      ) : null}

      {items ? (
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span>Uploads</span>
            <button type="button" className={styles.panelClose} onClick={handleClosePanel}>×</button>
          </div>
          <ul className={styles.panelList}>
            {items.map((item) => (
              <li key={item.key} className={styles.panelItem}>
                <span className={styles.panelItemName} title={item.name}>{item.name}</span>
                <span className={styles[`status-${item.status}`]}>
                  {item.status === 'pending' && 'wartet'}
                  {item.status === 'uploading' && 'lädt…'}
                  {item.status === 'done' && 'fertig'}
                  {item.status === 'error' && (item.error ?? 'Fehler')}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export default DriveDropzone;
