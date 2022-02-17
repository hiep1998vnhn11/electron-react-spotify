import { useEffect } from 'react';
import { useToggle } from './useToggle';

export function useDarkMode() {
  const [darkMode, toggleDarkMode] = useToggle(false);

  useEffect(() => {
    const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (matched != darkMode) toggleDarkMode(matched);
    else {
      const body = document.documentElement;
      if (darkMode) {
        body.classList.add('dark');
      } else {
        body.classList.remove('dark');
      }
    }
  }, []);

  useEffect(() => {
    const body = document.documentElement;
    if (darkMode) {
      body.classList.add('dark');
    } else {
      body.classList.remove('dark');
    }
  }, [darkMode]);

  return {
    darkMode,
    toggleDarkMode,
  };
}
