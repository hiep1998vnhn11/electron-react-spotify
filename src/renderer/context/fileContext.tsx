import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useRef,
  Ref,
} from 'react';
import type { AudioFile } from 'types/global';
import {
  getFilesFromPath,
  filesFromWindow,
  saveFilesToWindow,
} from 'renderer/utils/file';

export interface FileContextI {
  files: AudioFile[];
  playing: AudioFile | null;
  offlinePath: string;
  changeOfflinePath: (path: string | ((a: string) => string)) => void;
  getFilesAndFolders: () => void;
  onChangePlaying: (index: number) => void;
  duration: number;
  durationWidth: string;
  maxDuration: number;
  handleChangeVolume: (volume: string) => void;
  volume: string;
  playingAudio: Ref<HTMLAudioElement | null>;
  pause: boolean;
}

const FileContext = createContext<FileContextI>({} as FileContextI);

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider: React.FC = ({ children }) => {
  const playingAudio = useRef<HTMLAudioElement | null>(null);
  const playingIndex = useRef(-1);
  const [playing, setPlaying] = useState<AudioFile | null>(null);

  const [offlinePath, setOfflinePath] = useState(
    window.electron.store.get('offlinePath') || ''
  );
  const [files, setFiles] = useState<AudioFile[]>(filesFromWindow());
  const [duration, setDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [pause, setPause] = useState(true);
  const [volume, setVolume] = useState(
    window.electron.store.get('volume') || '50'
  );

  const durationWidth = useMemo(
    () =>
      maxDuration ? ((duration / maxDuration) * 100).toFixed(2) : '100' + '%',
    [duration, maxDuration]
  );
  const intervalRef = useRef<any>(null);

  const getFilesAndFolders = useCallback(async () => {
    try {
      const filesAndFolders = await window.file.getFilesAndFolders(offlinePath);
      const filesFromPath = await getFilesFromPath(filesAndFolders);
      saveFilesToWindow(filesFromPath);
      setFiles(filesFromPath);
    } catch (e) {
      console.log(e);
    }
  }, [offlinePath]);

  const changeOfflinePath = useCallback(
    (path: string | ((a: string) => string)) => {
      setOfflinePath(typeof path === 'function' ? path(offlinePath) : path);
      window.electron.store.set('offlinePath', path);
    },
    [offlinePath]
  );

  const onChangePlaying = useCallback(
    (index: number) => {
      if (playingIndex.current > -1 && playingAudio.current) {
        const currentIndex = playingIndex.current;
        playingAudio.current.pause();
        setFiles((files) => [
          ...files.slice(0, currentIndex),
          { ...files[currentIndex], playing: false },
          ...files.slice(currentIndex + 1),
        ]);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      const file = files[index];
      if (!file || index === playingIndex.current) {
        playingIndex.current = -1;
        setPause(true);
      } else {
        playingAudio.current = new Audio('file:///' + files[index].path);
        playingAudio.current.volume = +volume / 100;
        playingAudio.current.play();
        setDuration(0);
        setMaxDuration(Math.floor(file.duration));
        intervalRef.current = setInterval(() => {
          setDuration((value) => value + 1);
        }, 1000);
        setFiles((files) => [
          ...files.slice(0, index),
          {
            ...files[index],
            playing: true,
          },
          ...files.slice(index + 1),
        ]);
        playingIndex.current = index;
        setPlaying(files[index]);
        setPause(false);
      }
    },
    [playing, files, setFiles, setPlaying, volume, playingAudio]
  );

  const handleChangeVolume = useCallback(
    (value: string) => {
      setVolume(value);
      window.electron.store.set('volume', value);
      if (playingIndex.current > -1 && playingAudio.current) {
        playingAudio.current.volume = +value / 100;
      }
    },
    [playing, files]
  );

  const fileContextValue = useMemo<FileContextI>(
    () => ({
      pause,
      playingAudio,
      volume,
      files,
      playing,
      offlinePath,
      duration,
      durationWidth,
      maxDuration,
      changeOfflinePath,
      getFilesAndFolders,
      onChangePlaying,
      handleChangeVolume,
    }),
    [
      offlinePath,
      playing,
      files,
      duration,
      durationWidth,
      maxDuration,
      volume.pause,
      changeOfflinePath,
      getFilesAndFolders,
      onChangePlaying,
      handleChangeVolume,
    ]
  );

  return (
    <FileContext.Provider value={fileContextValue}>
      {children}
    </FileContext.Provider>
  );
};
