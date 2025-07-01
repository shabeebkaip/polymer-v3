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
    router.refresh();
    router.push("/");
  };

  const handleProfile = () => {
    router.push("/user/profile");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-emerald-600">
              POLYMERS HUB
            </div>
            <div className="ml-4 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-medium rounded-full">
              User Panel
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {/* Visit Marketplace Button */}
            <Button
              onClick={handleVisitMarketplace}
              variant="outline"
              className="inline-flex items-center gap-2 px-4 py-2 border border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:border-emerald-300 transition-colors duration-200"
            >
              <Home className="w-4 h-4" />
              <span className="font-medium">Visit Marketplace</span>
              <ExternalLink className="w-4 h-4" />
            </Button>

            {/* User Info & Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col items-start">
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
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button
                      onClick={handleProfile}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
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
