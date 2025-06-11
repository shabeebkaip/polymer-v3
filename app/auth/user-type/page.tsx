"use client";
import Image from "next/image";
import React from "react";
import { useRouter } from "next/navigation";

const Login: React.FC = () => {
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
    <div className="flex flex-col items-start justify-center gap-6 ">
      <div>
        <Image
          src="/typography.svg"
          alt="Logo"
          width={100}
          height={50}
          className="h-16 w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
      </div>
      <h4 className="text-4xl text-[var(--dark-main)]">Signup</h4>
      <h4 className="text-[var(--dark-main)] text-3xl">Who are You?</h4>
      <p>
        Access your Polymer Marketplace account to explore, buy, and sell
        high-quality polymers. Are you a buyer or a seller? Please select your
        role below to proceed.
      </p>
      <div className="flex flex-col gap-6 w-full">
        {userTypes.map((userType, index) => (
          <div
            className="flex items-center justify-center gap-4 w-full border border-gray-200 rounded-lg p-4 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
            key={index}
            onClick={() => router.push(userType.link)}
          >
            <Image
              src={userType.icon}
              alt={userType.name}
              width={24}
              height={24}
              className="w-32"
            />
            <div className="flex flex-col items-start">
              <h4 className="text-2xl text-[var(--dark-main)]">
                {userType?.name}
              </h4>
              <p className="text-gray-500">{userType?.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Login;
