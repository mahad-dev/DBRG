import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Notification as NotificationType } from "@/types/notification";

interface NotificationProps {
  notification: NotificationType | null;
}

export default function Notification({ notification }: NotificationProps) {
  // Show empty state if no notification selected
  if (!notification) {
    return (
      <div className="border border-white/30 rounded-[15px] p-4 sm:p-6 max-w-full flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <p className="text-white text-center text-sm sm:text-base">
          Select a notification to view details
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/30 rounded-[15px] p-3 sm:p-4 max-w-full">
      {/* Header Card */}
      <Card className="w-full p-3 sm:p-4 bg-[#FFFFFF] text-black rounded-[15px]">
        <CardContent className="flex items-center gap-2 sm:gap-3 p-0">
          <img
            src={
              notification.senderImage ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                notification.senderName || "System"
              )}&background=C9A85D&color=000`
            }
            className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover shrink-0"
            alt="avatar"
          />

          <p className="font-semibold font-inter text-[14px] sm:text-[16px] leading-[150%] tracking-[-0.02em] text-[#141522]">
            {notification.title}
          </p>
        </CardContent>
      </Card>

      {/* Notification Text */}
      <div className="bg-white/15 text-white mt-3 sm:mt-4 p-3 sm:p-4 font-normal text-[14px] sm:text-[16px] leading-[1.5] tracking-normal whitespace-pre-wrap rounded-lg">
        {notification.message}
      </div>

      {/* Buttons - Disabled for now, will be implemented in Phase 2 */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4 sm:mt-6 w-full">
        <Button
          variant={"site_btn"}
          className="cursor-not-allowed w-full sm:w-auto sm:min-w-[110px] h-[37px] rounded-[10px] px-4 py-2.5 font-inter font-normal text-sm leading-none text-center opacity-50"
          disabled
        >
          Mark as Read
        </Button>

        <Button
          className="cursor-not-allowed w-full sm:w-auto sm:min-w-[110px] h-[37px] bg-white text-black rounded-[10px] px-4 py-2.5 font-inter font-normal text-sm leading-none text-center opacity-50"
          disabled
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
