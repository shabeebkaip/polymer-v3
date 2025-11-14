import React from 'react';
import { mobileMenuButtonType } from '@/types/header';

const MobileMenuButton: React.FC<mobileMenuButtonType> = ({ toggleMenu, isOpen }) => {
  return (
    <div className="flex items-center lg:hidden">
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2.5 text-primary-500 rounded-xl hover:bg-primary-50 transition-all duration-200 relative z-[60]"
      >
        <svg
          className="w-6 h-6 transition-transform duration-200"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
          />
        </svg>
      </button>
    </div>
  );
};
export default MobileMenuButton;
