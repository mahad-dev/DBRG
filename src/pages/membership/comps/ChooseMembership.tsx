const features = [
  {
    icon: "/icons/award.svg",
    text: "A trusted network of industry leaders",
  },
  {
    icon: "/icons/linechart.svg",
    text: "Cutting-edge industry insights",
  },
  {
    icon: "/icons/crown.svg",
    text: "Exclusive access to events and reports",
  },
  {
    icon: "/icons/share2.svg",
    text: "A platform for global collaboration and growth",
  },
];

export default function ChooseMembership() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 sm:px-12 md:px-16 lg:px-24 py-16 sm:py-20 md:py-24">
      {/* Title */}
      <h2 className="font-['DM_Serif_Display'] text-4xl sm:text-5xl md:text-[52px] leading-snug sm:leading-tight text-[#C6A95F] mb-6 text-center md:text-left">
        Why Choose DBRG Membership?
      </h2>

      {/* Subtitle */}
      <p className="font-gilory-medium text-base sm:text-lg md:text-[24px] leading-relaxed sm:leading-[1.4] max-w-3xl md:max-w-7xl mb-12 text-center md:text-left mx-auto md:mx-0">
        DBRG is committed to supporting its members through valuable resources, educational
        opportunities, and an active network. When you join DBRG, you gain access to:
      </p>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16 text-center lg:text-left">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center gap-2">
            <img
              src={feature.icon}
              alt={`Feature ${index + 1}`}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
            />
            <p className="font-gilory-semibold text-center text-base sm:text-lg md:text-[22px] leading-[130%] max-w-[260px]">
              {feature.text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
