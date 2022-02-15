import type { FileOrFolder, AudioFile } from 'types/global';
import readAudioTags from './mediatags';
export const getFilesFromPath = async ({
  files,
  folders,
  filter,
}: {
  files: FileOrFolder[];
  folders: FileOrFolder[];
  filter?: (file: FileOrFolder) => boolean;
}) => {
  let result: AudioFile[] = await toAudioFile(
    filter ? files.filter(filter) : [...files]
  );

  if (!filter) {
    for (const folder of folders) {
      result = [...result, ...(await filesFromFolders(folder))];
    }
  } else {
    for (const folder of folders) {
      result = [
        ...result,
        ...(await filesFromFoldersWithFilter(folder, filter)),
      ];
    }
  }
  return result;
};

const filesFromFolders = async (folders: FileOrFolder) => {
  let files: AudioFile[] = [];
  if (folders.isFolder && folders.children) {
    files = [...files, ...(await toAudioFile(folders.children.files))];
    for (const folder of folders.children.folders) {
      files = [...files, ...(await filesFromFolders(folder))];
    }
  }
  return files;
};

async function getFileFromUrl(
  url: string,
  name: string,
  defaultType = 'image/jpeg'
) {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}
const getSongFromUrl = async (url: string, item: FileOrFolder) => {
  const fileUrl = await getFileFromUrl(url, item.name);
  const result = await new Promise<AudioFile | null>((resolve) => {
    const audio = new Audio(url);
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        name: item.name,
        path: item.path || '',
        duration: Math.floor(audio.duration),
        size: fileUrl.size / 1024 / 1024,
        playing: false,
        paused: false,
      });
    });
    audio.onerror = () => resolve(null);
  });
  if (result) {
    const tags = await readAudioTags(fileUrl);
    const image = tags?.picture;
    if (image) {
      let base64String = '';
      for (var i = 0; i < image.data.length; i++) {
        base64String += String.fromCharCode(image.data[i]);
      }
      const base64 =
        'data:' + image.format + ';base64,' + window.btoa(base64String);
      result.base64 = base64;
    }
  }
  return result;
};

const toAudioFile = async (files: FileOrFolder[]): Promise<AudioFile[]> => {
  const audioFiles: AudioFile[] = [];
  for (const item of files) {
    const url = 'file:///' + item.path;
    const file = await getSongFromUrl(url, item);
    if (file) audioFiles.push(file);
  }
  return audioFiles;
};
const filesFromFoldersWithFilter = async (
  folders: FileOrFolder,
  filter: (e: FileOrFolder) => boolean = (_) => true
) => {
  let files: AudioFile[] = [];
  if (folders.isFolder && folders.children) {
    files = [
      ...files,
      ...(await toAudioFile(folders.children.files.filter(filter))),
    ];
    for (const folder of folders.children.folders) {
      files = [...files, ...(await filesFromFoldersWithFilter(folder, filter))];
    }
  }
  return files;
};

export const filesFromWindow = () => {
  const json = window.electron.store.get('files');
  if (!json) return [];
  return JSON.parse(json) as AudioFile[];
};
export const saveFilesToWindow = (files: AudioFile[]) => {
  window.electron.store.set('files', JSON.stringify(files));
};
