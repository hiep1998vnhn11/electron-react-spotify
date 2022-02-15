import { FC, useCallback, useState } from 'react';
import { useAppContext } from 'renderer/context/appContext';
import { useFileContext } from 'renderer/context/fileContext';
import { IoLogoClosedCaptioning } from 'react-icons/io5';

const SettingPage: FC = () => {
  const [loading, setLoading] = useState(false);
  const { offlinePath, changeOfflinePath, getFilesAndFolders } =
    useFileContext();
  const { toastSuccess } = useAppContext();

  const handleSave = useCallback(async () => {
    try {
      setLoading(true);
      getFilesAndFolders();
      toastSuccess('Lưu thành công!');
    } finally {
      setLoading(false);
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
    </div>
  );
};

export default SettingPage;
