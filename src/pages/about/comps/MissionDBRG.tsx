export default function MissionDBRG() {
  return (
    <section className="relative w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-12 lg:px-16 py-16 sm:py-20 md:py-24 font-gilory-medium">

      {/* Top Description */}
      <div className="max-w-5xl mx-auto text-center text-[18px] sm:text-[20px] md:text-[22px] leading-[1.6] mb-16 md:mb-24">
        <p className="mb-6">
          Dubai Business Group for Bullion & Gold Refinery (DBRG) is a premier
          organization established to represent and promote the bullion and gold
          refining industry in Dubai. As an influential body in the precious
          metals sector, DBRG acts as a catalyst for excellence, fostering
          innovation, transparency, and collaboration.
        </p>

        <p>
          We connect businesses, professionals, and organizations, building an
          ecosystem where growth and sustainability are paramount. Our
          commitment to upholding the highest standards ensures that DBRG
          continues to lead and shape the future of the gold refining industry.
        </p>
      </div>

      {/* Mission + Vision */}
      <div className="space-y-16 sm:space-y-20 max-w-7xl mx-auto">

        {/* Mission */}
        <div className="flex flex-col md:flex-row items-start md:items-start gap-6 sm:gap-10 md:gap-14">
          
          {/* LEFT COLUMN */}
          <div className="w-full md:w-[200px] lg:w-60 shrink-0 text-center md:text-left">
            <h2 className="text-[#C6A95F] font-[Inter] font-bold text-4xl sm:text-5xl md:text-6xl leading-tight">
              Our <br /> Mission
            </h2>
          </div>

          {/* RIGHT COLUMN */}
          <p className="text-[18px] sm:text-[20px] md:text-[22px] leading-[1.6] max-w-4xl">
            At DBRG, our mission is to empower businesses in the precious metals
            industry by providing them with a robust platform for networking,
            collaboration, and growth. We aim to set the global standard for
            refining and bullion practices, ensuring compliance with regulatory
            frameworks and promoting ethical business conduct across the sector.
            DBRG is committed to supporting its members with the resources,
            insights, and connections they need to succeed in a dynamic and
            evolving industry.
          </p>
        </div>

        {/* Vision */}
        <div className="flex flex-col md:flex-row items-start md:items-start gap-6 sm:gap-10 md:gap-14">
          
          {/* LEFT COLUMN */}
          <div className="w-full md:w-[200px] lg:w-60 shrink-0 text-center md:text-left">
            <h2 className="text-[#C6A95F] font-[Inter] font-bold text-4xl sm:text-5xl md:text-6xl leading-tight">
              Our <br /> Vision
            </h2>
          </div>

          {/* RIGHT COLUMN */}
          <p className="text-[18px] sm:text-[20px] md:text-[22px] leading-[1.6] max-w-4xl">
            Our vision is to create a world-class network that sets Dubai at the
            heart of the global gold refining and bullion trade. We envision a
            collaborative environment where businesses of all sizes come
            together to share knowledge, adopt industry innovations, and
            maintain the highest levels of integrity, transparency, and
            sustainability. DBRG will continue to be the gold standard for
            ethical and responsible business practices in the precious metals
            industry.
          </p>
        </div>
      </div>

      {/* Chairman Section */}
      <div className="max-w-7xl mx-auto mt-20 md:mt-24 px-2 sm:px-0">
        
        <h2 className="text-[#C6A95F] font-['DM_Serif_Display'] text-4xl sm:text-5xl md:text-[60px] tracking-tight leading-none mb-8 md:mb-12 text-center md:text-left">
          Chairman’s Message
        </h2>

        <p className="text-[18px] sm:text-[20px] md:text-[22px] leading-[1.6] mb-12 md:mb-14 text-center md:text-left ">
          As Chairman of DBRG, I am proud to lead an organization that plays a pivotal
          role in shaping the future of the bullion and gold refining industry. DBRG
          represents a powerful network of businesses and professionals who share a
          common goal: advancing the standards of the industry and contributing to
          Dubai’s position as a global leader in the precious metals sector. We are
          committed to building a transparent, compliant, and sustainable platform
          that supports our members' growth and success. – [Chairman Name], Chairman
          of DBRG
        </p>

        {/* Chairman Image */}
        <div
          className="w-full h-60 sm:h-[300px] md:h-[380px] lg:h-[420px] bg-center bg-cover bg-no-repeat rounded-xl"
          style={{
            backgroundImage: "url('/static/chairman.jpg')",
          }}
        ></div>
      </div>

      {/* Bottom Gold Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
    </section>
  );
}
