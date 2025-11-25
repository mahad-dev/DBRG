import { Card } from "@/components/ui/card";

export default function FollowDBRGMedia() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-12 py-16 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-['DM_Serif_Display'] text-[#C6A95F] mb-6">
          Why Follow DBRG in the Media?
        </h2>

        {/* Section Description */}
        <p className="font-gilory text-[20px] sm:text-[22px] md:text-[24px] leading-[1.3] max-w-6xl mb-12">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>

        {/* Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full items-start">
          {/* Left Image Placeholder */}
          <Card className="bg-[#d9d9d9] h-[250px] sm:h-[300px] md:h-[420px] rounded-xl w-full" />

          {/* Middle Image Placeholder */}
          <Card className="bg-[#d9d9d9] h-[250px] sm:h-[300px] md:h-[420px] rounded-xl w-full" />

          {/* Right Text Section */}
          <div className="space-y-6 font-gilory text-[18px] sm:text-[20px] md:text-[21px] leading-[1.4]">
            <p>
              <span className="font-bold text-[20px] sm:text-[21px] md:text-[22px]">Industry Leadership:</span> As a leading authority in the bullion and gold refining sector, DBRG is often cited in the media for our expertise, initiatives, and contributions.
            </p>
            <p>
              <span className="font-bold text-[20px] sm:text-[21px] md:text-[22px]">Insightful Coverage:</span> Our media mentions offer a unique perspective on how DBRG is influencing industry standards, regulations, and future trends.
            </p>
            <p>
              <span className="font-bold text-[20px] sm:text-[21px] md:text-[22px]">Transparent Communication:</span> By staying updated on DBRG's media coverage, you will gain valuable insights into our ongoing efforts to improve the industry and collaborate with other global organizations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
