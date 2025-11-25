export default function DBRGEvents() {
  return (
    <div className="relative w-full text-white py-24 px-6 md:px-28 font-sans">
      {/* Title */}
      <h1
        className="font-[DM_Serif_Display] text-[#C6A95F] text-[62px] leading-none mb-20"
        style={{ fontWeight: 400 }}
      >
        Why Attend DBRG Events?
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-20 text-[22px] leading-[1.3] font-gilory relative">
        {/* Left Column */}
        <div>
          <p className="mb-16">
            <span className="text-white font-semibold">
              Stay Ahead of Industry Trends:
            </span>{" "}
            Our events provide you with cutting-edge insights into the latest
            market developments, regulatory changes, and innovations in the gold
            refining sector.
          </p>

          <p>
            <span className="text-white font-semibold">
              Gain Valuable Knowledge:
            </span>{" "}
            Learn from experts in the field through workshops, seminars, and
            presentations tailored to your needs.
          </p>
        </div>

        {/* Right Column */}
        <div>
          <p className="mb-16">
            <span className="text-white font-semibold">
              Networking Opportunities:
            </span>{" "}
            Connect with like-minded professionals, industry leaders, and
            regulators to expand your business network and discover new
            opportunities.
          </p>

          <p>
            <span className="text-white font-semibold">
              Access to Industry Resources:
            </span>{" "}
            Attendees gain access to event recordings, downloadable PDFs,
            presentations, and other valuable materials.
          </p>
        </div>

        {/* Vertical Divider */}
        <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#6A6A6A]" />

        {/* Horizontal Divider */}
        <div className="hidden md:block w-1/2 absolute left-1/4 right-0 top-1/2 h-px bg-[#6A6A6A]" />
      </div>
    </div>
  );
}
