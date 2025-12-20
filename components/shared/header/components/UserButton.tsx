import React from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useUserInfo } from '@/lib/useUserInfo';
import { ChevronDown } from 'lucide-react';

const UserButton: React.FC = () => {
  const { user } = useUserInfo();
  const router = useRouter();
  console.log('user', user);
  const handleClick = () => {
    router.push('/user/dashboard');
  };

  const capitalizedFirstName = user?.firstName 
    ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
    : '';

  const profileImage = (user?.company_logo || user?.avatar) as string | undefined;

  return (
    <button
      type="button"
      onClick={handleClick}
      className="md:flex hidden items-center gap-3 px-4 py-2.5 border border-primary-500/30 text-gray-700 rounded-xl hover:bg-primary-50 hover:border-primary-500/50 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
    >
      {profileImage ? (
        <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={profileImage}
            alt={capitalizedFirstName}
            width={32}
            height={32}
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium text-sm">
          {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
        </div>
      )}
      <span className="text-sm font-medium text-gray-800">{capitalizedFirstName}</span>
      <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-colors" />
    </button>
  );
};

export default UserButton;
