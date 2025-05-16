import Sidebar from "@/components/shared/Sidebar";
import React, { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 min-h-screen">
      <div className="grid grid-cols-12 gap-4 mt-10">
        {/* Sidebar: full width on mobile, 3 columns on md+ */}
        <div className="col-span-12 md:col-span-3">
          <Sidebar />
        </div>

        {/* Main Content: full width on mobile, 9 columns on md+ */}
        <main className="col-span-12 md:col-span-9">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
