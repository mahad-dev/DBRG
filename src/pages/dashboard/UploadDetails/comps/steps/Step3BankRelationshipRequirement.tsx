"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { useStep3BankRelationshipRequirement } from "@/hooks/useStep3BankRelationshipRequirement";

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function Step3BankRelationshipRequirement({
  onNext,
  onBack,
}: StepProps) {
  const {
    isClient24Months,
    bankFile,
    bankRef,
    bankName,
    accountNumber,
    accountType,
    bankingSince,
    address,
    setIsClient24Months,
    setBankFile,
    handleSelectFile,
    handleDropFile,
    setBankName,
    setAccountNumber,
    setAccountType,
    setBankingSince,
    setAddress,
  } = useStep3BankRelationshipRequirement();

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
      {/* Heading */}
      <h2 className="text-[30px] sm:text-[26px] font-bold text-[#C6A95F] font-gilroy">
        Section 3 – Bank Relationship Requirement
      </h2>

      {/* Question 1 */}
      <div className="mt-8">
        <Label className="text-white font-gilroy text-[20px]">
          1. Client of a DBRG Member Bank for at least 24 months?
        </Label>

        <div className="mt-4 flex gap-10 sm:flex-col sm:gap-3">
          <YesNoGroup value={isClient24Months} onChange={setIsClient24Months} />
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-10">
        <div className="text-white font-gilroy mb-2">
          Bank reference letter or account confirmation
        </div>

        <input
          ref={bankRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, setBankFile)}
        />

        <UploadBox
          title="Bank reference letter or account confirmation"
          file={bankFile}
          onClick={() => bankRef.current?.click()}
          onDrop={(e: any) => handleDropFile(e, setBankFile)}
          id="bank-upload"
          onRemove={() => setBankFile(null)}
        />
      </div>

      {/* Provide Details */}
      <div className="mt-12">
        <h3 className="text-[#C6A95F] font-gilroySemiBold text-[22px] mb-4">
          Please provide details below:
        </h3>

        {/* Grid row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Name of Bank */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Name of Bank
            </Label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Name of Bank"
              className="mt-2  bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] 
              focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Account Number */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Number
            </Label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account Number"
              className="mt-2  bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white  h-[47px] rounded-[10px] 
              focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Account Type */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Type
            </Label>
            <Input
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              placeholder="Account Type"
              className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[47px] rounded-[10px] 
              focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Banking Relation Since */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Banking Relation since
            </Label>
            <Input
              value={bankingSince}
              onChange={(e) => setBankingSince(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="mt-2 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] 
              focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        </div>

        {/* Address */}
        <div className="mt-6">
          <Label className="text-white font-gilroy text-[18px]">Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[55px] rounded-[10px] 
            focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-start gap-4">
        {onBack && (
          <Button
            onClick={onBack}
            className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
          >
            Back
          </Button>
        )}

        {onNext && (
          <Button
            onClick={onNext}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
          >
            Save / Next
          </Button>
        )}
      </div>
    </div>
  );
}
