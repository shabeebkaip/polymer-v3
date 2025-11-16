import { getUserNotifications } from "@/apiServices/user";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUserInfo } from "@/lib/useUserInfo";
import { UserNotification } from "@/types/notification";
import { Bell } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Notification = () => {
  const { loadUserFromCookies, user } = useUserInfo(); // ✅ must be at top
  const router = useRouter();
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] =
    useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);

  useEffect(() => {
    loadUserFromCookies(); // hydrate on mount
  }, [loadUserFromCookies]);

  useEffect(() => {
    // Only fetch notifications if user is logged in
    if (user) {
      getUserNotifications().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setNotifications(res.data);
        }
      }).catch((error) => {
        console.error('Error fetching notifications:', error);
      });
    } else {
      // Clear notifications when user logs out
      setNotifications([]);
    }
  }, [user]);
  return (
    <Popover
      open={isNotificationPopoverOpen}
      onOpenChange={setIsNotificationPopoverOpen}
    >
      <PopoverTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-full hover:bg-primary-50 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-6 h-6 text-primary-500" />
          {notifications.filter((n) => !n.isRead).length > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 z-50">
        <div className="p-4 border-b border-gray-100 bg-primary-50">
          <span className="font-semibold text-gray-900 text-base flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary-500" /> Notifications
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
          {notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No notifications
            </div>
          ) : (
            notifications.map((notif) => (
              <button
                key={notif._id}
                className={`w-full text-left px-4 py-3 hover:bg-primary-50 transition-colors flex flex-col gap-1 ${
                  notif.isRead ? "opacity-70" : ""
                }`}
                onClick={() => {
                  setIsNotificationPopoverOpen(false);
                  router.push(notif.redirectUrl || "/");
                }}
              >
                <span className="text-sm text-gray-900 font-medium">
                  {notif.message}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(notif.createdAt).toLocaleString()}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Notification;
