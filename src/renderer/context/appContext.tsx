import {
  createContext,
  useContext,
  useMemo,
  useCallback,
  useRef,
  useState,
} from 'react';

import { appSettings } from 'renderer/settings';

export interface AppContextI {
  navigate: (path: string) => void;
  toastError: (message: string) => void;
  toastSuccess: (message: string) => void;
}

const AppContext = createContext<AppContextI>({} as AppContextI);

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider: React.FC = ({ children }) => {
  const notificationTimerRef = useRef<number | null>(null);
  const isNotificationError = useRef(false);
  const [notification, setNotification] = useState<string | null>(
    'Đã đặt hàng thành công'
  );
  const navigate = useCallback((e: string) => {
    console.log(e);
  }, []);

  const toast = useCallback((message: string, isError: boolean) => {
    isNotificationError.current = isError;
    setNotification(message);
    if (notificationTimerRef.current) {
      clearTimeout(notificationTimerRef.current);
    }
    notificationTimerRef.current = window.setTimeout(() => {
      setNotification(null);
    }, appSettings.notificationTimer);
  }, []);

  const toastError = useCallback((message: string) => {
    toast(message, true);
  }, []);
  const toastSuccess = useCallback((message: string) => {
    toast(message, false);
  }, []);

  const appContextValue = useMemo<AppContextI>(
    () => ({
      navigate,
      toastSuccess,
      toastError,
    }),
    []
  );

  const notificationShow = useMemo(
    () =>
      notification ? (
        <div
          className={`fixed z-50
          bottom-24 left-1/2 -translate-x-1/2 flex 
          items-center px-4 py-2 rounded-lg transition-all 
          -translate-y-8
          ${isNotificationError.current ? 'bg-red-500' : 'bg-blue-300'}`}
        >
          {notification}
        </div>
      ) : null,
    [notification]
  );
  return (
    <AppContext.Provider value={appContextValue}>
      {children}
      {notificationShow}
    </AppContext.Provider>
  );
};
