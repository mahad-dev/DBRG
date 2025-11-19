import { Shield, FileCheck, Search, Users } from "lucide-react";

export default function MembershipFramework() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 md:px-16 py-24">
      {/* Title */}
      <h2 className="font-['DM_Serif_Display'] text-[52px] leading-[100%] text-[#C6A95F] mb-6">
        DBRG Membership Application & Approval Framework
      </h2>

      {/* Subtitle */}
      <p className="font-['Gilroy-Medium'] text-[20px] leading-[150%] max-w-4xl mb-20 text-white/80">
        Ensuring integrity, confidentiality, and governance in line with international best practices
      </p>

      {/* Overview */}
      <div className="mb-20 max-w-5xl">
        <h3 className="font-['Gilroy-Bold'] text-[32px] mb-4">Overview</h3>
        <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] text-white/80">
          The Dubai Business Group for Bullion and Gold Refinery (DBRG) is committed to maintaining a
          credible, transparent, and secure membership approval process. In line with global
          standards, the process balances strict due diligence, member confidentiality, and
          independent oversight committee, ensuring that only eligible and reputable entities are
          admitted.
        </p>
      </div>

      {/* Core Principles */}
      <h3 className="font-['Gilroy-Bold'] text-[32px] mb-12">Core Principles</h3>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
        {/* Confidentiality */}
        <div className="flex flex-col gap-4">
          <Shield className="w-16 h-16 text-[#C6A95F]" />
          <p className="font-['Gilroy-Bold'] text-[20px]">Confidentiality</p>
          <p className="font-['Gilroy-Medium'] text-[16px] text-white/80 leading-[150%]">
            All applicant information is handled with the highest degree of confidentiality. Only key
            compliance indicators as in the application form are escalated to the Board.
          </p>
        </div>

        {/* Governance */}
        <div className="flex flex-col gap-4">
          <Users className="w-16 h-16 text-[#C6A95F]" />
          <p className="font-['Gilroy-Bold'] text-[20px]">Governance</p>
          <p className="font-['Gilroy-Medium'] text-[16px] text-white/80 leading-[150%]">
            The Board is the final approving authority, while the DBRG Office is tasked with execution,
            documentation, and preliminary vetting.
          </p>
        </div>

        {/* Integrity */}
        <div className="flex flex-col gap-4">
          <FileCheck className="w-16 h-16 text-[#C6A95F]" />
          <p className="font-['Gilroy-Bold'] text-[20px]">Integrity</p>
          <p className="font-['Gilroy-Medium'] text-[16px] text-white/80 leading-[150%]">
            A transparent and consistent process ensures alignment with DBRG's mission, values, and
            AML/CFT principles.
          </p>
        </div>

        {/* Due Diligence */}
        <div className="flex flex-col gap-4">
          <Search className="w-16 h-16 text-[#C6A95F]" />
          <p className="font-['Gilroy-Bold'] text-[20px]">Due Diligence</p>
          <p className="font-['Gilroy-Medium'] text-[16px] text-white/80 leading-[150%]">
            In accordance with UAE AML / CFT rules.
          </p>
        </div>
      </div>
          {/* Square Image at Bottom */}
      <div
        className="mt-24"
      >
        <img
          src="/static/member-framework.png"
          alt="DBRG Visual"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </div>
    </section>
  );
}
