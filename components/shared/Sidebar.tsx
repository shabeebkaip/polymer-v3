"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { UserRound, ClipboardList, BookCopy } from "lucide-react";
import { Button } from "../ui/button";
import Cookies from "js-cookie";

const Sidebar = () => {
  const pathname = usePathname();
  console.log(pathname);
  const router = useRouter();
  const sidebarList = [
    {
      name: "Profile",
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
  ];
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userInfo");
    router.refresh();
    router.push("/");
  };
  return (
    <div className="border-r border-gray-300 ">
      <h4 className="font-medium text-[50px] text-[var(--dark-main)]">
        My Account
      </h4>
      <div className="flex flex-col mt-10 gap-4">
        {sidebarList.map((item) => (
          <div
            key={item.name}
            className="flex items-center gap-4 cursor-pointer"
            onClick={() => router.push(item.path)}
          >
            {item?.icon}

            <p
              className={`${
                pathname.includes(item?.path)
                  ? "text-[var(--green-main)]"
                  : "text-[#A8A8A8]"
              } text-lg`}
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
