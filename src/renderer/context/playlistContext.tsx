import { createContext, useContext, useMemo, useCallback } from 'react';

export interface PlaylistContextI {
  navigate: (path: string) => void;
}

const PlaylistContext = createContext<PlaylistContextI>({} as PlaylistContextI);

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistContextProvider: React.FC = ({ children }) => {
  const navigate = useCallback((e: string) => {
    console.log(e);
  }, []);

  const playlistContextValue = useMemo<PlaylistContextI>(
    () => ({
      navigate,
    }),
    []
  );
  return (
    <PlaylistContext.Provider value={playlistContextValue}>
      {children}
    </PlaylistContext.Provider>
  );
};
