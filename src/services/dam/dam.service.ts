import { fileServerApiService } from '@/services/file-server/file-server-api.service';
import type {
  TFolderChildren,
  TFolderPathEntry,
} from '@/services/file-server/file-server-api.type';

// DAM-specific composition over the shared file-server-api layer - the
// Mediathek gallery browses the same folder hierarchy as Drive, just
// rendered as a thumbnail grid instead of a table (see drive.service.ts's
// getFolderView, which this mirrors).
const getGalleryView = async (
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

  return {
    path: [...folder.path, { id: folder.id, name: folder.name }],
    ...children,
  };
};

export const damService = {
  ...fileServerApiService,
  getGalleryView,
};
