import { useFileContext } from 'renderer/context/fileContext';
import { useState, FC, useMemo } from 'react';
import { IoPlay, IoPause } from 'react-icons/io5';
import { secondToTime } from 'renderer/utils/format';

const LibraryPage: FC = () => {
  const { files, onChangePlaying, playing, pause } = useFileContext();

  const fileList = useMemo(
    () =>
      files.map((file, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer flex py-1 px-4 items-center song-row"
            onClick={() => onChangePlaying(index)}
          >
            <div className="w-14 h-14 rounded-lg overflow-hidden relative">
              <img
                className={file.playing ? 'active' : ''}
                src={file.base64}
                alt={file.name}
              />
              <div
                className={`absolute top-0 left-0 w-full h-full flex items-center justify-center song-row-status ${
                  file.playing ? 'active' : ''
                }`}
              >
                {file.playing ? <IoPause size={30} /> : <IoPlay size={30} />}
              </div>
            </div>
            <div className="pl-4 flex-1">
              <div>{file.title}</div>
              <div className="text-small text-xs">{file.artist}</div>
            </div>
            <div>{secondToTime(file.duration)}</div>
          </div>
        );
      }),
    [files, playing]
  );

  return (
    <div>
      <div className="text-3xl pl-4 text-bold">Thư viện âm nhạc của bạn</div>
      {fileList}
    </div>
  );
};

export default LibraryPage;
