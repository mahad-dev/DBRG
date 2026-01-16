import { Card } from "@/components/ui/card";

export default function NotificationList() {
  const items = [
    {
      id: 1,
      image: "/static/UserImg.png",
      title: "Alpha Corp",
      message: "Your request has been approved.",
      time: "1 m Ago",
      unread: true,
    },
    {
      id: 2,
      image: "/static/UserImg.png",
      title: "Tech Vision",
      message: "New event update available.",
      time: "5 m Ago",
      unread: false,
    },
    {
      id: 3,
      image: "/static/UserImg.png",
      title: "Global Expo",
      message: "Your ticket is ready.",
      time: "10 m Ago",
      unread: true,
    },
  ];

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
        {items.map((item, index) => (
          <div key={item.id} className="w-full">
            
            {/* Notification Box */}
            <div className="bg-[#FAFAFA] rounded-[10px] px-5 py-3 flex items-center justify-between gap-3 shadow-sm">
              
              {/* Left Profile + Text */}
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  width={42}
                  height={42}
                  className="rounded-full"
                  alt="profile"
                />

                <div className="flex flex-col min-w-0 flex-1">
                  <p
                    className="
                      font-semibold
                      text-[14px]
                      leading-[150%]
                      text-[#141522]
                      truncate
                    "
                    style={{ letterSpacing: "-2%" }}
                  >
                    {item.title}
                  </p>

                  <p
                    className="
                      text-[12px]
                      leading-none
                      text-[#141522]
                      opacity-80
                      font-normal
                      font-[Plus Jakarta Sans]
                      truncate
                    "
                    style={{ letterSpacing: "-1%" }}
                  >
                    {item.message}
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
                  {item.time}
                </p>

                {/* Show red dot only if unread */}
                {item.unread && (
                  <div className="w-2 h-2 rounded-full bg-[#DB5962]" />
                )}
              </div>
            </div>

            {/* Divider Line */}
            {index < items.length - 1 && (
              <div className="w-full h-px bg-[#787878] mt-5"></div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
