import { useState } from "react";
import NotificationList from "./comps/NotificationList";
import Notification from "./comps/Notification";
import type { Notification as NotificationType } from "@/types/notification";

export default function Notifications() {
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);

  const handleSelectNotification = (notification: NotificationType) => {
    setSelectedNotification(notification);
  };

  return (
    <div className="w-full min-h-screen px-2 sm:px-4 md:px-6 lg:px-8 py-4">
      <h1 className="text-[32px] sm:text-[36px] md:text-[38px] font-inter mb-4 font-semibold leading-tight sm:leading-snug text-[#C6A95F]">
        Notifications
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Notification List */}
        <div className="md:col-span-4 w-full">
          <NotificationList
            onSelectNotification={handleSelectNotification}
          />
        </div>

        {/* Selected Notification */}
        <div className="md:col-span-8 w-full">
          <Notification notification={selectedNotification} />
        </div>
      </div>
    </div>
  );
}
