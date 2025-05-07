"use client";
import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="flex items-center justify-center min-h-screen px-4 bg-[url('/assets/authbg.png')] bg-cover bg-center">
      <div className="w-full max-w-lg p-8 rounded-2xl shadow-2xl bg-white/10 backdrop-blur-xl border border-[#F9FAFB]  ">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
