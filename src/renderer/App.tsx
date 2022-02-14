import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './container/authContainer';
import './App.css';
import { AppContextProvider } from './context/appContext';
import { PlaylistContextProvider } from './context/playlistContext';

import PlaylistUrlPage from './pages/playlist/_url';
import SettingPage from './pages/setting';

const Hello = () => {
  return <div>123123</div>;
};

export default function App() {
  return (
    <Router>
      <AppContextProvider>
        <PlaylistContextProvider>
          <Routes>
            <Route element={<AuthContainer />}>
              <Route path="/" element={<Hello />} />
              <Route path="/playlist/:url" element={<PlaylistUrlPage />} />
              <Route path="/setting" element={<SettingPage />} />
            </Route>
          </Routes>
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
    };
  }
}
