import Sidebar from "@/components/shared/Sidebar";
import React, { ReactNode } from "react";

interface UserLayoutProps {
  children: ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="container mx-auto px-4 min-h-screen">
      <div className="grid grid-cols-12 gap-4 mt-10 ">
        <div className="col-span-3  ">
          <Sidebar />
        </div>
        {/* You can add a header or sidebar here if needed */}
        <main className="col-span-9">{children}</main>
      </div>
    </div>
  );
};

export default UserLayout;
