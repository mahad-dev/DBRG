"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useStep3BankRelationshipRequirement } from "@/hooks/useStep3BankRelationshipRequirement";
import { useAppSelector, useAppDispatch } from "../../../../../store/hooks";
import {
  selectFormData,
  selectIsSaving,
  saveUploadDetails,
  uploadDocument,
  setCurrentStep,
} from "../../../../../store/uploadDetailsSlice";
import { MemberApplicationSection } from "../../../../../types/uploadDetails";
import { toast } from "react-toastify";

export default function Step3BankRelationshipRequirement() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);
  const isSaving = useAppSelector(selectIsSaving);

  const {
    isClient24Months,
    bankFile,
    bankRef,
    bankReferenceLetterFileId,
    bankName,
    accountNumber,
    accountType,
    bankingSince,
    address,
    setIsClient24Months,
    setBankFile,
    setBankReferenceLetterFileId,
    handleSelectFile,
    handleDropFile,
    setBankName,
    setAccountNumber,
    setAccountType,
    setBankingSince,
    setAddress,
  } = useStep3BankRelationshipRequirement();

  // Track selected date as Date object for Calendar
  // Track selected date as Date object for Calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (bankingSince) {
      const [day, month, year] = bankingSince.split("/");
      if (day && month && year) {
        return new Date(Number(year), Number(month) - 1, Number(day));
      }
    }
    return undefined;
  });

  const handleSave = async () => {
    try {
      let fileId = bankReferenceLetterFileId;

      // Upload file if present
      if (bankFile) {
        const result = await dispatch(uploadDocument(bankFile)).unwrap();
        fileId = result;
        setBankReferenceLetterFileId(fileId);
      }

      // Convert selectedDate to ISO for backend
      let bankingSinceISO: string | null = null;
      if (selectedDate) {
        bankingSinceISO = selectedDate.toISOString();
        // Save in DD/MM/YYYY for local state
        const day = selectedDate.getDate().toString().padStart(2, "0");
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
        const year = selectedDate.getFullYear();
        setBankingSince(`${day}/${month}/${year}`);
      }

      // Validate required fields
      if (
        !bankName ||
        !accountNumber ||
        !accountType ||
        !bankingSinceISO ||
        !address
      ) {
        toast.error("Please fill in all required fields.");
        return;
      }

      // Save form data
      await dispatch(
        saveUploadDetails({
          payload: {
            ...formData,
            bankRelationshipRequirement: {
              isClientOfDBRGMemberBank24Months: isClient24Months,
              bankReferenceLetterFileId: fileId,
              bankName,
              accountNumber,
              accountType,
              bankingRelationSince: bankingSinceISO,
              bankAddress: address,
            },
          },
          sectionNumber: MemberApplicationSection.BankRelationReq,
        })
      );

      toast.success("Bank relationship details saved successfully!");
      dispatch(setCurrentStep(4));
    } catch (error) {
      console.error(error);
      toast.error(
        "Failed to save bank relationship details. Please try again."
      );
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Name of Bank
            </Label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Name of Bank"
              className="mt-2 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Number
            </Label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Account Number"
              className="mt-2 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Type
            </Label>
            <Input
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              placeholder="Account Type"
              className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Calendar Input */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Banking Relation since
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 text-left border-white bg-white text-black h-[47px] rounded-[10px]"
                >
                  {selectedDate
                    ? `${selectedDate.getDate().toString().padStart(2, "0")}/${(
                        selectedDate.getMonth() + 1
                      )
                        .toString()
                        .padStart(2, "0")}/${selectedDate.getFullYear()}`
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date ?? undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-white font-gilroy text-[18px]">Address</Label>
          <Input
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
            className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[55px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-start gap-4">
        <Button
          onClick={() => dispatch(setCurrentStep(2))}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
        >
          Back
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="site_btn"
          className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
        >
          {isSaving ? "Saving..." : "Save / Next"}
        </Button>
      </div>
    </div>
  );
}
