import React from 'react';
import { useRouter } from 'next/navigation';
import { useUserInfo } from '@/lib/useUserInfo';

const UserButton: React.FC = () => {
  const { user } = useUserInfo();
  const router = useRouter();

  const handleClick = () => {
    router.push('/user/profile');
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="md:flex hidden items-center gap-3 px-4 py-2.5 border border-primary-500/30 text-gray-700 rounded-xl hover:bg-primary-50 hover:border-primary-500/50 transition-all duration-200 shadow-sm hover:shadow-md"
    >
      <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium text-sm">
        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
      </div>
      <span className="font-medium">Hello {user?.firstName}</span>
    </button>
  );
};

export default UserButton;
