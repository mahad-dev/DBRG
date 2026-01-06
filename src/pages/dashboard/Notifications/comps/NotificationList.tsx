import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function NotificationList() {
  const items = [
    {
      id: 1,
      image: "https://i.pravatar.cc/50?img=1",
      title: "Company Name",
      message: "Lorem ipsum dolor consectetur...",
      time: "1m Ago",
      unread: true,
    },
    {
      id: 2,
      image: "https://i.pravatar.cc/50?img=2",
      title: "Another Company",
      message: "Sed do eiusmod tempor...",
      time: "5m Ago",
      unread: false,
    },
  ];

  return (
    <div className="bg-[#FFFFFF26] rounded-xl p-4 w-full h-full flex flex-col">
      {/* Search Input */}
      <div className="relative mb-4">
        <Input
          placeholder="Search Name"
          className="bg-[#FFFFFF26] text-white placeholder:text-white border-none 
                     rounded-[10px] py-3.5 px-7 font-gilroy font-semibold text-[16px] 
                     leading-[100%] tracking-[-0.01em]"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white" />
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 sm:gap-6 scrollbar-thin scrollbar-thumb-[#8E92BC]/40 scrollbar-track-transparent">
        {items.map((item, index) => (
          <div key={item.id} className="w-full">
            {/* Notification Box */}
            <Card className="bg-[#FAFAFA] p-0 rounded-[10px] shadow-sm w-full">
              <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-5 py-3 sm:py-3.5">
                {/* Left: Profile + Text */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={item.image}
                    width={42}
                    height={42}
                    className="rounded-full flex-shrink-0"
                    alt="profile"
                  />
                  <div className="flex flex-col min-w-0">
                    <p
                      className="font-semibold text-[13px] sm:text-[14px] leading-[150%] text-[#141522] truncate"
                      style={{ letterSpacing: "-2%" }}
                    >
                      {item.title}
                    </p>
                    <p
                      className="text-[11px] sm:text-[12px] leading-none text-[#141522] opacity-80 font-normal font-[Plus Jakarta Sans] truncate"
                      style={{ letterSpacing: "-1%" }}
                    >
                      {item.message}
                    </p>
                  </div>
                </div>

                {/* Right: Time + Status Dot */}
                <div className="flex flex-row sm:flex-col items-center sm:items-center gap-2 sm:gap-2 mt-2 sm:mt-0">
                  <p
                    className="text-[11px] sm:text-[12px] font-normal text-[#8E92BC] leading-none"
                    style={{ letterSpacing: "-1%" }}
                  >
                    {item.time}
                  </p>
                  {item.unread && (
                    <div className="w-2 h-2 rounded-full bg-[#DB5962] flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Divider */}
            {index < items.length - 1 && <div className="w-full h-px bg-[#787878] mt-4 sm:mt-5"></div>}
          </div>
        ))}
      </div>
    </div>
  );
}
