'use server';

import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { TFolder } from '@/services/file-server/file-server-api.type';

export const createDriveFolder = async (
  name: string,
  parentId: string | null,
): Promise<TFolder> => fileServerApiService.createFolder({ name, parentId });
