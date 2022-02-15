import { useFileContext } from 'renderer/context/fileContext';
import { useState, FC, useMemo } from 'react';

const LibraryPage: FC = () => {
  const {
    files,
    onChangePlaying,
    playing,
    duration,
    durationWidth,
    maxDuration,
  } = useFileContext();

  const fileList = useMemo(
    () =>
      files.map((file, index) => {
        return (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => onChangePlaying(index)}
          >
            {file.name}, {file.playing ? 'Đang chơi' : ''}
          </div>
        );
      }),
    [files, playing]
  );

  return (
    <div>
      Library
      <div>duration: {duration}</div>
      <div>durationWidth: {durationWidth}</div>
      <div>maxDuration: {maxDuration}</div>
      <div className="relative h-4 bg-red-50">
        <div
          className="absolute h-full bg-red-500"
          style={{ width: durationWidth }}
        />
      </div>
      {fileList}
    </div>
  );
};

export default LibraryPage;
