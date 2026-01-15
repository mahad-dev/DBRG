export default function GeneralRequirements() {
  const requirements = [
    "✅ Compliance & Ethics: Adhere to DBRG's Code of Conduct, AML/CFT regulations, and responsible sourcing practices.",
    "✅ Due Diligence & Approval: Subject to DBRG's internal review and verification process.",
    "✅ Annual Membership Fees: Members to pay a yearly fee, as determined by DBRG's membership structure.",
    "✅ Sponsorship of Application: Any member need to have letter of reference from a Principal Member / Member Bank."
  ];

  const fees = [
    { category: "Principal", application: "2,000", annual: "10,000" },
    { category: "Bank Member", application: "2,000", annual: "10,000" },
    { category: "Contributing", application: "2,000", annual: "15,000" },
    { category: "Affiliate", application: "2,000", annual: "5,000" },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-16 py-16 sm:py-20">
      {/* Title */}
     <h2 className="font-['DM_Serif_Display'] text-[#C6A95F] text-[42px] md:text-[48px] leading-[1.4] mb-12 uppercase"> General Requirements for All Members: </h2>
      {/* Requirements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 text-[18px] sm:text-[22px] leading-[1.4] font-gilory-medium mb-16">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-start gap-4">
            <p className="font-gilory-medium">{req}</p>
          </div>
        ))}
      </div>

      {/* Fees Table */}
      <h3 className="font-gilory-bold text-[28px] md:text-[32px] mb-8">Membership Fees</h3>
      <div className="overflow-x-auto">
        <table className="w-full max-w-3xl text-left border-collapse">
          <thead>
            <tr className="border-b border-[#C6A95F]">
              <th className="font-gilory-bold text-[18px] md:text-[20px] py-4 pr-8">Category</th>
              <th className="font-gilory-bold text-[18px] md:text-[20px] py-4 pr-8">Application Fees</th>
              <th className="font-gilory-bold text-[18px] md:text-[20px] py-4">Annual Membership Fees</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="font-gilory-medium text-[16px] md:text-[18px] py-4 pr-8">{fee.category}</td>
                <td className="font-gilory-medium text-[16px] md:text-[18px] py-4 pr-8">{fee.application}</td>
                <td className="font-gilory-medium text-[16px] md:text-[18px] py-4">{fee.annual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
