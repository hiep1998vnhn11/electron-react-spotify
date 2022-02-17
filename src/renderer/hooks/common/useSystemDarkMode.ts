import { useState, useEffect, useCallback } from 'react';

export function useSystemDarkMode() {
  const [darkMode, setDarkMode] = useState(false);
  const [isSystem, setIsSystem] = useState(false);
  useEffect(() => {
    const matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (matched != darkMode) setDarkMode(matched);
  }, []);
  const setSystemDarkMode = useCallback(async () => {
    await (window as any).darkMode.system();
    setIsSystem(true);
  }, []);

  const toggleDarkMode = useCallback(
    async (value?: any) => {
      if (typeof value != 'boolean') {
        await (window as any).darkMode.toggle();
        setDarkMode((value) => !value);
      } else {
        if (value === darkMode) return;
        await (window as any).darkMode.toggle();
        setDarkMode((value) => !value);
      }
    },
    [darkMode]
  );

  return {
    darkMode,
    isSystem,
    setSystemDarkMode,
    toggleDarkMode,
  };
}
