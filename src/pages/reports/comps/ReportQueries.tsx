"use client";

const reportPoints = [
  {
    title: "Industry-Leading Content:",
    text: "Our publications and resources are authored by experts with deep industry knowledge and experience.",
  },
  {
    title: "Stay Informed:",
    text: "Keep your business updated with the latest market data, trends, and regulatory changes.",
  },
  {
    title: "Ensure Compliance:",
    text: "Our regulatory notices and guidelines help you stay compliant with local and international laws.",
  },
  {
    title: "Enhance Business Strategy:",
    text: "Use our whitepapers and reports to make informed business decisions and stay competitive.",
  },
];

export default function ReportQueries() {
  return (
    <section className="w-full bg-[#0F0F0F] text-white px-4 sm:px-6 md:px-12 py-12 md:py-16 font-gilroy">
      
      {/* HEADINGS */}
      <div className="max-w-7xl mx-auto text-center md:text-left mb-8 space-y-2">
        <h3 className="font-[DM_Serif_Display] text-[28px] sm:text-[36px] md:text-[42px] leading-[100%] text-[#C6A95F]">
          Why Use Our
        </h3>

        <h1 className="font-[DM_Serif_Display] text-[36px] sm:text-[52px] md:text-[62px] leading-[100%] text-[#C6A95F]">
          Reports, Publications, and Resources?
        </h1>
      </div>

      {/* CONTENT GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start md:items-center">
        
        {/* LEFT TEXT SECTION */}
        <div className="space-y-6">
          {reportPoints.map((item, index) => (
            <p key={index} className="text-[18px] sm:text-[20px] md:text-[23px] leading-[1.6]">
              <span className="font-bold text-white">{item.title}</span> {item.text}
            </p>
          ))}
        </div>

        {/* RIGHT IMAGE */}
        <div className="w-full flex justify-center md:justify-end">
          <div className="w-full max-w-[573px] h-[300px] sm:h-[400px] md:h-[457px] rounded-[15px] overflow-hidden shadow-lg">
            <img
              src="/static/reportQuery.jpg"
              alt="Reports and Publications"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

      </div>
    </section>
  );
}
