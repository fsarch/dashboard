// Minimal typings for the non-standard (but widely supported: Chrome, Edge,
// Firefox, Safari) File and Directory Entries API, used to walk folders
// dropped via drag-and-drop. Not in lib.dom.d.ts.
type TFileSystemEntry = {
  isFile: boolean;
  isDirectory: boolean;
  name: string;
};

type TFileSystemFileEntry = TFileSystemEntry & {
  file: (success: (file: File) => void, error: (err: unknown) => void) => void;
};

type TFileSystemDirectoryEntry = TFileSystemEntry & {
  createReader: () => {
    // Only returns a batch of entries per call - must be called repeatedly
    // until it resolves an empty array.
    readEntries: (
      success: (entries: TFileSystemEntry[]) => void,
      error: (err: unknown) => void,
    ) => void;
  };
};

export type TDroppedFile = {
  file: File;
  // Names of the folders (from the drop root down) the file was nested in
  // when dropped, e.g. ['photos', '2024']. Empty for files dropped directly.
  folderPath: string[];
};

const readAllDirectoryEntries = (reader: ReturnType<TFileSystemDirectoryEntry['createReader']>) =>
  new Promise<TFileSystemEntry[]>((resolve, reject) => {
    reader.readEntries(resolve, reject);
  });

async function walkEntry(entry: TFileSystemEntry, folderPath: string[]): Promise<TDroppedFile[]> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) => {
      (entry as TFileSystemFileEntry).file(resolve, reject);
    });
    return [{ file, folderPath }];
  }

  if (entry.isDirectory) {
    const reader = (entry as TFileSystemDirectoryEntry).createReader();
    const childPath = [...folderPath, entry.name];
    const results: TDroppedFile[] = [];
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const batch = await readAllDirectoryEntries(reader);
      if (batch.length === 0) {
        break;
      }
      for (const child of batch) {
        results.push(...(await walkEntry(child, childPath)));
      }
    }
    return results;
  }

  return [];
}

// Resolves a drop's DataTransfer into a flat list of files with their
// (possibly empty) folder path. Falls back to a flat file list when the
// File and Directory Entries API isn't available - folders are then skipped
// silently rather than erroring.
export async function resolveDroppedFiles(dataTransfer: DataTransfer): Promise<TDroppedFile[]> {
  const items = dataTransfer.items;
  if (!items || items.length === 0 || typeof items[0]?.webkitGetAsEntry !== 'function') {
    return Array.from(dataTransfer.files).map((file) => ({ file, folderPath: [] }));
  }

  const entries = Array.from(items)
    .map((item) => item.webkitGetAsEntry() as TFileSystemEntry | null)
    .filter((entry): entry is TFileSystemEntry => entry !== null);

  const results = await Promise.all(entries.map((entry) => walkEntry(entry, [])));
  return results.flat();
}
