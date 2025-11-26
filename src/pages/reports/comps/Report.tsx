"use client";

import { Button } from "@/components/ui/button";
import React from "react";

interface SectionProps {
  title: string;
  desc: string;
  icon?: string;
  heading?: string;
  body?: string;
  buttonLabel?: string;
  hideContent?: boolean;
}

export default function Report() {
  return (
    <section className="w-full relative overflow-hidden bg-[#0F0F0F] text-white px-4 sm:px-6 md:px-12 py-16 font-gilroy">
      
      {/* TOP PARAGRAPH */}
      <div className="max-w-6xl mx-auto text-center mb-16 px-2 sm:px-4">
        <p className="font-gilroy font-normal text-[16px] sm:text-[18px] md:text-[22px] leading-[1.4]">
          At Dubai Business Group for Bullion & Gold Refinery (DBRG), we provide valuable
          resources, reports, and publications to our members and industry professionals.
          Our Reports & Publications section serves as a comprehensive hub for
          whitepapers, industry reports, regulatory notices, and more. Whether you’re
          looking for insights on market trends, compliance guidelines, or industry
          innovations, this page offers a wealth of knowledge to help you stay informed
          and compliant.
        </p>
      </div>

      {/* Background Ellipses */}
      <div className="absolute top-36 -right-36 flex justify-center">
        <div className="w-[350px] h-[350px] bg-[#C6A95F]/40 blur-[100px] rounded-full"></div>
      </div>

      <Section
        title="Whitepapers"
        desc="Our whitepapers offer in-depth analysis on critical industry topics, providing actionable insights and strategies to navigate the evolving bullion and gold refining landscape."
        icon="/icons/ComplienceSvg.svg"
        heading="[Title of Whitepaper: Sustainable Gold Refining Practices] Published on :"
        body="An analysis of the future of sustainable gold refining processes and their impact on the global market."
      />

      <div className="absolute top-[650px] -left-36 flex justify-center">
        <div className="w-[350px] h-[350px] bg-[#C6A95F]/40 blur-[100px] rounded-full"></div>
      </div>

      <Section
        title="Industry Reports"
        desc="Our industry reports provide professionals with the most current and relevant market data. These reports cover trends, forecasts, regulations, and financial data related to the bullion and gold refining industry."
        icon="/icons/industryIcon.svg"
        heading="[Industry Report: Global Bullion Market Trends] Published on:"
        body="Important updates on compliance requirements for gold refining businesses operating within Dubai and the UAE."
      />

      <div className="absolute top-[1650px] -right-36 flex justify-center">
        <div className="w-[350px] h-[350px] bg-[#C6A95F]/40 blur-[100px] rounded-full"></div>
      </div>

      <Section
        title="Regulatory Notices"
        desc="DBRG provides timely regulatory notices to keep our members and the industry informed about important changes in policies, standards, and regulations."
        icon="/icons/regulatoryIcon.svg"
        heading="[Regulatory Notice: Changes in Gold Refining Compliance] Published on:"
        body="Important updates on compliance requirements for gold refining businesses operating within Dubai and the UAE."
      />

      <Section
        title="FAQs"
        desc="Our FAQs section provides answers to commonly asked questions about DBRG membership, events, industry regulations, and more."
        icon="/icons/faqIcon.svg"
        heading="[How to Apply for Membership?]"
        body="Step-by-step guide on how to become a member of DBRG and the benefits of membership."
        buttonLabel="Learn More"
      />

      <div className="absolute top-[2150px] -left-36 flex justify-center">
        <div className="w-[350px] h-[350px] bg-[#C6A95F]/40 blur-[100px] rounded-full"></div>
      </div>

      <Section
        title="Industry Guidelines"
        desc="The industry guidelines section is dedicated to best practices, standards, and compliance requirements for businesses within the bullion and gold refining industry."
        icon="/icons/guidelineIcon.svg"
        heading="[Industry Guideline: Best Practices for Sustainable Refining] Published on:"
        body="Guidelines on the best practices for refining gold while adhering to environmental standards."
      />

      <Section
        title="External Links"
        desc="DBRG collaborates with various regulatory bodies, industry organizations, and key players in the precious metals sector. Below are some valuable external links to help you stay connected with global regulatory authorities, industry trends, and news."
        hideContent={true}
      />
    </section>
  );
}

const Section: React.FC<SectionProps> = ({
  title,
  desc,
  icon,
  heading,
  body,
  buttonLabel = "Download & view",
  hideContent,
}) => {
  return (
    <div className="max-w-6xl mx-auto mb-16 px-2 sm:px-4">
      
      {/* TITLE */}
      <h3 className="
        font-gilroy font-bold 
        text-[28px] sm:text-[36px] md:text-[46px]
        leading-[100%] 
        mb-8
      ">
        {title}
      </h3>

      {/* DESCRIPTION */}
      <p className="
        font-gilroy 
        text-[16px] sm:text-[18px] md:text-[22px]
        leading-[1.4]
        mb-6
      ">
        {desc}
      </p>

      {/* LINE */}
      {!hideContent && <div className="border-b border-gray-700 mb-6" />}

      {/* CONTENT */}
      {!hideContent && (
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          {icon && (
            <img
              src={icon}
              alt="icon"
              width={56}
              height={56}
              className="object-contain"
            />
          )}

          <div>
            {heading && (
              <h3 className="
                font-gilroy font-bold
                text-[20px] sm:text-[24px] md:text-[34px]
                leading-[100%]
                mb-2
              ">
                {heading}
              </h3>
            )}

            {body && (
              <p className="
                font-gilroy
                text-[16px] sm:text-[18px] md:text-[22px]
                leading-[1.4]
              ">
                {body}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        variant="site_btn"
        className="
          mt-8 sm:mt-12
          rounded-[10px]
          px-6 py-4 sm:py-6
          font-inter font-medium
          text-[16px] sm:text-[20px]
        "
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
