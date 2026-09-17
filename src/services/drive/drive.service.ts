import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import { TFolderChildren, TFolderPathEntry } from '@/services/file-server/file-server-api.type';

// Drive-specific composition over the shared file-server-api layer: a folder
// view needs both the breadcrumb (only available per-folder via GET
// /folders/:id) and the folder's children - the root has no folder id at all,
// so it only ever has children, never a breadcrumb.
const getFolderView = async (
  folderId: string | null,
): Promise<{ path: TFolderPathEntry[] } & TFolderChildren> => {
  if (!folderId) {
    const [folders, assets] = await Promise.all([
      fileServerApiService.listFolders(null),
      fileServerApiService.listAssets(null),
    ]);
    return { path: [], folders, assets };
  }

  const [folder, children] = await Promise.all([
    fileServerApiService.getFolder(folderId),
    fileServerApiService.getFolderChildren(folderId),
  ]);

  return { path: [...folder.path, { id: folder.id, name: folder.name }], ...children };
};

export const driveService = {
  ...fileServerApiService,
  getFolderView,
};
