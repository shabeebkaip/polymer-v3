"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = Cookies.get("token");
  const userInfo = Cookies.get("userInfo");
  const parsedUserInfo = userInfo ? JSON.parse(userInfo) : null;
  console.log("Parsed User Info:", parsedUserInfo);
  if (pathname.includes("auth")) {
    return null; // Don't render the header on the auth pages
  }
  return (
    <header className="bg-white shadow-xl shadow-green-600/10   ">
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="">
              <Image
                src="/typography.svg"
                alt="Logo"
                width={100}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links Desktop */}
          <nav className="hidden lg:flex space-x-8">
            <p
              onClick={() => router.push("/")}
              className="text-[var(--text-gray-primary)] hover:text-[var(--green-main)] cursor-pointer"
            >
              Home
            </p>
            <p
              onClick={() => router.push("/products")}
              className="text-[var(--text-gray-primary)] hover:text-[var(--green-main)] cursor-pointer"
            >
              Products
            </p>
            <p
              onClick={() => router.push("/suppliers")}
              className="text-[var(--text-gray-primary)] hover:text-[var(--green-main)] cursor-pointer"
            >
              Suppliers
            </p>
          </nav>

          {/* Action Buttons Desktop */}
          {token && userInfo && (
            <button
              type="button"
              className="flex items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
              onClick={() => router.push("/auth/profile")}
            >
              <Image
                src="/icons/user.svg"
                alt="User Icon"
                width={20}
                height={20}
                className="mr-2"
              />
              Hello {parsedUserInfo?.firstName} {parsedUserInfo?.lastName}
            </button>
          )}
          {!token && (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                type="button"
                className="flex items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
                onClick={() => router.push("/auth/login")}
              >
                <Image
                  src="/icons/user.svg"
                  alt="User Icon"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Login
              </button>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 transition cursor-pointer"
              >
                Sign Up for Free
              </Link>
            </div>
          )}

          {/* Hamburger Menu Icon */}
          {/* This is for mobile view */}
          <div className="lg:hidden flex items-center">
            <Image
              src="/icons/hamburger.svg"
              alt="Menu Icon"
              width={100}
              height={100}
              className="cursor-pointer w-12 "
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
