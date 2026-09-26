'use server';

import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import type {
  TAsset,
  TFolder,
} from '@/services/file-server/file-server-api.type';

export const renameDriveFolder = async (
  id: string,
  name: string,
): Promise<TFolder> => fileServerApiService.renameFolder(id, name);

export const deleteDriveFolder = async (id: string): Promise<void> =>
  fileServerApiService.deleteFolder(id);

export const moveDriveFolder = async (
  id: string,
  parentId: string | null,
): Promise<TFolder> => fileServerApiService.moveFolder(id, parentId);

export const renameDriveAsset = async (
  id: string,
  name: string,
): Promise<TAsset> => fileServerApiService.renameAsset(id, name);

export const deleteDriveAsset = async (id: string): Promise<void> =>
  fileServerApiService.deleteAsset(id);

export const moveDriveAsset = async (
  id: string,
  parentId: string | null,
): Promise<TAsset> => fileServerApiService.moveAsset(id, parentId);
