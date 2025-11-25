import { Card, CardContent } from "@/components/ui/card";

export default function DBRGMedia() {
  const mediaItems = [
    {
      image: "",
      title: "[Media Coverage Title]",
      source: "[Media Outlet]",
      text: "DBRG's role in advancing regulatory compliance within the bullion industry discussed in [Media Outlet].",
      type: "small",
    },
    {
      image: "/static/DBRGBitcoin.jpg",
      title: "[Media Coverage Title]",
      source: "[Media Outlet]",
      text: "DBRG featured as a key advocate for innovation and sustainability in the gold refining sector in [Media Outlet].",
      type: "large",
    },
    {
      image: "",
      title: "[Media Coverage Title]",
      source: "[Media Outlet]",
      text: "DBRG's recent conference on future trends in gold refining covered by [Media Outlet].",
      type: "small",
    },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 md:px-12 py-20 font-[Inter]">

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-['DM_Serif_Display'] text-[#C6A95F] mb-6">
          DBRG in the Media
        </h2>

        <p className="text-[18px] md:text-[22px] leading-[1.3] font-gilroy max-w-5xl mb-16">
          DBRG is frequently recognized and featured in top-tier media outlets, acknowledging
          our efforts and leadership in the bullion and gold refining industry. Our media
          mentions showcase DBRG’s influence, innovations, and thought leadership.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">

        {mediaItems.map((item, index) => (
          <Card
            key={index}
            className={`
              bg-transparent border-none shadow-none
              ${item.type === "large" ? "md:col-span-2" : "md:col-span-1"}
            `}
          >
            <CardContent className="p-0 relative">

              {/* LARGE CARD */}
              {item.type === "large" ? (
                <div className="relative w-full h-[380px] md:h-[420px] rounded-xl overflow-hidden">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt="Media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#d9d9d9]"></div>
                  )}

                  <div className="absolute bottom-0 left-0 p-6 bg-linear-to-t from-black/80 to-transparent w-full">
                    <p className="font-inter font-normal text-[20px] leading-[100%]">
                      {item.title}
                    </p>

                    <p className="text-[16px] leading-[100%] mt-2">
                      <span className="font-inter font-semibold text-white">Source:</span> {item.source}
                    </p>

                    <p className="font-inter font-normal text-[16px] leading-[140%] mt-3">
                      {item.text}
                    </p>
                  </div>
                </div>
              ) : (
                /* SMALL CARDS */
                <div className="w-full">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt="Media"
                      className="w-full h-[180px] md:h-[220px] object-cover rounded-xl"
                    />
                  ) : (
                    <div className="w-full h-[180px] md:h-[220px] bg-[#d9d9d9] rounded-xl"></div>
                  )}

                  <div className="py-5">
                    <p className="font-inter font-normal text-[20px] leading-[100%]">{item.title}</p>

                    <p className="text-[16px] mt-2 leading-[100%]">
                      <span className="font-inter font-semibold text-white">Source:</span> {item.source}
                    </p>

                    <p className="font-inter font-normal text-[16px] leading-[140%] mt-3">
                      {item.text}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

      </div>

      {/* FOOTER */}
      <div className="max-w-4xl mx-auto text-center mt-16">
        <p className="text-[18px] md:text-[22px] leading-[1.3] font-gilroy">
          DBRG’s media presence reflects our dedication to promoting best practices,
          supporting global standards, and contributing to the growth of the gold refining and
          bullion industry.
        </p>
      </div>

    </section>
  );
}
