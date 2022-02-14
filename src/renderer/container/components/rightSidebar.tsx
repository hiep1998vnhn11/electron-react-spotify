import React from 'react';
import { useSystemDarkMode } from 'renderer/hooks';

const RightSidebar: React.FC = () => {
  const { darkMode, isSystem, toggleDarkMode, setSystemDarkMode } =
    useSystemDarkMode();
  return (
    <div id="right-sidebar" className="right-sidebar">
      <button onClick={toggleDarkMode}>toggle</button>
      <button onClick={setSystemDarkMode}>system</button>
      Right
    </div>
  );
};

export default RightSidebar;
