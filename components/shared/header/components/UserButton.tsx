import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUserInfo } from '@/lib/useUserInfo';
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface UserButtonProps {
  onLogout: () => void;
}

const capitalize = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');

const UserButton: React.FC<UserButtonProps> = ({ onLogout }) => {
  const { user } = useUserInfo();
  const [isOpen, setIsOpen] = useState(false);
  const dashboardRef = useRef<HTMLAnchorElement>(null);

  const capitalizedFirstName = capitalize(user?.firstName);
  const fullName = [capitalizedFirstName, capitalize(user?.lastName)].filter(Boolean).join(' ') || 'User';
  const roleLabel = user?.user_type === 'superAdmin' ? 'Admin' : user?.user_type;

  const profileImage = (user?.company_logo || user?.avatar) as string | undefined;

  const avatar = (size: string, alt: string) =>
    profileImage ? (
      <div className={`${size} rounded-lg overflow-hidden flex-shrink-0`}>
        <Image
          src={profileImage}
          alt={alt}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      </div>
    ) : (
      <div className={`${size} bg-primary-500 rounded-lg flex items-center justify-center text-white font-medium text-sm flex-shrink-0`}>
        {user?.firstName?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${fullName} account menu`}
          className="md:flex hidden items-center gap-3 px-4 py-2.5 border border-primary-500/30 text-gray-700 rounded-xl hover:bg-primary-50 hover:border-primary-500/50 data-[state=open]:bg-primary-50 data-[state=open]:border-primary-500/50 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          {avatar('w-8 h-8', '')}
          <span className="text-sm font-medium text-gray-800">{capitalizedFirstName}</span>
          <ChevronDown
            aria-hidden="true"
            className="w-4 h-4 text-gray-500 group-hover:text-primary-500 transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary-500 motion-reduce:transition-none"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        aria-label="Account menu"
        // Radix skips links when auto-focusing, which would land on Logout — focus Dashboard instead
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          dashboardRef.current?.focus();
        }}
        className="w-72 p-0 rounded-2xl overflow-hidden shadow-xl border-gray-100"
      >
        <div className="flex items-center gap-3 p-4 bg-primary-50 border-b border-primary-100">
          {avatar('w-10 h-10', '')}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{fullName}</p>
            {user?.email && <p className="text-xs text-gray-500 truncate">{user.email}</p>}
            {roleLabel && (
              <span className="mt-1 inline-block px-2 py-0.5 rounded-md bg-white text-[11px] font-medium text-primary-600 capitalize">
                {roleLabel}
              </span>
            )}
          </div>
        </div>
        <div className="p-2">
          <Link
            ref={dashboardRef}
            href="/user/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex min-h-[44px] items-center gap-3 px-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-primary-50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-500 transition-colors motion-reduce:transition-none"
          >
            <LayoutDashboard aria-hidden="true" className="w-4 h-4" />
            Dashboard
          </Link>
          <div className="my-1 h-px bg-gray-100" />
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full min-h-[44px] items-center gap-3 px-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-500 transition-colors motion-reduce:transition-none"
          >
            <LogOut aria-hidden="true" className="w-4 h-4" />
            Logout
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserButton;
