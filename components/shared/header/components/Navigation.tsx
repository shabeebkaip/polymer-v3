import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { linksType} from "@/types/header";

type NavigationProps = {
    links: linksType[];
};

const Navigation: React.FC<NavigationProps> = ({ links }) => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <nav className="hidden lg:flex items-center space-x-8">
            {links.map((link: linksType) => (
                <div key={link.href} className="relative group">
                    <p
                        onClick={() => router.push(link.href)}
                        className={`cursor-pointer font-medium transition-all duration-200 px-3 py-2 rounded-lg hover:bg-green-50 ${
                            pathname === link.href
                                ? "text-emerald-600 bg-green-50"
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
        </nav>
    );
};

export default Navigation;