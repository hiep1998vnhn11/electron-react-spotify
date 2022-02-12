import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { IoHome, IoSearch, IoLibrary, IoAdd, IoHeart } from 'react-icons/io5';

const LeftSidebar: React.FC = () => {
  return (
    <div className="left-sidebar p-3">
      <div>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoHome size={22} />
          <span className="ml-2">Trang chủ</span>
        </NavLink>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoSearch size={22} />
          <span className="ml-2">Tìm kiếm</span>
        </NavLink>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoLibrary size={22} />
          <span className="ml-2">Thư viện của bạn</span>
        </NavLink>
        <div className="h-8" />
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoAdd size={22} />
          <span className="ml-2">Tạo danh sách mới</span>
        </NavLink>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoHeart size={22} />
          <span className="ml-2">Bài hát đã thích</span>
        </NavLink>
      </div>
      <div className="divider my-4" />
      <div>123123</div>
    </div>
  );
};

export default LeftSidebar;
