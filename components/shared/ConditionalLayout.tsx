"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Header from "./header/Header";
import Footer from "./Footer";
import { ConditionalLayoutProps } from "@/types/shared";

const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  
  // Check if current route should hide header/footer
  const isAuthRoute = pathname.startsWith("/auth");
  const isUserRoute = pathname.startsWith("/user");
  const isHomePage = pathname === "/"; // Coming soon page
  
  // Header visibility: Hide for auth, user routes, and home page
  const showHeader = !isAuthRoute && !isUserRoute && !isHomePage;
  
  // Footer visibility: Hide for auth routes, user routes, and home page
  const showFooter = !isAuthRoute && !isUserRoute && !isHomePage;

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
