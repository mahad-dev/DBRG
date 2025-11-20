export default function MembershipFramework() {
  const principles = [
    {
      id: 1,
      icon: "/icons/Confidentiality.svg",
      title: "Confidentiality",
      desc: "All applicant information is handled with the highest degree of confidentiality. Only key compliance indicators as in the application form are escalated to the Board.",
    },
    {
      id: 2,
      icon: "/icons/Governance.svg",
      title: "Governance",
      desc: "The Board is the final approving authority, while the DBRG Office is tasked with execution, documentation, and preliminary vetting.",
    },
    {
      id: 3,
      icon: "/icons/Integrity.svg",
      title: "Integrity",
      desc: "A transparent and consistent process ensures alignment with DBRG's mission, values, and AML/CFT principles.",
    },
    {
      id: 4,
      icon: "/icons/DueDiligence.svg",
      title: "Due Diligence",
      desc: "In accordance with UAE AML / CFT rules.",
    },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-16 lg:px-24 py-12 sm:py-16 md:py-20 lg:py-24">
      {/* Title */}
      <h2 className="font-['DM_Serif_Display'] text-[36px] sm:text-[44px] md:text-[52px] leading-[130%] text-[#C6A95F] mb-6 max-w-3xl">
        DBRG Membership Application & Approval Framework
      </h2>

      {/* Subtitle */}
      <p className="font-gilroy-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[130%] max-w-2xl mb-8">
        Ensuring integrity, confidentiality, and governance in line with international best practices
      </p>

      {/* Overview */}
      <div className="mb-16 max-w-6xl">
        <h3 className="font-gilroy font-bold text-[28px] sm:text-[32px] leading-[1.4] mb-4">Overview</h3>
        <p className="font-gilroy font-normal text-[16px] sm:text-[18px] md:text-[22px] leading-[1.2]">
          The Dubai Business Group for Bullion and Gold Refinery (DBRG) is committed to maintaining a
          credible, transparent, and secure membership approval process. In line with global
          standards, the process balances strict due diligence, member confidentiality, and
          independent oversight committee, ensuring that only eligible and reputable entities are
          admitted.
        </p>
      </div>

      {/* Core Principles */}
      <h3 className="font-gilroy font-bold text-[28px] sm:text-[32px] md:text-[36px] leading-[1.4] mb-12">
        Core Principles
      </h3>

      {/* Principles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-12 md:gap-16">
        {principles.map((item) => (
          <div key={item.id} className="flex items-start gap-4">
            {/* Icon */}
            <img
              src={item.icon}
              alt={item.title}
              className="w-14 h-14 sm:w-16 sm:h-16 shrink-0"
            />

            {/* Text */}
            <div className="font-gilroy-medium font-normal text-[18px] sm:text-[22px] leading-[1.2]">
              <span className="font-gilroy font-bold text-[18px] sm:text-[20px] leading-[1.2]">
                {item.title} : {" "}
              </span>
                {item.desc}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Image */}
      <div className="mt-16 sm:mt-20 md:mt-24">
        <img
          src="/static/member-framework.png"
          alt="DBRG Visual"
          className="w-full h-auto object-cover rounded-xl"
        />
      </div>
    </section>
  );
}
