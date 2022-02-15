import React, { useCallback, useMemo } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  IoHome,
  IoSearch,
  IoLibrary,
  IoAdd,
  IoHeart,
  IoCompassSharp,
} from 'react-icons/io5';
import { usePlaylistContext } from 'renderer/context/playlistContext';

const LeftSidebar: React.FC = () => {
  const navigate = useNavigate();
  const { playlists, createPlaylist } = usePlaylistContext();
  const handleCreatePlaylist = useCallback(() => {
    const url = createPlaylist();
    navigate('/playlist/' + url);
  }, [createPlaylist]);

  return (
    <div className="left-sidebar p-3" id="left-sidebar">
      <div>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoHome size={22} />
          <span className="ml-2">Trang chủ</span>
        </NavLink>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoSearch size={22} />
          <span className="ml-2">Tìm kiếm</span>
        </NavLink>
        <NavLink to="/library" className="flex sidebar-link p-2 items-center">
          <IoLibrary size={22} />
          <span className="ml-2">Thư viện của bạn</span>
        </NavLink>
        <div className="h-8" />
        <div
          className="flex sidebar-link p-2 items-center cursor-pointer"
          onClick={handleCreatePlaylist}
        >
          <IoAdd size={22} />
          <span className="ml-2">Tạo danh sách mới</span>
        </div>
        <NavLink to="/" className="flex sidebar-link p-2 items-center">
          <IoHeart size={22} />
          <span className="ml-2">Bài hát đã thích</span>
        </NavLink>
      </div>
      <div className="divider my-4" />
      <div>
        {playlists.map((playlist) => (
          <div key={playlist.url}>
            <NavLink
              to={`/playlist/${playlist.url}`}
              className="flex sidebar-link p-2 items-center"
            >
              {playlist.name}
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSidebar;
