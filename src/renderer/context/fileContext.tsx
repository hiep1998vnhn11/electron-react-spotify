import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useState,
  useRef,
  RefObject,
  useEffect,
} from 'react';
import type { AudioFile } from 'types/global';
import { filesFromWindow } from 'renderer/utils/file';

export interface FileContextI {
  files: AudioFile[];
  playing: AudioFile | null;
  offlinePath: string;
  changeOfflinePath: (path: string | ((a: string) => string)) => void;
  onChangePlaying: (index: number) => void;
  duration: number;
  durationWidth: string;
  maxDuration: number;
  handleChangeVolume: (volume: string) => void;
  volume: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  playingIndex: RefObject<number>;
  pause: boolean;
  handleChangeDuration: (e: any) => void;
  setFiles: (files: AudioFile[]) => void;
  shuffle: boolean;
  toggleShuffle: () => void;
  repeat: number;
  setRepeat: (repeat: number) => void;
  handleNextSong: () => void;
  togglePlaying: () => void;
}

const FileContext = createContext<FileContextI>({} as FileContextI);

export const useFileContext = () => useContext(FileContext);

export const FileContextProvider: React.FC = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const playingIndex = useRef<number>(-1);
  const [playing, setPlaying] = useState<AudioFile | null>(null);

  const [offlinePath, setOfflinePath] = useState(
    window.electron.store.get('offlinePath') || ''
  );
  const [files, setFiles] = useState<AudioFile[]>(filesFromWindow());
  const [duration, setDuration] = useState(0);
  const [maxDuration, setMaxDuration] = useState(0);
  const [pause, setPause] = useState(true);
  const [volume, setVolume] = useState<string>(
    window.electron.store.get('volume') || '50'
  );
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(0);
  useEffect(() => {
    if (!pause && playing && playingIndex.current > -1) {
      playSong(playingIndex.current, duration);
    }
    const setting = window.electron.store.get('setting');
    if (setting) {
      try {
        const parseSetting = JSON.parse(setting);
        setShuffle(parseSetting.shuffle);
        setRepeat(parseSetting.repeat);
      } catch (e) {
        console.log(e);
      }
    }

    return () => {
      window.electron.store.set('setting', JSON.stringify({ shuffle, repeat }));
    };
  }, []);

  const toggleShuffle = useCallback(() => {
    setShuffle((shuffle) => !shuffle);
  }, []);

  const durationWidth = useMemo(
    () =>
      maxDuration ? ((duration / maxDuration) * 100).toFixed(2) + '%' : '100%',
    [duration, maxDuration]
  );
  const intervalRef = useRef<any>(null);

  const changeOfflinePath = useCallback(
    (path: string | ((a: string) => string)) => {
      setOfflinePath(typeof path === 'function' ? path(offlinePath) : path);
      window.electron.store.set('offlinePath', path);
    },
    [offlinePath]
  );

  const playSong = useCallback(
    (index: number, duration: number = 0) => {
      audioRef.current!.src = 'file:///' + files[index].path;
      audioRef.current!.volume = +volume / 100;
      audioRef.current!.load();
      audioRef.current!.currentTime = duration;
      audioRef.current!.play();
      audioRef.current!.onended = () => {
        intervalRef.current && clearInterval(intervalRef.current);
        handleNextSong();
      };
    },
    [files, volume]
  );

  const onChangePlaying = useCallback(
    (index: number) => {
      const currentIndex = playingIndex.current;
      if (playingIndex.current > -1) {
        audioRef.current!.pause();
        setFiles((files) => [
          ...files.slice(0, currentIndex),
          { ...files[currentIndex], playing: false },
          ...files.slice(currentIndex + 1),
        ]);
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
      const file = files[index];
      if (!file) {
        playingIndex.current = -1;
        setPause(true);
      } else {
        playSong(index);
        setDuration(0);
        const maxSongDuration = Math.floor(file.duration);
        setMaxDuration(maxSongDuration);
        intervalRef.current = setInterval(() => {
          setDuration((value) =>
            value >= maxSongDuration ? maxSongDuration : value + 1
          );
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
    [playSong, files, volume, setPlaying]
  );

  const handleNextSong = useCallback(() => {
    if (shuffle) {
      const index = Math.floor(Math.random() * files.length);
      onChangePlaying(index);
    } else if (repeat === 1) {
      onChangePlaying(playingIndex.current);
    } else if (repeat === 0) {
      if (playingIndex.current < files.length - 1) {
        onChangePlaying(playingIndex.current + 1);
      }
    } else {
      if (playingIndex.current < files.length - 1) {
        onChangePlaying(playingIndex.current + 1);
      } else {
        onChangePlaying(0);
      }
    }
  }, [shuffle, repeat, files, onChangePlaying]);
  const handleChangeVolume = useCallback(
    (value: string) => {
      setVolume(value);
      window.electron.store.set('volume', value);
      if (playingIndex.current > -1 && audioRef.current) {
        audioRef.current.volume = +value / 100;
      }
    },
    [playing, files]
  );

  const handleChangeDuration = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (playingIndex.current > -1 && audioRef.current) {
        audioRef.current.currentTime = +value;
        setDuration(+value);
      }
    },
    [playing]
  );

  const togglePlaying = useCallback(() => {
    if (playingIndex.current > -1 && playing) {
      if (pause) {
        audioRef.current!.play();
        intervalRef.current = setInterval(() => {
          setDuration((value) =>
            value >= maxDuration ? maxDuration : value + 1
          );
        }, 1000);
      } else {
        intervalRef.current && clearInterval(intervalRef.current);
        audioRef.current!.pause();
      }
      setPause((value) => !value);
    }
  }, [pause, playing]);

  const fileContextValue = useMemo<FileContextI>(
    () => ({
      pause,
      audioRef,
      playingIndex,
      volume,
      files,
      playing,
      offlinePath,
      duration,
      durationWidth,
      maxDuration,
      shuffle,
      repeat,
      changeOfflinePath,
      onChangePlaying,
      handleChangeVolume,
      handleChangeDuration,
      setFiles,
      setRepeat,
      toggleShuffle,
      handleNextSong,
      togglePlaying,
    }),
    [
      offlinePath,
      playing,
      files,
      duration,
      durationWidth,
      maxDuration,
      volume,
      pause,
      repeat,
      shuffle,
      changeOfflinePath,
      onChangePlaying,
      handleChangeVolume,
      handleChangeDuration,
      setFiles,
      handleNextSong,
    ]
  );

  return (
    <FileContext.Provider value={fileContextValue}>
      {children}
      <audio ref={audioRef} />
    </FileContext.Provider>
  );
};
