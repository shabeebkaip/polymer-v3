import MobileSettingsMenu from "@/components/shared/MobileSettings";
import Sidebar from "@/components/shared/Sidebar";
import React, { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <>
      <div className="container mx-auto px-4 min-h-screen md:block hidden">
        <div className="grid grid-cols-12 gap-4 mt-10">
          <div className="col-span-12 lg:col-span-3">
            <Sidebar />
          </div>
          <main className="col-span-12 lg:col-span-9">{children}</main>
        </div>
      </div>
      <div className=" mt-10 md:hidden">
        <MobileSettingsMenu />
        <main className="col-span-12">{children}</main>
      </div>
    </>
  );
};

export default UserLayout;
