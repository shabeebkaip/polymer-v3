import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {FALLBACK_USER_AVATAR} from "@/lib/fallbackImages";
import {Button} from "@/components/ui/button";
import React from "react";
import {useUserInfo} from "@/lib/useUserInfo";
import  { usePathname} from "next/navigation";
import { userPopoverType } from "@/types/header";



const UserPopover: React.FC<userPopoverType> = ({isUserPopoverOpen, setIsUserPopoverOpen, navOptions, handleLogout, handleNavigate}) => {
    const {user} = useUserInfo();
    const pathname = usePathname();

    return (
        <Popover
            open={isUserPopoverOpen}
            onOpenChange={setIsUserPopoverOpen}
        >
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="md:flex hidden items-center gap-3 px-4 py-2.5 border border-green-200 text-gray-700 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                    <div
                        className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center text-white font-medium text-sm">
                        {user?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <span className="font-medium">Hello {user?.firstName}</span>
                    <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0 bg-white border-0 shadow-xl rounded-xl overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                    <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12 border-2 border-white/20">
                            <AvatarImage
                                src={
                                    typeof user?.company_logo === "string"
                                        ? user.company_logo
                                        : FALLBACK_USER_AVATAR
                                }
                                alt="User Avatar"
                            />
                            <AvatarFallback className="bg-white/20 text-white font-semibold">
                                {user?.firstName?.charAt(0)?.toUpperCase() || ""}
                                {user?.lastName?.charAt(0)?.toUpperCase() || ""}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="font-semibold">
                                {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-green-100 text-sm">
                                {user?.email}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="p-2">
                    {navOptions.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => handleNavigate(item.href)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-left ${
                                pathname === item.href
                                    ? "bg-green-50 text-[var(--green-main)] font-medium"
                                    : "text-gray-700 hover:bg-gray-50 hover:text-[var(--green-main)]"
                            }`}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <span className="mr-2">🚪</span>
                            Logout
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default UserPopover;