export interface FileOrFolder {
  name: string;
  children?: {
    files: FileOrFolder[];
    folders: FileOrFolder[];
  };
  isFolder: boolean;
  path?: string;
}

export interface AudioFile {
  name: string;
  path: string;
  duration: number;
  size: number;
  playing: boolean;
  paused: boolean;
  base64?: string;
}
