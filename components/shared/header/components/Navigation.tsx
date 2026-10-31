import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { linksType, NavigationProps } from "@/types/header";

const Navigation: React.FC<NavigationProps> = ({ links }) => {
    const pathname = usePathname();

    return (
        <nav aria-label="Main" className="hidden lg:flex items-center space-x-8">
            {links.map((link: linksType) => (
                <div key={link.href} className="relative group">
                    <Link
                        href={link.href}
                        aria-current={pathname === link.href ? "page" : undefined}
                        className={`block font-semibold transition-all duration-200 px-3 py-2 rounded-lg hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                            pathname === link.href
                                ? "text-primary-500 bg-primary-50"
                                : "text-gray-900 hover:text-primary-600"
                        }`}
                    >
                        {link.label}
                    </Link>
                    {pathname === link.href && (
                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary-500 rounded-full"></div>
                    )}
                </div>
            ))}
        </nav>
    );
};

export default Navigation;
