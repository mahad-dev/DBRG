export default function GovernanceProtocol() {
  const protocols = [
    {
      id: 1,
      icon: "/icons/DBRGOffice.svg",
      title: "DBRG Office:",
      desc: "Will be an independent outfit",
    },
    {
      id: 2,
      icon: "/icons/ConfidentialityAgreement.svg",
      title: "Confidentiality Agreement:",
      desc: "DBRG staff handling applications will sign NDAs.",
    },
    {
      id: 3,
      icon: "/icons/FirewalledAccess.svg",
      title: "Firewalled Access:",
      desc: "The Board is not exposed to underlying KYC documents — only vetted summary information is presented.",
    },
    {
      id: 4,
      icon: "/icons/DataSecurity.svg",
      title: "Data Security:",
      desc: "All applications and KYC data are stored securely and accessible only to authorized compliance personnel.",
    },
    {
      id: 5,
      icon: "/icons/CommitteeIndependence.svg",
      title: "Committee Independence:",
      desc: "No member of the Board shall be involved in vetting applicants to avoid conflict of interest.",
    },
    {
      id: 6,
      icon: "/icons/AnnualReview.svg",
      title: "Annual Review:",
      desc: "Membership process is reviewed annually to ensure compliance with evolving regulations and industry standards.",
    },
  ];

  return (
    <section className="w-full bg-[#121212] text-white px-4 sm:px-6 md:px-16 py-12 sm:py-16">
      {/* Title */}
      <h2 className="font-gilroy font-bold text-[24px] sm:text-[28px] md:text-[34px] lg:text-[40px] xl:text-[44px] leading-tight mb-10 sm:mb-12 md:mb-14">
        Governance & Confidentiality Protocols
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-12 md:gap-16 lg:gap-20 max-w-7xl mx-auto">
        {protocols.map((item) => (
          <div key={item.id} className="flex items-start gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {/* Icon Image */}
            <img
              src={item.icon}
              alt={item.title}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16"
            />

            {/* Text */}
            <p className="font-gilroy-medium text-[14px] sm:text-[15px] md:text-[16px] lg:text-[18px] xl:text-[20px] leading-[120%] max-w-lg">
              <span className="font-gilroy font-semibold text-white">{item.title}</span> {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
