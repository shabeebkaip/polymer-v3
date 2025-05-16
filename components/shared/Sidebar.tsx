"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { UserRound, ClipboardList, BookCopy } from "lucide-react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";
import path from "path";
import { useUserInfo } from "@/lib/useUserInfo";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUserInfo();
  console.log("user", user);
  const sidebarList = [
    {
      name: "Profile",
      user: "all",
      icon: (
        <UserRound
          className={`${
            pathname.includes("/user/profile")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
          }`}
        />
      ),
      path: "/user/profile",
      items: [],
    },
    {
      name: "Sample Requests",
      path: "/user/sample-requests",
      user: "buyer",
      icon: (
        <ClipboardList
          className={`${
            pathname.includes("/user/sample-requests")
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
          className={` ${
            pathname.includes("/user/quote-requests")
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
          className={` ${
            pathname.includes("/user/products")
              ? "text-[var(--green-main)]"
              : "text-[#A8A8A8]"
          }`}
        />
      ),
    },
  ];
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    router.refresh();
    router.push("/");
  };
  const filteredSidebarList = sidebarList.filter(
    (item) => item?.user === user?.user_type || item?.user === "all"
  );
  return (
    <div className="border-r border-gray-300 ">
      <h4 className="font-medium text-sm sm:text-lg lg:text-[50px] text-[var(--dark-main)]">
        My Account
      </h4>
      <div className="flex flex-col mt-10 gap-4">
        {filteredSidebarList?.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-4 cursor-pointer text-sm lg:text-base"
            onClick={() => router.push(item.path)}
          >
            {item?.icon}
            <p
              className={`${
                pathname.includes(item?.path)
                  ? "text-[var(--green-main)]"
                  : "text-[#A8A8A8]"
              } text-sm lg:text-base`}
            >
              {item.name}
            </p>
          </div>
        ))}
      </div>
      
      <div className="p-4 flex items-center justify-start gap-2 ">
        <Button
          variant={"outline"}
          className="cursor-pointer"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
