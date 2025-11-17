import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NewsDBRG() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-8 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h2 className="font-['DM_Serif_Display'] font-normal text-4xl sm:text-5xl md:text-[62px] leading-tight text-[#C6A95F] mb-12 text-center md:text-left">
          News
        </h2>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* LEFT — Big Video */}
          <div className="relative rounded-xl overflow-hidden bg-[#d3d3d3]/30 aspect-video flex items-center justify-center border border-white/10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white flex items-center justify-center">
              <Play className="w-9 h-9 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>

          {/* RIGHT — Grid of 4 Equal Boxes (2×2) */}
          <div className="grid grid-rows-2 grid-cols-2 gap-6 h-full">
            {[
              { img: "/static/News1.jpg", title: "Title", desc: "Description" },
              { img: "/static/News1.jpg", title: "Title", desc: "Description" },
              { img: "/static/News2.jpg", title: "Title", desc: "Description" },
              { img: "/static/News2.jpg", title: "Title", desc: "Description" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row gap-4 items-center h-full"
              >
                <div className="w-full sm:w-56 h-40 sm:h-40 rounded-md overflow-hidden border border-white/10 bg-[#333] shrink-0">
                  <img
                    src={item.img}
                    className="w-full h-full object-cover"
                    alt={`news-${idx + 1}`}
                  />
                </div>
                <div className="flex flex-col justify-center text-center sm:text-left">
                  <p className="font-semibold text-lg sm:text-xl leading-tight">
                    {item.title}
                  </p>
                  <p className="text-gray-300 text-sm sm:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12 md:mt-16">
          <Button
            variant={"site_btn"}
            className="w-[123px] sm:w-[140px] h-[52px] sm:h-14 rounded-[10px] px-4 py-2 text-base sm:text-lg"
          >
            Read More
          </Button>
        </div>
      </div>
    </section>
  );
}
