import fs from 'fs';
import Store from 'electron-store';
import { ipcMain } from 'electron';
import type { FileOrFolder } from 'types/global';

export default function createFileController(_: Store) {
  ipcMain.handle('get-files-and-folders', (_, path, recursive = true) => {
    if (!path)
      return {
        files: [],
        folders: [],
      };
    return (
      getFileNames(path, recursive) || {
        files: [],
        folders: [],
      }
    );
  });

  ipcMain.handle('get-song', (_, path) => {
    if (!path) return null;
    try {
      return new Audio(path);
    } catch (e) {
      console.log(e);
      return null;
    }
  });
}

function getFileNames(path: string, recursive = true) {
  try {
    const dirs = fs.readdirSync(path, 'utf8');
    const files: FileOrFolder[] = [];
    const folders: FileOrFolder[] = [];
    dirs.forEach((dir) => {
      const stat = fs.statSync(`${path}/${dir}`);
      if (stat.isDirectory()) {
        folders.push({
          name: dir,
          isFolder: true,
          children: recursive ? getFileNames(`${path}/${dir}`) : undefined,
        });
      } else {
        files.push({
          name: dir,
          isFolder: false,
          path: `${path}/${dir}`,
        });
      }
    });
    return { files, folders };
  } catch (e) {
    return undefined;
  }
}
