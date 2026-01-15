
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
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
import { Formik } from "formik";
import { affiliateMemberStep3Schema } from "@/validation";
import { extractDocumentIdFromPath } from "@/validation/utils/fileValidation";

export default function Step4BankRelationshipRequirement() {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;
  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  const {
    isClient24Months,
    setIsClient24Months,
    bankFile,
    setBankFile,
    bankRef,
    bankReferenceLetterFileId,
    setBankReferenceLetterFileId,
    bankReferenceLetterFilePath,
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

  // Track pending uploads
  const [pendingUploads, setPendingUploads] = useState(0);

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

  // Handle file upload with immediate API call
  const handleFileUpload = async (
    file: File | null,
    setFile: (f: File | null) => void,
    setDocumentId: (id: number | null) => void,
    setFieldValue: any,
    fieldName: string
  ) => {
    setFile(file);
    setFieldValue(fieldName, file);
    setFieldValue(`${fieldName}Touched`, true);

    if (file) {
      setPendingUploads((prev) => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setDocumentId(documentId);
        toast.success("File uploaded successfully!");
      } catch (error) {
        toast.error("File upload failed. Please try again.");
        setFile(null);
        setFieldValue(fieldName, null);
      } finally {
        setPendingUploads((prev) => prev - 1);
      }
    } else {
      setDocumentId(null);
    }
  };

  const emptyToNull = (value: any): any => {
    if (value === "" || value === undefined) return null;
    return value;
  };

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Use document ID from hook (already uploaded immediately)
      const bankFileId = bankReferenceLetterFileId || extractDocumentIdFromPath(formData.bankRelationReq?.bankReferenceLetterFilePath || null);

      // Save form data
      await saveUploadDetails({
        membershipType: emptyToNull(formData.membershipType),
        bankRelationshipRequirement: {
          isClientOfDBRGMemberBank24Months: isClient24Months,
          bankReferenceLetterFileId: bankFileId,
          bankName: emptyToNull(bankName),
          accountNumber: emptyToNull(accountNumber),
          accountType: emptyToNull(accountType),
          bankingRelationSince: emptyToNull(selectedDate ? selectedDate.toISOString() : ""),
          bankAddress: emptyToNull(address),
        }
      }, MemberApplicationSection.BankRelationReq);

      toast.success('Bank relationship details saved successfully!');
      setCurrentStep(5);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error('Failed to save bank relationship details. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    isClient24Months: isClient24Months,
    bankReferenceLetterFile: bankFile,
    bankReferenceLetterFileId: bankReferenceLetterFileId,
    bankName: bankName || "",
    accountNumber: accountNumber || "",
    accountType: accountType || "",
    bankingSince: bankingSince || "",
    address: address || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={affiliateMemberStep3Schema}
      onSubmit={handleSave}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
      <h2 className="text-[30px] sm:text-[26px] font-bold text-[#C6A95F] font-gilroy">
        Section 4 – Bank Relationship Requirement
      </h2>

      {/* Question 1 */}
      <div className="mt-8">
        <Label className="text-white font-gilroy text-[20px]">
          I. Client of UAE-regulated bank for 12+ months <span className="text-red-500">*</span>
        </Label>
        <div className="mt-4 flex gap-10 sm:flex-col sm:gap-3">
          <YesNoGroup
            value={isClient24Months}
            onChange={(val) => {
              setIsClient24Months(val);
              setFieldValue("isClient24Months", val);
              setFieldTouched("isClient24Months", true);
            }}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
        </div>
        {touched.isClient24Months && errors.isClient24Months && (
          <p className="text-red-500 text-sm mt-2">{errors.isClient24Months as string}</p>
        )}
      </div>

      {/* Upload Section */}
      <div className="mt-10">
        <Label className="text-white font-gilroy text-[18px]">
          Bank reference letter or account confirmation <span className="text-red-500">*</span>
        </Label>

        <input
          ref={bankRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            const file = e.target.files?.[0] ?? null;
            await handleFileUpload(file, setBankFile, setBankReferenceLetterFileId, setFieldValue, "bankReferenceLetterFile");
            if (file) handleSelectFile(e, setBankFile);
          }}
        />
        <UploadBox
          title="Bank reference letter or account confirmation"
          file={bankFile}
          prefilledUrl={bankReferenceLetterFilePath}
          onClick={() => bankRef.current?.click()}
          onDrop={async (e: any) => {
            e.preventDefault();
            const file = e.dataTransfer?.files?.[0] ?? null;
            await handleFileUpload(file, setBankFile, setBankReferenceLetterFileId, setFieldValue, "bankReferenceLetterFile");
            if (file) handleDropFile(e, setBankFile);
          }}
          id="bank-upload"
          onRemove={() => {
            setBankFile(null);
            setBankReferenceLetterFileId(null);
            setFieldValue("bankReferenceLetterFile", null);
            setFieldValue("bankReferenceLetterFileId", null);
          }}
        />
        {touched.bankReferenceLetterFile && errors.bankReferenceLetterFile && (
          <p className="text-red-500 text-sm mt-2">{errors.bankReferenceLetterFile as string}</p>
        )}
        {formData.bankRelationReq?.bankReferenceLetterFilePath && !bankFile && (
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
              Name of Bank <span className="text-red-500">*</span>
            </Label>
            <Input
              value={bankName || ""}
              onChange={(e) => {
                setBankName(e.target.value);
                setFieldValue("bankName", e.target.value);
              }}
              onBlur={() => setFieldTouched("bankName", true)}
              placeholder="Name of Bank"
              className="mt-2 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {touched.bankName && errors.bankName && (
              <p className="text-red-500 text-sm mt-2">{errors.bankName as string}</p>
            )}
          </div>

          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Number <span className="text-red-500">*</span>
            </Label>
            <Input
              value={accountNumber || ""}
              onChange={(e) => {
                setAccountNumber(e.target.value);
                setFieldValue("accountNumber", e.target.value);
              }}
              onBlur={() => setFieldTouched("accountNumber", true)}
              placeholder="Account Number"
              className="mt-2 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {touched.accountNumber && errors.accountNumber && (
              <p className="text-red-500 text-sm mt-2">{errors.accountNumber as string}</p>
            )}
          </div>

          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Account Type <span className="text-red-500">*</span>
            </Label>
            <Input
              value={accountType || ""}
              onChange={(e) => {
                setAccountType(e.target.value);
                setFieldValue("accountType", e.target.value);
              }}
              onBlur={() => setFieldTouched("accountType", true)}
              placeholder="Account Type"
              className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[47px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            {touched.accountType && errors.accountType && (
              <p className="text-red-500 text-sm mt-2">{errors.accountType as string}</p>
            )}
          </div>

          {/* Calendar Input */}
          <div>
            <Label className="text-white font-gilroy text-[18px]">
              Banking Relation since <span className="text-red-500">*</span>
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
                  onSelect={(date) => {
                    setSelectedDate(date ?? undefined);
                    setFieldValue("bankingSince", date ? date.toISOString() : "");
                    setFieldTouched("bankingSince", true);
                  }}
                />
              </PopoverContent>
            </Popover>
            {touched.bankingSince && errors.bankingSince && (
              <p className="text-red-500 text-sm mt-2">{errors.bankingSince as string}</p>
            )}
          </div>
        </div>

        <div className="mt-6">
          <Label className="text-white font-gilroy text-[18px]">Address <span className="text-red-500">*</span></Label>
          <Input
            value={address || ""}
            onChange={(e) => {
              setAddress(e.target.value);
              setFieldValue("address", e.target.value);
            }}
            onBlur={() => setFieldTouched("address", true)}
            placeholder="Address"
            className="mt-2 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 h-[55px] rounded-[10px] focus-visible:ring-0 focus-visible:ring-offset-0"
          />
          {touched.address && errors.address && (
            <p className="text-red-500 text-sm mt-2">{errors.address as string}</p>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-10 flex justify-start gap-4">
        <Button
          onClick={() => {setCurrentStep(3);}}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
        >
          Back
        </Button>

        <Button
          onClick={() => submitForm()}
          disabled={state.isSaving || pendingUploads > 0}
          variant="site_btn"
          className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
        >
          {pendingUploads > 0 ? 'Uploading...' : state.isSaving ? 'Saving...' : 'Save / Next'}
        </Button>
      </div>

      <SpecialConsiderationDialog
        open={specialConsiderationOpen}
        onOpenChange={setSpecialConsiderationOpen}
      />
    </div>
      )}
    </Formik>
  );
}
