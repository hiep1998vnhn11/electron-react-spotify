import { useState, FC, useCallback, useEffect } from 'react';
import { useAppContext } from 'renderer/context/appContext';

const SettingPage: FC = () => {
  const { offlinePath, setOfflinePath } = useAppContext();

  useEffect(() => {
    console.log(window.electron);
  }, []);
  console.log(offlinePath);

  const selectPath = useCallback(async () => {
    try {
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
    </div>
  );
};

export default SettingPage;
