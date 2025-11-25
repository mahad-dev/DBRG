import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Events() {
  const events = [
    {
      title: "Event",
      description:
        "Join us for an in-depth seminar on the latest advancements in gold refining technology. Learn from top experts with other professionals in the bullion industry.",
      date: "Date:",
      time: "Time:",
      alignment: "left",
    },
    {
      title: "Event",
      description:
        "Join us for an in-depth seminar on the latest advancements in gold refining technology. Learn from top experts with other professionals in the bullion industry.",
      date: "Date:",
      time: "Time:",
      alignment: "right",
    },
    {
      title: "Event",
      description:
        "Join us for an in-depth seminar on the latest advancements in gold refining technology. Learn from top experts with other professionals in the bullion industry.",
      date: "Date:",
      time: "Time:",
      alignment: "left",
    },
  ];

  return (
    <div className="w-full relative bg-[#121212] text-white py-16 px-6 md:px-20 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16 font-gilroy">
        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal">
          At Dubai Business Group for Bullion & Gold Refinery (DBRG), we host a
          wide range of events, seminars, conferences, and webinars aimed at
          providing valuable insights into the bullion and gold refining
          industry. These events bring together industry professionals, thought
          leaders, and businesses to share knowledge, network, and collaborate
          on innovative solutions.
        </p>

        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal mt-6 md:mt-8">
          Stay updated with our upcoming events and secure your spot at
          exclusive seminars and networking opportunities. Our events focus on
          industry trends, market analysis, regulatory updates, and much more.
        </p>
      </div>

      {/* Events Grid */}
      <div className="flex flex-col gap-12">
        {events.map((event, idx) => (
          <Card key={idx} className="border-none w-full">
            <CardContent
              className={`p-6 md:p-8 font-gilroy grid gap-6 items-stretch
                ${
                  event.alignment === "left"
                    ? "md:grid-cols-[40%_60%]"
                    : "md:grid-cols-[60%_40%]"
                }
              `}
            >
              {/* Image Left */}
              {event.alignment === "left" && (
                <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full" />
              )}

              {/* Content */}
              <div className="w-full flex flex-col justify-between font-gilroy max-w-2xl mx-auto">
                <div>
                  <h2 className="text-[28px] md:text-[34px] font-medium mb-2 md:mb-3 leading-tight">
                    {event.title}
                  </h2>

                  <p className="text-[18px] md:text-[24px] leading-[1.2] mb-4 md:mb-5">
                    {event.description}
                  </p>
                  <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4 md:gap-36">
                    <p className="text-[18px] md:text-[24px] ">{event.date}</p>
                    <p className="text-[18px] md:text-[24px] ">{event.time}</p>
                  </div>
                </div>

                <Button
                  variant="site_btn"
                  className="text-[16px] md:text-[20px] w-[120px] h-[52px] rounded-[10px] font-normal"
                >
                  Register
                </Button>
              </div>

              {/* Image Right */}
              {event.alignment === "right" && (
                <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

        {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 sm:h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
    </div>
  );
}
