"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useUserInfo } from "@/lib/useUserInfo";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FALLBACK_USER_AVATAR } from "@/lib/fallbackImages";

// --- TypeScript Types ---
type NavbarLinkProps = {
  href: string;
  label: string;
  isActive: boolean;
  onClick: (href: string) => void;
};

type Language = "en" | "ar" | "de" | "zh";

const NavbarLink: React.FC<NavbarLinkProps> = ({
  href,
  label,
  isActive,
  onClick,
}) => (
  <span
    onClick={() => onClick(href)}
    className={`inline-flex items-center px-1 pt-1 xl:text-[18px] text-[15px] font-[300] cursor-pointer relative
            ${
              isActive
                ? "text-[var(--green-main)] hover:text-[var(--green-main)] after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-[var(--green-main)]"
                : "text-[var(--green-main)] hover:text-[var(--green-main)]"
            }`}
  >
    {label}
  </span>
);

const Header: React.FC = () => {
  const pathname = usePathname(); // ✅ must be at top
  const { user, logout, loadUserFromCookies } = useUserInfo(); // ✅ must be at top
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguagePopupOpen, setIsLanguagePopupOpen] = useState(false);
  const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);
  const [language, setLanguage] = useState<Language>("en");
  const languagePopupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadUserFromCookies(); // hydrate on mount
  }, [loadUserFromCookies]);

  // ✅ Safe early return AFTER hooks
  if (pathname.includes("auth")) return null;

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const handleLogout = () => {
    logout();
    setIsUserPopoverOpen(false); // Close the popover
    router.refresh();
    router.push("/");
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
    setIsUserPopoverOpen(false); // Close the popover
    router.push(href);
  };

  const changeLanguage = (selectedLanguage: Language) => {
    setLanguage(selectedLanguage);
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleLanguagePopup = () => setIsLanguagePopupOpen((prev) => !prev);

  const links = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/suppliers", label: "Suppliers" },
  ];
  const navOptions =
    user?.user_type === "buyer"
      ? [
          { href: "/user/profile", label: "Profile", icon: "👤", id: "profile" },
          {
            href: "/user/sample-requests",
            label: "Sample Requests",
            icon: "📋",
            id: "sample-requests"
          },
          { href: "/user/quote-requests", label: "Quote Requests", icon: "💼", id: "quote-requests" },
          { href: "/user/finance", label: "Request Finance", icon: "💰", id: "finance" },
          { href: "/user/open-requests", label: "Post Open Requests", icon: "📝", id: "open-requests" },
        ]
      : [
          { href: "/user/profile", label: "Profile", icon: "👤", id: "profile" },
          { href: "/user/products", label: "My Products", icon: "📦", id: "products" },
          { href: "/user/sample-requests", label: "Sample Request", icon: "📋", id: "sample-request" },
          { href: "/user/sample-enquiries", label: "Sample Enquiries", icon: "💼", id: "sample-enquiries" },
          { href: "/user/offers", label: "Post Offers", icon: "📝", id: "offers" },
          { href: "/user/finance", label: "Request Finance", icon: "💰", id: "finance" },
        ];
  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg shadow-green-600/5 sticky top-0 z-20 border-b border-green-100/50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-18">
          {/* Enhanced Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative overflow-hidden rounded-lg p-1 group-hover:bg-green-50 transition-all duration-200">
              <Image
                src="/typography.svg"
                alt="Polymers Hub Logo"
                width={120}
                height={50}
                className="md:h-12 h-8 w-auto transition-transform duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Enhanced Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {links.map((link) => (
              <div key={link.href} className="relative group">
                <p
                  onClick={() => router.push(link.href)}
                  className={`cursor-pointer font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-50 ${
                    pathname === link.href
                      ? "text-[var(--green-main)] bg-green-50"
                      : "text-gray-700 hover:text-[var(--green-main)]"
                  }`}
                >
                  {link.label}
                </p>
                {pathname === link.href && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-[var(--green-main)] rounded-full"></div>
                )}
              </div>
            ))}

            {/* Enhanced Language Selector */}
            {/* <div className="relative" ref={languagePopupRef}>
              <div
                className="flex items-center gap-2 cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200 border border-gray-200 hover:border-green-300"
                onClick={toggleLanguagePopup}
              >
                <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {language === "en"
                    ? "English"
                    : language === "ar"
                    ? "العربية"
                    : language === "de"
                    ? "Deutsch"
                    : "中文"}
                </span>
                <svg
                  className="w-4 h-4 text-gray-500 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {isLanguagePopupOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-xl rounded-xl border border-gray-200 z-10 overflow-hidden">
                  <div className="py-2">
                    {[
                      { code: "ar", name: "العربية", flag: "🇸🇦" },
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "de", name: "Deutsch", flag: "🇩🇪" },
                      { code: "zh", name: "中文", flag: "🇨🇳" }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code as Language)}
                        className={`w-full px-4 py-3 text-sm text-left flex items-center gap-3 transition-all duration-200 ${
                          language === lang.code 
                            ? "bg-green-50 text-[var(--green-main)] font-medium" 
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div> */}
          </nav>

          {/* Enhanced User Menu */}
          {user && (
            <Popover open={isUserPopoverOpen} onOpenChange={setIsUserPopoverOpen}>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  className="md:flex hidden items-center gap-3 px-4 py-2.5 border border-green-200 text-gray-700 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                    {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="font-medium">Hello {user?.firstName}</span>
                  <svg
                    className="w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-white border-0 shadow-xl rounded-xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12 border-2 border-white/20">
                      <AvatarImage
                        src={user?.company_logo || FALLBACK_USER_AVATAR}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="bg-white/20 text-white font-semibold">
                        {user?.firstName?.charAt(0)?.toUpperCase() || ""}
                        {user?.lastName?.charAt(0)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">
                        {user?.firstName} {user?.lastName}
                      </div>
                      <div className="text-green-100 text-sm">
                        {user?.email}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  {navOptions.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                        pathname === item.href
                          ? "bg-green-50 text-[var(--green-main)] font-medium"
                          : "text-gray-700 hover:bg-gray-50 hover:text-[var(--green-main)]"
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <span className="mr-2">🚪</span>
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}

          {/* Enhanced Auth Buttons */}
          {!user && (
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Login
              </button>
              <button
                onClick={() => router.push("/auth/user-type")}
                className="px-6 py-2.5 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                Sign Up for Free
              </button>
            </div>
          )}

          {/* Enhanced Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2.5 text-[var(--green-main)] rounded-xl hover:bg-green-50 transition-all duration-200 relative z-[60]"
            >
              <svg
                className="w-6 h-6 transition-transform duration-200"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={
                    isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
                  }
                />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          {isOpen && (
            <div
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={toggleMenu}
            />
          )}

          {/* Enhanced Mobile Menu */}
          <div
            className={`fixed inset-y-0 right-0 bg-white z-50 transform rounded-l-3xl shadow-2xl w-[280px] ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out lg:hidden flex flex-col overflow-y-auto border-l border-gray-100`}
            style={{ maxHeight: "100vh" }}
          >
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z" />
                  </svg>
                </div>
                <span className="font-semibold text-gray-900">Menu</span>
              </div>
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-500 hover:text-[var(--green-main)] hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 p-6 space-y-2">
              {links.map((link) => (
                <div key={link.href} className="group">
                  <button
                    onClick={() => handleNavigate(link.href)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      pathname === link.href
                        ? "bg-green-50 text-[var(--green-main)] font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[var(--green-main)]"
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center">
                      {link.href === "/" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                      ) : link.href === "/products" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      ) : link.href === "/suppliers" ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 6h16M4 12h16M4 18h16"
                          />
                        </svg>
                      )}
                    </div>
                    <span>{link.label}</span>
                  </button>
                </div>
              ))}

              {user && (
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="px-4 py-3 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-medium">
                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {user?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleNavigate("/user/profile")}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      pathname === "/user/profile"
                        ? "bg-green-50 text-[var(--green-main)] font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Profile</span>
                  </button>
                </div>
              )}

              {/* Mobile Language Selector */}
              <div className="pt-4">
                <button
                  onClick={toggleVisibility}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>
                      {language === "en"
                        ? "English"
                        : language === "ar"
                        ? "العربية"
                        : language === "de"
                        ? "Deutsch"
                        : "中文"}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isVisible ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isVisible && (
                  <div className="mt-2 ml-4 space-y-1">
                    {[
                      { code: "ar", name: "العربية", flag: "🇸🇦" },
                      { code: "en", name: "English", flag: "🇺🇸" },
                      { code: "de", name: "Deutsch", flag: "🇩🇪" },
                      { code: "zh", name: "中文", flag: "🇨🇳" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code as Language)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-3 ${
                          language === lang.code
                            ? "bg-green-100 text-[var(--green-main)] font-medium"
                            : "text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        <span className="text-sm">{lang.flag}</span>
                        <span className="text-sm">{lang.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Footer */}
            <div className="p-6 border-t border-gray-100 space-y-3">
              {user ? (
                <Button
                  variant="outline"
                  className="w-full justify-center text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                  onClick={handleLogout}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Button>
              ) : (
                <>
                  <button
                    onClick={() => handleNavigate("/auth/login")}
                    className="w-full px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => handleNavigate("/auth/user-type")}
                    className="w-full px-4 py-3 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-xl hover:opacity-90 transition-all duration-200 font-medium"
                  >
                    Sign Up for Free
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
