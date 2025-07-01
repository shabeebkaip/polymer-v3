"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Check if current route should hide header/footer
  const isAuthRoute = pathname.startsWith("/auth");
  const isUserRoute = pathname.startsWith("/user");
  
  // Header visibility: Hide for auth and user routes
  const showHeader = !isAuthRoute && !isUserRoute;
  
  // Footer visibility: Hide for auth routes only
  const showFooter = !isAuthRoute;

  return (
    <>
      {showHeader && <Header />}
      <div className="md:min-h-screen flex flex-col justify-between">
        <main className="flex-grow">{children}</main>
      </div>
      {showFooter && <Footer />}
    </>
  );
};

export default ConditionalLayout;
