"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Home, User, ChevronDown, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useUserInfo } from "@/lib/useUserInfo";
import Cookies from "js-cookie";

const UserPanelHeader = () => {
  const router = useRouter();
  const { user } = useUserInfo();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleVisitMarketplace = () => {
    router.push("/");
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    window.location.href = "/";
  };

  const handleProfile = () => {
    router.push("/user/profile");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-3 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex min-w-0 items-center">
            <div className="truncate text-base font-bold text-primary-500 sm:text-2xl">
              PolymersHub
            </div>
          </div>

          {/* Navigation */}
          <div className="flex shrink-0 items-center gap-1 sm:gap-4">
            {/* Visit Marketplace Button */}
            <Button
              onClick={handleVisitMarketplace}
              variant="outline"
              aria-label="Visit Marketplace"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center gap-2 border border-primary-500/30 px-2 py-2 text-primary-500 transition-colors duration-200 hover:border-primary-500 hover:bg-primary-50 focus-visible:ring-2 focus-visible:ring-teal-700 motion-reduce:transition-none sm:px-4"
            >
              <Home aria-hidden="true" className="w-4 h-4" />
              <span className="hidden font-medium sm:inline">Visit Marketplace</span>
              <ExternalLink aria-hidden="true" className="hidden w-4 h-4 sm:block" />
            </Button>

            {/* User Info & Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex min-h-[44px] min-w-[44px] items-center gap-2 px-2 py-2 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-teal-700 sm:px-3"
                aria-label={`${user?.firstName || user?.lastName || "User"} account menu`}
                aria-expanded={isUserMenuOpen}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <User aria-hidden="true" className="w-4 h-4 text-white" />
                </div>
                <div className="hidden min-w-0 flex-col items-start sm:flex">
                  <span className="text-sm font-medium text-gray-900">
                    {user?.firstName && user?.lastName 
                      ? `${user.firstName} ${user.lastName}` 
                      : user?.firstName || user?.lastName || 'User'
                    }
                  </span>
                  <span className="text-xs text-gray-500 capitalize">
                    {user?.user_type || 'Member'}
                  </span>
                </div>
                <ChevronDown aria-hidden="true" className="hidden w-4 h-4 text-gray-400 sm:block" />
              </Button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute end-0 z-50 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex min-h-[44px] items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700 motion-reduce:transition-none"
                    >
                      <User aria-hidden="true" className="w-4 h-4 me-2" />
                      Profile
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex min-h-[44px] items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-700 motion-reduce:transition-none"
                    >
                      <LogOut aria-hidden="true" className="w-4 h-4 me-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {isUserMenuOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsUserMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default UserPanelHeader;
