"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRound, ClipboardList, BookCopy, Package } from "lucide-react";
import Cookies from "js-cookie";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  UserRound,
  ClipboardList,
  BookCopy,
  Package,
};

const MobileSettingsMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserInfo();
  const { sidebarItems, sidebarLoading, fetchSidebarItems } = useSharedState();

  useEffect(() => {
    if (user) {
      fetchSidebarItems();
    }
  }, [user, fetchSidebarItems]);

  // Filter sidebar items based on user type
  const filteredSidebarList = sidebarItems.filter(
    (item) => item?.user === user?.user_type || item?.user === "all"
  );

  // Fallback data in case API fails or is loading
  const fallbackSidebarList = [
    {
      displayName: "Profile",
      user: "all",
      route: "/user/profile",
      icon: "UserRound",
      subItems: [],
    },
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
    },
  ];

  // Use API data if available, otherwise use fallback
  const displaySidebarList = sidebarLoading || filteredSidebarList.length === 0 
    ? fallbackSidebarList.filter((item) => item?.user === user?.user_type || item?.user === "all")
    : filteredSidebarList;

  const renderIcon = (iconName: string, isActive: boolean) => {
    const IconComponent = iconMap[iconName] || UserRound;
    return (
      <IconComponent
        className={`w-5 h-5 ${
          isActive ? "text-[var(--green-main)]" : "text-[#A8A8A8]"
        }`}
      />
    );
  };

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    router.refresh();
    router.push("/");
  };

  return (
    <div className="bg-gray-50 h-full w-full">
      <div className="bg-white rounded-lg shadow-sm mx-4 my-4">
        {sidebarLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 animate-pulse">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded w-24"></div>
            </div>
          ))
        ) : (
          displaySidebarList.map((item, index) => {
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
                      isActive ? "text-[var(--green-main)]" : "text-[#A8A8A8]"
                    } text-sm lg:text-base`}
                  >
                    {item.displayName}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MobileSettingsMenu;
