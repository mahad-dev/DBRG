"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import UploadBox from "@/components/custom/ui/UploadBox";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useStep2CompanyDetails } from '@/hooks/useStep2CompanyDetails';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';

interface StepProps {
  onNext?: () => void;
}

export default function Step2CompanyDetails({ onNext }: StepProps): React.JSX.Element {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  // Use the hook with prefill data
  const {
    form,
    setField,
    uploadBoxes,
    fileRefs,
    handleSelectFile,
    handleDropFile,
    removeFile,
    shareholders,
    shareholderRefs,
    addShareholder,
    removeShareholder,
    setShareholderField,
    handleShareholderFile,
    ubos,
    uboRefs,
    addUbo,
    removeUbo,
    setUboField,
    handleUboFile,
    directors,
    addDirector,
    removeDirector,
    setDirectorField,
  } = useStep2CompanyDetails(formData, 2);

  // Date picker states for calendar components
  const [dateOfIssuance, setDateOfIssuance] = useState<Date | undefined>();
  const [dateOfExpiry, setDateOfExpiry] = useState<Date | undefined>();
  const [dateOfIncorporation, setDateOfIncorporation] = useState<Date | undefined>();
  const [shareholderAppointmentDates, setShareholderAppointmentDates] = useState<(Date | undefined)[]>(
    shareholders.map(s => s.dateOfAppointment ? new Date(s.dateOfAppointment) : undefined)
  );
  const [directorAppointmentDates, setDirectorAppointmentDates] = useState<(Date | undefined)[]>(
    directors.map(d => d.dateOfAppointment ? new Date(d.dateOfAppointment) : undefined)
  );
  const [dateOfAppointment, setDateOfAppointment] = useState<Date | undefined>(
    form.dateOfAppointment ? new Date(form.dateOfAppointment) : undefined
  );


  // Prefill date states from form data
  useEffect(() => {
    if (form.dateOfIssuance) setDateOfIssuance(new Date(form.dateOfIssuance));
    if (form.dateOfExpiry) setDateOfExpiry(new Date(form.dateOfExpiry));
    if (form.dateOfIncorporation) setDateOfIncorporation(new Date(form.dateOfIncorporation));
    if (form.dateOfAppointment) setDateOfAppointment(new Date(form.dateOfAppointment));
  }, [form.dateOfIssuance, form.dateOfExpiry, form.dateOfIncorporation, form.dateOfAppointment]);

  // Prefill shareholder and director dates
  useEffect(() => {
    setShareholderAppointmentDates(shareholders.map(s => s.dateOfAppointment ? new Date(s.dateOfAppointment) : undefined));
  }, [shareholders]);

  useEffect(() => {
    setDirectorAppointmentDates(directors.map(d => d.dateOfAppointment ? new Date(d.dateOfAppointment) : undefined));
  }, [directors]);

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Upload main company files first
      let tradeLicenseDocumentId: number | null = null;
      let coiDocumentId: number | null = null;
      let passportDocumentId: number | null = null;
      let nationalIdDocumentId: number | null = null;
      let vatDocDocumentId: number | null = null;
      let taxRegDocDocumentId: number | null = null;
      let addressProofDocumentId: number | null = null;
      let tradeAssociationCertificateDocumentId: number | null = null;

      if (uploadBoxes.tradeLicense) {
        tradeLicenseDocumentId = await uploadDocument(uploadBoxes.tradeLicense);
      }
      if (uploadBoxes.coi) {
        coiDocumentId = await uploadDocument(uploadBoxes.coi);
      }
      if (uploadBoxes.passport) {
        passportDocumentId = await uploadDocument(uploadBoxes.passport);
      }
      if (uploadBoxes.nationalId) {
        nationalIdDocumentId = await uploadDocument(uploadBoxes.nationalId);
      }
      if (uploadBoxes.vatDoc) {
        vatDocDocumentId = await uploadDocument(uploadBoxes.vatDoc);
      }
      if (uploadBoxes.taxRegDoc) {
        taxRegDocDocumentId = await uploadDocument(uploadBoxes.taxRegDoc);
      }
      if (uploadBoxes.addressProof) {
        addressProofDocumentId = await uploadDocument(uploadBoxes.addressProof);
      }
      if (uploadBoxes.tradeAssociationCertificate) {
        tradeAssociationCertificateDocumentId = await uploadDocument(uploadBoxes.tradeAssociationCertificate);
      }

      // Upload shareholder files and update shareholder data
      const updatedShareholders = await Promise.all(
        shareholders.map(async (shareholder) => {
          let proofDocId: number | null = null;

          // Upload shareholding proof document if exists
          if (shareholder.proofFile) {
            proofDocId = await uploadDocument(shareholder.proofFile);
          }

          return {
            ...shareholder,
            passportDocument: passportDocumentId, // Use company passport document
            nationalIdDocument: nationalIdDocumentId, // Use company national ID document
            shareholdingDocumentId: proofDocId,
            proofFile: null, // Remove file object from payload
          };
        })
      );

      // Upload UBO files and update UBO data
      const updatedUbos = await Promise.all(
        ubos.map(async (ubo) => {
          let confirmationDocId: number | null = null;

          // Upload UBO confirmation document if exists
          if (ubo.confirmationFile) {
            confirmationDocId = await uploadDocument(ubo.confirmationFile);
          }

          return {
            ...ubo,
            ownershipPercentage: ubo.ownershipPercentage, // Already a number
            passportDocument: passportDocumentId, // Use company passport document
            nationalIdDocument: nationalIdDocumentId, // Use company national ID document
            uboConfirmationDocument: confirmationDocId,
            confirmationFile: null, // Remove file object from payload
          };
        })
      );

      // Save form data
      await saveUploadDetails({
        membershipType: formData.membershipType,
        companyDetails: {
          legalEntityName: form.legalEntityName,
          entityLegalType: form.entityLegalType,
          tradeLicenseNumber: form.tradeLicenseNumber,
          licensingAuthority: form.licensingAuthority,
          dateOfIssuance: form.dateOfIssuance,
          dateOfExpiry: form.dateOfExpiry,
          countryOfIncorporation: form.countryOfIncorporation,
          dateOfIncorporation: form.dateOfIncorporation,
          passportId: form.passportId,
          nationalId: form.nationalId,
          vatNumber: form.vatNumber,
          taxRegistrationNumber: form.taxRegistrationNumber,
          website: form.website,
          officialEmail: form.officialEmail,
          phoneNumber: form.phoneNumber,
          primaryContactName: form.primaryContactName,
          primaryContactDesignation: form.primaryContactDesignation,
          primaryContactEmail: form.primaryContactEmail,
          registeredOfficeAddress: form.registeredOfficeAddress,
          anyShareholderDirectorUBOPEP: form.anyShareholderDirectorUBOPEP ?? false,
          anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP ?? false,
          hasCustomerPEPChecks: form.hasCustomerPEPChecks ?? false,
          tradeAssociationName: form.tradeAssociationName,
          nameOfMember: form.nameOfMember,
          dateOfAppointment: form.dateOfAppointment,
          lbma: form.lbma,
          dmccDgd: form.dmccDgd,
          dmccMdb: form.dmccMdb,
          rjc: form.rjc,
          iages: form.iages,
          accreditationOther: form.accreditationOther,
          otherAccreditation: form.otherAccreditation,
          tradeLicenseDocument: tradeLicenseDocumentId,
          certificateOfIncorporation: coiDocumentId,
          taxRegistrationDocument: taxRegDocDocumentId,
          vatDocument: vatDocDocumentId,
          addressProofDocument: addressProofDocumentId,
          accreditationCertificate: tradeAssociationCertificateDocumentId,
          shareholdingProof: tradeLicenseDocumentId, // Using trade license as shareholding proof
          uboConfirmationDocument: coiDocumentId, // Using COI as UBO confirmation
          shareholders: updatedShareholders,
          ultimateBeneficialOwners: updatedUbos,
          directors,
        }
      }, MemberApplicationSection.CompanyDetails);

      toast.success('Company details saved successfully!');
      setCurrentStep(3);
      onNext?.();
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error('Failed to save company details. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg min-h-screen text-white">
      <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
        Section 2 - Company Details
      </h2>

      {/* -------------------------------------- */}
      {/* Row: Legal Entity Name + Entity Type */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Legal Entity Name</Label>
          <Input
            type="text"
            value={form.legalEntityName}
            onChange={(e) => setField("legalEntityName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Legal Entity Name"
          />
        </div>

        <div>
          <Label>Entity Legal Type</Label>
          <Select
            value={form.entityLegalType}
            onValueChange={(value) => setField("entityLegalType", value)}
          >
            <SelectTrigger className="w-full mt-2 bg-white h-[42px] text-black border-gray-300 focus:ring-0 focus:ring-offset-0">
              <SelectValue placeholder="Entity Legal Type" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="LLC">LLC</SelectItem>
              <SelectItem value="Sole">Sole Proprietorship</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Row: Trade License No + Licensing Authority */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Trade License / Registration No</Label>
          <Input
            type="text"
            value={form.tradeLicenseNumber}
            onChange={(e) => setField("tradeLicenseNumber", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Trade License/Registration No"
          />
        </div>

        <div>
          <Label>Licensing Authority</Label>
          <Input
            type="text"
            value={form.licensingAuthority}
            onChange={(e) => setField("licensingAuthority", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Licensing Authority"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Upload Trade License */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Upload Trade License</Label>

        <input
          ref={fileRefs.licenseRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "tradeLicense")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.tradeLicense}
          onClick={() => fileRefs.licenseRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "tradeLicense")}
          onRemove={() => removeFile("tradeLicense")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Row: Issuance + Expiry */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Date of Issuance</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfIssuance ? format(dateOfIssuance, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateOfIssuance}
                onSelect={(date) => {
                  setDateOfIssuance(date);
                  setField("dateOfIssuance", date ? date.toISOString() : "");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label>Date of Expiry</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfExpiry ? format(dateOfExpiry, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateOfExpiry}
                onSelect={(date) => {
                  setDateOfExpiry(date);
                  setField("dateOfExpiry", date ? date.toISOString() : "");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Row: Country of Incorporation + Date of Incorporation */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Country of Incorporation</Label>
          <Input
            type="text"
            value={form.countryOfIncorporation}
            onChange={(e) => setField("countryOfIncorporation", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Dubai"
          />
        </div>

        <div>
          <Label>Date of Incorporation</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfIncorporation ? format(dateOfIncorporation, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateOfIncorporation}
                onSelect={(date) => {
                  setDateOfIncorporation(date);
                  setField("dateOfIncorporation", date ? date.toISOString() : "");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Upload Certificate of Incorporation */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Upload Certificate of Incorporation</Label>

        <input
          ref={fileRefs.coiRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "coi")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.coi}
          onClick={() => fileRefs.coiRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "coi")}
          onRemove={() => removeFile("coi")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Passport ID + Upload Passport */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Passport ID</Label>
        <Input
          type="text"
          value={form.passportId}
          onChange={(e) => setField("passportId", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Enter Passport ID"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Passport</Label>

        <input
          ref={fileRefs.passportRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "passport")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.passport}
          onClick={() => fileRefs.passportRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "passport")}
          onRemove={() => removeFile("passport")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* National ID + Upload National ID */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>National ID Number</Label>
        <Input
          type="text"
          value={form.nationalId}
          onChange={(e) => setField("nationalId", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="National ID Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload National ID</Label>

        <input
          ref={fileRefs.nationalIdRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "nationalId")}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.nationalId}
          onClick={() => fileRefs.nationalIdRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "nationalId")}
          onRemove={() => removeFile("nationalId")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* VAT Number + VAT Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>VAT Number</Label>
        <Input
          type="text"
          value={form.vatNumber}
          onChange={(e) => setField("vatNumber", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="VAT Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload VAT Document</Label>

        <input
          ref={fileRefs.vatRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "vatDoc")}
        />

        <UploadBox
          title="Upload VAT Document"
          file={uploadBoxes.vatDoc}
          onClick={() => fileRefs.vatRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "vatDoc")}
          onRemove={() => removeFile("vatDoc")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Tax Registration Number + Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Tax Registration Number</Label>
        <Input
          type="text"
          value={form.taxRegistrationNumber}
          onChange={(e) => setField("taxRegistrationNumber", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Tax Registration Number"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Tax Registration Number Document</Label>

        <input
          ref={fileRefs.taxRegRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "taxRegDoc")}
        />

        <UploadBox
          title="Upload Tax Registration Document"
          file={uploadBoxes.taxRegDoc}
          onClick={() => fileRefs.taxRegRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "taxRegDoc")}
          onRemove={() => removeFile("taxRegDoc")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Website + Email + Phone */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Website</Label>
          <Input
            type="text"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Website"
          />
        </div>

        <div>
          <Label>Email (Official)</Label>
          <Input
            type="text"
            value={form.officialEmail}
            onChange={(e) => setField("officialEmail", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Email"
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Primary Contact Person */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Primary Contact – Name</Label>
          <Input
            type="text"
            value={form.primaryContactName}
            onChange={(e) => setField("primaryContactName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Name"
          />
        </div>

        <div>
          <Label>Primary Contact – Designation</Label>
          <Input
            type="text"
            value={form.primaryContactDesignation}
            onChange={(e) => setField("primaryContactDesignation", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Designation"
          />
        </div>
      </div>

      <div className="mt-6">
        <Label>Primary Contact – Email</Label>
        <Input
          type="text"
          value={form.primaryContactEmail}
          onChange={(e) => setField("primaryContactEmail", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Primary Contact – Email"
        />
      </div>

      {/* -------------------------------------- */}
      {/* Registered Address + Upload Address Proof */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Registered Office Address in UAE</Label>
        <Input
          type="text"
          value={form.registeredOfficeAddress}
          onChange={(e) => setField("registeredOfficeAddress", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Registered Office Address in UAE"
        />
      </div>

      <div className="mt-6">
        <Label>Upload Address Proof</Label>

        <input
          ref={fileRefs.addressProofRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) => handleSelectFile(e, "addressProof")}
        />

        <UploadBox
          title="Upload Address Proof"
          file={uploadBoxes.addressProof}
          onClick={() => fileRefs.addressProofRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "addressProof")}
          onRemove={() => removeFile("addressProof")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* SHAREHOLDERS SECTION */}
      {/* -------------------------------------- */}

      <h3 className="text-[22px] mt-10 mb-4 font-bold text-[#C6A95F]">
        Ownership and Management Details
      </h3>

      <div className="mt-6">
        <h4 className="font-bold text-[20px] text-white">a. Shareholder Details</h4>
      </div>

      {shareholders.map((s, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={s.fullName || ""}
                onChange={(e) =>
                  setShareholderField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Shareholding Percentage</Label>
              <Input
                type="number"
                value={s.shareholdingPercentage}
                onChange={(e) =>
                  setShareholderField(index, "shareholdingPercentage", parseFloat(e.target.value) || 0)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                type="text"
                value={s.nationality}
                onChange={(e) =>
                  setShareholderField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div>
              <Label>Passport ID</Label>
              <Input
                type="text"
                value={s.passportId}
                onChange={(e) =>
                  setShareholderField(index, "passportId", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>National ID Number</Label>
              <Input
                type="text"
                value={s.nationalIdNumber}
                onChange={(e) =>
                  setShareholderField(index, "nationalIdNumber", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Date of Appointment</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shareholderAppointmentDates[index] ? format(shareholderAppointmentDates[index], "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={shareholderAppointmentDates[index]}
                    onSelect={(date) => {
                      const updatedDates = [...shareholderAppointmentDates];
                      updatedDates[index] = date;
                      setShareholderAppointmentDates(updatedDates);
                      setShareholderField(index, "dateOfAppointment", date ? date.toISOString() : "");
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={s.address}
              onChange={(e) =>
                setShareholderField(index, "address", e.target.value)
              }
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          {/* Upload Proof */}
          <div className="mt-4">
            <Label>Upload Shareholding Proof</Label>

            <input
              ref={(el) => {
                if (el) {
                  shareholderRefs.current.set(index, el);
                } else {
                  shareholderRefs.current.delete(index);
                }
              }}
              type="file"
              className="hidden"
              onChange={(e) =>
                handleShareholderFile(index, e.target.files?.[0] ?? null)
              }
            />

            <UploadBox
              title="Upload Proof"
              file={s.proofFile}
              onClick={() => shareholderRefs.current.get(index)?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleShareholderFile(
                  index,
                  e.dataTransfer?.files?.[0] ?? null
                );
              }}
              onRemove={() => handleShareholderFile(index, null)}
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeShareholder(index)}
          >
            Remove Shareholder
          </Button>
        </div>
      ))}

      <Button
        onClick={addShareholder}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add Shareholder
      </Button>

      {/* -------------------------------------- */}
      {/* UBO SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        b. Ultimate Beneficial Owner (UBO) Details
      </h4>

      {ubos.map((u, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={u.fullName}
                onChange={(e) =>
                  setUboField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Shareholding (%)</Label>
              <Input
                type="number"
                value={u.ownershipPercentage}
                onChange={(e) =>
                  setUboField(index, "ownershipPercentage", parseFloat(e.target.value) || 0)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                type="text"
                value={u.nationality}
                onChange={(e) =>
                  setUboField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>Passport ID</Label>
              <Input
                type="text"
                value={u.passportId}
                onChange={(e) =>
                  setUboField(index, "passportId", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>National ID Number</Label>
              <Input
                type="text"
                value={u.nationalIdNumber}
                onChange={(e) =>
                  setUboField(index, "nationalIdNumber", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={u.address}
              onChange={(e) => setUboField(index, "address", e.target.value)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          {/* Upload UBO Confirmation */}
          <div className="mt-4">
            <Label>Upload UBO Confirmation</Label>

            <input
              ref={(el) => {
                if (el) {
                  uboRefs.current.set(index, el);
                } else {
                  uboRefs.current.delete(index);
                }
              }}
              type="file"
              className="hidden"
              onChange={(e) =>
                handleUboFile(index, e.target.files?.[0] ?? null)
              }
            />

            <UploadBox
              title="Upload UBO Confirmation"
              file={u.confirmationFile}
              onClick={() => uboRefs.current.get(index)?.click()}
              onDrop={(e) => {
                e.preventDefault();
                handleUboFile(index, e.dataTransfer.files?.[0] ?? null);
              }}
              onRemove={() => handleUboFile(index, null)}
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeUbo(index)}
          >
            Remove UBO
          </Button>
        </div>
      ))}

      <Button
        onClick={addUbo}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add UBO
      </Button>

      {/* -------------------------------------- */}
      {/* DIRECTORS SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        c. Director Details
      </h4>

      {directors.map((d, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name</Label>
              <Input
                type="text"
                value={d.fullName}
                onChange={(e) =>
                  setDirectorField(index, "fullName", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>

            <div>
              <Label>Date of Appointment</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {directorAppointmentDates[index] ? format(directorAppointmentDates[index], "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={directorAppointmentDates[index]}
                    onSelect={(date) => {
                      const updatedDates = [...directorAppointmentDates];
                      updatedDates[index] = date;
                      setDirectorAppointmentDates(updatedDates);
                      setDirectorField(index, "dateOfAppointment", date ? date.toISOString() : "");
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Nationality</Label>
              <Input
                type="text"
                value={d.nationality}
                onChange={(e) =>
                  setDirectorField(index, "nationality", e.target.value)
                }
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
            </div>
          </div>

          <div className="mt-4">
            <Label>Address</Label>
            <Input
              type="text"
              value={d.address}
              onChange={(e) => setDirectorField(index, "address", e.target.value)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          <Button
            className="mt-4 border cursor-pointer border-red-400 text-red-400"
            onClick={() => removeDirector(index)}
          >
            Remove Director
          </Button>
        </div>
      ))}

      <Button
        onClick={addDirector}
        className="mt-4 border cursor-pointer border-white text-white"
      >
        Add Director
      </Button>

      {/* -------------------------------------- */}
      {/* PEP Questions */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        d. Is any shareholder, director, UBO a Politically Exposed Person?
      </h4>
      <YesNoGroup
        value={form.anyShareholderDirectorUBOPEP}
        onChange={(v) => setField("anyShareholderDirectorUBOPEP", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        e. Is any shareholder / beneficial owner / key managerial person related to a PEP?
      </h4>
      <YesNoGroup
        value={form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP}
        onChange={(v) => setField("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        f. Does your establishment check to identify PEP customers?
      </h4>
      <YesNoGroup
        value={form.hasCustomerPEPChecks}
        onChange={(v) => setField("hasCustomerPEPChecks", v)}
      />

      {/* -------------------------------------- */}
      {/* Trade Association */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[22px] mt-10 text-[#C6A95F]">
        Membership of Trade Association
      </h4>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Name of Trade Association</Label>
          <Input
            type="text"
            value={form.tradeAssociationName}
            onChange={(e) => setField("tradeAssociationName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
        </div>

        <div>
          <Label>Name of Member</Label>
          <Input
            type="text"
            value={form.nameOfMember}
            onChange={(e) => setField("nameOfMember", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
        </div>

        <div>
          <Label>Date of Appointment</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateOfAppointment ? format(dateOfAppointment, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateOfAppointment}
                onSelect={(date) => {
                  setDateOfAppointment(date);
                  setField("dateOfAppointment", date ? date.toISOString() : "");
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Accreditations */}
      {/* -------------------------------------- */}
      <h4 className="mt-10 text-[20px] font-bold text-white">
        Recognized Accreditations (Select all that apply)
      </h4>

      <div className="mt-4 grid gap-3">
        {[
          ["lbma", "LBMA – London Good Delivery"],
          ["dmccDgd", "DMCC – Dubai Gold Delivery (DGD)"],
          ["dmccMdb", "DMCC – Market Deliverable Brand (MDB)"],
          ["rjc", "RJC – Responsible Jewellery Council Certification"],
          ["iages", "IAGES – Indian Association for Gold Excellence Standards"],
        ].map(([key, label]) => (
          <ServiceCheckbox
            key={key}
            label={label}
            checked={(form as any)[key]}
            onChange={() => setField(key as any, !(form as any)[key])}
          />
        ))}

        {/* Other */}
        <ServiceCheckbox
          label="Other (please specify)"
          checked={form.accreditationOther}
          onChange={() => setField("accreditationOther", !form.accreditationOther)}
        />

        {form.accreditationOther && (
          <Input
            type="text"
            value={form.otherAccreditation}
            onChange={(e) => setField("otherAccreditation", e.target.value)}
            className="w-full bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] mt-2 text-black placeholder:text-black/50"
            placeholder="Specify other accreditation"
          />
        )}
      </div>

      {/* Upload accreditation certificate */}
      <div className="mt-6">
        <Label>Copy of Valid Accreditation Certificate(s)</Label>

        <input
          ref={fileRefs.accreditationRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/*"
          onChange={(e) =>
            handleSelectFile(e, "tradeAssociationCertificate")
          }
        />

        <UploadBox
          file={uploadBoxes.tradeAssociationCertificate}
          title="Upload Accreditation Certificates"
          onClick={() => fileRefs.accreditationRef.current?.click()}
          onDrop={(e) => handleDropFile(e, "tradeAssociationCertificate")}
          onRemove={() => removeFile("tradeAssociationCertificate")}
        />
      </div>

      {/* -------------------------------------- */}
      {/* Navigation Buttons */}
      {/* -------------------------------------- */}
      <div className="mt-10 flex justify-start gap-4">
        <Button
          onClick={() => setCurrentStep(1)}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
        >
          Back
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="site_btn"
          className="w-[132px] h-[42px] rounded-[10px] text-white"
        >
          {isSaving ? 'Saving...' : 'Save / Next'}
        </Button>
      </div>


    </div>
  );
}
