"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRound, ClipboardList, BookCopy, Package } from "lucide-react";
import { useUserInfo } from "@/lib/useUserInfo";

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  UserRound,
  ClipboardList,
  BookCopy,
  Package,
};

const MobileSettingsMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserInfo();

  // Comprehensive fallback data based on user type
  const getFallbackSidebarList = (userType?: string) => {
    const fallbackItems = [
      {
        displayName: "Profile",
        user: "all",
        route: "/user/profile",
        icon: "UserRound",
        subItems: [],
      },
    ];

    if (userType === "buyer") {
      fallbackItems.push(
        {
          displayName: "Sample Requests",
          route: "/user/sample-requests",
          user: "buyer",
          icon: "ClipboardList",
          subItems: [],
        },
        {
          displayName: "Quote Requests",
          route: "/user/quote-requests",
          user: "buyer",
          icon: "BookCopy",
          subItems: [],
        },
        {
          displayName: "Finance Requests",
          route: "/user/finance-requests",
          user: "buyer",
          icon: "ClipboardList",
          subItems: [],
        },
        {
          displayName: "Product Requests",
          route: "/user/product-requests",
          user: "buyer",
          icon: "Package",
          subItems: [],
        }
      );
    } else if (userType === "seller") {
      fallbackItems.push(
        {
          displayName: "Products",
          route: "/user/products",
          user: "seller",
          icon: "Package",
          subItems: [],
        },
        {
          displayName: "Sample Enquiries",
          route: "/user/sample-enquiries",
          user: "seller",
          icon: "ClipboardList",
          subItems: [],
        },
        {
          displayName: "Quote Enquiries",
          route: "/user/quote-enquiries",
          user: "seller",
          icon: "ClipboardList",
          subItems: [],
        }
      );
    }

    return fallbackItems;
  };

  // Use fallback data only - no API dependency
  const displaySidebarList = getFallbackSidebarList(user?.user_type);

  const renderIcon = (iconName: string, isActive: boolean) => {
    const IconComponent = iconMap[iconName] || UserRound;
    return (
      <IconComponent
        className={`w-5 h-5 ${
          isActive ? "text-primary-500" : "text-[#A8A8A8]"
        }`}
      />
    );
  };

  return (
    <div className="bg-gray-50 h-full w-full">
      <div className="bg-white rounded-lg shadow-sm mx-4 my-4">
        {displaySidebarList.map((item, index) => {
          const isActive = pathname.includes(item?.route);
          return (
            <div
              key={item.displayName}
              className={`flex items-center justify-between p-4 cursor-pointer ${
                index !== displaySidebarList.length - 1 ? "border-b border-gray-100" : ""
              }`}
              onClick={() => router.push(item.route)}
            >
              <div className="flex items-center gap-3">
                {renderIcon(item.icon || "UserRound", isActive)}
                <span 
                  className={`${
                    isActive ? "text-primary-500" : "text-[#A8A8A8]"
                  } text-sm lg:text-base`}
                >
                  {item.displayName}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSettingsMenu;
