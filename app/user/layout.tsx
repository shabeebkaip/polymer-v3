import MobileSettingsMenu from "@/components/shared/MobileSettings";
import Sidebar from "@/components/shared/Sidebar";
import React, { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="min-h-screen bg-gray-50 md:block hidden">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-72 min-h-screen bg-white shadow-sm">
            <Sidebar />
          </div>
          
          {/* Main Content */}
          <main className="flex-1 p-8">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      {/* Mobile Layout */}
      <div className="mt-10 md:hidden">
        <MobileSettingsMenu />
        <main className="px-4">
          {children}
        </main>
      </div>
    </>
  );
};

export default UserLayout;
