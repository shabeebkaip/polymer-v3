import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f5f6f8] px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-lg">
        {children}
      </div>
    </section>
  );
};

export default AuthLayout;
