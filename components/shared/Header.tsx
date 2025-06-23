"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "../ui/button";
import { useUserInfo } from "@/lib/useUserInfo";

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
    router.refresh();
    router.push("/");
  };

  const handleNavigate = (href: string) => {
    setIsOpen(false);
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

  return (
    <header className="bg-white shadow-xl shadow-green-600/10 sticky top-0 z-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <Image
              src="/typography.svg"
              alt="Logo"
              width={100}
              height={50}
              className="md:h-10 h-7 w-auto"
            />
          </Link>

          <nav className="hidden lg:flex space-x-8">
            {links.map((link) => (
              <p
                key={link.href}
                onClick={() => router.push(link.href)}
                className="hover:text-[var(--green-main)] cursor-pointer"
              >
                {link.label}
              </p>
            ))}
            <div className="relative" ref={languagePopupRef}>
              <div
                className="flex items-center gap-2 cursor-pointer"
                onClick={toggleLanguagePopup}
              >
                {/* <img src="/globes.svg" alt="" /> */}
                <span>{language === "en" ? "English" : "العربية"}</span>
                <img src="/arrow.svg" alt="" />
              </div>
              {isLanguagePopupOpen && (
                <div
                  className={`absolute ${
                    language === "ar" ? "left-0" : "right-0"
                  } mt-2 w-32 bg-white shadow-lg rounded-md border z-10 px-3 top-[35px]`}
                >
                  <div className="py-2">
                    <button
                      onClick={() => changeLanguage("ar")}
                      className="group px-4 py-2 text-sm text-[#737791] hover:text-white hover:bg-[var(--green-main)] w-full rounded-lg text-left flex gap-2 items-center"
                    >
                      العربية
                    </button>
                    <button
                      onClick={() => changeLanguage("en")}
                      className="px-4 py-2 text-sm text-[#737791] hover:text-white hover:bg-[var(--green-main)] rounded-lg w-full text-left flex items-center gap-2"
                    >
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("de")}
                      className="px-4 py-2 text-sm text-[#737791] hover:text-white hover:bg-[var(--green-main)] rounded-lg w-full text-left flex items-center gap-2"
                    >
                      Deutsch
                    </button>
                    <button
                      onClick={() => changeLanguage("zh")}
                      className="px-4 py-2 text-sm text-[#737791] hover:text-white hover:bg-[var(--green-main)] rounded-lg w-full text-left flex items-center gap-2"
                    >
                      中文
                    </button>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {user && (
            <button
              type="button"
              onClick={() => router.push("/user/profile")}
              className="md:flex hidden items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
            >
              <Image
                src="/icons/user.svg"
                alt="User"
                width={20}
                height={20}
                className="mr-2"
              />
              Hello {user?.firstName} {user?.lastName}
            </button>
          )}

          {!user && (
            <div className="hidden lg:flex items-center space-x-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="flex items-center px-4 py-2 border border-[var(--green-main)] text-[var(--green-main)] rounded-lg hover:bg-green-50 transition cursor-pointer"
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
              <button
                onClick={() => router.push("/auth/user-type")}
                className="px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 cursor-pointer"
              >
                Sign Up for Free
              </button>
            </div>
          )}

          <div className="flex items-center -mr-2 lg:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-[var(--green-main)] rounded-md relative z-[2]"
            >
              <svg
                className="w-8 h-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isOpen ? "" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          <div
            className={`fixed inset-y-0 right-0 bg-white opacity-90 z-10 transform rounded-l-2xl shadow-2xl w-[200px] ${
              isOpen ? "translate-x-0" : "translate-x-full"
            } transition-transform duration-300 ease-in-out lg:hidden flex flex-col px-4 py-6 space-y-4 overflow-y-auto`}
            style={{ maxHeight: "100vh" }}
          >
            <button
              onClick={toggleMenu}
              className="self-end p-2 text-[var(--green-main)] hover:text-[var(--green-main)]"
            >
              <svg
                className="w-6 h-6 sm:h-8 sm:w-8"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {links.map((link) => (
              <NavbarLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={link.href === pathname}
                onClick={handleNavigate}
              />
            ))}
            {user ? (
              <NavbarLink
                href="/user/profile"
                label={"Profile"}
                isActive={"/user/profile" === pathname}
                onClick={handleNavigate}
              />
            ) : null}
            <div
              className="flex items-center gap-2 cursor-pointer"
              onClick={toggleVisibility}
            >
              <span className="inline-flex items-center px-1 pt-1 xl:text-[18px] text-[15px] font-[300] text-[var(--green-main)]">
                {language === "en" ? "English" : "العربية"}
              </span>
              <img src="/arrow.svg" alt="arrow" />
            </div>
            {isVisible && (
              <div
                className="flex items-center flex-wrap gap-4 mt-2 transition-all duration-1000 ease-out transform scale-95 opacity-0"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.95)",
                }}
              >
                <div
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    language === "ar"
                      ? "bg-[var(--green-main)] text-white"
                      : "text-[#737791]"
                  } hover:bg-[var(--green-main)] hover:text-white`}
                  onClick={() => changeLanguage("ar")}
                >
                  العربية
                </div>

                <div
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    language === "en"
                      ? "bg-[var(--green-main)] text-white"
                      : "text-[var(--green-main)]"
                  } hover:bg-[var(--green-main)] hover:text-white`}
                  onClick={() => changeLanguage("en")}
                >
                  English
                </div>

                <div
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    language === "de"
                      ? "bg-[var(--green-main)] text-white"
                      : "text-[var(--green-main)]"
                  } hover:bg-[var(--green-main)] hover:text-white`}
                  onClick={() => changeLanguage("de")}
                >
                  Deutsch
                </div>

                <div
                  className={`cursor-pointer px-4 py-2 rounded-md text-sm ${
                    language === "zh"
                      ? "bg-[var(--green-main)] text-white"
                      : "text-[var(--green-main)]"
                  } hover:bg-[var(--green-main)] hover:text-white`}
                  onClick={() => changeLanguage("zh")}
                >
                  中文
                </div>
              </div>
            )}

            {user ? (
              <Button
                variant={"outline"}
                className="cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              <NavbarLink
                href="/auth/login"
                label="Register/Login"
                isActive={false}
                onClick={handleNavigate}
              />
            )}
            {!user && (
              <button
                onClick={() => handleNavigate("/auth/user-type")}
                className="px-4 py-2 bg-gradient-to-r from-[var(--green-gradient-from)] via-[var(--green-gradient-via)] to-[var(--green-gradient-to)] text-white rounded-lg hover:opacity-90 cursor-pointer"
              >
                Sign Up for Free
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
