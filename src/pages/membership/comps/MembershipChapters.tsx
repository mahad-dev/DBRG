import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import BecomeMemberButton from "@/pages/layout/comps/BecomeMemberButton";
// import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function MembershipChapters() {
  // -------------------- DATA --------------------
  const membershipData = [
    {
      id: "01",
      title: "Principal Member",
      eligibility: [
        "This category is open to industry leaders who play a critical role in bullion trade, refining, for over five years. Eligible entities include:",
        "Refiners – Accredited gold and silver refineries operating under UAE AML standards with refining output of over 10 tons per year for last three years. They should be rated Compliant as per Ministry of Economy's regulations on responsible sourcing.",
        "Gold and bullion trading companies involved in wholesale bullion trading having relationships with international bullion banks, commercial banks dealing in Bullion in UAE and regulated entities for at least 3 years.",
        "At time of application should have no unresolved notices from UAE AML rules.",
        "Applicants should be a client of one of the member banks for atleast over 24 months.",
        "Turnover of 50 tons plus / 100 tonnes of silver production.",
        "Net worth of $15 million.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions, and policy advocacy efforts.",
        "Invitation to DBRG board meetings, and working committees. Access to the meeting minutes and rights to share feedback.",
        "Are invited for engagement with government bodies and regulators to shape Dubai's bullion policies.",
        "Branding & recognition in DBRG publications, international forums, and market reports.",
      ],
    },
    {
      id: "02",
      title: "Member Banks",
      eligibility: [
        "Banks regulated by the Central Bank of UAE / DFSA / ADGM actively providing bullion-related financial services, hedging, physical trade, trade financing.",
        "The bank should be working with at least one UAE Good Delivery brand which are operating in UAE on physical side of the business.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions, and policy advocacy efforts.",
        "Invitation to DBRG board meetings, and working committees. Access to the meeting minutes and rights to share feedback.",
        "Are invited for engagement with government bodies and regulators to shape Dubai's bullion policies.",
      ],
    },
    {
      id: "03",
      title: "Contributing Member",
      eligibility: [
        "This category is designed for UAE-based entities that play an instrumental role providing critical support services for the bullion and refinery ecosystem. These companies with the office provide essential operational, commercial, or advisory support to the industry. Eligible entities include:",
        "Customs clearance agents involved in the bullion supply chain.",
        "Consulting, legal, and compliance firms advising bullion-related businesses.",
        "Technology solution providers supporting bullion trade operations, documentation, or back-office infrastructure.",
        "Insurance companies, assay labs, and testing facilities offering specialized services to the bullion and refining sector.",
        "Industry related trade bodies invited by the board.",
        "At time of application should have no unresolved notices from UAE AML rules.",
      ],
      benefits: [
        "Access to DBRG regulatory briefings, market insights, and industry updates.",
        "Participation in knowledge-sharing sessions, seminars, and select working groups.",
        "Inclusion in DBRG's communication network, member listing, and non-governance committees.",
        "No voting rights.",
      ],
    },
    {
      id: "04",
      title: "Affiliate Member",
      eligibility: [
        "This category is designed for all the bullion traders and refiners with an operational physical office in the UAE. Eligible criteria:",
        "In one of the above-mentioned licensed activity they are operating, should be in the business in the UAE for at least three years or thirty-six months.",
        "International organizations with operations for over 10 years, with affiliation to a global trade association, having a subsidiary or branch office in UAE.",
        "Company should be having a bank account with any of the banks regulated by UAE Central Bank, and should have an active account for at least twenty-four months.",
        "At time of application should have no unresolved notices from UAE AML rules.",
      ],
      benefits: [
        "Participation in knowledge-sharing sessions, roundtables, and industry discussions.",
        "Collaboration opportunities on policy advocacy, technology integration, and global trade initiatives.",
        "Networking opportunities with key stakeholders, decision-makers, and market leaders.",
        "No voting rights or governance participation.",
      ],
    },
  ];

  return (
    <section className="w-full bg-[#0d0d0d] text-white px-6 md:px-20 py-24">
      {/* MAIN HEADING */}
      <h2 className="font-['DM_Serif_Display'] text-[#C6A95F] text-[48px] md:text-[52px] leading-[100%] uppercase mb-6">
        Membership
      </h2>

      {/* PARAGRAPH */}
      <p className="font-gilory-medium text-[20px] md:text-[22px] leading-[1.4] max-w-8xl mb-16">
        DBRG offers three structured membership categories for
      </p>

      {/* ACCORDION */}
      <Accordion type="multiple" className="w-full border-t">
        {membershipData.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="px-4">
            <AccordionTrigger className="flex justify-between items-center w-full px-0 hover:no-underline">
              <div className="font-['Inter'] text-[42px] font-medium text-[#C6A95F] no-underline hover:no-underline">
                {item.id}
              </div>

              <div className="font-['Inter'] text-[#C6A95F] text-[20px] sm:text-[24px] md:text-[38px] font-medium no-underline hover:no-underline">
                {item.title}
              </div>

              <span className="font-['Inter'] min-w-[100px] cursor-pointer text-[16px] sm:text-[22px] md:text-[28px] font-medium underline">
                View Details
              </span>
            </AccordionTrigger>

            {/* ---------------- CONTENT ---------------- */}
            <AccordionContent className="mt-10 space-y-12">
              {/* ELIGIBILITY */}
              <div>
                <h3 className="font-gilory-bold text-[26px] md:text-[32px] mb-6 flex items-center gap-4">
                  <img
                    src="/icons/eligibility.svg"
                  />
                  Eligibility
                </h3>

                <ul className="space-y-4 font-gilory-medium text-[20px] md:text-[22px] leading-[130%]">
                  {item.eligibility.map((e, i) => (
                    <li key={i}>• {e}</li>
                  ))}
                </ul>
              </div>

              {/* BENEFITS */}
              <div>
                <h3 className="font-gilory-bold text-[26px] md:text-[32px] mb-6 flex items-center gap-4">
                  <img
                    src="/icons/rights.svg"
                    alt="hand icon"
                  />
                  Rights & Benefits
                </h3>

                <ul className="space-y-4 font-gilory-medium text-[20px] md:text-[22px] leading-[130%] ml-1">
                  {item.benefits.map((b, i) => (
                    <li key={i} className="flex gap-4">
                      <Check className="text-[#C6A95F] w-7 h-7 pt-1" /> {b}
                    </li>
                  ))}
                </ul>

               <BecomeMemberButton triggerClassName="mt-4"/>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
