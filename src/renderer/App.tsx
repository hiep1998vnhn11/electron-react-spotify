import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContainer from './container/authContainer';
import './App.css';
import { useDarkMode } from './hooks';
import { AppContextProvider } from './context/appContext';
import { PlaylistContextProvider } from './context/playlistContext';

const Hello = () => {
  return <div>123123</div>;
};

export default function App() {
  useDarkMode();
  return (
    <Router>
      <AppContextProvider>
        <PlaylistContextProvider>
          <Routes>
            <Route element={<AuthContainer />}>
              <Route path="/" element={<Hello />} />
            </Route>
          </Routes>
        </PlaylistContextProvider>
      </AppContextProvider>
    </Router>
  );
}
