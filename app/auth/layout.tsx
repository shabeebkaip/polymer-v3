"use client";
import React from "react";
import { usePathname } from "next/navigation";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isSignupPage = pathname.includes("register");
  const isLoginPage = pathname.includes("login");
  
  return (
    <div className="min-h-screen bg-[url('/assets/authbg.png')] bg-cover bg-center flex items-center justify-center px-4 py-4 relative">
      {/* Background overlay with green tints */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-transparent to-emerald-900/20"></div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-green-400/10 to-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/10 to-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/5 to-emerald-400/5 rounded-full blur-3xl"></div>
      </div>
      
      {/* Auth card */}
      <div
        className={`relative w-full ${
          isSignupPage ? "max-w-7xl" : isLoginPage ? "max-w-md" : "max-w-lg"
        } ${isSignupPage ? "p-4" : "p-6"} rounded-3xl shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30 
        hover:shadow-3xl transition-all duration-300`}
      >
        {/* Card inner glow effect */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 to-green-50/20 pointer-events-none"></div>
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
