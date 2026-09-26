import {
  abortAssetUpload,
  completeAssetUpload,
  createAssetUpload,
  createAssetVersionUpload,
} from '@/components/apps/drive/upload/AssetUploadForm.server-actions';

// PUTs the file content to `url`, reporting progress via XHR (fetch doesn't
// expose upload progress).
const putContent = (
  url: string,
  file: File,
  onProgress?: (loaded: number, total: number) => void,
) =>
  new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader(
      'Content-Type',
      file.type || 'application/octet-stream',
    );
    if (onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          onProgress(event.loaded, event.total);
        }
      };
    }
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Upload fehlgeschlagen (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error('Upload fehlgeschlagen'));
    xhr.send(file);
  });

export type TUploadAssetFileParams = {
  serviceId: string;
  file: File;
  // Create a new asset in this folder (null/undefined = root) ...
  parentId?: string | null;
  // ... or upload a new version of this existing asset instead.
  existingAssetId?: string;
  onProgress?: (loaded: number, total: number) => void;
};

// Shared create-asset/PUT/complete-upload flow, used by the inline upload
// form, the floating-button dialog, and drag-and-drop uploads alike.
export async function uploadAssetFile({
  serviceId,
  file,
  parentId = null,
  existingAssetId,
  onProgress,
}: TUploadAssetFileParams): Promise<void> {
  let uploadId: string | undefined;
  try {
    const upload = existingAssetId
      ? await createAssetVersionUpload(existingAssetId, {
          mimeType: file.type,
          size: file.size,
        })
      : (
          await createAssetUpload({
            name: file.name,
            parentId,
            mimeType: file.type,
            size: file.size,
          })
        ).upload;
    uploadId = upload.id;

    const targetUrl =
      upload.uploadUrl ?? `/drive/${serviceId}/upload/${upload.id}`;
    await putContent(targetUrl, file, onProgress);

    await completeAssetUpload(upload.id);
  } catch (uploadError) {
    if (uploadId) {
      await abortAssetUpload(uploadId).catch(() => undefined);
    }
    throw uploadError instanceof Error
      ? uploadError
      : new Error('Upload fehlgeschlagen');
  }
}
