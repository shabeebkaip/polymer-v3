"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  User,
  Settings,
  ShieldCheck,
  FileText,
  LayoutDashboard,
  Bell,
  HelpCircle,
  MessageCircle,
  Package,
  ClipboardList,
  DollarSign,
  Users,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  Truck,
  ShoppingCart,
  Heart,
  FlaskConical,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";

// Icon mapping for dynamic icons - using exact Lucide icon names
const iconMap: Record<string, React.ComponentType<any>> = {
  User: User,
  Settings: Settings,
  ShieldCheck: ShieldCheck,
  FileText: FileText,
  LayoutDashboard: LayoutDashboard,
  Bell: Bell,
  HelpCircle: HelpCircle,
  MessageCircle: MessageCircle,
  Package: Package,
  ClipboardList: ClipboardList,
  Flask: FlaskConical, // Map Flask to FlaskConical from Lucide
  DollarSign: DollarSign,
  Users: Users,
  TrendingUp: TrendingUp,
  ShoppingBag: ShoppingBag,
  CreditCard: CreditCard,
  Truck: Truck,
  ShoppingCart: ShoppingCart,
  Heart: Heart,
};

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserInfo();
  const { sidebarItems, sidebarLoading, fetchSidebarItems } = useSharedState();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchSidebarItems();
    }
  }, [user, fetchSidebarItems]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    router.refresh();
    router.push("/");
  };

  const toggleExpanded = (itemDisplayName: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemDisplayName)) {
        newSet.delete(itemDisplayName);
      } else {
        newSet.add(itemDisplayName);
      }
      return newSet;
    });
  };

  // Fallback data in case API fails or is loading
  const fallbackSidebarList = [
    {
      displayName: "Profile",
      route: "/user/profile",
      name: "profile",
      icon: "User",
      subItems: [],
    },
    {
      displayName: "Settings",
      route: "/user/settings",
      name: "settings",
      icon: "Settings",
      subItems: [],
    },
    {
      displayName: "Dashboard",
      route: "/user/dashboard",
      name: "dashboard",
      icon: "LayoutDashboard",
      subItems: [],
    },
  ];

  // Process and use API data when available
  let displaySidebarList: any[] = [];

  if (sidebarLoading) {
    // Show loading skeleton
    displaySidebarList = [];
  } else if (sidebarItems && sidebarItems.length > 0) {
    // Use API data directly since it matches the expected structure
    displaySidebarList = sidebarItems.map((item: any) => ({
      displayName: item.displayName,
      route: item.route,
      name: item.name,
      icon: item.icon,
      subItems: item.subItems || [],
    }));
  } else {
    // Use minimal fallback data if API is not available
    displaySidebarList = fallbackSidebarList;
  }

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = iconMap[iconName] || User; // Default to User icon if not found
    return <IconComponent className={`w-5 h-5 ${className}`} />;
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  const hasActiveSubItem = (subItems: any[] = []) => {
    return subItems.some((subItem) => isActiveRoute(subItem.route));
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {user?.first_name} {user?.last_name}
            </h3>
            <p className="text-xs text-gray-500 capitalize">
              {user?.user_type}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 animate-pulse"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-md"></div>
                  <div className="h-4 bg-gray-200 rounded flex-1"></div>
                </div>
              ))}
            </div>
          ) : (
            displaySidebarList?.map((item) => {
              const isActive = isActiveRoute(item.route);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.has(item.displayName);
              const hasActiveChild = hasActiveSubItem(item.subItems);
              const showAsActive = isActive || hasActiveChild;

              return (
                <div key={item.name || item.displayName} className="space-y-1">
                  {/* Main item */}
                  <div
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                      ${
                        showAsActive
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                    onClick={() => {
                      if (hasSubItems) {
                        toggleExpanded(item.displayName);
                      } else {
                        router.push(item.route);
                      }
                    }}
                  >
                    {/* Icon */}
                    <div
                      className={`
                      w-8 h-8 rounded-md flex items-center justify-center transition-colors
                      ${
                        showAsActive
                          ? "bg-emerald-100"
                          : "bg-gray-100 group-hover:bg-gray-200"
                      }
                    `}
                    >
                      {renderIcon(
                        item.icon,
                        showAsActive
                          ? "text-emerald-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      )}
                    </div>

                    {/* Label */}
                    <span className="flex-1 font-medium text-sm">
                      {item.displayName}
                    </span>

                    {/* Expand/Collapse icon for items with subItems */}
                    {hasSubItems && (
                      <div className="w-5 h-5 flex items-center justify-center">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 transition-transform duration-200" />
                        ) : (
                          <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-8 space-y-1 border-l-2 border-emerald-100 pl-4">
                      {item.subItems?.map((subItem: any) => {
                        const isSubActive = isActiveRoute(subItem.route);

                        return (
                          <div
                            key={subItem.name || subItem.displayName}
                            className={`
                              flex items-center gap-3 p-2.5 rounded-md cursor-pointer transition-all duration-200
                              ${
                                isSubActive
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              }
                            `}
                            onClick={() => router.push(subItem.route)}
                          >
                            {/* Sub item icon */}
                            <div
                              className={`
                              w-6 h-6 rounded flex items-center justify-center
                              ${isSubActive ? "bg-emerald-100" : "bg-gray-100"}
                            `}
                            >
                              {renderIcon(
                                subItem.icon,
                                `w-3 h-3 ${
                                  isSubActive
                                    ? "text-emerald-600"
                                    : "text-gray-400"
                                }`
                              )}
                            </div>

                            {/* Sub item label */}
                            <span className="text-sm font-medium">
                              {subItem.displayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="mt-auto p-4 border-t border-gray-100">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
