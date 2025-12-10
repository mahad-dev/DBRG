"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { useStep4FinancialThresholds } from "@/hooks/useStep4FinancialThresholds";

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function Step4FinancialThresholds({
  onNext,
  onBack,
}: StepProps) {
  const {
    paidUpCapital,
    annualTurnover,
    bullionTurnover,
    netWorth,
    bullionFile,
    netWorthFile,
    bullionRef,
    netWorthRef,
    setPaidUpCapital,
    setAnnualTurnover,
    setBullionTurnover,
    setNetWorth,
    setBullionFile,
    setNetWorthFile,
    handleSelectFile,
    handleDropFile,
  } = useStep4FinancialThresholds();

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
      {/* Heading */}
      <h2 className="text-[30px] sm:text-[26px] font-bold text-[#C6A95F] font-gilroy">
        Section 4 - Financial Thresholds
      </h2>

      {/* 1 & 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
        {/* Paid Up Capital */}
        <div className="flex flex-col w-full">
          <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
            1. Paid Up Capital:
          </Label>
          <Input
            type="text"
            value={paidUpCapital}
            onChange={(e) => setPaidUpCapital(e.target.value)}
            placeholder="Paid Up Capital"
            className="mt-3 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white w-full h-[47px] rounded-[10px]"
          />
        </div>

        {/* Annual Turnover */}
        <div className="flex flex-col w-full">
          <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
            2. Annual Turnover (In Values):
          </Label>
          <Input
            type="text"
            value={annualTurnover}
            onChange={(e) => setAnnualTurnover(e.target.value)}
            placeholder="Annual Turnover"
            className="mt-3 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 w-full h-[47px] rounded-[10px]"
          />
        </div>
      </div>

      {/* 3 - Bullion Turnover */}
      <div className="mt-10">
        <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
          3. Annual bullion turnover (In Tonnes) ≥ 50 tons (or ≥ 100 tons
          silver)
        </Label>

        <div className="mt-4">
          <YesNoGroup value={bullionTurnover} onChange={setBullionTurnover} />
        </div>

        {/* Upload */}
        <div className="mt-6 w-full">
          <div className="text-white font-gilroy mb-2">
            Upload: Statement of confirmation for Annual Bullion Turnover
          </div>

          <input
            ref={bullionRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={(e) => handleSelectFile(e, setBullionFile)}
          />

          <UploadBox
            title="Statement of confirmation for Annual Bullion Turnover"
            file={bullionFile}
            onClick={() => bullionRef.current?.click()}
            onDrop={(e) => handleDropFile(e, setBullionFile)}
            id="bullion-upload"
            onRemove={() => setBullionFile(null)}
          />
        </div>
      </div>

      {/* 4 - Net Worth */}
      <div className="mt-10">
        <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
          4. Net worth ≥ USD 15 million
        </Label>

        <div className="mt-4">
          <YesNoGroup value={netWorth} onChange={setNetWorth} />
        </div>

        {/* Upload Proof */}
        <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
          <input
            ref={netWorthRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={(e) => handleSelectFile(e, setNetWorthFile)}
          />

          {/* Upload Box */}
          <UploadBox
            title="If yes, Upload Proof"
            file={netWorthFile}
            onClick={() => netWorthRef.current?.click()}
            onDrop={(e) => handleDropFile(e, setNetWorthFile)}
            id="networth-upload"
            onRemove={() => setNetWorthFile(null)}
          />

          {/* Download Template */}
          <Button
            variant="site_btn"
            className="w-full md:w-[220px] h-[42px] rounded-[10px] text-[18px] bg-[#C6A95F] text-black font-gilroySemiBold"
          >
            Download Template
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="w-full sm:w-[132px] h-[42px] border border-white text-white rounded-[10px] font-gilroySemiBold"
          >
            Back
          </Button>
        )}

        {onNext && (
          <Button
            onClick={onNext}
            variant="site_btn"
            className="w-full sm:w-[132px] h-[42px] rounded-[10px] font-gilroySemiBold"
          >
            Save / Next
          </Button>
        )}
      </div>
    </div>
  );
}
