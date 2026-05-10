'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserInfo } from '@/lib/useUserInfo';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import UserButton from '@/components/shared/header/components/UserButton';
import AuthButtons from '@/components/shared/header/components/AuthButtons';
import MobileMenuButton from '@/components/shared/header/components/MobileMenuButton';
import MobileMenu from '@/components/shared/header/components/MobileMenu';
import SubHeader from '@/components/shared/header/components/SubHeader';
import AccountVerificationBanner from '@/components/shared/header/components/AccountVerificationBanner';

type Language = 'en' | 'ar' | 'de' | 'zh';
const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useUserInfo();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const [language, setLanguage] = useState<Language>('en');
  // ✅ Safe early return AFTER hooks
  if (pathname.includes('auth')) return null;

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    router.push(href);
  };

  const changeLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  // Base navigation links
  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/suppliers', label: 'Suppliers' },
    {href: '/about-us', label: 'About Us' },
  ];


  return (
    <>
      {/* Account Verification Banner */}
      {user && user.verification === "pending" && (
        <AccountVerificationBanner />
      )}

      {/* Main Header */}
      <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm backdrop-blur-sm">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4 h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Center Navigation */}
            <div className="flex-1 flex justify-center">
              <Navigation links={links} />
            </div>
            
            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {user && <Notification />}
              {user && <UserButton />}
              {!user && <AuthButtons />}
              <MobileMenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </div>
      </header>

      {/* Sub Header */}
      <SubHeader />

      {/* MobileMenu MUST live outside <header> — backdrop-filter on the header
          creates a new containing block that breaks fixed positioning */}
      <MobileMenu
        isOpen={isOpen}
        toggleMenu={toggleMenu}
        links={links}
        handleNavigate={handleNavigate}
        toggleVisibility={toggleVisibility}
        language={language}
        changeLanguage={(selectedLanguage: string) =>
          changeLanguage(selectedLanguage as Language)
        }
        isVisible={isVisible}
        handleLogout={handleLogout}
      />
    </>
  );
};

export default Header;
