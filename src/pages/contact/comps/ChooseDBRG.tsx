import React from "react";
import { Button } from "@/components/ui/button";

export default function WhyContactDBRG() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 md:px-12 py-20">
          {/* TITLE */}
          <h2
            className="text-[#C6A95F] mb-8 font-dm-serif text-[58px] leading-[100%]"
          >
            Why Contact DBRG?
          </h2>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-start">
        
        {/* LEFT GREY BOX */}
        <div className="w-full h-[380px] md:h-[420px] bg-[#d9d9d9] rounded-xl" />

        {/* RIGHT CONTENT */}
        <div>
      
          {/* TEXT LIST */}
          <div className="space-y-8">

            {/* Item 1 */}
            <div>
              <p className="font-gilory-medium text-[24px] leading-[100%] text-white">
                Get Membership Information:
              </p>
              <p className="text-[#e5e5e5] text-[16px] md:text-[18px] mt-1">
                Learn more about the benefits of becoming a DBRG member.
              </p>
            </div>

            {/* Item 2 */}
            <div>
              <p className="font-gilory-medium text-[24px] leading-[100%] text-white">
                Stay Updated on Events:
              </p>
              <p className="text-[#e5e5e5] text-[16px] md:text-[18px] mt-1">
                Ask about upcoming industry events, webinars, and networking opportunities.
              </p>
            </div>

            {/* Item 3 */}
            <div>
              <p className="font-gilory-medium text-[24px] leading-[100%] text-white">
                Request Industry Resources:
              </p>
              <p className="text-[#e5e5e5] text-[16px] md:text-[18px] mt-1">
                Inquire about our latest industry reports, whitepapers, and regulatory updates.
              </p>
            </div>

            {/* Item 4 */}
            <div>
              <p className="font-gilory-medium text-[24px] leading-[100%] text-white">
                General Inquiries:
              </p>
              <p className="text-[#e5e5e5] text-[16px] md:text-[18px] mt-1">
                Reach out to us for any other questions or assistance.
              </p>
            </div>
          </div>

          {/* BUTTON */}
          <Button className="mt-10 bg-[#C6A95F] text-black px-8 py-6 rounded-md hover:bg-[#b79a55] text-lg">
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
