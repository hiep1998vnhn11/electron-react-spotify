import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useRef,
} from 'react';
import type { AudioFile } from 'types/global';
import {
  getFilesFromPath,
  filesFromWindow,
  saveFilesToWindow,
} from 'renderer/utils/file';

export interface FileContextI {
  files: AudioFile[];
  playing: number;
  offlinePath: string;
  changeOfflinePath: (path: string | ((a: string) => string)) => void;
  getFilesAndFolders: () => void;
  onChangePlaying: (index: number) => void;
  duration: number;
  durationWidth: string;
  maxDuration: number;
}

const FileContext = createContext<FileContextI>({} as FileContextI);

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider: React.FC = ({ children }) => {
  const [offlinePath, setOfflinePath] = useState(
    window.electron.store.get('offlinePath') || ''
  );
  const [files, setFiles] = useState<AudioFile[]>(filesFromWindow());
  const [playing, setPlaying] = useState(-1);
  const [duration, setDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const durationWidth = useMemo(
    () => ((duration / maxDuration) * 100).toFixed(2) + '%',
    [duration, maxDuration]
  );
  const intervalRef = useRef<any>(null);

  const getFilesAndFolders = useCallback(async () => {
    const filesAndFolders = await window.file.getFilesAndFolders(offlinePath);
    const filesFromPath = await getFilesFromPath(filesAndFolders);
    saveFilesToWindow(filesFromPath);
    setFiles(filesFromPath);
  }, [offlinePath]);

  const changeOfflinePath = useCallback(
    (path: string | ((a: string) => string)) => {
      setOfflinePath(typeof path === 'function' ? path(offlinePath) : path);
      window.electron.store.set('offlinePath', path);
    },
    [offlinePath]
  );

  const onChangePlaying = useCallback(
    (value: number) => {
      if (playing > -1) {
        files[playing].media?.pause();
        setFiles((files) => [
          ...files.slice(0, playing),
          { ...files[playing], playing: false, media: undefined },
          ...files.slice(playing + 1),
        ]);
      }
      const file = files[value];
      if (!file || value === playing) return setPlaying(0);
      if (intervalRef.current) clearInterval(intervalRef.current);

      const media = new Audio('file:///' + files[value].path);
      media.play();
      setDuration(0);
      setMaxDuration(Math.floor(file.duration));
      intervalRef.current = setInterval(() => {
        setDuration((value) => value + 1);
      }, 1000);
      setFiles((files) => [
        ...files.slice(0, value),
        {
          ...files[value],
          playing: true,
          media: media,
        },
        ...files.slice(value + 1),
      ]);
      setPlaying(value);
    },
    [playing, files, setFiles, setPlaying]
  );

  const fileContextValue = useMemo<FileContextI>(
    () => ({
      files,
      playing,
      offlinePath,
      duration,
      durationWidth,
      maxDuration,
      changeOfflinePath,
      getFilesAndFolders,
      onChangePlaying,
    }),
    [offlinePath, playing, files, duration, durationWidth, maxDuration]
  );

  return (
    <FileContext.Provider value={fileContextValue}>
      {children}
    </FileContext.Provider>
  );
};
