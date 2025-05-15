"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";

const Header: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const token = Cookies.get("token");
  const userInfo = Cookies.get("userInfo")
    ? JSON.parse(Cookies.get("userInfo")!)
    : null;

  if (pathname.includes("auth")) {
    return null; // Don't render on auth pages
  }

  return (
    <header className="bg-white shadow-xl shadow-green-600/10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <Image
              src="/typography.svg"
              alt="Logo"
              width={100}
              height={50}
              className="h-10 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex space-x-8">
            <p
              onClick={() => router.push("/")}
              className="hover:text-[var(--green-main)] cursor-pointer"
            >
              Home
            </p>
            <p
              onClick={() => router.push("/products")}
              className="hover:text-[var(--green-main)] cursor-pointer"
            >
              Products
            </p>
            <p
              onClick={() => router.push("/suppliers")}
              className="hover:text-[var(--green-main)] cursor-pointer"
            >
              Suppliers
            </p>
          </nav>

          {token && userInfo && (
            <button
              type="button"
              onClick={() => router.push("/user/profile")}
              className="flex items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
            >
              <Image
                src="/icons/user.svg"
                alt="User"
                width={20}
                height={20}
                className="mr-2"
              />
              Hello {userInfo?.firstName} {userInfo?.lastName}
            </button>
          )}

          {!token && (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition"
              >
                <Image
                  src="/icons/user.svg"
                  alt="User"
                  width={20}
                  height={20}
                  className="mr-2"
                />
                Login
              </button>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90"
              >
                Sign Up for Free
              </Link>
            </div>
          )}

          <div className="lg:hidden flex items-center">
            <Image
              src="/icons/hamburger.svg"
              alt="Menu Icon"
              width={100}
              height={100}
              className="cursor-pointer w-12"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
