'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IndustriesDropdown from './IndustriesDropdown';
import ProductFamiliesDropdown from './ProductFamiliesDropdown';
import { useUserInfo } from '@/lib/useUserInfo';

const SubHeader: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUserInfo();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Quick links based on user type
  const quickLinks = [
    { href: '/products', label: 'All Products', show: true },
    { href: '/suppliers', label: 'Find Suppliers', show: isClient && !!user },
    { href: '/deals', label: 'Special Deals', show: isClient && user?.user_type === 'buyer' },
    { href: '/opportunities', label: 'Bulk Orders', show: isClient && user?.user_type === 'seller' },
  ];

  // User-specific navigation options
  const userNavLinks =
    user?.user_type === 'buyer'
      ? [
          { href: '/user/finance-requests/add', label: 'Request Finance' },
          { href: '/user/product-requests/add', label: 'Request Product' },
        ]
      : user
      ? [
          { href: '/user/products', label: 'My Products' },
          { href: '/user/promotions/add', label: 'Post Offers' },
        ]
      : [];

  // Don't show sub-header on auth pages
  if (pathname.includes('auth')) return null;

  return (
    <div className="w-full bg-white border-b border-gray-200 sticky top-[64px] z-20 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto px-4 lg:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Left Section - Category Dropdowns & Quick Links */}
          <div className="flex items-center gap-3">
            {/* Category Dropdowns */}
            <div className="flex items-center gap-1.5">
              <IndustriesDropdown />
              <ProductFamiliesDropdown />
            </div>
            
            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-gray-300"></div>
            
            {/* Quick Links */}
            <nav className="hidden md:flex items-center gap-1">
              {quickLinks.filter(link => link.show).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-800 hover:text-primary-600 hover:bg-gray-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - User Navigation Links */}
          {user && userNavLinks.length > 0 && (
            <nav className="hidden lg:flex items-center gap-1">
              {userNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                    pathname === link.href
                      ? 'text-primary-500 bg-primary-50'
                      : 'text-gray-800 hover:text-primary-600 hover:bg-primary-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
