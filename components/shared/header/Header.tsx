'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserInfo } from '@/lib/useUserInfo';
import Logo from './components/Logo';
import Navigation from './components/Navigation';
import Notification from './components/Notification';
import UserPopover from '@/components/shared/header/components/UserPopover';
import AuthButtons from '@/components/shared/header/components/AuthButtons';
import MobileMenuButton from '@/components/shared/header/components/MobileMenuButton';
import MobileMenuOverlay from '@/components/shared/header/components/MobileMenuOverlay';
import MobileMenu from '@/components/shared/header/components/MobileMenu';

type Language = 'en' | 'ar' | 'de' | 'zh';
const Header: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useUserInfo();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);

  const [language, setLanguage] = useState<Language>('en');

  // ✅ Safe early return AFTER hooks
  if (pathname.includes('auth')) return null;

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsUserPopoverOpen(false); // Close the popover
    router.refresh();
    router.push('/');
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setIsUserPopoverOpen(false); // Close the popover
    router.push(href);
  };

  const changeLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const links = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/suppliers', label: 'Suppliers' },
  ];

  const navOptions =
    user?.user_type === 'buyer'
      ? [
          {
            href: '/user/profile',
            label: 'Profile',
            icon: '👤',
            id: 'profile',
          },
          {
            href: '/user/finance-requests/add',
            label: 'Request Finance',
            icon: '💰',
            id: 'finance',
          },
          {
            href: '/user/product-requests/add',
            label: 'Request Product',
            icon: '📦',
            id: 'product-request',
          },
        ]
      : [
          {
            href: '/user/profile',
            label: 'Profile',
            icon: '👤',
            id: 'profile',
          },
          {
            href: '/user/products',
            label: 'My Products',
            icon: '📦',
            id: 'products',
          },
          {
            href: '/user/promotions/add',
            label: 'Post Offers',
            icon: '📝',
            id: 'offers',
          },
        ];

  return (
    <header className="w-full bg-white shadow-sm border-b border-gray-100/50 z-30 sticky top-0">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Enhanced Logo */}
        <Logo />
        <Navigation links={links} />
        <div className="flex items-center gap-4">
          {user && <Notification />}
          {user && (
            <UserPopover
              isUserPopoverOpen={isUserPopoverOpen}
              setIsUserPopoverOpen={setIsUserPopoverOpen}
              handleNavigate={handleNavigate}
              handleLogout={handleLogout}
              navOptions={navOptions}
            />
          )}
          {!user && <AuthButtons />}
          <MobileMenuButton isOpen={isOpen} toggleMenu={toggleMenu} />
          {isOpen && <MobileMenuOverlay toggleMenu={toggleMenu} />}
          <MobileMenu
            isOpen={isOpen}
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
        </div>
      </div>
    </header>
  );
};

export default Header;
