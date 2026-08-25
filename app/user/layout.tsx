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
      {/* One responsive content tree keeps form state, generated IDs, focus,
          and polite announcements single-instance at every breakpoint. */}
      <div className="min-h-screen bg-gray-50 md:flex md:h-screen">
        <aside className="hidden w-72 flex-shrink-0 overflow-hidden bg-white shadow-sm md:block">
          <Sidebar />
        </aside>

        <div className="min-w-0 flex-1 md:flex md:flex-col">
          <UserPanelHeader />
          <div className="md:hidden">
            <MobileSettingsMenu />
          </div>

          <main className="px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 [scroll-padding-block-end:6rem] [scroll-padding-block-start:6rem] sm:px-5 md:flex-1 md:overflow-y-auto md:p-8">
            <div className="container mx-auto min-w-0 max-w-[1440px]">
              {children}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

export default UserLayout;
