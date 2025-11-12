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
import MobileMenuOverlay from '@/components/shared/header/components/MobileMenuOverlay';
import MobileMenu from '@/components/shared/header/components/MobileMenu';
import SubHeader from '@/components/shared/header/components/SubHeader';

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
    router.refresh();
    router.push('/');
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

  // User-specific navigation options for mobile menu
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
      : user
      ? [
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
        ]
      : [];

  return (
    <>
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
        </div>
      </header>

      {/* Sub Header */}
      <SubHeader />
    </>
  );
};

export default Header;
