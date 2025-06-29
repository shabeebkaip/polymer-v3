"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { 
  UserRound, 
  ClipboardList, 
  BookCopy, 
  Package, 
  FileText, 
  DollarSign, 
  ShoppingCart, 
  Mail,
  ChevronDown,
  ChevronRight,
  LogOut,
  User,
  Settings
} from "lucide-react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import { useUserInfo } from "@/lib/useUserInfo";
import { useSharedState } from "@/stores/sharedStore";

// Icon mapping for dynamic icons
const iconMap: Record<string, React.ComponentType<any>> = {
  UserRound,
  ClipboardList,
  BookCopy,
  Package,
  FileText,
  DollarSign,
  ShoppingCart,
  Mail,
  User,
  Settings,
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
    setExpandedItems(prev => {
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
      user: "all",
      icon: "UserRound",
      route: "/user/profile",
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

  // Process and use API data when available
  let displaySidebarList: any[] = [];
  
  if (sidebarLoading) {
    // Show loading skeleton
    displaySidebarList = [];
  } else if (sidebarItems && sidebarItems.length > 0) {
    // Use API data - handle different possible API response structures
    displaySidebarList = sidebarItems.map((item: any) => ({
      ...item,
      // Ensure all required properties exist and handle different API structures
      displayName: item.displayName || item.name || "Unknown",
      route: item.route || item.path || "#",
      icon: item.icon || "UserRound",
      subItems: item.subItems || item.items || [],
      user: item.user || "all" // Default to show for all users if not specified
    }));
    
    // Filter by user type if needed (though API should handle this)
    if (user?.user_type) {
      displaySidebarList = displaySidebarList.filter(
        (item: any) => item.user === user.user_type || item.user === "all"
      );
    }
  } else {
    // Use fallback data filtered by user type
    displaySidebarList = fallbackSidebarList.filter(
      (item) => item?.user === user?.user_type || item?.user === "all"
    );
  }

  const renderIcon = (iconName: string, className: string = "") => {
    const IconComponent = iconMap[iconName] || UserRound;
    return <IconComponent className={`w-5 h-5 ${className}`} />;
  };

  const isActiveRoute = (route: string) => {
    return pathname === route || pathname.startsWith(route + "/");
  };

  const hasActiveSubItem = (subItems: any[] = []) => {
    return subItems.some(subItem => isActiveRoute(subItem.route));
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
            <p className="text-xs text-gray-500 capitalize">{user?.user_type}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4">
        <nav className="space-y-1">
          {sidebarLoading ? (
            // Loading skeleton
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center gap-3 p-3 animate-pulse">
                  <div className="w-5 h-5 bg-gray-200 rounded"></div>
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
                <div key={item.displayName} className="space-y-1">
                  {/* Main item */}
                  <div
                    className={`
                      flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 group
                      ${showAsActive 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
                    <div className={`
                      w-8 h-8 rounded-md flex items-center justify-center transition-colors
                      ${showAsActive 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100 group-hover:bg-gray-200'
                      }
                    `}>
                      {renderIcon(item.icon || "UserRound", 
                        showAsActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
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
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Sub items */}
                  {hasSubItems && isExpanded && (
                    <div className="ml-8 space-y-1 border-l-2 border-gray-100 pl-4">
                      {item.subItems?.map((subItem: any) => {
                        const isSubActive = isActiveRoute(subItem.route);
                        
                        return (
                          <div
                            key={subItem.displayName}
                            className={`
                              flex items-center gap-3 p-2 rounded-md cursor-pointer transition-all duration-200
                              ${isSubActive
                                ? 'bg-blue-50 text-blue-700'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                              }
                            `}
                            onClick={() => router.push(subItem.route)}
                          >
                            {/* Sub item icon */}
                            <div className={`
                              w-6 h-6 rounded flex items-center justify-center
                              ${isSubActive ? 'bg-blue-100' : 'bg-gray-100'}
                            `}>
                              {renderIcon(subItem.icon || "FileText", 
                                `w-3 h-3 ${isSubActive ? 'text-blue-600' : 'text-gray-400'}`
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
