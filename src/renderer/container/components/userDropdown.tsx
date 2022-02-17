import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { IoCaretDownSharp, IoCaretUpSharp } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
const UserDropdown: React.FC = () => {
  const elRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const options = useMemo(
    () => [
      {
        label: 'Tài khoản',
        url: '/account',
      },
      {
        label: 'Trang cá nhân',
        url: '/profile',
      },
      {
        label: 'Cài đặt',
        url: '/setting',
      },
    ],
    []
  );

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);
  const handleClickOutside = (e: any) => {
    if (elRef.current && !elRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div ref={elRef} className="relative">
      <div
        className="flex items-center pl-1 pr-2 h-10 user-dropdown rounded-3xl border border-black cursor-pointer select-none"
        onClick={toggleOpen}
      >
        <div className="h-8 w-8 rounded-full overflow-hidden">
          <img src="https://cdn.chanhtuoi.com/uploads/2020/05/icon-facebook-08-2.jpg" />
        </div>
        <div className="hidden lg:flex items-center">
          <span className="mx-2">Hiệp Trần</span>
          {isOpen ? (
            <IoCaretUpSharp size={12} />
          ) : (
            <IoCaretDownSharp size={12} />
          )}
        </div>
      </div>
      {isOpen ? (
        <div className="absolute flex flex-col rounded-xl border border-black text-blue-400 p-1 w-64 left-1/2 -translate-x-1/2 top-12 drop-shadow-2xl">
          {options.map((option) => (
            <NavLink
              className="opacity-80 hover:opacity-100 p-2"
              to={option.url}
              onClick={toggleOpen}
              key={option.url}
            >
              {option.label}
            </NavLink>
          ))}
          <div className="divider" />
          <a className="opacity-80 hover:opacity-100 p-2">Đăng xuất</a>
        </div>
      ) : null}
    </div>
  );
};

export default UserDropdown;
