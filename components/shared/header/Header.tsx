"use client";

import React, {useState} from "react";
import {usePathname, useRouter} from "next/navigation";
import {Button} from "../../ui/button";
import {useUserInfo} from "@/lib/useUserInfo";
import Logo from "./components/Logo";
import Navigation from "./components/Navigation";
import Notification from "./components/Notification";
import UserPopover from "@/components/shared/header/components/UserPopover";
import AuthButtons from "@/components/shared/header/components/AuthButtons";

// --- TypeScript Types ---
type Language = "en" | "ar" | "de" | "zh";

const Header: React.FC = () => {
    const pathname = usePathname(); // ✅ must be at top
    const {user, logout} = useUserInfo(); // ✅ must be at top
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isUserPopoverOpen, setIsUserPopoverOpen] = useState(false);

    const [language, setLanguage] = useState<Language>("en");

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

    const links = [
        {href: "/", label: "Home"},
        {href: "/products", label: "Products"},
        {href: "/suppliers", label: "Suppliers"},
    ];

    const navOptions =
        user?.user_type === "buyer"
            ? [
                {
                    href: "/user/profile",
                    label: "Profile",
                    icon: "👤",
                    id: "profile",
                },
                {
                    href: "/user/finance-requests/add",
                    label: "Request Finance",
                    icon: "💰",
                    id: "finance",
                },
                {
                    href: "/user/product-requests/add",
                    label: "Request Product",
                    icon: "📦",
                    id: "product-request",
                }
            ]
            : [
                {
                    href: "/user/profile",
                    label: "Profile",
                    icon: "👤",
                    id: "profile",
                },
                {
                    href: "/user/products",
                    label: "My Products",
                    icon: "📦",
                    id: "products",
                },
                {
                    href: "/user/promotions/add",
                    label: "Post Offers",
                    icon: "📝",
                    id: "offers",
                },

            ];

    return (
        <header className="w-full bg-white shadow-sm border-b border-gray-100/50 z-30 sticky top-0">
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                {/* Enhanced Logo */}
                <Logo/>

                {/* Enhanced Desktop Navigation */}
                <Navigation links={links}/>

                <div className="flex items-center gap-4">
                    {user && <Notification/>}

                    {/* Enhanced User Menu */}
                    {user && (
                        <UserPopover  isUserPopoverOpen={isUserPopoverOpen} setIsUserPopoverOpen={setIsUserPopoverOpen} handleNavigate={handleNavigate}  handleLogout={handleLogout} navOptions={navOptions}  />
                    )}

                    {/* Enhanced Auth Buttons */}
                    {!user &&  <AuthButtons />}

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
                        style={{maxHeight: "100vh"}}
                    >
                        {/* Mobile Menu Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-white"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5z"/>
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
                                            <div
                                                className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-medium">
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
                                            {code: "ar", name: "العربية", flag: "🇸🇦"},
                                            {code: "en", name: "English", flag: "🇺🇸"},
                                            {code: "de", name: "Deutsch", flag: "🇩🇪"},
                                            {code: "zh", name: "中文", flag: "🇨🇳"},
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
