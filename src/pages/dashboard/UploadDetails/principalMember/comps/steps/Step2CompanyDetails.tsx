"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Formik, Form } from 'formik';
import { principalMemberStep2Schema } from '@/validation';
import { extractDocumentIdFromPath } from '@/validation/utils/fileValidation';

interface StepProps {
  onNext?: () => void;
}

export default function Step2CompanyDetails({ onNext }: StepProps): React.JSX.Element {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  // Track pending file uploads
  const [pendingUploads, setPendingUploads] = useState<number>(0);

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
    tradeLicenseDocumentId,
    coiDocumentId,
    passportDocumentId,
    nationalIdDocumentId,
    vatDocumentId,
    taxRegDocumentId,
    addressProofDocumentId,
    tradeAssociationCertificateDocumentId,
    setTradeLicenseDocumentId,
    setCoiDocumentId,
    setPassportDocumentId,
    setNationalIdDocumentId,
    setVatDocumentId,
    setTaxRegDocumentId,
    setAddressProofDocumentId,
    setTradeAssociationCertificateDocumentId,
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

  // Validation helpers for Add buttons
  const isShareholderComplete = (shareholder: typeof shareholders[0]) => {
    return !!(
      shareholder.fullName &&
      shareholder.passportId &&
      shareholder.nationalIdNumber &&
      shareholder.shareholdingPercentage > 0 &&
      shareholder.nationality &&
      shareholder.dateOfAppointment &&
      shareholder.address &&
      (shareholder.proofFile || shareholder.proofFileId)
    );
  };

  const isUboComplete = (ubo: typeof ubos[0]) => {
    return !!(
      ubo.fullName &&
      ubo.passportId &&
      ubo.nationalIdNumber &&
      ubo.ownershipPercentage > 0 &&
      ubo.nationality &&
      ubo.address &&
      (ubo.confirmationFile || ubo.confirmationFileId)
    );
  };

  const isDirectorComplete = (director: typeof directors[0]) => {
    return !!(
      director.fullName &&
      director.dateOfAppointment &&
      director.nationality &&
      director.address &&
      director.phoneNumber
    );
  };

  const canAddShareholder = shareholders.length === 0 || shareholders.every(isShareholderComplete);
  const canAddUbo = ubos.length === 0 || ubos.every(isUboComplete);
  const canAddDirector = directors.length === 0 || directors.every(isDirectorComplete);

  const handleSubmit = async (_values: any, _helpers: any) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Use stored document IDs or extract from existing paths
      const tradeLicenseDocId =
        tradeLicenseDocumentId ??
        extractDocumentIdFromPath(form.tradeLicenseDocumentPath);

      const coiDocId =
        coiDocumentId ??
        extractDocumentIdFromPath(form.certificateOfIncorporationPath);

      const passportDocId =
        passportDocumentId ??
        extractDocumentIdFromPath(form.passportDocumentPath);

      const nationalIdDocId =
        nationalIdDocumentId ??
        extractDocumentIdFromPath(form.nationalIdDocumentPath);

      const vatDocId =
        vatDocumentId ??
        extractDocumentIdFromPath(form.vatDocumentPath);

      const taxRegDocId =
        taxRegDocumentId ??
        extractDocumentIdFromPath(form.taxRegistrationDocumentPath);

      const addressProofDocId =
        addressProofDocumentId ??
        extractDocumentIdFromPath(form.addressProofDocumentPath);

      const tradeAssociationCertificateDocId =
        tradeAssociationCertificateDocumentId ??
        extractDocumentIdFromPath(form.accreditationCertificatePath);

      // Upload shareholder files and update shareholder data
      const updatedShareholders = await Promise.all(
        shareholders.map(async (shareholder) => {
          let proofDocId: number | null = shareholder.proofFileId || null;

          // Upload shareholding proof document if exists
          if (shareholder.proofFile && !shareholder.proofFileId) {
            proofDocId = await uploadDocument(shareholder.proofFile);
          }

          return {
            fullName: shareholder.fullName,
            passportId: shareholder.passportId,
            nationalIdNumber: shareholder.nationalIdNumber,
            shareholdingPercentage: shareholder.shareholdingPercentage,
            nationality: shareholder.nationality,
            dateOfAppointment: shareholder.dateOfAppointment,
            address: shareholder.address,
            passportDocument: passportDocId,
            nationalIdDocument: nationalIdDocId,
            shareholdingDocument: proofDocId,
          };
        })
      );

      // Upload UBO files and update UBO data
      const updatedUbos = await Promise.all(
        ubos.map(async (ubo) => {
          let confirmationDocId: number | null = ubo.confirmationFileId || null;

          // Upload UBO confirmation document if exists
          if (ubo.confirmationFile && !ubo.confirmationFileId) {
            confirmationDocId = await uploadDocument(ubo.confirmationFile);
          }

          return {
            fullName: ubo.fullName,
            passportId: ubo.passportId,
            nationalIdNumber: ubo.nationalIdNumber,
            ownershipPercentage: ubo.ownershipPercentage,
            nationality: ubo.nationality,
            address: ubo.address,
            passportDocument: passportDocId,
            nationalIdDocument: nationalIdDocId,
            uboConfirmationDocument: confirmationDocId,
          };
        })
      );

      // Build refineryAccreditations array from checkboxes
      const refineryAccreditations: number[] = [];
      if (form.lbma) refineryAccreditations.push(0); // LBMA
      if (form.dmccDgd) refineryAccreditations.push(1); // DMCC DGD
      if (form.dmccMdb) refineryAccreditations.push(2); // DMCC MDB
      if (form.rjc) refineryAccreditations.push(3); // RJC
      if (form.iages) refineryAccreditations.push(4); // IAGES
      if (form.accreditationOther) refineryAccreditations.push(5); // Other

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
          passportDocument: passportDocId,
          nationalIdDocument: nationalIdDocId,
          isRegisteredForVAT: true,
          vatNumber: form.vatNumber,
          vatDocument: vatDocId,
          isRegisteredForCorporateTax: true,
          taxRegistrationNumber: form.taxRegistrationNumber,
          taxRegistrationDocument: taxRegDocId,
          website: form.website,
          officialEmail: form.officialEmail,
          phoneNumber: form.phoneNumber,
          primaryContactName: form.primaryContactName,
          primaryContactDesignation: form.primaryContactDesignation,
          primaryContactEmail: form.primaryContactEmail,
          registeredOfficeAddress: form.registeredOfficeAddress,
          addressProofDocument: addressProofDocId,
          anyShareholderDirectorUBOPEP: form.anyShareholderDirectorUBOPEP,
          anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP,
          hasCustomerPEPChecks: form.hasCustomerPEPChecks,
          shareholdingType: 1,
          tradeAssociationName: form.tradeAssociationName,
          nameOfMember: form.nameOfMember,
          dateOfAppointment: form.dateOfAppointment,
          refineryAccreditations,
          otherAccreditation: form.otherAccreditation,
          tradeLicenseDocument: tradeLicenseDocId,
          certificateOfIncorporation: coiDocId,
          accreditationCertificate: tradeAssociationCertificateDocId,
          shareholders: updatedShareholders.length > 0 ? updatedShareholders : undefined,
          ultimateBeneficialOwners: updatedUbos.length > 0 ? updatedUbos : undefined,
          directors: directors.length > 0 ? directors : undefined,
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

  // Formik initial values
  const initialValues = {
    // Company Information
    legalEntityName: form.legalEntityName,
    entityLegalType: form.entityLegalType,
    tradeLicenseNumber: form.tradeLicenseNumber,
    licensingAuthority: form.licensingAuthority,
    dateOfIssuance: form.dateOfIssuance,
    dateOfExpiry: form.dateOfExpiry,
    countryOfIncorporation: form.countryOfIncorporation,
    dateOfIncorporation: form.dateOfIncorporation,

    // Trade License File
    tradeLicenseFile: uploadBoxes.tradeLicense,
    tradeLicenseFilePath: form.tradeLicenseDocumentPath,
    tradeLicenseFileId: tradeLicenseDocumentId,

    // COI File
    coiFile: uploadBoxes.coi,
    coiFilePath: form.certificateOfIncorporationPath,
    coiFileId: coiDocumentId,

    // Identity Documents
    passportId: form.passportId,
    passportFile: uploadBoxes.passport,
    passportFilePath: form.passportDocumentPath,
    passportFileId: passportDocumentId,

    nationalId: form.nationalId,
    nationalIdFile: uploadBoxes.nationalId,
    nationalIdFilePath: form.nationalIdDocumentPath,
    nationalIdFileId: nationalIdDocumentId,

    // VAT & Tax
    vatNumber: form.vatNumber,
    vatDocFile: uploadBoxes.vatDoc,
    vatDocFilePath: form.vatDocumentPath,
    vatDocFileId: vatDocumentId,

    taxRegistrationNumber: form.taxRegistrationNumber,
    taxRegDocFile: uploadBoxes.taxRegDoc,
    taxRegDocFilePath: form.taxRegistrationDocumentPath,
    taxRegDocFileId: taxRegDocumentId,

    // Contact Information
    website: form.website,
    officialEmail: form.officialEmail,
    phoneNumber: form.phoneNumber,

    // Primary Contact
    primaryContactName: form.primaryContactName,
    primaryContactDesignation: form.primaryContactDesignation,
    primaryContactEmail: form.primaryContactEmail,

    // Registered Address
    registeredOfficeAddress: form.registeredOfficeAddress,
    addressProofFile: uploadBoxes.addressProof,
    addressProofFilePath: form.addressProofDocumentPath,
    addressProofFileId: addressProofDocumentId,

    // Dynamic Arrays
    shareholders: shareholders,
    ubos: ubos,
    directors: directors,

    // PEP Questions
    anyShareholderDirectorUBOPEP: form.anyShareholderDirectorUBOPEP,
    anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP,
    hasCustomerPEPChecks: form.hasCustomerPEPChecks,

    // Trade Association
    tradeAssociationName: form.tradeAssociationName,
    nameOfMember: form.nameOfMember,
    dateOfAppointment: form.dateOfAppointment,

    // Accreditations
    lbma: form.lbma,
    dmccDgd: form.dmccDgd,
    dmccMdb: form.dmccMdb,
    rjc: form.rjc,
    iages: form.iages,
    accreditationOther: form.accreditationOther,
    otherAccreditation: form.otherAccreditation,
    tradeAssociationCertificateFile: uploadBoxes.tradeAssociationCertificate,
    tradeAssociationCertificateFilePath: form.accreditationCertificatePath,
    tradeAssociationCertificateFileId: tradeAssociationCertificateDocumentId,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={principalMemberStep2Schema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={true}
      validateOnMount={false}
      enableReinitialize={true}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => {
        // Upload file immediately when selected (upload-on-selection pattern)
        const uploadFileImmediately = async (
          file: File | null,
          setDocumentId: (id: number | null) => void,
          fieldName: string
        ) => {
          setFieldValue(fieldName, file);
          setFieldTouched(fieldName, true);

          if (file) {
            setPendingUploads(prev => prev + 1);
            try {
              const documentId = await uploadDocument(file);
              setDocumentId(documentId);
              setFieldValue(`${fieldName}Id`, documentId);
              toast.success('File uploaded successfully!');
            } catch (error) {
              toast.error('File upload failed');
              setFieldValue(fieldName, null);
            } finally {
              setPendingUploads(prev => prev - 1);
            }
          }
        };

        return (
        <Form>
          <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg min-h-screen text-white">
            <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
              Section 2 - Company Details
            </h2>

            {/* -------------------------------------- */}
            {/* Row: Legal Entity Name + Entity Type */}
            {/* -------------------------------------- */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Legal Entity Name <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={form.legalEntityName}
                  onChange={(e) => {
                    setField("legalEntityName", e.target.value);
                    setFieldValue("legalEntityName", e.target.value);
                    setFieldTouched("legalEntityName", true);
                  }}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  placeholder="Legal Entity Name"
                />
                {touched.legalEntityName && errors.legalEntityName && (
                  <p className="text-red-500 text-sm mt-2">{errors.legalEntityName as string}</p>
                )}
              </div>

              <div>
                <Label>Entity Legal Type <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={form.entityLegalType}
                  onChange={(e) => {
                    setField("entityLegalType", e.target.value);
                    setFieldValue("entityLegalType", e.target.value);
                    setFieldTouched("entityLegalType", true);
                  }}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  placeholder="Entity Legal Type"
                />
                {touched.entityLegalType && errors.entityLegalType && (
                  <p className="text-red-500 text-sm mt-2">{errors.entityLegalType as string}</p>
                )}
              </div>
            </div>

            {/* -------------------------------------- */}
            {/* Row: Trade License No + Licensing Authority */}
            {/* -------------------------------------- */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Trade License / Registration No <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={form.tradeLicenseNumber}
                  onChange={(e) => {
                    setField("tradeLicenseNumber", e.target.value);
                    setFieldValue("tradeLicenseNumber", e.target.value);
                    setFieldTouched("tradeLicenseNumber", true);
                  }}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  placeholder="Trade License/Registration No"
                />
                {touched.tradeLicenseNumber && errors.tradeLicenseNumber && (
                  <p className="text-red-500 text-sm mt-2">{errors.tradeLicenseNumber as string}</p>
                )}
              </div>

              <div>
                <Label>Licensing Authority <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={form.licensingAuthority}
                  onChange={(e) => {
                    setField("licensingAuthority", e.target.value);
                    setFieldValue("licensingAuthority", e.target.value);
                    setFieldTouched("licensingAuthority", true);
                  }}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  placeholder="Licensing Authority"
                />
                {touched.licensingAuthority && errors.licensingAuthority && (
                  <p className="text-red-500 text-sm mt-2">{errors.licensingAuthority as string}</p>
                )}
              </div>
            </div>

            {/* -------------------------------------- */}
            {/* Upload Trade License */}
            {/* -------------------------------------- */}
            <div className="mt-6">
              <Label>Upload Trade License <span className="text-red-500">*</span></Label>

              <input
                ref={fileRefs.licenseRef}
                type="file"
                className="hidden"
                accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={async (e) => {
                  handleSelectFile(e, 'tradeLicense'); // Update hook state
                  const file = e.target.files?.[0] ?? null;
                  await uploadFileImmediately(
                    file,
                    setTradeLicenseDocumentId,
                    'tradeLicenseFile'
                  );
                }}
              />

              <UploadBox
                title="Drag And Drop or Select"
                file={uploadBoxes.tradeLicense}
                prefilledUrl={form.tradeLicenseDocumentPath}
                onClick={() => fileRefs.licenseRef.current?.click()}
                onDrop={async (e) => {
                  handleDropFile(e, 'tradeLicense'); // Update hook state
                  const file = e.dataTransfer?.files?.[0] ?? null;
                  await uploadFileImmediately(
                    file,
                    setTradeLicenseDocumentId,
                    'tradeLicenseFile'
                  );
                }}
                onRemove={() => {
                  removeFile("tradeLicense");
                  setTradeLicenseDocumentId(null);
                  setFieldValue('tradeLicenseFile', null);
                  setFieldValue('tradeLicenseFileId', null);
                  setFieldTouched('tradeLicenseFile', true);
                }}
              />
              {form.tradeLicenseDocumentPath && !uploadBoxes.tradeLicense && (
                <a
                  href={form.tradeLicenseDocumentPath}
                  target="_blank"
                  className="mt-2 inline-block text-[#C6A95F] underline"
                >
                  View Previous Document
                </a>
              )}
              {touched.tradeLicenseFile && errors.tradeLicenseFile && (
                <p className="text-red-500 text-sm mt-2">{errors.tradeLicenseFile as string}</p>
              )}
            </div>

            {/* -------------------------------------- */}
            {/* Row: Issuance + Expiry */}
            {/* -------------------------------------- */}
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <Label>Date of Issuance <span className="text-red-500">*</span></Label>
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
                        const dateString = date ? date.toISOString() : "";
                        setField("dateOfIssuance", dateString);
                        setFieldValue("dateOfIssuance", dateString);
                        setFieldTouched("dateOfIssuance", true);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {touched.dateOfIssuance && errors.dateOfIssuance && (
                  <p className="text-red-500 text-sm mt-2">{errors.dateOfIssuance as string}</p>
                )}
              </div>

              <div>
                <Label>Date of Expiry <span className="text-red-500">*</span></Label>
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
                        const dateString = date ? date.toISOString() : "";
                        setField("dateOfExpiry", dateString);
                        setFieldValue("dateOfExpiry", dateString);
                        setFieldTouched("dateOfExpiry", true);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {touched.dateOfExpiry && errors.dateOfExpiry && (
                  <p className="text-red-500 text-sm mt-2">{errors.dateOfExpiry as string}</p>
                )}
              </div>
            </div>

      {/* -------------------------------------- */}
      {/* Row: Country of Incorporation + Date of Incorporation */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Country of Incorporation <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            value={form.countryOfIncorporation}
            onChange={(e) => {
              setField("countryOfIncorporation", e.target.value);
              setFieldValue("countryOfIncorporation", e.target.value);
              setFieldTouched("countryOfIncorporation", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Dubai"
          />
          {touched.countryOfIncorporation && errors.countryOfIncorporation && (
            <p className="text-red-500 text-sm mt-2">{errors.countryOfIncorporation as string}</p>
          )}
        </div>

        <div>
          <Label>Date of Incorporation <span className="text-red-500">*</span></Label>
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
                  const dateString = date ? date.toISOString() : "";
                  setField("dateOfIncorporation", dateString);
                  setFieldValue("dateOfIncorporation", dateString);
                  setFieldTouched("dateOfIncorporation", true);
                }}
              />
            </PopoverContent>
          </Popover>
          {touched.dateOfIncorporation && errors.dateOfIncorporation && (
            <p className="text-red-500 text-sm mt-2">{errors.dateOfIncorporation as string}</p>
          )}
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Upload Certificate of Incorporation */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Upload Certificate of Incorporation <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.coiRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'coi'); // Update hook state
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setCoiDocumentId,
              'coiFile'
            );
          }}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.coi}
          prefilledUrl={form.certificateOfIncorporationPath}
          onClick={() => fileRefs.coiRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'coi'); // Update hook state
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setCoiDocumentId,
              'coiFile'
            );
          }}
          onRemove={() => {
            removeFile("coi");
            setCoiDocumentId(null);
            setFieldValue('coiFile', null);
            setFieldValue('coiFileId', null);
            setFieldTouched('coiFile', true);
          }}
        />
        {form.certificateOfIncorporationPath && !uploadBoxes.coi && (
          <a
            href={form.certificateOfIncorporationPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.coiFile && errors.coiFile && (
          <p className="text-red-500 text-sm mt-2">{errors.coiFile as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* Passport ID + Upload Passport */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Passport ID <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={form.passportId}
          onChange={(e) => {
            setField("passportId", e.target.value);
            setFieldValue("passportId", e.target.value);
            setFieldTouched("passportId", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Enter Passport ID"
        />
        {touched.passportId && errors.passportId && (
          <p className="text-red-500 text-sm mt-2">{errors.passportId as string}</p>
        )}
      </div>

      <div className="mt-6">
        <Label>Upload Passport <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.passportRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'passport');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setPassportDocumentId,
              'passportFile'
            );
          }}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.passport}
          prefilledUrl={form.passportDocumentPath}
          onClick={() => fileRefs.passportRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'passport');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setPassportDocumentId,
              'passportFile'
            );
          }}
          onRemove={() => {
            removeFile("passport");
            setPassportDocumentId(null);
            setFieldValue('passportFile', null);
            setFieldValue('passportFileId', null);
            setFieldTouched('passportFile', true);
          }}
        />
        {form.passportDocumentPath && !uploadBoxes.passport && (
          <a
            href={form.passportDocumentPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.passportFile && errors.passportFile && (
          <p className="text-red-500 text-sm mt-2">{errors.passportFile as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* National ID + Upload National ID */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>National ID Number <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={form.nationalId}
          onChange={(e) => {
            setField("nationalId", e.target.value);
            setFieldValue("nationalId", e.target.value);
            setFieldTouched("nationalId", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="National ID Number"
        />
        {touched.nationalId && errors.nationalId && (
          <p className="text-red-500 text-sm mt-2">{errors.nationalId as string}</p>
        )}
      </div>

      <div className="mt-6">
        <Label>Upload National ID <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.nationalIdRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'nationalId');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setNationalIdDocumentId,
              'nationalIdFile'
            );
          }}
        />

        <UploadBox
          title="Drag And Drop or Select"
          file={uploadBoxes.nationalId}
          prefilledUrl={form.nationalIdDocumentPath}
          onClick={() => fileRefs.nationalIdRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'nationalId');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setNationalIdDocumentId,
              'nationalIdFile'
            );
          }}
          onRemove={() => {
            removeFile("nationalId");
            setNationalIdDocumentId(null);
            setFieldValue('nationalIdFile', null);
            setFieldValue('nationalIdFileId', null);
            setFieldTouched('nationalIdFile', true);
          }}
        />
        {form.nationalIdDocumentPath && !uploadBoxes.nationalId && (
          <a
            href={form.nationalIdDocumentPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.nationalIdFile && errors.nationalIdFile && (
          <p className="text-red-500 text-sm mt-2">{errors.nationalIdFile as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* VAT Number + VAT Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>VAT Number <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={form.vatNumber}
          onChange={(e) => {
            setField("vatNumber", e.target.value);
            setFieldValue("vatNumber", e.target.value);
            setFieldTouched("vatNumber", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="VAT Number"
        />
        {touched.vatNumber && errors.vatNumber && (
          <p className="text-red-500 text-sm mt-2">{errors.vatNumber as string}</p>
        )}
      </div>

      <div className="mt-6">
        <Label>Upload VAT Document <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.vatRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'vatDoc');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setVatDocumentId,
              'vatDocFile'
            );
          }}
        />

        <UploadBox
          title="Upload VAT Document"
          file={uploadBoxes.vatDoc}
          prefilledUrl={form.vatDocumentPath}
          onClick={() => fileRefs.vatRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'vatDoc');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setVatDocumentId,
              'vatDocFile'
            );
          }}
          onRemove={() => {
            removeFile("vatDoc");
            setVatDocumentId(null);
            setFieldValue('vatDocFile', null);
            setFieldValue('vatDocFileId', null);
            setFieldTouched('vatDocFile', true);
          }}
        />
        {form.vatDocumentPath && !uploadBoxes.vatDoc && (
          <a
            href={form.vatDocumentPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.vatDocFile && errors.vatDocFile && (
          <p className="text-red-500 text-sm mt-2">{errors.vatDocFile as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* Tax Registration Number + Document */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Tax Registration Number <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={form.taxRegistrationNumber}
          onChange={(e) => {
            setField("taxRegistrationNumber", e.target.value);
            setFieldValue("taxRegistrationNumber", e.target.value);
            setFieldTouched("taxRegistrationNumber", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Tax Registration Number"
        />
        {touched.taxRegistrationNumber && errors.taxRegistrationNumber && (
          <p className="text-red-500 text-sm mt-2">{errors.taxRegistrationNumber as string}</p>
        )}
      </div>

      <div className="mt-6">
        <Label>Upload Tax Registration Number Document <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.taxRegRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'taxRegDoc');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setTaxRegDocumentId,
              'taxRegDocFile'
            );
          }}
        />

        <UploadBox
          title="Upload Tax Registration Document"
          file={uploadBoxes.taxRegDoc}
          prefilledUrl={form.taxRegistrationDocumentPath}
          onClick={() => fileRefs.taxRegRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'taxRegDoc');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setTaxRegDocumentId,
              'taxRegDocFile'
            );
          }}
          onRemove={() => {
            removeFile("taxRegDoc");
            setTaxRegDocumentId(null);
            setFieldValue('taxRegDocFile', null);
            setFieldValue('taxRegDocFileId', null);
            setFieldTouched('taxRegDocFile', true);
          }}
        />
        {form.taxRegistrationDocumentPath && !uploadBoxes.taxRegDoc && (
          <a
            href={form.taxRegistrationDocumentPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.taxRegDocFile && errors.taxRegDocFile && (
          <p className="text-red-500 text-sm mt-2">{errors.taxRegDocFile as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* Website + Email + Phone */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Website <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            value={form.website}
            onChange={(e) => {
              setField("website", e.target.value);
              setFieldValue("website", e.target.value);
              setFieldTouched("website", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Website"
          />
          {touched.website && errors.website && (
            <p className="text-red-500 text-sm mt-2">{errors.website as string}</p>
          )}
        </div>

        <div>
          <Label>Email (Official) <span className="text-red-500">*</span></Label>
          <Input
            type="email"
            value={form.officialEmail}
            onChange={(e) => {
              setField("officialEmail", e.target.value);
              setFieldValue("officialEmail", e.target.value);
              setFieldTouched("officialEmail", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Email"
          />
          {touched.officialEmail && errors.officialEmail && (
            <p className="text-red-500 text-sm mt-2">{errors.officialEmail as string}</p>
          )}
        </div>

        <div>
          <Label>Phone Number <span className="text-red-500">*</span></Label>
          <Input
            type="tel"
            value={form.phoneNumber}
            onChange={(e) => {
              setField("phoneNumber", e.target.value);
              setFieldValue("phoneNumber", e.target.value);
              setFieldTouched("phoneNumber", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Phone Number"
          />
          {touched.phoneNumber && errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-2">{errors.phoneNumber as string}</p>
          )}
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Primary Contact Person */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Primary Contact – Name <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            value={form.primaryContactName}
            onChange={(e) => {
              setField("primaryContactName", e.target.value);
              setFieldValue("primaryContactName", e.target.value);
              setFieldTouched("primaryContactName", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Name"
          />
          {touched.primaryContactName && errors.primaryContactName && (
            <p className="text-red-500 text-sm mt-2">{errors.primaryContactName as string}</p>
          )}
        </div>

        <div>
          <Label>Primary Contact – Designation <span className="text-red-500">*</span></Label>
          <Input
            type="text"
            value={form.primaryContactDesignation}
            onChange={(e) => {
              setField("primaryContactDesignation", e.target.value);
              setFieldValue("primaryContactDesignation", e.target.value);
              setFieldTouched("primaryContactDesignation", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Designation"
          />
          {touched.primaryContactDesignation && errors.primaryContactDesignation && (
            <p className="text-red-500 text-sm mt-2">{errors.primaryContactDesignation as string}</p>
          )}
        </div>
      </div>

      <div className="mt-6">
        <Label>Primary Contact – Email <span className="text-red-500">*</span></Label>
        <Input
          type="email"
          value={form.primaryContactEmail}
          onChange={(e) => {
            setField("primaryContactEmail", e.target.value);
            setFieldValue("primaryContactEmail", e.target.value);
            setFieldTouched("primaryContactEmail", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Primary Contact – Email"
        />
        {touched.primaryContactEmail && errors.primaryContactEmail && (
          <p className="text-red-500 text-sm mt-2">{errors.primaryContactEmail as string}</p>
        )}
      </div>

      {/* -------------------------------------- */}
      {/* Registered Address + Upload Address Proof */}
      {/* -------------------------------------- */}
      <div className="mt-6">
        <Label>Registered Office Address in UAE <span className="text-red-500">*</span></Label>
        <Input
          type="text"
          value={form.registeredOfficeAddress}
          onChange={(e) => {
            setField("registeredOfficeAddress", e.target.value);
            setFieldValue("registeredOfficeAddress", e.target.value);
            setFieldTouched("registeredOfficeAddress", true);
          }}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Registered Office Address in UAE"
        />
        {touched.registeredOfficeAddress && errors.registeredOfficeAddress && (
          <p className="text-red-500 text-sm mt-2">{errors.registeredOfficeAddress as string}</p>
        )}
      </div>

      <div className="mt-6">
        <Label>Upload Address Proof <span className="text-red-500">*</span></Label>

        <input
          ref={fileRefs.addressProofRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'addressProof');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setAddressProofDocumentId,
              'addressProofFile'
            );
          }}
        />

        <UploadBox
          title="Upload Address Proof"
          file={uploadBoxes.addressProof}
          prefilledUrl={form.addressProofDocumentPath}
          onClick={() => fileRefs.addressProofRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'addressProof');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setAddressProofDocumentId,
              'addressProofFile'
            );
          }}
          onRemove={() => {
            removeFile("addressProof");
            setAddressProofDocumentId(null);
            setFieldValue('addressProofFile', null);
            setFieldValue('addressProofFileId', null);
            setFieldTouched('addressProofFile', true);
          }}
        />
        {form.addressProofDocumentPath && !uploadBoxes.addressProof && (
          <a
            href={form.addressProofDocumentPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.addressProofFile && errors.addressProofFile && (
          <p className="text-red-500 text-sm mt-2">{errors.addressProofFile as string}</p>
        )}
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

      {values.shareholders.map((s, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={s.fullName || ""}
                onChange={(e) => {
                  setShareholderField(index, "fullName", e.target.value);
                  const updatedShareholders = [...shareholders];
                  updatedShareholders[index].fullName = e.target.value;
                  setFieldValue('shareholders', updatedShareholders);
                  setFieldTouched(`shareholders.${index}.fullName`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.shareholders?.[index]?.fullName && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && 'fullName' in errors.shareholders[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).fullName}</p>
              )}
            </div>

            <div>
              <Label>Shareholding Percentage <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={s.shareholdingPercentage}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setShareholderField(index, "shareholdingPercentage", value);
                  const updatedShareholders = [...shareholders];
                  updatedShareholders[index].shareholdingPercentage = value;
                  setFieldValue('shareholders', updatedShareholders);
                  setFieldTouched(`shareholders.${index}.shareholdingPercentage`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.shareholders?.[index]?.shareholdingPercentage && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && 'shareholdingPercentage' in errors.shareholders[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).shareholdingPercentage}</p>
              )}
            </div>

            <div>
              <Label>Nationality <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={s.nationality}
                onChange={(e) => {
                  setShareholderField(index, "nationality", e.target.value);
                  const updatedShareholders = [...shareholders];
                  updatedShareholders[index].nationality = e.target.value;
                  setFieldValue('shareholders', updatedShareholders);
                  setFieldTouched(`shareholders.${index}.nationality`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.shareholders?.[index]?.nationality && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && 'nationality' in errors.shareholders[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).nationality}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-4">
            <div>
              <Label>Passport ID <span className="text-red-500">*</span></Label>
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
              <Label>National ID Number <span className="text-red-500">*</span></Label>
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
              <Label>Date of Appointment <span className="text-red-500">*</span></Label>
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
            <Label>Address <span className="text-red-500">*</span></Label>
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
            <Label>Upload Shareholding Proof <span className="text-red-500">*</span></Label>

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
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                handleShareholderFile(index, file);

                // Upload immediately
                if (file) {
                  setPendingUploads(prev => prev + 1);
                  try {
                    const documentId = await uploadDocument(file);
                    const updatedShareholders = [...shareholders];
                    updatedShareholders[index].proofFileId = documentId;
                    setFieldValue('shareholders', updatedShareholders);
                    toast.success('Shareholding proof uploaded successfully!');
                  } catch (error) {
                    toast.error('File upload failed');
                    handleShareholderFile(index, null);
                  } finally {
                    setPendingUploads(prev => prev - 1);
                  }
                }
              }}
            />

            <UploadBox
              title="Upload Proof"
              file={s.proofFile}
              prefilledUrl={s.proofFilePath}
              onClick={() => shareholderRefs.current.get(index)?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                handleShareholderFile(index, file);

                // Upload immediately
                if (file) {
                  setPendingUploads(prev => prev + 1);
                  try {
                    const documentId = await uploadDocument(file);
                    const updatedShareholders = [...shareholders];
                    updatedShareholders[index].proofFileId = documentId;
                    setFieldValue('shareholders', updatedShareholders);
                    toast.success('Shareholding proof uploaded successfully!');
                  } catch (error) {
                    toast.error('File upload failed');
                    handleShareholderFile(index, null);
                  } finally {
                    setPendingUploads(prev => prev - 1);
                  }
                }
              }}
              onRemove={() => {
                handleShareholderFile(index, null);
                const updatedShareholders = [...shareholders];
                updatedShareholders[index].proofFileId = null;
                setFieldValue('shareholders', updatedShareholders);
              }}
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
        disabled={!canAddShareholder}
        className={`mt-4 border cursor-pointer ${canAddShareholder ? 'border-white text-white' : 'border-gray-500 text-gray-500 opacity-50 cursor-not-allowed'}`}
      >
        Add Shareholder
      </Button>
      {!canAddShareholder && (
        <p className="text-yellow-500 text-sm mt-2">Please complete all fields for existing shareholders before adding a new one.</p>
      )}
      {touched.shareholders && errors.shareholders && typeof errors.shareholders === 'string' && (
        <p className="text-red-500 text-sm mt-2">{errors.shareholders}</p>
      )}

      {/* -------------------------------------- */}
      {/* UBO SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        b. Ultimate Beneficial Owner (UBO) Details
      </h4>

      {values.ubos.map((u, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={u.fullName}
                onChange={(e) => {
                  setUboField(index, "fullName", e.target.value);
                  const updatedUbos = [...ubos];
                  updatedUbos[index].fullName = e.target.value;
                  setFieldValue('ubos', updatedUbos);
                  setFieldTouched(`ubos.${index}.fullName`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.ubos?.[index]?.fullName && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && 'fullName' in errors.ubos[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).fullName}</p>
              )}
            </div>

            <div>
              <Label>Shareholding (%) <span className="text-red-500">*</span></Label>
              <Input
                type="number"
                value={u.ownershipPercentage}
                onChange={(e) => {
                  const value = parseFloat(e.target.value) || 0;
                  setUboField(index, "ownershipPercentage", value);
                  const updatedUbos = [...ubos];
                  updatedUbos[index].ownershipPercentage = value;
                  setFieldValue('ubos', updatedUbos);
                  setFieldTouched(`ubos.${index}.ownershipPercentage`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.ubos?.[index]?.ownershipPercentage && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && 'ownershipPercentage' in errors.ubos[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).ownershipPercentage}</p>
              )}
            </div>

            <div>
              <Label>Nationality <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={u.nationality}
                onChange={(e) => {
                  setUboField(index, "nationality", e.target.value);
                  const updatedUbos = [...ubos];
                  updatedUbos[index].nationality = e.target.value;
                  setFieldValue('ubos', updatedUbos);
                  setFieldTouched(`ubos.${index}.nationality`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.ubos?.[index]?.nationality && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && 'nationality' in errors.ubos[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).nationality}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>Passport ID <span className="text-red-500">*</span></Label>
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
              <Label>National ID Number <span className="text-red-500">*</span></Label>
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
            <Label>Address <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={u.address}
              onChange={(e) => setUboField(index, "address", e.target.value)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
            />
          </div>

          {/* Upload UBO Confirmation */}
          <div className="mt-4">
            <Label>Upload UBO Confirmation <span className="text-red-500">*</span></Label>

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
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                handleUboFile(index, file);

                // Upload immediately
                if (file) {
                  setPendingUploads(prev => prev + 1);
                  try {
                    const documentId = await uploadDocument(file);
                    const updatedUbos = [...ubos];
                    updatedUbos[index].confirmationFileId = documentId;
                    setFieldValue('ubos', updatedUbos);
                    toast.success('UBO confirmation uploaded successfully!');
                  } catch (error) {
                    toast.error('File upload failed');
                    handleUboFile(index, null);
                  } finally {
                    setPendingUploads(prev => prev - 1);
                  }
                }
              }}
            />

            <UploadBox
              title="Upload UBO Confirmation"
              file={u.confirmationFile}
              prefilledUrl={u.confirmationFilePath}
              onClick={() => uboRefs.current.get(index)?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0] ?? null;
                handleUboFile(index, file);

                // Upload immediately
                if (file) {
                  setPendingUploads(prev => prev + 1);
                  try {
                    const documentId = await uploadDocument(file);
                    const updatedUbos = [...ubos];
                    updatedUbos[index].confirmationFileId = documentId;
                    setFieldValue('ubos', updatedUbos);
                    toast.success('UBO confirmation uploaded successfully!');
                  } catch (error) {
                    toast.error('File upload failed');
                    handleUboFile(index, null);
                  } finally {
                    setPendingUploads(prev => prev - 1);
                  }
                }
              }}
              onRemove={() => {
                handleUboFile(index, null);
                const updatedUbos = [...ubos];
                updatedUbos[index].confirmationFileId = null;
                setFieldValue('ubos', updatedUbos);
              }}
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
        disabled={!canAddUbo}
        className={`mt-4 border cursor-pointer ${canAddUbo ? 'border-white text-white' : 'border-gray-500 text-gray-500 opacity-50 cursor-not-allowed'}`}
      >
        Add UBO
      </Button>
      {!canAddUbo && (
        <p className="text-yellow-500 text-sm mt-2">Please complete all fields for existing UBOs before adding a new one.</p>
      )}
      {touched.ubos && errors.ubos && typeof errors.ubos === 'string' && (
        <p className="text-red-500 text-sm mt-2">{errors.ubos}</p>
      )}

      {/* -------------------------------------- */}
      {/* DIRECTORS SECTION */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 text-white">
        c. Director Details
      </h4>

      {values.directors.map((d, index) => (
        <div key={index} className="mt-6 border border-gray-600 rounded-lg p-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label>Full Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={d.fullName}
                onChange={(e) => {
                  setDirectorField(index, "fullName", e.target.value);
                  const updatedDirectors = [...directors];
                  updatedDirectors[index].fullName = e.target.value;
                  setFieldValue('directors', updatedDirectors);
                  setFieldTouched(`directors.${index}.fullName`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.directors?.[index]?.fullName && errors.directors?.[index] && typeof errors.directors[index] === 'object' && 'fullName' in errors.directors[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).fullName}</p>
              )}
            </div>

            <div>
              <Label>Date of Appointment <span className="text-red-500">*</span></Label>
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
              <Label>Nationality <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={d.nationality}
                onChange={(e) => {
                  setDirectorField(index, "nationality", e.target.value);
                  const updatedDirectors = [...directors];
                  updatedDirectors[index].nationality = e.target.value;
                  setFieldValue('directors', updatedDirectors);
                  setFieldTouched(`directors.${index}.nationality`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.directors?.[index]?.nationality && errors.directors?.[index] && typeof errors.directors[index] === 'object' && 'nationality' in errors.directors[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).nationality}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-4">
            <div>
              <Label>Address <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={d.address}
                onChange={(e) => {
                  setDirectorField(index, "address", e.target.value);
                  const updatedDirectors = [...directors];
                  updatedDirectors[index].address = e.target.value;
                  setFieldValue('directors', updatedDirectors);
                  setFieldTouched(`directors.${index}.address`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.directors?.[index]?.address && errors.directors?.[index] && typeof errors.directors[index] === 'object' && 'address' in errors.directors[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).address}</p>
              )}
            </div>

            <div>
              <Label>Phone Number <span className="text-red-500">*</span></Label>
              <Input
                type="tel"
                value={d.phoneNumber}
                onChange={(e) => {
                  setDirectorField(index, "phoneNumber", e.target.value);
                  const updatedDirectors = [...directors];
                  updatedDirectors[index].phoneNumber = e.target.value;
                  setFieldValue('directors', updatedDirectors);
                  setFieldTouched(`directors.${index}.phoneNumber`, true);
                }}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.directors?.[index]?.phoneNumber && errors.directors?.[index] && typeof errors.directors[index] === 'object' && 'phoneNumber' in errors.directors[index] && (
                <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).phoneNumber}</p>
              )}
            </div>
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
        disabled={!canAddDirector}
        className={`mt-4 border cursor-pointer ${canAddDirector ? 'border-white text-white' : 'border-gray-500 text-gray-500 opacity-50 cursor-not-allowed'}`}
      >
        Add Director
      </Button>
      {!canAddDirector && (
        <p className="text-yellow-500 text-sm mt-2">Please complete all fields for existing directors before adding a new one.</p>
      )}
      {touched.directors && errors.directors && typeof errors.directors === 'string' && (
        <p className="text-red-500 text-sm mt-2">{errors.directors}</p>
      )}

      {/* -------------------------------------- */}
      {/* PEP Questions */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        d. Is any shareholder, director, UBO a Politically Exposed Person? <span className="text-red-500">*</span>
      </h4>
      <YesNoGroup
        value={form.anyShareholderDirectorUBOPEP}
        onChange={(v) => {
          setField("anyShareholderDirectorUBOPEP", v);
          setFieldValue("anyShareholderDirectorUBOPEP", v);
          setFieldTouched("anyShareholderDirectorUBOPEP", true);
        }}
      />
      {touched.anyShareholderDirectorUBOPEP && errors.anyShareholderDirectorUBOPEP && (
        <p className="text-red-500 text-sm mt-2">{errors.anyShareholderDirectorUBOPEP as string}</p>
      )}

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        e. Is any shareholder / beneficial owner / key managerial person related to a PEP? <span className="text-red-500">*</span>
      </h4>
      <YesNoGroup
        value={form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP}
        onChange={(v) => {
          setField("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", v);
          setFieldValue("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", v);
          setFieldTouched("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", true);
        }}
      />
      {touched.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP && errors.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP && (
        <p className="text-red-500 text-sm mt-2">{errors.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP as string}</p>
      )}

      <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
        f. Does your establishment check to identify PEP customers? <span className="text-red-500">*</span>
      </h4>
      <YesNoGroup
        value={form.hasCustomerPEPChecks}
        onChange={(v) => {
          setField("hasCustomerPEPChecks", v);
          setFieldValue("hasCustomerPEPChecks", v);
          setFieldTouched("hasCustomerPEPChecks", true);
        }}
      />
      {touched.hasCustomerPEPChecks && errors.hasCustomerPEPChecks && (
        <p className="text-red-500 text-sm mt-2">{errors.hasCustomerPEPChecks as string}</p>
      )}

      {/* -------------------------------------- */}
      {/* Trade Association */}
      {/* -------------------------------------- */}
      <h4 className="font-bold text-[22px] mt-10 text-[#C6A95F]">
        Membership of Trade Association
      </h4>

      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Name of Trade Association (Optional)</Label>
          <Input
            type="text"
            value={form.tradeAssociationName}
            onChange={(e) => {
              setField("tradeAssociationName", e.target.value);
              setFieldValue("tradeAssociationName", e.target.value);
              setFieldTouched("tradeAssociationName", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
          {touched.tradeAssociationName && errors.tradeAssociationName && (
            <p className="text-red-500 text-sm mt-2">{errors.tradeAssociationName as string}</p>
          )}
        </div>

        <div>
          <Label>Name of Member (Optional)</Label>
          <Input
            type="text"
            value={form.nameOfMember}
            onChange={(e) => {
              setField("nameOfMember", e.target.value);
              setFieldValue("nameOfMember", e.target.value);
              setFieldTouched("nameOfMember", true);
            }}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
          />
          {touched.nameOfMember && errors.nameOfMember && (
            <p className="text-red-500 text-sm mt-2">{errors.nameOfMember as string}</p>
          )}
        </div>

        <div>
          <Label>Date of Appointment (Optional)</Label>
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
                  const dateString = date ? date.toISOString() : "";
                  setField("dateOfAppointment", dateString);
                  setFieldValue("dateOfAppointment", dateString);
                  setFieldTouched("dateOfAppointment", true);
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
            onChange={() => {
              const newValue = !(form as any)[key];
              setField(key as any, newValue);
              setFieldValue(key as any, newValue);
              setFieldTouched(key as any, true);
            }}
          />
        ))}

        {/* Other */}
        <ServiceCheckbox
          label="Other (please specify)"
          checked={form.accreditationOther}
          onChange={() => {
            const newValue = !form.accreditationOther;
            setField("accreditationOther", newValue);
            setFieldValue("accreditationOther", newValue);
            setFieldTouched("accreditationOther", true);
          }}
        />

        {form.accreditationOther && (
          <div>
            <Input
              type="text"
              value={form.otherAccreditation}
              onChange={(e) => {
                setField("otherAccreditation", e.target.value);
                setFieldValue("otherAccreditation", e.target.value);
                setFieldTouched("otherAccreditation", true);
              }}
              className="w-full bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] mt-2 text-black placeholder:text-black/50"
              placeholder="Specify other accreditation"
            />
            {touched.otherAccreditation && errors.otherAccreditation && (
              <p className="text-red-500 text-sm mt-2">{errors.otherAccreditation as string}</p>
            )}
          </div>
        )}
      </div>

      {/* Upload accreditation certificate */}
      <div className="mt-6">
        <Label>Copy of Valid Accreditation Certificate(s) (Optional)</Label>

        <input
          ref={fileRefs.accreditationRef}
          type="file"
          className="hidden"
          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
          onChange={async (e) => {
            handleSelectFile(e, 'tradeAssociationCertificate');
            const file = e.target.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setTradeAssociationCertificateDocumentId,
              'tradeAssociationCertificateFile'
            );
          }}
        />

        <UploadBox
          file={uploadBoxes.tradeAssociationCertificate}
          prefilledUrl={form.accreditationCertificatePath}
          title="Upload Accreditation Certificates"
          onClick={() => fileRefs.accreditationRef.current?.click()}
          onDrop={async (e) => {
            handleDropFile(e, 'tradeAssociationCertificate');
            const file = e.dataTransfer?.files?.[0] ?? null;
            await uploadFileImmediately(
              file,
              setTradeAssociationCertificateDocumentId,
              'tradeAssociationCertificateFile'
            );
          }}
          onRemove={() => {
            removeFile("tradeAssociationCertificate");
            setTradeAssociationCertificateDocumentId(null);
            setFieldValue('tradeAssociationCertificateFile', null);
            setFieldValue('tradeAssociationCertificateFileId', null);
            setFieldTouched('tradeAssociationCertificateFile', true);
          }}
        />
        {form.accreditationCertificatePath && !uploadBoxes.tradeAssociationCertificate && (
          <a
            href={form.accreditationCertificatePath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View Previous Document
          </a>
        )}
        {touched.tradeAssociationCertificateFile && errors.tradeAssociationCertificateFile && (
          <p className="text-red-500 text-sm mt-2">{errors.tradeAssociationCertificateFile as string}</p>
        )}
      </div>

            {/* -------------------------------------- */}
            {/* Navigation Buttons */}
            {/* -------------------------------------- */}
            <div className="mt-10 flex justify-start gap-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={() => {
                  // Touch array fields to trigger validation errors
                  setFieldTouched('shareholders', true);
                  setFieldTouched('ubos', true);
                  setFieldTouched('directors', true);
                  submitForm();
                }}
                disabled={isSaving || pendingUploads > 0}
                variant="site_btn"
                className="w-[132px] h-[42px] rounded-[10px] text-white"
              >
                {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Save / Next'}
              </Button>
            </div>
          </div>
        </Form>
        );
      }}
    </Formik>
  );
}
