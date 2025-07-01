"use client";

import MobileSettingsMenu from "@/components/shared/MobileSettings";
import Sidebar from "@/components/shared/Sidebar";
import UserPanelHeader from "@/components/shared/UserPanelHeader";
import UserInitializer from "@/components/providers/UserInitializer";
import { useAuthGuard } from "@/lib/useAuthGuard";
import React, { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  // Auth guard to protect all user routes
  useAuthGuard();

  return (
    <>
      <UserInitializer />
      <div className="min-h-screen bg-gray-50 md:block hidden">
        <div className="flex h-screen">
          {/* Sidebar */}
          <div className="w-72 bg-white shadow-sm">
            <Sidebar />
          </div>
          
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <UserPanelHeader />
            
            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
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
