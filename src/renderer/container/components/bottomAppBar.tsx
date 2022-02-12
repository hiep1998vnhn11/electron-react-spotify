import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  IoPlaySkipForward,
  IoPlaySkipBack,
  IoRepeat,
  IoPlay,
  IoVolumeMedium,
  IoVolumeLow,
  IoVolumeMute,
  IoVolumeHigh,
  IoMusicalNotes,
  IoPause,
  IoShuffle,
  IoHeart,
  IoHeartOutline,
} from 'react-icons/io5';
import { useToggle } from 'renderer/hooks';
import thumb from 'renderer/../../assets/mtmb_thumb.jpg';
import { useAppContext } from 'renderer/context/appContext';

const BottomAppBar: React.FC = () => {
  const { toastSuccess } = useAppContext();
  const [playing, togglePlaying] = useToggle(false);
  const [shuffle, toggleShuffle] = useToggle(false);
  const [repeat, toggleRepeat] = useToggle(false);
  const previousVolume = useRef('50');
  const [volume, setVolume] = useState('50');

  const handleChangeVolume = useCallback(
    (e: any) => {
      if (e.target.value) previousVolume.current = e.target.value;
      else previousVolume.current = '50';
      setVolume(e.target.value);
    },
    [volume]
  );

  const renderVolumeIcon = useMemo(() => {
    if (volume === '0') return <IoVolumeMute size={20} />;
    if (volume === '100') return <IoVolumeHigh size={20} />;
    if (volume < '50') return <IoVolumeLow size={20} />;
    return <IoVolumeMedium size={20} />;
  }, [volume]);

  const handleClickVolume = useCallback(() => {
    if (volume > '0') {
      setVolume('0');
    } else {
      setVolume(previousVolume.current);
    }
  }, [volume]);
  return (
    <div className="bottom-app-bar border-l-emerald-100 flex justify-between">
      <div className="flex w-52 items-center">
        <div className="w-16 h-16 rounded-full overflow-hidden relative rotating">
          <img src={thumb} className="w-16 h-16" />
          <div
            className="absolute w-4 h-4 top-1/2 left-1/2 rounded-2xl -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'var(--active-color)' }}
          />
          <div
            className="absolute w-2 h-2 top-1/2 left-1/2 rounded-2xl -translate-x-1/2 -translate-y-1/2"
            style={{ background: 'red' }}
          />
        </div>
        <IoHeartOutline
          size={20}
          className="ml-4"
          onClick={() => toastSuccess('tesssst')}
        />
      </div>
      <div className="flex-1">
        <div className="flex h-16 items-center justify-center">
          <div className="mx-2 cursor-pointer">
            <IoShuffle
              size={20}
              onClick={toggleShuffle}
              color={shuffle ? 'var(--active-color)' : undefined}
            />
            {shuffle ? <div className="dot-active" /> : null}
          </div>
          <IoPlaySkipBack className="mx-2 cursor-pointer" size={20} />
          <span
            className="rounded-full w-9 h-9 text-center m-auto cursor-pointer bg-white flex items-center justify-center mx-1 hover:scale-110 transition-all"
            onClick={togglePlaying}
          >
            {playing ? (
              <IoPause size={16} color="var(--app-container)" />
            ) : (
              <IoPlay size={16} color="var(--app-container)" />
            )}
          </span>

          <IoPlaySkipForward size={20} className="mx-2 cursor-pointer" />
          <div className="mx-2 cursor-pointer">
            <IoRepeat
              size={20}
              onClick={toggleRepeat}
              color={repeat ? 'var(--active-color)' : undefined}
            />
            {repeat ? <div className="dot-active" /> : null}
          </div>
        </div>
        <div className="flex"></div>
      </div>
      <div className="flex w-52 justify-end">
        <div className="flex items-center mr-2">
          <div className="mx-2 cursor-pointer" onClick={handleClickVolume}>
            {renderVolumeIcon}
          </div>
          <input
            className="volume-slider"
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={handleChangeVolume}
          />
        </div>
      </div>
    </div>
  );
};

export default BottomAppBar;
