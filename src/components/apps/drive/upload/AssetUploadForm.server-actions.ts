'use server';

import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { TCreateAssetResponse, TFolder, TUpload } from '@/services/file-server/file-server-api.type';

export const createAssetUpload = async (data: {
  name: string;
  parentId: string | null;
  mimeType?: string;
  size?: number;
}): Promise<TCreateAssetResponse> =>
  fileServerApiService.createAsset({
    name: data.name,
    parentId: data.parentId,
    mimeType: data.mimeType,
    expectedSize: data.size,
  });

export const createAssetVersionUpload = async (
  assetId: string,
  data: { mimeType?: string; size?: number },
): Promise<TUpload> =>
  fileServerApiService.createAssetVersion(assetId, {
    mimeType: data.mimeType,
    expectedSize: data.size,
  });

export const completeAssetUpload = async (uploadId: string) =>
  fileServerApiService.completeUpload(uploadId);

export const abortAssetUpload = async (uploadId: string) => fileServerApiService.abortUpload(uploadId);

// Creates a single subfolder, used to recreate a dropped folder's structure
// one level at a time (see DriveDropzone, which caches results per path so
// each subfolder is only created once even if many files share it).
export const createDriveUploadFolder = async (name: string, parentId: string | null): Promise<TFolder> =>
  fileServerApiService.createFolder({ name, parentId });
