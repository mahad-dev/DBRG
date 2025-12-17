"use client";

import { useState, useRef, useCallback } from "react";
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
import { cn } from "@/lib/utils";
import UploadBox from "@/components/custom/ui/UploadBox";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { selectFormData, selectIsSaving, updateFormData, saveUploadDetails, uploadDocument, setCurrentStep } from '../../../../../store/uploadDetailsSlice';
import type { Shareholder, UltimateBeneficialOwner, Director, CompanyDetails } from '../../../../../types/uploadDetails';
import { MemberApplicationSection } from '../../../../../types/uploadDetails';
import { toast } from 'react-toastify';

interface StepProps {
  onNext?: () => void;
}

export default function Step2CompanyDetails({ onNext }: StepProps): React.JSX.Element {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);
  const isSaving = useAppSelector(selectIsSaving);

  // Extract current step data
  const defaultCompanyDetails: CompanyDetails = {
    legalEntityName: '',
    entityType: '',
    tradeLicenseNo: '',
    licensingAuthority: '',
    dateIssued: '',
    dateExpiry: '',
    country: '',
    dateIncorp: '',
    passportId: '',
    nationalId: '',
    vatNumber: '',
    taxRegNumber: '',
    website: '',
    emailOfficial: '',
    phoneNumber: '',
    primaryContactName: '',
    primaryContactDesignation: '',
    primaryContactEmail: '',
    registeredOfficeAddress: '',
    anyShareholderDirectorUBOPEP: false,
    pepShareholders: false,
    pepBeneficialOwners: false,
    pepCustomers: false,
    shareholdingType: 1,
    shareholders: [],
    ultimateBeneficialOwners: [],
    directors: [],
    tradeAssociationName: '',
    tradeAssociationMember: '',
    tradeAssociationDate: '',
    refineryAccreditations: [],
    accreditationOther: false,
    accreditationOtherName: '',
    tradeLicenseDocument: null,
    certificateOfIncorporation: null,
    taxRegistrationDocument: null,
    vatDocument: null,
    addressProofDocument: null,
    accreditationCertificate: null,
    shareholdingProof: null,
    uboConfirmationDocument: null,
    entityLegalType: "",
    tradeLicenseNumber: "",
    isRegisteredForCorporateTax: false,
    taxRegistrationNumber: "",
    isRegisteredForVAT: false,
    officialEmail: "",
    countryOfIncorporation: "",
    dateOfIncorporation: "",
    anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: false,
    hasCustomerPEPChecks: false,
    nameOfMember: "",
    dateOfAppointment: "",
    otherAccreditation: "",
    lbma: false,
    dmccDgd: false,
    dmccMdb: false,
    rjc: false,
    iages: false
  };

  const companyDetails = { ...defaultCompanyDetails, ...formData.companyDetails };

  // Local state for dynamic arrays and files
  const [shareholders, setShareholders] = useState<Shareholder[]>(companyDetails.shareholders || []);
  const [ubos, setUbos] = useState<UltimateBeneficialOwner[]>(companyDetails.ultimateBeneficialOwners || []);
  const [directors, setDirectors] = useState<Director[]>(companyDetails.directors || []);

  const [uploadBoxes, setUploadBoxes] = useState({
    tradeLicense: null as File | null,
    coi: null as File | null,
    passport: null as File | null,
    nationalId: null as File | null,
    vatDoc: null as File | null,
    taxRegDoc: null as File | null,
    addressProof: null as File | null,
    tradeAssociationCertificate: null as File | null,
  });

  // Date picker states
  const [dateIssued, setDateIssued] = useState<Date | undefined>();
  const [dateExpiry, setDateExpiry] = useState<Date | undefined>();
  const [dateIncorp, setDateIncorp] = useState<Date | undefined>();
  const [shareholderAppointmentDates, setShareholderAppointmentDates] = useState<(Date | undefined)[]>(
    companyDetails.shareholders?.map(s => s.dateOfAppointment ? new Date(s.dateOfAppointment) : undefined) || []
  );
  const [directorAppointmentDates, setDirectorAppointmentDates] = useState<(Date | undefined)[]>(
    companyDetails.directors?.map(d => d.dateOfAppointment ? new Date(d.dateOfAppointment) : undefined) || []
  );

  const [tradeAssociationDate, setTradeAssociationDate] = useState<Date | undefined>(
    companyDetails.tradeAssociationDate ? new Date(companyDetails.tradeAssociationDate) : undefined
  );

  const fileRefs = {
    licenseRef: useRef<HTMLInputElement>(null),
    coiRef: useRef<HTMLInputElement>(null),
    passportRef: useRef<HTMLInputElement>(null),
    nationalIdRef: useRef<HTMLInputElement>(null),
    vatRef: useRef<HTMLInputElement>(null),
    taxRegRef: useRef<HTMLInputElement>(null),
    addressProofRef: useRef<HTMLInputElement>(null),
    accreditationRef: useRef<HTMLInputElement>(null),
  };

  const shareholderRefs = useRef(new Map<number, HTMLInputElement>());
  const uboRefs = useRef(new Map<number, HTMLInputElement>());

  const setField = useCallback((field: string, value: any) => {
    dispatch(updateFormData({
      companyDetails: {
        ...companyDetails,
        [field]: value
      }
    }));
  }, [dispatch, companyDetails]);

  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, key: keyof typeof uploadBoxes) => {
      const file = e.target.files?.[0] ?? null;
      setUploadBoxes((prev) => ({ ...prev, [key]: file }));
    },
    []
  );

  const handleDropFile = useCallback(
    (e: React.DragEvent, key: keyof typeof uploadBoxes) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0] ?? null;
      setUploadBoxes((prev) => ({ ...prev, [key]: file }));
    },
    []
  );

  const removeFile = (key: keyof typeof uploadBoxes) =>
    setUploadBoxes((prev) => ({ ...prev, [key]: null }));

  const addShareholder = () => {
    setShareholders((prev:any) => [
      ...prev,
      {
        fullName: "",
        passportId: "",
        nationalIdNumber: "",
        shareholdingPercentage: 0,
        nationality: "",
        dateOfAppointment: "",
        address: "",
        passportDocument: null,
        nationalIdDocument: null,
        proofFile: null,
      },
    ]);
    setShareholderAppointmentDates((prev) => [...prev, undefined]);
  };

  const removeShareholder = (index: number) => {
    setShareholders((prev) => prev.filter((_, i) => i !== index));
    setShareholderAppointmentDates((prev) => prev.filter((_, i) => i !== index));
  };

  const setShareholderField = <K extends keyof Shareholder>(
    index: number,
    field: K,
    value: Shareholder[K]
  ) => {
    setShareholders((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleShareholderFile = (
    index: number,
    file: File | null
  ) => {
    setShareholders((prev) => {
      const updated = [...prev];
      updated[index].proofFile = file;
      return updated;
    });
  };

  const addUbo = () => {
    setUbos((prev) => [
      ...prev,
      {
        fullName: "",
        percentage: "",
        nationality: "",
        address: "",
        passportDocument: null,
        nationalIdDocument: null,
        confirmationFile: null,
      },
    ]);
  };

  const removeUbo = (index: number) =>
    setUbos((prev) => prev.filter((_, i) => i !== index));

  const setUboField = (
    index: number,
    field: keyof UltimateBeneficialOwner,
    value: any
  ) => {
    setUbos((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleUboFile = (index: number, file: File | null) => {
    setUbos((prev) => {
      const updated = [...prev];
      updated[index].confirmationFile = file;
      return updated;
    });
  };

  const addDirector = () => {
    setDirectors((prev) => [
      ...prev,
      {
        fullName: "",
        dateOfAppointment: "",
        nationality: "",
        address: "",
        phoneNumber: "",
      },
    ]);
  };

  const removeDirector = (index: number) =>
    setDirectors((prev) => prev.filter((_, i) => i !== index));

  const setDirectorField = (
    index: number,
    field: keyof Director,
    value: any
  ) => {
    setDirectors((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      // Upload files first
      const fileUploads = [];
      if (uploadBoxes.tradeLicense) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.tradeLicense)));
      }
      if (uploadBoxes.coi) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.coi)));
      }
      if (uploadBoxes.passport) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.passport)));
      }
      if (uploadBoxes.nationalId) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.nationalId)));
      }
      if (uploadBoxes.vatDoc) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.vatDoc)));
      }
      if (uploadBoxes.taxRegDoc) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.taxRegDoc)));
      }
      if (uploadBoxes.addressProof) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.addressProof)));
      }
      if (uploadBoxes.tradeAssociationCertificate) {
        fileUploads.push(dispatch(uploadDocument(uploadBoxes.tradeAssociationCertificate)));
      }

      // Wait for all file uploads to complete
      await Promise.all(fileUploads);

      // Save form data
      await dispatch(saveUploadDetails({
        payload: {
          ...formData,
          companyDetails: {
            ...companyDetails,
            shareholders,
            ultimateBeneficialOwners: ubos,
            directors,
          }
        },
        sectionNumber: MemberApplicationSection.CompanyDetails
      }));

      toast.success('Company details saved successfully!');
      onNext?.();
    } catch (error) {
      toast.error('Failed to save company details. Please try again.');
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
            value={companyDetails.legalEntityName}
            onChange={(e) => setField("legalEntityName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Legal Entity Name"
          />
        </div>

        <div>
          <Label>Entity Legal Type</Label>
          <Select
            value={companyDetails.entityType}
            onValueChange={(value) => setField("entityType", value)}
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
            value={companyDetails.tradeLicenseNo}
            onChange={(e) => setField("tradeLicenseNo", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Trade License/Registration No"
          />
        </div>

        <div>
          <Label>Licensing Authority</Label>
          <Input
            type="text"
            value={companyDetails.licensingAuthority}
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
                {dateIssued ? format(dateIssued, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateIssued}
                onSelect={(date) => {
                  setDateIssued(date);
                  setField("dateIssued", date ? date.toISOString() : "");
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
                {dateExpiry ? format(dateExpiry, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateExpiry}
                onSelect={(date) => {
                  setDateExpiry(date);
                  setField("dateExpiry", date ? date.toISOString() : "");
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
            value={companyDetails.country}
            onChange={(e) => setField("country", e.target.value)}
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
                {dateIncorp ? format(dateIncorp, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={dateIncorp}
                onSelect={(date) => {
                  setDateIncorp(date);
                  setField("dateIncorp", date ? date.toISOString() : "");
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
          value={companyDetails.passportId}
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
          value={companyDetails.nationalId}
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
          value={companyDetails.vatNumber}
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
          value={companyDetails.taxRegNumber}
          onChange={(e) => setField("taxRegNumber", e.target.value)}
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
            value={companyDetails.website}
            onChange={(e) => setField("website", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Website"
          />
        </div>

        <div>
          <Label>Email (Official)</Label>
          <Input
            type="text"
            value={companyDetails.emailOfficial}
            onChange={(e) => setField("emailOfficial", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Email"
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={companyDetails.phoneNumber}
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
            value={companyDetails.primaryContactName}
            onChange={(e) => setField("primaryContactName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Name"
          />
        </div>

        <div>
          <Label>Primary Contact – Designation</Label>
          <Input
            type="text"
            value={companyDetails.primaryContactDesignation}
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
          value={companyDetails.primaryContactEmail}
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
          value={companyDetails.registeredOfficeAddress}
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
                value={s.fullName}
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
                type="text"
                value={u.percentage}
                onChange={(e) =>
                  setUboField(index, "percentage", e.target.value)
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
        value={companyDetails.pepShareholders}
        onChange={(v) => setField("pepShareholders", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        e. Is any shareholder / beneficial owner / key managerial person related to a PEP?
      </h4>
      <YesNoGroup
        value={companyDetails.pepBeneficialOwners}
        onChange={(v) => setField("pepBeneficialOwners", v)}
      />

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        f. Does your establishment check to identify PEP customers?
      </h4>
      <YesNoGroup
        value={companyDetails.pepCustomers}
        onChange={(v) => setField("pepCustomers", v)}
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
            value={companyDetails.tradeAssociationName}
            onChange={(e) => setField("tradeAssociationName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
        </div>

        <div>
          <Label>Name of Member</Label>
          <Input
            type="text"
            value={companyDetails.tradeAssociationMember}
            onChange={(e) => setField("tradeAssociationMember", e.target.value)}
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
                {tradeAssociationDate ? format(tradeAssociationDate, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white">
              <Calendar
                mode="single"
                selected={tradeAssociationDate}
                onSelect={(date) => {
                  setTradeAssociationDate(date);
                  setField("tradeAssociationDate", date ? date.toISOString() : "");
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
            checked={(companyDetails as any)[key]}
            onChange={() => setField(key as any, !(companyDetails as any)[key])}
          />
        ))}

        {/* Other */}
        <ServiceCheckbox
          label="Other (please specify)"
          checked={companyDetails.accreditationOther}
          onChange={() => setField("accreditationOther", !companyDetails.accreditationOther)}
        />

        {companyDetails.accreditationOther && (
          <Input
            type="text"
            value={companyDetails.accreditationOtherName}
            onChange={(e) => setField("accreditationOtherName", e.target.value)}
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
          onClick={() => dispatch(setCurrentStep(1))}
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
