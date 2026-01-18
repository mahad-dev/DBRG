import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { getDashboardNotifications } from "@/services/dashboardApi";
import { Loader2 } from "lucide-react";
import type { Notification } from "@/types/notification";

export default function NotificationList() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getDashboardNotifications({
          PageNumber: 1,
          PageSize: 3, // Show only 3 notifications on dashboard
        });

        if (response.status && response.data) {
          setNotifications(response.data);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getTimeAgo = (dateString: string) => {
    try {
      let dateStr = dateString;
      if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('T')) {
        dateStr = dateStr + 'Z';
      } else if (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
        dateStr = dateStr + 'Z';
      }

      const utcDate = new Date(dateStr);
      const now = new Date();
      const diffInMs = now.getTime() - utcDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);

      if (diffInMinutes < 0) return "Just now";
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes} m Ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours} h Ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays} d Ago`;

      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths} mo Ago`;
    } catch (error) {
      return "NaN Ago";
    }
  };

  return (
    <Card className="bg-[#FFFFFF26] border-none rounded-2xl p-5">
      {/* Title */}
      <h3
        className="
          text-[25px] 
          font-medium 
          text-[#C6A95F] 
          leading-none 
          mb-6
        "
        style={{ letterSpacing: "-1%" }}
      >
        Notification
      </h3>

      {/* List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 text-[#C6A95F] animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-white/70 text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <div key={notification.id} className="w-full">

              {/* Notification Box */}
              <div className="bg-[#FAFAFA] rounded-[10px] px-5 py-3 flex items-center justify-between gap-3 shadow-sm overflow-hidden">

                {/* Left Profile + Text */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <img
                    src={
                      notification.senderImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        notification.senderName || notification.title
                      )}&background=C6A95F&color=000`
                    }
                    width={42}
                    height={42}
                    className="rounded-full shrink-0"
                    alt="profile"
                  />

                  <div className="flex flex-col min-w-0 flex-1 overflow-hidden">
                    <p
                      className="
                        font-semibold
                        text-[14px]
                        leading-[150%]
                        text-[#141522]
                        line-clamp-2
                      "
                      style={{ letterSpacing: "-2%" }}
                    >
                      {notification.title}
                    </p>

                    <p
                      className="
                        text-[12px]
                        leading-tight
                        text-[#141522]
                        opacity-80
                        font-normal
                        font-[Plus Jakarta Sans]
                        line-clamp-1
                      "
                      style={{ letterSpacing: "-1%" }}
                    >
                      {notification.message.replace(/<[^>]*>/g, '').substring(0, 50)}...
                    </p>
                  </div>
                </div>

                {/* Right Side — Time + Status Dot */}
                <div className="flex flex-col items-center gap-2 shrink-0">
                  <p
                    className="
                      text-[12px]
                      font-normal
                      text-[#8E92BC]
                      leading-none
                      whitespace-nowrap
                    "
                    style={{ letterSpacing: "-1%" }}
                  >
                    {getTimeAgo(notification.createdDate || notification.createdAt || "")}
                  </p>

                  {/* Show red dot only if unread */}
                  {!notification.isRead && (
                    <div className="w-2 h-2 rounded-full bg-[#DB5962]" />
                  )}
                </div>
              </div>

              {/* Divider Line */}
              {index < notifications.length - 1 && (
                <div className="w-full h-px bg-[#787878] mt-5"></div>
              )}
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
