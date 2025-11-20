import { Button } from "@/components/ui/button";

export default function WhyContactDBRG() {
  const items = [
    {
      title: "Get Membership Information:",
      desc: "Learn more about the benefits of becoming a DBRG member.",
    },
    {
      title: "Stay Updated on Events:",
      desc: "Ask about upcoming industry events, webinars, and networking opportunities.",
    },
    {
      title: "Request Industry Resources:",
      desc: "Inquire about our latest industry reports, whitepapers, and regulatory updates.",
    },
    {
      title: "General Inquiries:",
      desc: "Reach out to us for any other questions or assistance.",
    },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-24">
      {/* TITLE */}
      <h2
        className="text-[#C6A95F] mb-12 text-4xl sm:text-5xl md:text-[58px] font-normal leading-tight text-center md:text-left"
        style={{ fontFamily: "DM Serif Display" }}
      >
        Why Contact DBRG?
      </h2>

      <div className="mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-start">
        {/* LEFT GREY BOX */}
        {/* <div className="w-full h-64 sm:h-80 md:h-[420px] bg-[#d9d9d9] rounded-xl" /> */}

        {/* RIGHT CONTENT */}
        <div className="space-y-6 md:space-y-8">
          {items.map((item, index) => (
            <div key={index}>
              <p className="text-[16px] sm:text-[17px] md:text-[18px] text-white leading-snug">
                <span className="font-gilory font-bold text-[20px] sm:text-[21px] md:text-[22px] leading-[100%] text-white">
                  {item.title}{" "}
                </span>
                {item.desc}
              </p>
            </div>
          ))}

          {/* BUTTON */}
          <Button
            variant="site_btn"
            className="mt-4 w-[150px] sm:w-40 h-[52px] sm:h-14 rounded-[10px] px-4 py-2.5 flex items-center justify-center gap-2.5 text-[18px] sm:text-[20px] font-semibold text-center"
            style={{ fontFamily: "Inter", lineHeight: "100%" }}
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
