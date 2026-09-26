import { resolveDroppedFiles } from './dataTransfer.util';

const fakeFile = (name: string) => ({ name }) as unknown as File;

describe('resolveDroppedFiles', () => {
  it('falls back to a flat file list when the entries API is unavailable', async () => {
    const files = [fakeFile('a.txt'), fakeFile('b.txt')];
    const dataTransfer = {
      items: [{}, {}], // no webkitGetAsEntry on the items
      files,
    } as unknown as DataTransfer;

    const result = await resolveDroppedFiles(dataTransfer);

    expect(result).toEqual([
      { file: files[0], folderPath: [] },
      { file: files[1], folderPath: [] },
    ]);
  });

  it('resolves files dropped directly with an empty folder path', async () => {
    const file = fakeFile('root.txt');
    const dataTransfer = {
      items: [
        {
          webkitGetAsEntry: () => ({
            isFile: true,
            isDirectory: false,
            name: 'root.txt',
            file: (success: (f: File) => void) => success(file),
          }),
        },
      ],
      files: [file],
    } as unknown as DataTransfer;

    const result = await resolveDroppedFiles(dataTransfer);

    expect(result).toEqual([{ file, folderPath: [] }]);
  });

  it('recursively walks nested directories, batching readEntries calls', async () => {
    const nestedFile = fakeFile('photo.jpg');
    const rootFile = fakeFile('readme.txt');

    // "2024" directory containing one file, served across two readEntries
    // batches (as the real browser API does) to exercise the read-until-empty loop.
    let readCall = 0;
    const yearDirEntry = {
      isFile: false,
      isDirectory: true,
      name: '2024',
      createReader: () => ({
        readEntries: (success: (entries: unknown[]) => void) => {
          readCall += 1;
          if (readCall === 1) {
            success([
              {
                isFile: true,
                isDirectory: false,
                name: 'photo.jpg',
                file: (cb: (f: File) => void) => cb(nestedFile),
              },
            ]);
          } else {
            success([]);
          }
        },
      }),
    };

    const photosDirEntry = {
      isFile: false,
      isDirectory: true,
      name: 'photos',
      createReader: () => {
        let called = false;
        return {
          readEntries: (success: (entries: unknown[]) => void) => {
            if (!called) {
              called = true;
              success([yearDirEntry]);
            } else {
              success([]);
            }
          },
        };
      },
    };

    const rootFileEntry = {
      isFile: true,
      isDirectory: false,
      name: 'readme.txt',
      file: (cb: (f: File) => void) => cb(rootFile),
    };

    const dataTransfer = {
      items: [
        { webkitGetAsEntry: () => photosDirEntry },
        { webkitGetAsEntry: () => rootFileEntry },
      ],
      files: [],
    } as unknown as DataTransfer;

    const result = await resolveDroppedFiles(dataTransfer);

    expect(result).toEqual([
      { file: nestedFile, folderPath: ['photos', '2024'] },
      { file: rootFile, folderPath: [] },
    ]);
    expect(readCall).toBe(2);
  });
});
