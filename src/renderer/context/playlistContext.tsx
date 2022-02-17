import { createContext, useContext, useMemo, useCallback } from 'react';
import { useArray } from 'renderer/hooks';
export interface PlaylistContextI {
  navigate: (path: string) => void;
  createPlaylist: () => string;
  playlists: Playlist[];
}

export interface Playlist {
  name: string;
  url: string;
}

const PlaylistContext = createContext<PlaylistContextI>({} as PlaylistContextI);

export const usePlaylistContext = () => useContext(PlaylistContext);

export const PlaylistContextProvider: React.FC = ({ children }) => {
  const { array: playlists, add } = useArray<Playlist>(() => {
    const playlists = localStorage.getItem('playlists');
    if (!playlists) return [];
    return JSON.parse(playlists);
  });

  const save = useCallback(() => {
    localStorage.setItem('playlists', JSON.stringify(playlists));
  }, [playlists]);

  const createPlaylist = useCallback(() => {
    const newPlaylist: Playlist = {
      name: 'Danh sách nhạc số ' + (playlists.length + 1),
      url: 'playlist-' + (playlists.length + 1),
    };
    add(newPlaylist);
    save();
    return newPlaylist.url;
  }, [playlists]);
  const navigate = useCallback((e: string) => {
    console.log(e);
  }, []);

  const playlistContextValue = useMemo<PlaylistContextI>(
    () => ({
      playlists,
      navigate,
      createPlaylist,
    }),
    [playlists]
  );
  return (
    <PlaylistContext.Provider value={playlistContextValue}>
      {children}
    </PlaylistContext.Provider>
  );
};
