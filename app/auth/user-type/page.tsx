"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const UserTypeSelection: React.FC = () => {
  const router = useRouter();
  const userTypes = [
    {
      name: "Buyer",
      description:
        "As a buyer, you can explore and purchase high-quality polymers.",
      icon: "/icons/buyer.svg",
      link: "/auth/register?role=buyer",
    },
    {
      name: "Seller",
      description:
        "As a seller, you can list your products and manage your sales.",
      icon: "/icons/Seller.svg",
      link: "/auth/register?role=seller",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center gap-6 w-full h-full">
      {/* Logo Section */}
      <div className="text-center">
        <Image
          src="/typography.svg"
          alt="Logo"
          width={100}
          height={50}
          className="h-14 w-auto cursor-pointer hover:opacity-80 transition-opacity mx-auto"
          onClick={() => router.push("/")}
        />
      </div>

      {/* Header Section */}
      <div className="text-center space-y-2 max-w-lg">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Join Our Marketplace
        </h1>
        <h2 className="text-xl font-semibold text-gray-800">
          Who are you?
        </h2>
        <p className="text-gray-600 leading-relaxed text-sm">
          Select your role below to get started with our Polymer Marketplace.
        </p>
      </div>
      {/* User Type Selection */}
      <div className="w-full max-w-xl space-y-3">
        {userTypes.map((userType, index) => (
          <div
            className="group relative overflow-hidden bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer 
                     hover:border-green-500 hover:shadow-lg transform hover:scale-[1.01] 
                     transition-all duration-200 ease-in-out"
            key={index}
            onClick={() => router.push(userType.link)}
          >
            {/* Background gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-emerald-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            
            {/* Content */}
            <div className="relative z-10 flex items-center gap-4">
              {/* Icon */}
              <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center group-hover:from-green-200 group-hover:to-emerald-200 transition-all duration-200">
                <Image
                  src={userType.icon}
                  alt={userType.name}
                  width={28}
                  height={28}
                  className="w-7 h-7 object-contain"
                />
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-green-700 transition-colors duration-200">
                  {userType.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700 transition-colors duration-200">
                  {userType.description}
                </p>
              </div>
              
              {/* Arrow indicator */}
              <div className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-green-500 transition-all duration-200">
                <svg 
                  className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Already have account link */}
      <div className="text-center">
        <p className="text-gray-600 text-sm">
          Already have an account?{" "}
          <button 
            onClick={() => router.push("/auth/login")}
            className="font-medium text-green-600 hover:text-green-700 transition-colors hover:underline"
          >
            Sign in here
          </button>
        </p>
      </div>
    </div>
  );
};

export default UserTypeSelection;
