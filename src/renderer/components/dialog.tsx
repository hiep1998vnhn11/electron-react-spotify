import { useState, FC, useCallback } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
}
const Dialog: FC<Props> = ({ children, open, onClose }) => {
  const handleClick = useCallback((e: any) => {
    if (e.target.classList.contains('backdrop')) onClose();
  }, []);
  return open ? (
    <div
      className="w-full h-full top-0 left-0 fixed flex items-center justify-center backdrop opacity-3 bg-transparent"
      onClick={handleClick}
    >
      <div className="dialog min-w-64 transition bg-red-200 min-h-16 p-4 text-black text-bold">
        {children}
      </div>
    </div>
  ) : null;
};

export default Dialog;
