"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Tracking() {
  const steps = [
    { title: "Applied", status: "Completed", date: "09/07/2025" },
    { title: "Under\nReview", status: "Completed", date: "10/07/2025" },
    { title: "Approved", status: "Under Review", date: "N/A" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#111] text-white px-4 sm:px-6 md:px-10 py-12 font-inter">

      {/* Track Status */}
      <h1 className="text-[#C6A95F] text-3xl md:text-4xl font-semibold leading-none">
        Track Status
      </h1>

      {/* Time Line */}
      <p className="text-white text-xl md:text-2xl font-medium mt-8 mb-10">
        Time Line
      </p>

      {/* Timeline Container */}
      <div className="flex flex-wrap items-center gap-6 md:gap-8">

        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 md:gap-6">

            {/* STEP */}
            <div className="flex flex-col items-center gap-2">
              <Card className="px-6 md:px-12 py-8 rounded-[30px] bg-white/15 border-none flex flex-col items-center justify-center">
                <div className="aspect-square w-20 sm:w-[90px] md:w-[100px] rounded-full bg-[#C6A95F] flex items-center justify-center shrink-0">
                  <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-center whitespace-pre-line">
                    {step.title}
                  </p>
                </div>
                <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-white text-center mt-3">
                  {step.status}
                </p>
              </Card>

              <p className="text-[12px] sm:text-[13px] md:text-[14px] font-medium text-white mt-2 text-center">
                {step.date}
              </p>
            </div>

            {/* Arrow after each step except last */}
            {index !== steps.length - 1 && (
              <div className="flex flex-col items-center md:flex-row md:gap-2">
                {/* Desktop arrow */}
                 <div className="hidden md:flex items-center shrink-0">
                  <div className="w-[145px] h-[3px] bg-[#C6A95F] -mr-3" />
                  <ArrowRight className="text-[#C6A95F]" size={30} strokeWidth={2.5} />
                </div>


                {/* Mobile arrow */}
                <div className="flex md:hidden flex-col items-center mt-2">
                  <div className="w-0.5 h-6 bg-[#C6A95F]" />
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-10 border-t-[#C6A95F] border-l-transparent border-r-transparent" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Downloadable PDF */}
      <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-white mt-10">
        Downloadable acknowledgment PDF
      </p>

      <Button className="bg-black font-medium text-white mt-3 px-6 py-3 sm:py-4 rounded-lg hover:bg-white/20 transition text-sm md:text-base">
        Downloadable acknowledgment PDF
      </Button>

      {/* Description Box */}
      <div className="w-full md:w-[870px] bg-white/10 p-6 mt-12 rounded-lg">
        <p className="text-[16px] sm:text-[18px] md:text-[20px] font-normal leading-tight text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  );
}
