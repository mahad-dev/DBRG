"use client";

import { useState, useEffect } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { useStep3BankRelationshipRequirement } from "@/hooks/useStep3BankRelationshipRequirement";

export default function Step3BankRelationshipRequirement() {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;

  const {
    isClient24Months,
    setIsClient24Months,
    bankFile,
    setBankFile,
    bankRef,
    bankName,
    setBankName,
    accountNumber,
    setAccountNumber,
    accountType,
    setAccountType,
    bankingSince,
    setBankingSince,
    address,
    setAddress,
    handleSelectFile,
    handleDropFile,
  } = useStep3BankRelationshipRequirement(formData.bankRelationReq);

  // Track selected date as Date object for Calendar
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Update selectedDate when bankingSince changes
  useEffect(() => {
    if (bankingSince) {
      const [day, month, year] = bankingSince.split('/');
      setSelectedDate(new Date(parseInt(year), parseInt(month) - 1, parseInt(day)));
    } else {
      setSelectedDate(undefined);
    }
  }, [bankingSince]);

  // Update bankingSince when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      const day = selectedDate.getDate().toString().padStart(2, "0");
      const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      const year = selectedDate.getFullYear();
      setBankingSince(`${day}/${month}/${year}`);
    } else {
      setBankingSince("");
    }
  }, [selectedDate, setBankingSince]);

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      let bankFileId = null;

      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Upload file if present, or use existing ID from path
      if (bankFile) {
        bankFileId = await uploadDocument(bankFile);
      } else if (formData.bankRelationReq?.bankReferenceLetterFilePath) {
        bankFileId = extractIdFromPath(formData.bankRelationReq.bankReferenceLetterFilePath);
      }

      // Save form data
      await saveUploadDetails({
        membershipType: formData.membershipType,
        bankRelationshipRequirement: {
          isClientOfDBRGMemberBank24Months: isClient24Months,
          bankReferenceLetterFileId: bankFileId,
          bankName: bankName,
          accountNumber: accountNumber,
          accountType: accountType,
          bankingRelationSince: selectedDate ? selectedDate.toISOString() : "",
          bankAddress: address,
        }
      }, MemberApplicationSection.BankRelationReq);

      toast.success('Bank relationship details saved successfully!');
      setCurrentStep(4);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error('Failed to save bank relationship details. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
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
          <YesNoGroup
            value={isClient24Months}
            onChange={setIsClient24Months}
          />
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
        {formData.bankRelationReq?.bankReferenceLetterFilePath  && (
          <a
            href={formData.bankRelationReq.bankReferenceLetterFilePath}
            target="_blank"
            className="text-[#C6A95F] underline mt-2 block"
          >
            View previously uploaded bank reference letter
          </a>
        )}
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
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
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
          onClick={() => {setCurrentStep(2);}}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
        >
          Back
        </Button>

        <Button
          onClick={handleSave}
          disabled={state.isSaving}
          variant="site_btn"
          className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
        >
          {state.isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

    </div>
  );
}
