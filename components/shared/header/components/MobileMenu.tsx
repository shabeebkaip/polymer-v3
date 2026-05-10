'use client';

import Image from 'next/image';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useUserInfo } from '@/lib/useUserInfo';
import { mobileMenuType } from '@/types/header';

const BROWSE_LINKS = [
  { href: '/products',         label: 'All Products'      },
  { href: '/industries',       label: 'Industries'        },
  { href: '/product-families', label: 'Product Families'  },
];

const NAV_ICONS: Record<string, React.ReactNode> = {
  '/': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  '/products': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  '/suppliers': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  '/about-us': (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

const MobileMenu: React.FC<mobileMenuType> = ({
  isOpen,
  toggleMenu,
  links,
  handleNavigate,
  handleLogout,
}) => {
  const pathname = usePathname();
  const { user } = useUserInfo();

  // handleNavigate already calls setIsOpen(false) inside Header —
  // do NOT also call toggleMenu() or the state double-toggles back to true.
  const navigate = (href: string) => {
    handleNavigate(href);
  };

  return (
    <>
      {/* ── Backdrop ──────────────────────────────────────── */}
      <div
        aria-hidden="true"
        onClick={toggleMenu}
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* ── Bottom-sheet panel ────────────────────────────── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white rounded-t-3xl flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ maxHeight: '88vh' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-gray-200 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Polymers Hub"
            width={130}
            height={34}
            className="h-8 w-auto object-contain"
          />
          <button
            onClick={toggleMenu}
            aria-label="Close menu"
            className="w-9 h-9 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* User greeting (if logged in) */}
          {user && (
            <div className="mx-4 mt-4 p-4 bg-primary-50 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {/* Main navigation */}
          <div className="px-4 pt-4 pb-2 space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <span className={isActive ? 'text-primary-500' : 'text-gray-400'}>
                    {NAV_ICONS[link.href] ?? null}
                  </span>
                  {link.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Browse section */}
          <div className="px-4 pt-2 pb-4">
            <p className="px-4 pb-2 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
              Browse
            </p>
            <div className="space-y-1">
              {BROWSE_LINKS.map((link) => (
                <button
                  key={link.href}
                  onClick={() => navigate(link.href)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {link.label}
                  <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer CTA */}
        <div className="px-4 pt-3 pb-6 border-t border-gray-100 space-y-2.5 flex-shrink-0">
          {user ? (
            <>
              <button
                onClick={() => navigate('/user/profile')}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                My Dashboard
              </button>
              <button
                onClick={() => { handleLogout(); }}
                className="w-full py-3 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-medium text-sm transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/auth/login')}
                className="w-full py-3 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium text-sm transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/auth/user-type')}
                className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold text-sm transition-colors"
              >
                Sign Up for Free
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MobileMenu;
