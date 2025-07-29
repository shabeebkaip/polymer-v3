import React from 'react';
import { mobileMenuOverlayType } from '@/types/header';

const MobileMenuOverlay: React.FC<mobileMenuOverlayType> = ({ toggleMenu }) => {
  return <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={toggleMenu} />;
};

export default MobileMenuOverlay;
