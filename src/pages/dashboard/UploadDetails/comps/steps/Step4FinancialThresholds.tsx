"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useStep4FinancialThresholds } from "@/hooks/useStep4FinancialThresholds";
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { selectFormData, selectIsSaving, saveUploadDetails, uploadDocument, setCurrentStep } from '../../../../../store/uploadDetailsSlice';
import { MemberApplicationSection } from '../../../../../types/uploadDetails';
import { toast } from 'react-toastify';

export default function Step4FinancialThresholds() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);
  const isSaving = useAppSelector(selectIsSaving);

  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  const {
    paidUpCapital,
    annualTurnover,
    bullionTurnover,
    bullionTurnoverProofFileId,
    netWorth,
    netWorthProofFileId,
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

  const handleSave = async () => {
    try {
      let bullionFileId = bullionTurnoverProofFileId;
      let netWorthFileId = netWorthProofFileId;

      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Upload file if present, or use existing ID from path
      if (bullionFile) {
        const result = await dispatch(uploadDocument(bullionFile)).unwrap();
        bullionFileId = result;
      } else if (formData.financialThresholds?.bullionTurnoverProofFileIdPath) {
        bullionFileId = extractIdFromPath(formData.financialThresholds.bullionTurnoverProofFileIdPath);
      }

      if (netWorthFile) {
        const result = await dispatch(uploadDocument(netWorthFile)).unwrap();
        netWorthFileId = result;
      } else if (formData.financialThresholds?.netWorthProofPath) {
        netWorthFileId = extractIdFromPath(formData.financialThresholds.netWorthProofPath);
      }

      // Save form data
      const parsedPaidUpCapital = paidUpCapital ? parseFloat(paidUpCapital) : null;
      const parsedAnnualTurnover = annualTurnover ? parseFloat(annualTurnover) : null;

      await dispatch(saveUploadDetails({
        payload: {
          membershipType: formData.application.membershipType,
          financialThresholds: {
            paidUpCapital: parsedPaidUpCapital === 0 ? null : parsedPaidUpCapital,
            annualTurnoverValue: parsedAnnualTurnover === 0 ? null : parsedAnnualTurnover,
            hasRequiredBullionTurnover: bullionTurnover || false,
            bullionTurnoverProofFileId: bullionFileId,
            hasRequiredNetWorth: netWorth || false,
            netWorthProofFileId: netWorthFileId,
          }
        },
        sectionNumber: MemberApplicationSection.FinancialThreshold
      }));

      toast.success('Financial thresholds saved successfully!');
      dispatch(setCurrentStep(5));
    } catch (error) {
      toast.error('Failed to save financial thresholds. Please try again.');
    }
  };

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
          <YesNoGroup
            value={bullionTurnover}
            onChange={setBullionTurnover}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
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
          {formData.financialThresholds?.bullionTurnoverProofFileIdPath && !bullionFile && (
            <a
              href={formData.financialThresholds.bullionTurnoverProofFileIdPath}
              target="_blank"
              className="text-[#C6A95F] underline mt-2 block"
            >
              View previously uploaded bullion turnover proof
            </a>
          )}
        </div>
      </div>

      {/* 4 - Net Worth */}
      <div className="mt-10">
        <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
          4. Net worth ≥ USD 15 million
        </Label>

        <div className="mt-4">
          <YesNoGroup value={netWorth} onChange={setNetWorth} 
            onNoClick={() => setSpecialConsiderationOpen(true)}/>
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
          {formData.financialThresholds?.netWorthProofPath && !netWorthFile && (
            <a
              href={formData.financialThresholds.netWorthProofPath}
              target="_blank"
              className="text-[#C6A95F] underline mt-2 block"
            >
              View previously uploaded net worth proof
            </a>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => dispatch(setCurrentStep(3))}
                  className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
                >
                  Back
                </Button>
        
        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="site_btn"
          className="w-full sm:w-[132px] h-[42px] rounded-[10px] font-gilroySemiBold"
        >
          {isSaving ? 'Saving...' : 'Save / Next'}
        </Button>
      </div>

      <SpecialConsiderationDialog
        open={specialConsiderationOpen}
        onOpenChange={setSpecialConsiderationOpen}
        onSubmit={() => setSpecialConsiderationOpen(false)}
      />
    </div>
  );
}
