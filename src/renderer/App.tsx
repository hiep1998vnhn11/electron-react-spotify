import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './container/authContainer';
import './App.css';
import { AppContextProvider } from './context/appContext';
import { PlaylistContextProvider } from './context/playlistContext';
import { FileContextProvider } from './context/fileContext';

import PlaylistUrlPage from './pages/playlist/_url';
import SettingPage from './pages/setting';
import LibraryPage from './pages/library';

import type { OpenDialogOptions, OpenDialogReturnValue } from 'electron';
import type { FileOrFolder } from 'types/global';

const Hello = () => {
  return <div>123123</div>;
};

export default function App() {
  return (
    <Router>
      <AppContextProvider>
        <PlaylistContextProvider>
          <FileContextProvider>
            <Routes>
              <Route element={<AuthContainer />}>
                <Route path="/" element={<Hello />} />
                <Route path="/playlist/:url" element={<PlaylistUrlPage />} />
                <Route path="/setting" element={<SettingPage />} />
                <Route path="/library" element={<LibraryPage />} />
              </Route>
            </Routes>
          </FileContextProvider>
        </PlaylistContextProvider>
      </AppContextProvider>
    </Router>
  );
}

declare global {
  interface Window {
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, val: any) => void;
        // any other methods you've defined...
      };
      dialog: {
        showOpenDialog: (
          option: OpenDialogOptions
        ) => Promise<OpenDialogReturnValue>;
      };
    };
    file: {
      getFilesAndFolders: (
        path: string,
        recursive?: boolean
      ) => {
        files: FileOrFolder[];
        folders: FileOrFolder[];
      };
      getSong: (path: string) => Promise<typeof Audio>;
    };
  }
}
