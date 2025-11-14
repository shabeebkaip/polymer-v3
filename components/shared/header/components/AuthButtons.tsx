import React from 'react';
import { useRouter } from 'next/navigation';

const AuthButtons = () => {
  const router = useRouter();
  return (
    <div className="hidden lg:flex items-center space-x-3">
      <button
        onClick={() => router.push('/auth/login')}
        className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        Login
      </button>
      <button
        onClick={() => router.push('/auth/user-type')}
        className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        Sign Up for Free
      </button>
    </div>
  );
};

export default AuthButtons;
