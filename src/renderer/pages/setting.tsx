import { FC, useCallback, useState, useRef } from 'react';
import { useAppContext } from 'renderer/context/appContext';
import { useFileContext } from 'renderer/context/fileContext';
import { IoLogoClosedCaptioning } from 'react-icons/io5';
import { getSongFromPath, saveFilesToWindow } from 'renderer/utils/file';
import type { AudioFile } from 'types/global';
import Dialog from 'renderer/components/dialog';
const SettingPage: FC = () => {
  const breakFlag = useRef(false);
  const [dialog, setDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalSong, setTotalSong] = useState(0);
  const [syncSong, setSyncSong] = useState(0);
  const { offlinePath, changeOfflinePath, setFiles } = useFileContext();
  const { toastSuccess } = useAppContext();
  const closeDialog = useCallback(() => {
    setDialog(false);
    breakFlag.current = true;
  }, []);

  const handleSave = useCallback(async () => {
    try {
      breakFlag.current = false;
      setLoading(true);
      setDialog(true);
      setSyncSong(0);
      setTotalSong(0);
      const songsPath = await window.file.getAllSongs(offlinePath);
      setTotalSong(songsPath.length);
      const songs: AudioFile[] = [];
      for (const path of songsPath) {
        if (breakFlag.current) return;
        const song = await getSongFromPath(path);
        setSyncSong((song) => song + 1);
        song && songs.push(song);
      }
      setFiles(songs);
      saveFilesToWindow(songs);
      toastSuccess('Lưu thành công!');
    } catch (e) {
      setTotalSong(0);
      setSyncSong(0);
    } finally {
      setLoading(false);
      setDialog(false);
      breakFlag.current = true;
    }
  }, []);

  const selectPath = useCallback(async () => {
    try {
      const { canceled, filePaths } =
        await window.electron.dialog.showOpenDialog({
          properties: ['openDirectory'],
        });
      if (canceled || !filePaths.length) return;
      changeOfflinePath(filePaths[0]);
    } catch (e) {
      console.log(e);
    }
  }, []);
  return (
    <div className="p-4">
      <h3 className="text-3xl text-bold">Cài đặt</h3>
      <div className="text-xl mt-6 text-bold">Tự động phát</div>
      <div className="">Tự động phát bài hát khác khi hết</div>
      <div className="text-xl mt-6 text-bold">
        Vị trí lưu trữ file ngoại tuyến:
      </div>
      <div className="flex justify-between">
        <div className="text-xl">{offlinePath}</div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={selectPath}
        >
          Đổi vị trí
        </button>
      </div>

      <button
        className="float-right mt-4 bg-red-200 hover:bg-red-300 transition px-4 py-2 text-bold rounded text-white"
        onClick={handleSave}
      >
        {loading ? <IoLogoClosedCaptioning /> : 'Lưu'}
      </button>

      <Dialog open={dialog} onClose={closeDialog}>
        <div className="text-xl text-bold">
          <div>Đang đồng bộ bài hát</div>
          <div className="">
            Tiến độ: {syncSong}/{totalSong}
          </div>
          <div className="mt-4 relative h-1 bg-blue-500">
            <div
              className="absolute w-full h-full top-0 left-0"
              style={{
                background:
                  'linear-gradient(90deg, #00d1b2 0%, #00d1b2 50%, #00d1b2 100%)',
                width: `${(syncSong / totalSong) * 100}%`,
              }}
            />
          </div>
          <div>
            <button
              className="float-right bg-red-200 hover:bg-red-300 transition px-4 py-2 text-bold rounded text-white"
              onClick={closeDialog}
            >
              Đóng
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default SettingPage;
