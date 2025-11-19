import React from "react";
import { Building2, ShieldCheck, Handshake, Users, FileCheck2, ScrollText } from "lucide-react";

export default function GovernanceProtocol() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 md:px-16 py-24">
      {/* Title */}
      <h2 className="font-['Gilroy-Bold'] text-[36px] md:text-[42px] leading-[120%] mb-12">
        Governance & Confidentiality Protocols
      </h2>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 max-w-7xl">
        {/* Left Column */}
        <div className="flex flex-col gap-12">
          {/* DBRG Office */}
          <div className="flex items-start gap-6">
            <Building2 className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">DBRG Office:</span> Will be an independent outfit
            </p>
          </div>

          {/* Confidentiality Agreement */}
          <div className="flex items-start gap-6">
            <Handshake className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">Confidentiality Agreement:</span> DBRG staff handling
              applications will sign NDAs.
            </p>
          </div>

          {/* Firewalled Access */}
          <div className="flex items-start gap-6">
            <ShieldCheck className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">Firewalled Access:</span> The Board is not exposed to
              underlying KYC documents — only vetted summary information is presented.
            </p>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-12">
          {/* Data Security */}
          <div className="flex items-start gap-6">
            <FileCheck2 className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">Data Security:</span> All applications and KYC data are
              stored securely and accessible only to authorized compliance personnel.
            </p>
          </div>

          {/* Committee Independence */}
          <div className="flex items-start gap-6">
            <Users className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">Committee Independence:</span> No member of the Board shall
              be involved in vetting applicants to avoid conflict of interest.
            </p>
          </div>

          {/* Annual Review */}
          <div className="flex items-start gap-6">
            <ScrollText className="w-14 h-14 text-[#C6A95F]" />
            <p className="font-['Gilroy-Medium'] text-[18px] leading-[150%] max-w-md">
              <span className="font-['Gilroy-SemiBold']">Annual Review:</span> Membership process is reviewed annually
              to ensure compliance with evolving regulations and industry standards.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
