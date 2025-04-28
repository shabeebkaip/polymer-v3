import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md ">
      <div className="container mx-auto ">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              <Image
                src="/typography.svg"
                alt="Logo"
                width={100}
                height={50}
                className="h-10 w-auto"
              />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-sans ">
              Home
            </Link>
            <Link href="/brand" className="text-gray-700 hover:text-blue-600 ">
              Brand
            </Link>
            <Link href="/buyers" className="text-gray-700 hover:text-blue-600 ">
              Buyers
            </Link>
            <Link
              href="/supplier"
              className="text-gray-700 hover:text-blue-600 "
            >
              Supplier
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="flex items-center px-4 py-2 border border-[#008767] text-[#008767] rounded hover:bg-green-50 transition"
            >
              Login
            </button>
            <Link
              href="/signup"
              className="px-4 py-3 bg-gradient-to-r from-[#3DB2A2] via-[#2CA88F] to-[#008767] text-white rounded-lg hover:opacity-90 transition"
            >
              Sign Up for Free
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
