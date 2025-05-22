"use client";
import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserRound, ClipboardList, BookCopy } from "lucide-react";
import Cookies from "js-cookie";
import { useUserInfo } from "@/lib/useUserInfo";

const MobileSettingsMenu = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUserInfo();

  const sidebarList = [
    {
      name: "Profile",
      user: "all",
      path: "/user/profile",
      icon: (
        <UserRound
          className={`${pathname.includes("/user/profile")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
    {
      name: "Sample Requests",
      path: "/user/sample-requests",
      user: "buyer",
      icon: (
        <ClipboardList
          className={`${pathname.includes("/user/sample-requests")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
    {
      name: "Quote Requests",
      path: "/user/quote-requests",
      user: "buyer",
      icon: (
        <BookCopy
          className={`${pathname.includes("/user/quote-requests")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
    {
      name: "Products",
      path: "/user/products",
      user: "seller",
      icon: (
        <BookCopy
          className={`${pathname.includes("/user/products")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
    {
      name: "Sample Enquiries",
      path: "/user/sample-enquiries",
      user: "seller",
      icon: (
        <ClipboardList
          className={`${pathname.includes("/user/sample-enquiries")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
    {
      name: "Quote Enquiries",
      path: "/user/quote-enquiries",
      user: "seller",
      icon: (
        <ClipboardList
          className={`${pathname.includes("/user/quote-enquiries")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
            }`}
        />
      ),
    },
  ];

  const filteredSidebarList = sidebarList.filter(
    (item) => item.user === user?.user_type || item.user === "all"
  );

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    router.refresh();
    router.push("/");
  };

  return (
    <div className="bg-gray-50 h-full w-full">
      <div className="bg-white rounded-lg shadow-sm mx-4 my-4">
        {filteredSidebarList.map((item, index) => (
          <div
            key={item.name}
            className={`flex items-center justify-between p-4 cursor-pointer ${index !== filteredSidebarList.length - 1 ? "border-b border-gray-100" : ""
              }`}
            onClick={() => router.push(item.path)}
          >
            <div className="flex items-center gap-3">
              {item.icon}
              <span className={`${pathname.includes(item?.path)
                  ? "text-[var(--green-main)]"
                  : "text-[#A8A8A8]"
                } text-sm lg:text-base`}>{item.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileSettingsMenu;
