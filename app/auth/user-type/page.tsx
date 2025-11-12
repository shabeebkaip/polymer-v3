'use client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/navigation';

const UserTypeSelection: React.FC = () => {
  const router = useRouter();
  const userTypes = [
    {
      name: 'Buyer',
      description: 'Ideal for factories and distributors seeking verified polymer suppliers.',
      icon: '/icons/buyer.svg',
      link: '/auth/register?role=buyer',
      bgHover: 'from-blue-50 to-cyan-50',
      borderHover: 'hover:border-blue-500',
      iconBg: 'from-blue-100 to-cyan-100',
      iconBgHover: 'group-hover:from-blue-200 group-hover:to-cyan-200',
      titleHover: 'group-hover:text-blue-700',
      arrowBgHover: 'group-hover:bg-blue-500',
    },
    {
      name: 'Seller',
      description: 'Perfect for polymer producers and traders to list products globally.',
      icon: '/icons/Seller.svg',
      link: '/auth/register?role=seller',
      bgHover: 'from-primary-50 to-primary-50',
      borderHover: 'hover:border-primary-500',
      iconBg: 'from-primary-50 to-primary-50',
      iconBgHover: 'group-hover:from-primary-500/20 group-hover:to-primary-500/20',
      titleHover: 'group-hover:text-primary-600',
      arrowBgHover: 'group-hover:bg-primary-500',
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
      {/* Logo Section */}
      <div className="text-center">
        <Link href="/" className="inline-block cursor-pointer hover:opacity-80 transition-opacity">
          <Image
            src="/logo.png"
            alt="Logo"
            width={200}
            height={200}
            className="h-20 w-auto mx-auto"
          />
        </Link>
      </div>

      {/* Header Section */}
      <div className="text-center space-y-2 max-w-lg">
        <h1 className="text-3xl font-bold text-primary-500">
          Join Our Marketplace
        </h1>
        <h2 className="text-xl font-semibold text-gray-800">Select your role to continue</h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          Choose your account type to get started with the Polymer Marketplace
        </p>
      </div>
      {/* User Type Selection */}
      <div className="w-full max-w-xl space-y-3">
        {userTypes.map((userType, index) => (
          <div
            className={`group relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer 
                     ${userType.borderHover} hover:shadow-lg transform hover:scale-[1.01] 
                     transition-all duration-200 ease-in-out`}
            key={index}
            onClick={() => router.push(userType.link)}
          >
            {/* Background gradient effect */}
            <div className={`absolute inset-0 bg-gradient-to-r ${userType.bgHover} opacity-0 group-hover:opacity-100 transition-opacity duration-200`}></div>

            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-18 h-18 bg-gradient-to-br ${userType.iconBg} rounded-xl flex items-center justify-center ${userType.iconBgHover} transition-all duration-200`}>
                <Image
                  src={userType.icon}
                  alt={userType.name}
                  width={36}
                  height={36}
                  className="w-9 h-9 object-contain"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className={`text-xl font-bold text-gray-900 mb-1 ${userType.titleHover} transition-colors duration-200`}>
                  {userType.name}
                </h3>
                <p
                  className="text-sm leading-relaxed transition-colors duration-200"
                  style={{ color: '#333333' }}
                >
                  {userType.description}
                </p>
              </div>

              {/* Arrow indicator */}
              <div className={`flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ${userType.arrowBgHover} transition-all duration-200`}>
                <svg
                  className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Already have account link */}
      <div className="text-center pt-2">
        <p className="text-gray-600 text-sm">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-primary-500 hover:text-primary-600 transition-colors hover:underline"
          >
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;
