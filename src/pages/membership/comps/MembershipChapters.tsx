import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
// import { Button } from "@/components/ui/button";
import BecomeMemberModal from "@/pages/layout/comps/BecomeMemberModal";
import { Check } from "lucide-react";

export default function MembershipChapters() {
  // -------------------- DATA --------------------
  const membershipData = [
    {
      id: "01",
      title: "Principal Member",
      eligibility: [
        "This category is open to industry leaders who play a critical role in bullion trade, refining, or four years. Eligible entities include:",
        "Accredited gold & silver refineries operating under UAE AML standards.",
        "Bullion trading companies with international banking relationships.",
        "No unresolved AML notices at time of application.",
        "Client of member banks for 24+ months.",
        "50 tons+ gold / 100 tons silver turnover.",
        "Net worth of $15 million.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions and advocacy efforts.",
        "Invitation to DBRG board meetings and committees.",
        "Engagement with UAE regulators & government bodies.",
        "Branding & recognition in DBRG publications and forums.",
      ],
    },
    {
      id: "02",
      title: "Member Banks",
        eligibility: [
        "This category is open to industry leaders who play a critical role in bullion trade, refining, or four years. Eligible entities include:",
        "Accredited gold & silver refineries operating under UAE AML standards.",
        "Bullion trading companies with international banking relationships.",
        "No unresolved AML notices at time of application.",
        "Client of member banks for 24+ months.",
        "50 tons+ gold / 100 tons silver turnover.",
        "Net worth of $15 million.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions and advocacy efforts.",
        "Invitation to DBRG board meetings and committees.",
        "Engagement with UAE regulators & government bodies.",
        "Branding & recognition in DBRG publications and forums.",
      ],
    },
    {
      id: "03",
      title: "Contributing Member",
        eligibility: [
        "This category is open to industry leaders who play a critical role in bullion trade, refining, or four years. Eligible entities include:",
        "Accredited gold & silver refineries operating under UAE AML standards.",
        "Bullion trading companies with international banking relationships.",
        "No unresolved AML notices at time of application.",
        "Client of member banks for 24+ months.",
        "50 tons+ gold / 100 tons silver turnover.",
        "Net worth of $15 million.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions and advocacy efforts.",
        "Invitation to DBRG board meetings and committees.",
        "Engagement with UAE regulators & government bodies.",
        "Branding & recognition in DBRG publications and forums.",
      ],
    },
    {
      id: "04",
      title: "Affiliate Member",
        eligibility: [
        "This category is open to industry leaders who play a critical role in bullion trade, refining, or four years. Eligible entities include:",
        "Accredited gold & silver refineries operating under UAE AML standards.",
        "Bullion trading companies with international banking relationships.",
        "No unresolved AML notices at time of application.",
        "Client of member banks for 24+ months.",
        "50 tons+ gold / 100 tons silver turnover.",
        "Net worth of $15 million.",
      ],
      benefits: [
        "Voting rights in DBRG governance and strategic decision-making.",
        "Access to regulatory discussions and advocacy efforts.",
        "Invitation to DBRG board meetings and committees.",
        "Engagement with UAE regulators & government bodies.",
        "Branding & recognition in DBRG publications and forums.",
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation.
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

               <BecomeMemberModal triggerClassName="mt-4"/>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
