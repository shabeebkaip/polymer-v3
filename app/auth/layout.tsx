import Image from "next/image";
import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="flex items-center justify-center min-h-screen bg-[#f5f6f8] px-4">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 p-4">
        {/* Left Image Side */}
        <div className="hidden lg:block">
          <Image
            src="/assets/loginImage.png"
            alt="Login visual"
            width={600}
            height={600}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right Form Side */}
        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
