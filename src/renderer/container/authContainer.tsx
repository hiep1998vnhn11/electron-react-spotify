import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomAppBar from './components/bottomAppBar';
import RightSidebar from './components/rightSidebar';
import LeftSidebar from './components/leftSidebar';

const AuthContainer: React.FC = () => {
  return (
    <div className="auth">
      <div className="auth-content flex">
        <LeftSidebar />
        <div className="flex-1">
          <Outlet />
        </div>
        <RightSidebar />
      </div>
      <BottomAppBar />
    </div>
  );
};

export default AuthContainer;
