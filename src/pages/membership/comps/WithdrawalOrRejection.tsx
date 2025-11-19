import React from "react";
import { Card } from "@/components/ui/card";

export default function WithdrawalOrRejection() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 md:px-16 py-24">
      {/* Title */}
      <h2 className="font-['Gilroy-Bold'] text-[42px] md:text-[48px] leading-[110%] mb-12">
        Withdrawal or Rejection
      </h2>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left Square Placeholder using shadcn Card */}
        <Card className="w-full h-[320px] md:h-[380px] bg-[#d3d3d3] rounded-xl" />

        {/* Right Text Content */}
        <div className="text-[18px] leading-[160%] max-w-xl font-['Gilroy-Medium']">
          <p className="mb-6">
            DBRG reserves the right to reject or withdraw membership if:
          </p>

          <ul className="list-disc ml-6 mb-6 space-y-2">
            <li>False or misleading information is provided</li>
            <li>Significant compliance concerns arise post-approval</li>
            <li>The member is found in breach of DBRG Code of Conduct</li>
          </ul>

          <p className="mb-6">
            Affected parties will be notified in writing with appropriate reasoning.
          </p>

          <p>
            On withdrawal or delisting, member will be moved to former list.
          </p>
        </div>
      </div>
    </section>
  );
}