"use client";

import MobileSettingsMenu from "@/components/shared/MobileSettings";
import Sidebar from "@/components/shared/Sidebar";
import UserPanelHeader from "@/components/shared/UserPanelHeader";
import UserInitializer from "@/components/providers/UserInitializer";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { UserLayoutProps } from "@/types/user";
import React from "react";

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  // Auth guard to protect all user routes
  useAuthGuard();

  return (
    <>
      <UserInitializer />
      <div className="min-h-screen bg-gray-50 md:block hidden">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-72 bg-white shadow-sm flex-shrink-0 overflow-hidden">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <UserPanelHeader />
            
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
              <div className="container mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="mt-10 md:hidden">
        {/* Mobile Header */}
        <UserPanelHeader />
        <MobileSettingsMenu />
        <main className="px-4">
          {children}
        </main>
      </div>
    </>
  );
};

export default UserLayout;
