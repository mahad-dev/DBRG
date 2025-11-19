import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Check } from "lucide-react";

export default function MembershipChapters() {
  return (
    <section className="w-full bg-[#0d0d0d] text-white px-6 md:px-20 py-20 font-['Inter']">
      {/* Main Heading */}
      <h2 className="font-['DM_Serif_Display'] text-[#C6A95F] text-[44px] md:text-[48px] leading-[110%] mb-4 uppercase">
        Membership
      </h2>

      {/* Description under heading */}
      <p className="text-[#cfcfcf] text-[14px] max-w-3xl leading-[150%] mb-12">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
        exercitation.
      </p>

      {/* FIRST ACCORDION – PRINCIPAL MEMBER */}
      <Accordion type="single" collapsible className="w-full max-w-4xl space-y-4">
        <AccordionItem
          value="01"
          className="bg-[#121212] border border-[#262626] rounded-lg px-6 py-6"
        >
          <AccordionTrigger className="flex justify-between items-center w-full">
            <div className="flex items-center gap-4">
              <span className="font-['Gilroy'] font-bold text-[22px] text-[#C6A95F]">
                01
              </span>
              <span className="font-['Gilroy'] text-[20px]">
                Principal member
              </span>
            </div>

            <span className="text-[#C6A95F] font-['Gilroy'] text-[16px] hidden md:block">
              View Details
            </span>
          </AccordionTrigger>

          {/* CONTENT */}
          <AccordionContent className="mt-6 space-y-8">
            {/* ----------- Eligibility ---------------- */}
            <div>
              <h3 className="font-['Gilroy'] text-[18px] mb-4 flex items-center gap-3">
                <img
                  src="/icons/eligibility.svg"
                  width={24}
                  height={24}
                  alt="icon"
                />
                <span className="font-semibold">Eligibility:</span>
              </h3>

              <ul className="space-y-3 pl-1">
                <li className="text-[15px] leading-[150%]">
                  This category is open to industry leaders who play a critical
                  role in bullion trade, refining, or four years. Eligible
                  entities include:
                </li>

                <li className="text-[15px] leading-[150%]">
                  • Refiners – Accredited gold and silver refineries operating
                  under UAE AML standards with refining output of over 10 tons
                  per year for last three years. They should be rated Compliant
                  as per Ministry of Economy’s regulations on responsible
                  sourcing.
                </li>

                <li className="text-[15px] leading-[150%]">
                  • Gold and bullion trading companies involved in wholesale
                  bullion trading having relationships with international
                  bullion banks, commercial banks dealing in Bullion in UAE and
                  regulated entities for at least 3 years.
                </li>

                <li className="text-[15px] leading-[150%]">
                  • At time of application should have no unresolved notices from
                  UAE AML rules.
                </li>

                <li className="text-[15px] leading-[150%]">
                  • Applicants should be a client of one of the member banks for
                  atleast over 24 months.
                </li>

                <li className="text-[15px] leading-[150%]">
                  • Turnover of 50 tons plus / 100 tonnes of silver production
                </li>

                <li className="text-[15px] leading-[150%]">
                  • Net worth of $15 million
                </li>
              </ul>
            </div>

            {/* -------- Rights & Benefits ------------ */}
            <div>
              <h3 className="font-['Gilroy'] text-[18px] mb-4 flex items-center gap-3">
                <img
                  src="/icons/hand.svg"
                  width={24}
                  height={24}
                  alt="hand icon"
                />
                <span className="font-semibold">Rights & Benefits:</span>
              </h3>

              <ul className="space-y-3">
                {[
                  "Voting rights in DBRG governance and strategic decision-making.",
                  "Access to regulatory discussions, and policy advocacy efforts.",
                  "Invitation to DBRG board meetings, and working committees. Access to the meeting minutes and rights to share feedback.",
                  "Are invited for engagement with government bodies and regulators to shape Dubai’s bullion policies.",
                  "Branding & recognition in DBRG publications, international forums, and market reports.",
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-[15px] leading-[150%]">
                    <Check className="text-[#C6A95F] w-5 h-5 translate-y-1" />
                    {text}
                  </li>
                ))}
              </ul>

              <button className="mt-6 bg-[#C6A95F] text-black font-semibold px-6 py-3 rounded-lg">
                Join Membership
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTIONS 02–04 */}
        {[
          { id: "02", title: "Member Banks" },
          { id: "03", title: "Contributing member" },
          { id: "04", title: "Affiliate Member" },
        ].map((item) => (
          <AccordionItem
            key={item.id}
            value={item.id}
            className="bg-[#121212] border border-[#262626] rounded-lg px-6 py-5"
          >
            <AccordionTrigger className="flex justify-between items-center w-full">
              <div className="flex items-center gap-4">
                <span className="font-['Gilroy'] font-bold text-[22px] text-[#C6A95F]">
                  {item.id}
                </span>
                <span className="font-['Gilroy'] text-[20px]">{item.title}</span>
              </div>

              <span className="text-[#C6A95F] font-['Gilroy'] text-[16px] hidden md:block">
                View Details
              </span>
            </AccordionTrigger>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
