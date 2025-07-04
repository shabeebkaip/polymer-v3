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

// Define types for sidebar items
interface SidebarSubItem {
  displayName: string;
  route: string;
  name: string;
  icon: string;
}

interface SidebarItem {
  displayName: string;
  route: string;
  name: string;
  icon: string;
  subItems?: SidebarSubItem[];
}

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
  const { user, isInitialized, loadUserFromCookies } = useUserInfo();
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  // Initialize user data from cookies on mount
  useEffect(() => {
    const token = Cookies.get("token");
    
    // Redirect to home if no token
    if (!token) {
      console.log("No token found, redirecting to home");
      router.push("/");
      return;
    }

    if (!isInitialized) {
      console.log("Loading user from cookies...");
      loadUserFromCookies();
    }
  }, [isInitialized, loadUserFromCookies, router]);

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

  // Comprehensive fallback data based on API structure
  const getFallbackSidebarList = (userType?: string): SidebarItem[] => {
    let sidebarItems: SidebarItem[] = [
      {
        displayName: "Profile",
        route: "/user/profile",
        name: "profile",
        icon: "User",
        subItems: [],
      },
    ];

    if (userType === "expert") {
      sidebarItems.push({
        displayName: "Message",
        route: "/user/message",
        name: "message",
        icon: "MessageCircle",
        subItems: [],
      });
    } else if (userType === "seller") {
      sidebarItems.push(
        {
          displayName: "Product",
          route: "/user/products",
          name: "product",
          icon: "Package",
          subItems: [],
        },
        {
          displayName: "Procurement",
          route: "/enquiries",
          name: "enquiries",
          icon: "ClipboardList",
          subItems: [
            {
              displayName: "Sample Request Enquiries",
              route: "/user/sample-enquiries",
              name: "sample-request-enquiries",
              icon: "Flask",
            },
            {
              displayName: "Quote Request Enquiries",
              route: "/user/quote-enquiries",
              name: "quote-request-enquiries",
              icon: "DollarSign",
            },
          ],
        },
        {
          displayName: "Experts",
          route: "/user/experts",
          name: "experts",
          icon: "Users",
          subItems: [],
        },
        // {
        //   displayName: "Analytics",
        //   route: "/user/analytics",
        //   name: "analytics",
        //   icon: "TrendingUp",
        //   subItems: [],
        // },
        // {
        //   displayName: "Orders",
        //   route: "/user/orders",
        //   name: "orders",
        //   icon: "ShoppingBag",
        //   subItems: [],
        // }
      );
    } else if (userType === "buyer") {
      sidebarItems.push({
        displayName: "Procurement",
        route: "/procurement",
        name: "procurement",
        icon: "ClipboardList",
        subItems: [
          {
            displayName: "Sample Request",
            route: "/user/sample-requests",
            name: "sample-request",
            icon: "Flask",
          },
          {
            displayName: "Quote Request",
            route: "/user/quote-requests",
            name: "quote-request",
            icon: "DollarSign",
          },
          {
            displayName: "Finance Request",
            route: "/user/finance-requests",
            name: "finance-request",
            icon: "CreditCard",
          },
          {
            displayName: "Product Requests",
            route: "/user/product-requests",
            name: "open-requests",
            icon: "Truck",
          },
        ],
      });
    }

    // Add common items for all user types
    sidebarItems.push(
      // {
      //   displayName: "Settings",
      //   route: "/user/settings",
      //   name: "settings",
      //   icon: "Settings",
      //   subItems: [],
      // },
      // {
      //   displayName: "Privacy Policy",
      //   route: "/privacy-policy",
      //   name: "privacyPolicy",
      //   icon: "ShieldCheck",
      //   subItems: [],
      // },
      // {
      //   displayName: "Terms & Conditions",
      //   route: "/terms-and-Condition",
      //   name: "termsAndCondition",
      //   icon: "FileText",
      //   subItems: [],
      // },
      // {
      //   displayName: "Dashboard",
      //   route: "/user/dashboard",
      //   name: "dashboard",
      //   icon: "LayoutDashboard",
      //   subItems: [],
      // },
      // {
      //   displayName: "Notifications",
      //   route: "/user/notifications",
      //   name: "notifications",
      //   icon: "Bell",
      //   subItems: [],
      // },
      // {
      //   displayName: "Help & Support",
      //   route: "/user/support",
      //   name: "support",
      //   icon: "HelpCircle",
      //   subItems: [],
      // }
    );

    return sidebarItems;
  };

  // Process and use fallback data only - no API dependency
  const displaySidebarList: SidebarItem[] = getFallbackSidebarList(user?.user_type);

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = iconMap[iconName] || User; // Default to User icon if not found
    return <IconComponent className={`w-5 h-5 ${className}`} />;
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  const hasActiveSubItem = (subItems: SidebarSubItem[] = []) => {
    return subItems.some((subItem) => isActiveRoute(subItem.route));
  };

  // Debug logging
  console.log("Sidebar debug:", {
    user: !!user,
    userDetails: user ? { firstName: user.firstName, email: user.email, user_type: user.user_type } : null,
    isInitialized,
    hasToken: !!Cookies.get("token"),
    tokenValue: Cookies.get("token")?.substring(0, 10) + "...",
    fallbackUserType: user?.user_type || "unknown",
    sidebarItemsCount: displaySidebarList.length
  });
  return (
    <div className="h-full w-full bg-white border-r border-gray-200 flex flex-col overflow-hidden">
      {/* User Profile Header */}
      <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <User className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-base truncate">
              {user?.firstName && user?.lastName
                ? `${user.firstName} ${user.lastName}`
                : user?.firstName || user?.lastName || "User"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700 capitalize">
                {user?.user_type || "Member"}
              </span>
              <div
                className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse flex-shrink-0"
                title="Online"
              ></div>
            </div>
          </div>
        </div>

        {/* Additional User Info */}
        {user?.email && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 truncate" title={user.email}>
              {user.email}
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-2">
        <nav className="space-y-1 px-3 min-w-0">
          {displaySidebarList?.map((item) => {
              const isActive = isActiveRoute(item.route);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isExpanded = expandedItems.has(item.displayName);
              const hasActiveChild = hasActiveSubItem(item.subItems);
              const showAsActive = isActive || hasActiveChild;

              return (
                <div key={item.name || item.displayName} className="space-y-1 min-w-0">
                  {/* Main item */}
                  <div
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-200 group min-w-0
                      ${
                        showAsActive
                          ? "bg-emerald-50 text-emerald-700 border-l-3 border-emerald-600"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
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
                      className={`flex-shrink-0 ${
                        showAsActive
                          ? "text-emerald-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      }`}
                    >
                      {renderIcon(item.icon)}
                    </div>

                    {/* Label */}
                    <span className="flex-1 font-medium text-sm truncate min-w-0">
                      {item.displayName}
                    </span>

                    {/* Expand/Collapse icon for items with subItems */}
                    {hasSubItems && (
                      <div className="flex-shrink-0">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-4 space-y-1 pr-2 min-w-0">
                      {item.subItems?.map((subItem: SidebarSubItem) => {
                        const isSubActive = isActiveRoute(subItem.route);

                        return (
                          <div
                            key={subItem.name || subItem.displayName}
                            className={`
                              flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer transition-colors duration-200 min-w-0
                              ${
                                isSubActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }
                            `}
                            onClick={() => router.push(subItem.route)}
                          >
                            {/* Sub item icon */}
                            <div
                              className={`flex-shrink-0 ${
                                isSubActive
                                  ? "text-emerald-600"
                                  : "text-gray-400"
                              }`}
                            >
                              {renderIcon(subItem.icon, "w-4 h-4")}
                            </div>

                            {/* Sub item label */}
                            <span className="text-sm font-medium truncate min-w-0">
                              {subItem.displayName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>                );
              })
            }
        </nav>
      </div>

      {/* Logout Button */}
      <div className="flex-shrink-0 p-3 border-t border-gray-100">        
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2.5 h-auto min-w-0"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="font-medium text-sm truncate">Sign Out</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
