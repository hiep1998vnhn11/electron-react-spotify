import React, { useCallback, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import BottomAppBar from './components/bottomAppBar';
import RightSidebar from './components/rightSidebar';
import LeftSidebar from './components/leftSidebar';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserDropdown from './components/userDropdown';

const AuthContainer: React.FC = () => {
  const leftSidebarRef = useRef<any>(null);
  const rightSidebarRef = useRef<any>(null);
  const navigate = useNavigate();
  const handleBack = useCallback(() => {
    navigate(-1);
  }, []);

  const handleForward = useCallback(() => {
    navigate(1);
  }, []);

  const resize = useCallback((isLeft = true, size: number) => {
    if (size < 150 || size > 400) return;
    const element = isLeft ? leftSidebarRef.current : rightSidebarRef.current;
    element.style.width = `${size}px`;
  }, []);

  useEffect(() => {
    leftSidebarRef.current = document.querySelector('#left-sidebar');
    rightSidebarRef.current = document.querySelector('#right-sidebar');
  }, []);

  const handleMouseMove = (e: any) => resize(true, e.x);
  const handleMouseRightMove = (e: any) =>
    resize(false, window.innerWidth - e.x);
  const removeMouseMoveEvent = () => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', removeMouseMoveEvent);
  };
  const removeMouseRightMoveEvent = () => {
    document.removeEventListener('mousemove', handleMouseRightMove);
    document.removeEventListener('mouseup', removeMouseRightMoveEvent);
  };

  const handleMouseLeftDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('mouseup', removeMouseMoveEvent, false);
  }, []);
  const handleMouseRightDown = useCallback(() => {
    document.addEventListener('mousemove', handleMouseRightMove, false);
    document.addEventListener('mouseup', removeMouseRightMoveEvent, false);
  }, []);
  return (
    <div className="auth">
      <div className="auth-content flex">
        <LeftSidebar />
        <div
          id="left-resizer"
          className="resizer"
          onMouseDown={handleMouseLeftDown}
        />
        <div className="flex-1">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer"
                onClick={handleBack}
              >
                <IoChevronBack size={20} />
              </div>
              <div
                className="flex items-center justify-center w-8 h-8 rounded-full cursor-pointer"
                onClick={handleForward}
              >
                <IoChevronForward size={20} />
              </div>
            </div>
            <UserDropdown />
          </div>
          <Outlet />
        </div>
        <div
          id="left-resizer"
          className="resizer"
          onMouseDown={handleMouseRightDown}
        />
        <RightSidebar />
      </div>
      <BottomAppBar />
    </div>
  );
};

export default AuthContainer;
