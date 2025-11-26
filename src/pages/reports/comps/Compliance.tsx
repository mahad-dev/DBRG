"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Compliance() {
  const items = [
    {
      title: "Compliance Guideline",
      date: "[Date]",
      desc: "Best practices for ensuring AML compliance within the gold refining and bullion trade.",
    },
    {
      title: "Compliance Guideline",
      date: "[Date]",
      desc: "An overview of new environmental regulations affecting gold refining businesses globally.",
    },
    {
      title: "Compliance Guideline",
      date: "[Date]",
      desc: "A comprehensive guide to the global compliance standards for precious metals trading and refining.",
    },
  ];

  return (
    <section className="w-full bg-[#0F0F0F] text-white px-4 sm:px-6 md:px-12 py-16 font-gilroy">
      {/* Heading Section */}
      <div className="max-w-7xl mx-auto mb-12 text-center md:text-left">
        <h1 className="font-[DM_Serif_Display] text-[36px] sm:text-[48px] md:text-[62px] text-[#C6A95F] leading-none">
          Compliance
        </h1>

        <p className="font-normal text-[18px] sm:text-[22px] md:text-[24px] leading-[1.3] max-w-7xl mt-4 mx-auto md:mx-0">
          Compliance is a critical aspect of the bullion and gold refining
          industry. DBRG is committed to helping its members stay compliant with
          local and international laws, regulations, and industry standards. Our
          Compliance section provides essential guidelines, regulatory updates,
          and resources to ensure your operations meet the highest standards.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item, index) => (
          <Card key={index} className="p-0 m-0 border-none">
            <CardContent className="flex flex-col h-full p-6">
              {/* Icon + Title */}
              <div className="flex items-center gap-4 mb-6">
                <img
                  src="/icons/ComplienceSvg.svg"
                  alt="Compliance Icon"
                  className="w-12 h-12"
                />
                <h3 className="text-[22px] md:text-[26px] font-gilroy font-semibold text-white">
                  {item.title}
                </h3>
              </div>

              {/* Date */}
              <p className="text-[18px] md:text-[20px] font-inter font-semibold mb-4">
                Published on: {item.date}
              </p>

              {/* Description */}
              <p className="text-[20px] md:text-[22px] font-gilroy leading-[1.3] mb-6 flex-1">
                {item.desc}
              </p>

              {/* Button */}
              <Button
                variant="site_btn"
                className="
                  w-[184px] h-[52px]
                  rounded-[10px]
                  text-center
                  font-inter font-medium text-[18px] 
                  leading-[100%] 
                  mt-auto
                "
              >
                Download & View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
