import fs from 'fs';
import Store from 'electron-store';
import { ipcMain } from 'electron';
import type { FileOrFolder } from 'types/global';
import jsmediatags from 'jsmediatags';

const getSongTags = (path: string) =>
  new Promise((resolve) => {
    jsmediatags.read(path, {
      onSuccess: (tags) => {
        console.log(tags);
        resolve(tags);
      },
      onError: (error) => {
        console.log(error);
        resolve(null);
      },
    });
  });
export default async function createFileController(_: Store) {
  try {
    await getSongTags(
      'file:///Users/hieptran/Documents/music/Last%20One%20Standing%20-%20Skylar%20Grey_%20Polo%20G%20(1).m4a'
    );
  } catch (e) {
    console.log(e);
  }

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

  ipcMain.handle('get-all-songs', (_, path) => {
    if (!path) return [];
    return getAllSongs([], path);
  });
}

function getExt(path: string) {
  return path.split('.').pop() || '';
}

function getAllSongs(files: string[], path: string) {
  try {
    const exts = ['mp3', 'm4a', 'flac', 'wav'];
    const dirs = fs.readdirSync(path, 'utf8');
    dirs.forEach((dir) => {
      if (exts.includes(getExt(dir))) {
        const stat = fs.statSync(`${path}/${dir}`);
        if (stat.isDirectory()) {
          getAllSongs(files, `${path}/${dir}`);
        } else {
          files.push(`${path}/${dir}`);
        }
      }
    });
    return files;
  } catch (err) {
    return [];
  }
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
