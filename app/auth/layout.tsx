"use client";
import React from "react";
import { usePathname } from "next/navigation";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const isSignupPage = pathname.includes("register");
  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-[url('/assets/authbg.png')] bg-cover bg-center">
      <div
        className={`w-full ${
          isSignupPage ? "max-w-7xl" : "max-w-lg"
        }  p-8 rounded-2xl shadow-2xl bg-gray-100/10 backdrop-blur-xl border border-[#F9FAFB]  `}
      >
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
