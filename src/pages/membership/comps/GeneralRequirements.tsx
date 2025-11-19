export default function GeneralRequirements() {
  const requirements = [
    "✅ Annual Membership Fees: Members to pay a yearly fee, as determined by DBRG’s membership structure.",
    "✅ Due Diligence Approval: Subject to DBRG’s internal review and verification process.",
    "✅ Sponsorship of Application: Any member needs to have a letter of reference from a Principal Member / Member Bank.",
    "✅ Compliance with DBRG Guidelines: All members must adhere to the organization’s professional and ethical standards."
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-16 py-16 sm:py-20">
      {/* Title */}
     <h2 className="font-['DM_Serif_Display'] text-[#C6A95F] text-[42px] md:text-[48px] leading-[110%] mb-12 uppercase"> General Requirements for All Members: </h2>
      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[18px] sm:text-[24px] leading-[160%] font-gilory-medium">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-start gap-4">
            <p className="font-gilory-medium">{req}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
