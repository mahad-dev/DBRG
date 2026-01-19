"use client";

import React, { useState, useEffect } from "react";
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
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useStep2CompanyDetails } from '@/hooks/useStep2CompanyDetails';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';
import { parseApiError } from '@/utils/errorHandler';
import { Formik } from 'formik';
import { contributingMemberStep2Schema } from '@/validation';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';

interface StepProps {
  onNext?: () => void;
}

export default function Step2CompanyDetails({ onNext }: StepProps): React.JSX.Element {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;
  const { downloadDocument, downloadingId, extractIdFromPath } = useDocumentDownload();

  // Use the hook with prefill data
  const {
    form,
    setField,
    uploadBoxes,
    setUploadBoxes,
    fileRefs,
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
    // Document IDs from hook
    tradeLicenseDocumentId,
    coiDocumentId,
    passportDocumentId,
    nationalIdDocumentId,
    vatDocumentId,
    taxRegDocumentId,
    addressProofDocumentId,
    tradeAssociationCertificateDocumentId,
    // Document ID setters
    setTradeLicenseDocumentId,
    setCoiDocumentId,
    setPassportDocumentId,
    setNationalIdDocumentId,
    setVatDocumentId,
    setTaxRegDocumentId,
    setAddressProofDocumentId,
    setTradeAssociationCertificateDocumentId,
  } = useStep2CompanyDetails(formData, 2);

  // Debug: Log the arrays from hook
  console.log('📊 Component - shareholders from hook:', shareholders);
  console.log('📊 Component - ubos from hook:', ubos);
  console.log('📊 Component - directors from hook:', directors);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState(0);

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

  // Handle file upload with immediate UI update and background API call
  const handleFileUpload = async (
    file: File | null,
    fieldName: string,
    setFieldValue: any,
    setFieldTouched: any
  ) => {
    console.log('📤 handleFileUpload called:', { fieldName, file: file?.name });

    // Immediately update UI with the file (don't wait for API)
    setFieldValue(fieldName, file);

    // Also update uploadBoxes state to persist the file
    const uploadBoxKey = {
      tradeLicenseFile: 'tradeLicense',
      coiFile: 'coi',
      passportFile: 'passport',
      nationalIdFile: 'nationalId',
      vatDocFile: 'vatDoc',
      taxRegDocFile: 'taxRegDoc',
      addressProofFile: 'addressProof',
      tradeAssociationCertificateFile: 'tradeAssociationCertificate',
    }[fieldName];

    console.log('📦 Upload box key:', uploadBoxKey);

    if (uploadBoxKey) {
      setUploadBoxes(prev => ({ ...prev, [uploadBoxKey]: file }));
    }

    // Clear the old document path from form state so anchor tag disappears
    const pathFieldMap = {
      tradeLicenseFile: 'tradeLicenseDocumentPath',
      coiFile: 'certificateOfIncorporationPath',
      passportFile: 'passportDocumentPath',
      nationalIdFile: 'nationalIdDocumentPath',
      vatDocFile: 'vatDocumentPath',
      taxRegDocFile: 'taxRegistrationDocumentPath',
      addressProofFile: 'addressProofDocumentPath',
      tradeAssociationCertificateFile: 'accreditationCertificatePath',
    }[fieldName];

    if (pathFieldMap) {
      setField(pathFieldMap as keyof typeof form, "");
    }

    if (file) {
      console.log('🚀 Starting upload for:', file.name);
      // Background upload - UI already shows the file
      setPendingUploads((prev) => prev + 1);
      try {
        console.log('📡 Calling uploadDocument API...');
        const documentId = await uploadDocument(file);
        console.log('✅ Upload successful! Document ID:', documentId);
        setFieldValue(`${fieldName}Id`, documentId);

        // Also update the hook's document ID state
        if (fieldName === "tradeLicenseFile") setTradeLicenseDocumentId(documentId);
        else if (fieldName === "coiFile") setCoiDocumentId(documentId);
        else if (fieldName === "passportFile") setPassportDocumentId(documentId);
        else if (fieldName === "nationalIdFile") setNationalIdDocumentId(documentId);
        else if (fieldName === "vatDocFile") setVatDocumentId(documentId);
        else if (fieldName === "taxRegDocFile") setTaxRegDocumentId(documentId);
        else if (fieldName === "addressProofFile") setAddressProofDocumentId(documentId);
        else if (fieldName === "tradeAssociationCertificateFile") setTradeAssociationCertificateDocumentId(documentId);

        setFieldTouched(fieldName, true); // Only touch after successful upload
        toast.success("File uploaded successfully!");
      } catch (error: any) {
        console.error('❌ Upload failed:', error);
        toast.error(parseApiError(error, "File upload failed. Please try again."));
        // Remove file from UI on error
        setFieldValue(fieldName, null);
        setFieldValue(`${fieldName}Id`, null);

        // Clear uploadBoxes state
        if (uploadBoxKey) {
          setUploadBoxes(prev => ({ ...prev, [uploadBoxKey]: null }));
        }

        // Also clear the hook's document ID state
        if (fieldName === "tradeLicenseFile") setTradeLicenseDocumentId(null);
        else if (fieldName === "coiFile") setCoiDocumentId(null);
        else if (fieldName === "passportFile") setPassportDocumentId(null);
        else if (fieldName === "nationalIdFile") setNationalIdDocumentId(null);
        else if (fieldName === "vatDocFile") setVatDocumentId(null);
        else if (fieldName === "taxRegDocFile") setTaxRegDocumentId(null);
        else if (fieldName === "addressProofFile") setAddressProofDocumentId(null);
        else if (fieldName === "tradeAssociationCertificateFile") setTradeAssociationCertificateDocumentId(null);

        setFieldTouched(fieldName, true); // Touch on error too
      } finally {
        setPendingUploads((prev) => prev - 1);
      }
    } else {
      setFieldValue(`${fieldName}Id`, null);

      // Also clear the hook's document ID state when file is removed
      if (fieldName === "tradeLicenseFile") setTradeLicenseDocumentId(null);
      else if (fieldName === "coiFile") setCoiDocumentId(null);
      else if (fieldName === "passportFile") setPassportDocumentId(null);
      else if (fieldName === "nationalIdFile") setNationalIdDocumentId(null);
      else if (fieldName === "vatDocFile") setVatDocumentId(null);
      else if (fieldName === "taxRegDocFile") setTaxRegDocumentId(null);
      else if (fieldName === "addressProofFile") setAddressProofDocumentId(null);
      else if (fieldName === "tradeAssociationCertificateFile") setTradeAssociationCertificateDocumentId(null);

      setFieldTouched(fieldName, true); // Touch when file is removed
    }
  };

  // Initial values for Formik - use useMemo to prevent recreation on every render
  const initialValues = React.useMemo(() => ({
    legalEntityName: form.legalEntityName || '',
    entityLegalType: form.entityLegalType || '',
    tradeLicenseNumber: form.tradeLicenseNumber || '',
    licensingAuthority: form.licensingAuthority || '',
    dateOfIssuance: form.dateOfIssuance || '',
    dateOfExpiry: form.dateOfExpiry || '',
    countryOfIncorporation: form.countryOfIncorporation || '',
    dateOfIncorporation: form.dateOfIncorporation || '',
    tradeLicenseFile: uploadBoxes.tradeLicense,
    tradeLicenseFilePath: form.tradeLicenseDocumentPath || '',
    tradeLicenseFileId: tradeLicenseDocumentId,
    coiFile: uploadBoxes.coi,
    coiFilePath: form.certificateOfIncorporationPath || '',
    coiFileId: coiDocumentId,
    passportId: form.passportId || '',
    passportFile: uploadBoxes.passport,
    passportFilePath: form.passportDocumentPath || '',
    passportFileId: passportDocumentId,
    nationalId: form.nationalId || '',
    nationalIdFile: uploadBoxes.nationalId,
    nationalIdFilePath: form.nationalIdDocumentPath || '',
    nationalIdFileId: nationalIdDocumentId,
    vatNumber: form.vatNumber || '',
    vatDocFile: uploadBoxes.vatDoc,
    vatDocFilePath: form.vatDocumentPath || '',
    vatDocFileId: vatDocumentId,
    taxRegistrationNumber: form.taxRegistrationNumber || '',
    taxRegDocFile: uploadBoxes.taxRegDoc,
    taxRegDocFilePath: form.taxRegistrationDocumentPath || '',
    taxRegDocFileId: taxRegDocumentId,
    website: form.website || '',
    officialEmail: form.officialEmail || '',
    phoneNumber: form.phoneNumber || '',
    primaryContactName: form.primaryContactName || '',
    primaryContactDesignation: form.primaryContactDesignation || '',
    primaryContactEmail: form.primaryContactEmail || '',
    registeredOfficeAddress: form.registeredOfficeAddress || '',
    addressProofFile: uploadBoxes.addressProof,
    addressProofFilePath: form.addressProofDocumentPath || '',
    addressProofFileId: addressProofDocumentId,
    shareholders: shareholders,
    ubos: ubos,
    directors: directors,
    anyShareholderDirectorUBOPEP: form.anyShareholderDirectorUBOPEP ?? null,
    anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: form.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP ?? null,
    hasCustomerPEPChecks: form.hasCustomerPEPChecks ?? null,
    tradeAssociationName: form.tradeAssociationName || null,
    nameOfMember: form.nameOfMember || null,
    dateOfAppointment: form.dateOfAppointment || '',
    lbma: form.lbma || false,
    dmccDgd: form.dmccDgd || false,
    dmccMdb: form.dmccMdb || false,
    rjc: form.rjc || false,
    iages: form.iages || false,
    accreditationOther: form.accreditationOther || false,
    otherAccreditation: form.otherAccreditation || '',
    tradeAssociationCertificateFile: uploadBoxes.tradeAssociationCertificate,
    tradeAssociationCertificateFilePath: form.accreditationCertificatePath || '',
    tradeAssociationCertificateFileId: tradeAssociationCertificateDocumentId,
  }), [
    form,
    uploadBoxes,
    shareholders,
    ubos,
    directors,
    tradeLicenseDocumentId,
    coiDocumentId,
    passportDocumentId,
    nationalIdDocumentId,
    vatDocumentId,
    taxRegDocumentId,
    addressProofDocumentId,
    tradeAssociationCertificateDocumentId,
  ]);

  // Helper function to convert empty strings to null
  const emptyToNull = (value: any): any => {
    if (value === "" || value === undefined) return null;
    return value;
  };

  const handleSubmit = async (values: typeof initialValues, _helpers: any) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Upload shareholder files and update shareholder data
      const updatedShareholders = await Promise.all(
        values.shareholders.map(async (shareholder: any) => {
          let proofDocId: number | null = shareholder.proofFileId || null;

          // Upload shareholding proof document if exists
          if (shareholder.proofFile && !shareholder.proofFileId) {
            proofDocId = await uploadDocument(shareholder.proofFile);
          }

          return {
            fullName: emptyToNull(shareholder.fullName),
            passportId: emptyToNull(shareholder.passportId),
            nationalIdNumber: emptyToNull(shareholder.nationalIdNumber),
            shareholdingPercentage: shareholder.shareholdingPercentage,
            nationality: emptyToNull(shareholder.nationality),
            dateOfAppointment: emptyToNull(shareholder.dateOfAppointment),
            address: emptyToNull(shareholder.address),
            passportDocument: values.passportFileId,
            nationalIdDocument: values.nationalIdFileId,
            shareholdingDocument: proofDocId,
          };
        })
      );

      // Upload UBO files and update UBO data
      const updatedUbos = await Promise.all(
        values.ubos.map(async (ubo: any) => {
          let confirmationDocId: number | null = ubo.confirmationFileId || null;

          // Upload UBO confirmation document if exists
          if (ubo.confirmationFile && !ubo.confirmationFileId) {
            confirmationDocId = await uploadDocument(ubo.confirmationFile);
          }

          return {
            fullName: emptyToNull(ubo.fullName),
            passportId: emptyToNull(ubo.passportId),
            nationalIdNumber: emptyToNull(ubo.nationalIdNumber),
            ownershipPercentage: ubo.ownershipPercentage,
            nationality: emptyToNull(ubo.nationality),
            address: emptyToNull(ubo.address),
            passportDocument: values.passportFileId,
            nationalIdDocument: values.nationalIdFileId,
            uboConfirmationDocument: confirmationDocId,
          };
        })
      );

      // Build refineryAccreditations array from checkboxes
      const refineryAccreditations: number[] = [];
      if (values.lbma) refineryAccreditations.push(0); // LBMA
      if (values.dmccDgd) refineryAccreditations.push(1); // DMCC DGD
      if (values.dmccMdb) refineryAccreditations.push(2); // DMCC MDB
      if (values.rjc) refineryAccreditations.push(3); // RJC
      if (values.iages) refineryAccreditations.push(4); // IAGES
      if (values.accreditationOther) refineryAccreditations.push(5); // Other

      // Clean directors data - convert empty strings to null
      const cleanedDirectors = values.directors.map((d: any) => ({
        fullName: emptyToNull(d.fullName),
        dateOfAppointment: emptyToNull(d.dateOfAppointment),
        nationality: emptyToNull(d.nationality),
        address: emptyToNull(d.address),
        phoneNumber: emptyToNull(d.phoneNumber),
      }));

      // Save form data
      await saveUploadDetails({
        membershipType: formData.membershipType,
        companyDetails: {
          legalEntityName: emptyToNull(values.legalEntityName),
          entityLegalType: emptyToNull(values.entityLegalType),
          tradeLicenseNumber: emptyToNull(values.tradeLicenseNumber),
          licensingAuthority: emptyToNull(values.licensingAuthority),
          dateOfIssuance: emptyToNull(values.dateOfIssuance),
          dateOfExpiry: emptyToNull(values.dateOfExpiry),
          countryOfIncorporation: emptyToNull(values.countryOfIncorporation),
          dateOfIncorporation: emptyToNull(values.dateOfIncorporation),
          passportId: emptyToNull(values.passportId),
          nationalId: emptyToNull(values.nationalId),
          passportDocument: values.passportFileId,
          nationalIdDocument: values.nationalIdFileId,
          isRegisteredForVAT: true,
          vatNumber: emptyToNull(values.vatNumber),
          vatDocument: values.vatDocFileId,
          isRegisteredForCorporateTax: true,
          taxRegistrationNumber: emptyToNull(values.taxRegistrationNumber),
          taxRegistrationDocument: values.taxRegDocFileId,
          website: emptyToNull(values.website),
          officialEmail: emptyToNull(values.officialEmail),
          phoneNumber: emptyToNull(values.phoneNumber),
          primaryContactName: emptyToNull(values.primaryContactName),
          primaryContactDesignation: emptyToNull(values.primaryContactDesignation),
          primaryContactEmail: emptyToNull(values.primaryContactEmail),
          registeredOfficeAddress: emptyToNull(values.registeredOfficeAddress),
          addressProofDocument: values.addressProofFileId,
          anyShareholderDirectorUBOPEP: values.anyShareholderDirectorUBOPEP ?? false,
          anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: values.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP ?? false,
          hasCustomerPEPChecks: values.hasCustomerPEPChecks ?? false,
          shareholdingType: 1, // Default to individual (you may need to add this field to the form)
          tradeAssociationName: emptyToNull(values.tradeAssociationName),
          nameOfMember: emptyToNull(values.nameOfMember),
          dateOfAppointment: emptyToNull(values.dateOfAppointment),
          refineryAccreditations: refineryAccreditations,
          otherAccreditation: emptyToNull(values.otherAccreditation),
          tradeLicenseDocument: values.tradeLicenseFileId,
          certificateOfIncorporation: values.coiFileId,
          accreditationCertificate: values.tradeAssociationCertificateFileId,
          shareholders: updatedShareholders,
          ultimateBeneficialOwners: updatedUbos,
          directors: cleanedDirectors,
        }
      }, MemberApplicationSection.CompanyDetails);

      toast.success('Company details saved successfully!');
      setCurrentStep(3);
      onNext?.();
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error: any) {
      toast.error(parseApiError(error, 'Failed to save company details. Please try again.'));
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={contributingMemberStep2Schema}
      onSubmit={handleSubmit}
      enableReinitialize={true}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm, validateForm }) => (
        <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg min-h-screen text-white">
          <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
            Section 2 - Company Details
          </h2>

          {/* Legal Entity Name + Entity Type */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>Legal Entity Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.legalEntityName}
                onChange={(e) => {
                  setFieldValue("legalEntityName", e.target.value);
                  setField("legalEntityName", e.target.value);
                }}
                onBlur={() => setFieldTouched("legalEntityName", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Legal Entity Name"
              />
              {touched.legalEntityName && errors.legalEntityName && (
                <p className="text-red-500 text-sm mt-1">{errors.legalEntityName}</p>
              )}
            </div>

            <div>
              <Label>Entity Legal Type <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.entityLegalType}
                onChange={(e) => {
                  setFieldValue("entityLegalType", e.target.value);
                  setField("entityLegalType", e.target.value);
                }}
                onBlur={() => setFieldTouched("entityLegalType", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Entity Legal Type"
              />
              {touched.entityLegalType && errors.entityLegalType && (
                <p className="text-red-500 text-sm mt-2">{errors.entityLegalType as string}</p>
              )}
            </div>
          </div>

          {/* Trade License No + Licensing Authority */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>Trade License / Registration No <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.tradeLicenseNumber}
                onChange={(e) => {
                  setFieldValue("tradeLicenseNumber", e.target.value);
                  setField("tradeLicenseNumber", e.target.value);
                }}
                onBlur={() => setFieldTouched("tradeLicenseNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Trade License/Registration No"
              />
              {touched.tradeLicenseNumber && errors.tradeLicenseNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.tradeLicenseNumber}</p>
              )}
            </div>

            <div>
              <Label>Licensing Authority <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.licensingAuthority}
                onChange={(e) => {
                  setFieldValue("licensingAuthority", e.target.value);
                  setField("licensingAuthority", e.target.value);
                }}
                onBlur={() => setFieldTouched("licensingAuthority", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Licensing Authority"
              />
              {touched.licensingAuthority && errors.licensingAuthority && (
                <p className="text-red-500 text-sm mt-1">{errors.licensingAuthority}</p>
              )}
            </div>
          </div>

          {/* Upload Trade License */}
          <div className="mt-6">
            <Label>Upload Trade License <span className="text-red-500">*</span></Label>

            <input
              ref={fileRefs.licenseRef}
              type="file"
              className="hidden"
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "tradeLicenseFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Drag And Drop or Select"
              file={values.tradeLicenseFile}
              prefilledUrl={form.tradeLicenseDocumentPath}
              onClick={() => fileRefs.licenseRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "tradeLicenseFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("tradeLicense");
                setFieldValue("tradeLicenseFile", null);
                setFieldValue("tradeLicenseFileId", null);
              }}
            />

            {touched.tradeLicenseFile && errors.tradeLicenseFile && !values.tradeLicenseFileId && (
              <p className="text-red-500 text-sm mt-1">{errors.tradeLicenseFile as string}</p>
            )}

            {form.tradeLicenseDocumentPath && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.tradeLicenseDocumentPath), "Trade License")}
                disabled={downloadingId === extractIdFromPath(form.tradeLicenseDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.tradeLicenseDocumentPath) ? 'Downloading...' : 'Download Trade License'}
              </button>
            )}
          </div>

          {/* Issuance + Expiry */}
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
                      const isoDate = date ? date.toISOString() : "";
                      setField("dateOfIssuance", isoDate);
                      setFieldValue("dateOfIssuance", isoDate);
                      setFieldTouched("dateOfIssuance", true);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {touched.dateOfIssuance && errors.dateOfIssuance && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfIssuance}</p>
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
                      const isoDate = date ? date.toISOString() : "";
                      setField("dateOfExpiry", isoDate);
                      setFieldValue("dateOfExpiry", isoDate);
                      setFieldTouched("dateOfExpiry", true);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {touched.dateOfExpiry && errors.dateOfExpiry && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfExpiry}</p>
              )}
            </div>
          </div>

          {/* Country + Date of Incorporation */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>Country of Incorporation <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.countryOfIncorporation}
                onChange={(e) => {
                  setFieldValue("countryOfIncorporation", e.target.value);
                  setField("countryOfIncorporation", e.target.value);
                }}
                onBlur={() => setFieldTouched("countryOfIncorporation", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Dubai"
              />
              {touched.countryOfIncorporation && errors.countryOfIncorporation && (
                <p className="text-red-500 text-sm mt-1">{errors.countryOfIncorporation}</p>
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
                      const isoDate = date ? date.toISOString() : "";
                      setField("dateOfIncorporation", isoDate);
                      setFieldValue("dateOfIncorporation", isoDate);
                      setFieldTouched("dateOfIncorporation", true);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {touched.dateOfIncorporation && errors.dateOfIncorporation && (
                <p className="text-red-500 text-sm mt-1">{errors.dateOfIncorporation}</p>
              )}
            </div>
          </div>

          {/* Upload Certificate of Incorporation */}
          <div className="mt-6">
            <Label>Upload Certificate of Incorporation <span className="text-red-500">*</span></Label>

            <input
              ref={fileRefs.coiRef}
              type="file"
              className="hidden"
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "coiFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Drag And Drop or Select"
              file={values.coiFile}
              prefilledUrl={form.certificateOfIncorporationPath}
              onClick={() => fileRefs.coiRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "coiFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("coi");
                setFieldValue("coiFile", null);
                setFieldValue("coiFileId", null);
              }}
            />

            {touched.coiFile && errors.coiFile && !values.coiFileId && (
              <p className="text-red-500 text-sm mt-1">{errors.coiFile as string}</p>
            )}

            {form.certificateOfIncorporationPath && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.certificateOfIncorporationPath), "Certificate of Incorporation")}
                disabled={downloadingId === extractIdFromPath(form.certificateOfIncorporationPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.certificateOfIncorporationPath) ? 'Downloading...' : 'Download Certificate of Incorporation'}
              </button>
            )}
          </div>

          {/* Passport ID + Upload Passport */}
          <div className="mt-6">
            <Label>Passport ID <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.passportId}
              onChange={(e) => {
                setFieldValue("passportId", e.target.value);
                setField("passportId", e.target.value);
              }}
              onBlur={() => setFieldTouched("passportId", true)}
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
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "passportFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Drag And Drop or Select"
              file={values.passportFile}
              prefilledUrl={form.passportDocumentPath}
              onClick={() => fileRefs.passportRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "passportFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("passport");
                setFieldValue("passportFile", null);
                setFieldValue("passportFileId", null);
                setFieldTouched("passportFile", true);
              }}
            />
            {touched.passportFile && errors.passportFile && !values.passportFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.passportFile as string}</p>
            )}

            {form.passportDocumentPath && !uploadBoxes.passport && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.passportDocumentPath), "Passport")}
                disabled={downloadingId === extractIdFromPath(form.passportDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.passportDocumentPath) ? 'Downloading...' : 'Download Passport'}
              </button>
            )}
          </div>

          {/* National ID + Upload National ID */}
          <div className="mt-6">
            <Label>National ID Number <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.nationalId}
              onChange={(e) => {
                setFieldValue("nationalId", e.target.value);
                setField("nationalId", e.target.value);
              }}
              onBlur={() => setFieldTouched("nationalId", true)}
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
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "nationalIdFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Drag And Drop or Select"
              file={values.nationalIdFile}
              prefilledUrl={form.nationalIdDocumentPath}
              onClick={() => fileRefs.nationalIdRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "nationalIdFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("nationalId");
                setFieldValue("nationalIdFile", null);
                setFieldValue("nationalIdFileId", null);
                setFieldTouched("nationalIdFile", true);
              }}
            />
            {touched.nationalIdFile && errors.nationalIdFile && !values.nationalIdFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.nationalIdFile as string}</p>
            )}

            {form.nationalIdDocumentPath && !uploadBoxes.nationalId && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.nationalIdDocumentPath), "National ID")}
                disabled={downloadingId === extractIdFromPath(form.nationalIdDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.nationalIdDocumentPath) ? 'Downloading...' : 'Download National ID'}
              </button>
            )}
          </div>

          {/* VAT Number + VAT Document */}
          <div className="mt-6">
            <Label>VAT Number <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.vatNumber}
              onChange={(e) => {
                setFieldValue("vatNumber", e.target.value);
                setField("vatNumber", e.target.value);
              }}
              onBlur={() => setFieldTouched("vatNumber", true)}
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
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "vatDocFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Upload VAT Document"
              file={values.vatDocFile}
              prefilledUrl={form.vatDocumentPath}
              onClick={() => fileRefs.vatRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "vatDocFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("vatDoc");
                setFieldValue("vatDocFile", null);
                setFieldValue("vatDocFileId", null);
                setFieldTouched("vatDocFile", true);
              }}
            />
            {touched.vatDocFile && errors.vatDocFile && !values.vatDocFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.vatDocFile as string}</p>
            )}

            {form.vatDocumentPath && !uploadBoxes.vatDoc && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.vatDocumentPath), "VAT Document")}
                disabled={downloadingId === extractIdFromPath(form.vatDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.vatDocumentPath) ? 'Downloading...' : 'Download VAT Document'}
              </button>
            )}
          </div>

          {/* Tax Registration Number + Document */}
          <div className="mt-6">
            <Label>Tax Registration Number <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.taxRegistrationNumber}
              onChange={(e) => {
                setFieldValue("taxRegistrationNumber", e.target.value);
                setField("taxRegistrationNumber", e.target.value);
              }}
              onBlur={() => setFieldTouched("taxRegistrationNumber", true)}
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
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "taxRegDocFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Upload Tax Registration Document"
              file={values.taxRegDocFile}
              prefilledUrl={form.taxRegistrationDocumentPath}
              onClick={() => fileRefs.taxRegRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "taxRegDocFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("taxRegDoc");
                setFieldValue("taxRegDocFile", null);
                setFieldValue("taxRegDocFileId", null);
                setFieldTouched("taxRegDocFile", true);
              }}
            />
            {touched.taxRegDocFile && errors.taxRegDocFile && !values.taxRegDocFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.taxRegDocFile as string}</p>
            )}

            {form.taxRegistrationDocumentPath && !uploadBoxes.taxRegDoc && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.taxRegistrationDocumentPath), "Tax Registration")}
                disabled={downloadingId === extractIdFromPath(form.taxRegistrationDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.taxRegistrationDocumentPath) ? 'Downloading...' : 'Download Tax Registration Document'}
              </button>
            )}
          </div>

          {/* Website + Email + Phone */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Website <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.website}
                onChange={(e) => {
                  setFieldValue("website", e.target.value);
                  setField("website", e.target.value);
                }}
                onBlur={() => setFieldTouched("website", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Website"
              />
              {touched.website && errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website as string}</p>
              )}
            </div>

            <div>
              <Label>Email (Official) <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.officialEmail}
                onChange={(e) => {
                  setFieldValue("officialEmail", e.target.value);
                  setField("officialEmail", e.target.value);
                }}
                onBlur={() => setFieldTouched("officialEmail", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Email"
              />
              {touched.officialEmail && errors.officialEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.officialEmail}</p>
              )}
            </div>

            <div>
              <Label>Phone Number <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.phoneNumber}
                onChange={(e) => {
                  setFieldValue("phoneNumber", e.target.value);
                  setField("phoneNumber", e.target.value);
                }}
                onBlur={() => setFieldTouched("phoneNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Phone Number"
              />
              {touched.phoneNumber && errors.phoneNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
              )}
            </div>
          </div>

          {/* Primary Contact Person */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>Primary Contact – Name <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.primaryContactName}
                onChange={(e) => {
                  setFieldValue("primaryContactName", e.target.value);
                  setField("primaryContactName", e.target.value);
                }}
                onBlur={() => setFieldTouched("primaryContactName", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Primary Contact – Name"
              />
              {touched.primaryContactName && errors.primaryContactName && (
                <p className="text-red-500 text-sm mt-1">{errors.primaryContactName}</p>
              )}
            </div>

            <div>
              <Label>Primary Contact – Designation <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.primaryContactDesignation}
                onChange={(e) => {
                  setFieldValue("primaryContactDesignation", e.target.value);
                  setField("primaryContactDesignation", e.target.value);
                }}
                onBlur={() => setFieldTouched("primaryContactDesignation", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Primary Contact – Designation"
              />
              {touched.primaryContactDesignation && errors.primaryContactDesignation && (
                <p className="text-red-500 text-sm mt-1">{errors.primaryContactDesignation}</p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <Label>Primary Contact – Email <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.primaryContactEmail}
              onChange={(e) => {
                setFieldValue("primaryContactEmail", e.target.value);
                setField("primaryContactEmail", e.target.value);
              }}
              onBlur={() => setFieldTouched("primaryContactEmail", true)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              placeholder="Primary Contact – Email"
            />
            {touched.primaryContactEmail && errors.primaryContactEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.primaryContactEmail}</p>
            )}
          </div>

          {/* Registered Address + Upload Address Proof */}
          <div className="mt-6">
            <Label>Registered Office Address in UAE <span className="text-red-500">*</span></Label>
            <Input
              type="text"
              value={values.registeredOfficeAddress}
              onChange={(e) => {
                setFieldValue("registeredOfficeAddress", e.target.value);
                setField("registeredOfficeAddress", e.target.value);
              }}
              onBlur={() => setFieldTouched("registeredOfficeAddress", true)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              placeholder="Registered Office Address in UAE"
            />
            {touched.registeredOfficeAddress && errors.registeredOfficeAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.registeredOfficeAddress}</p>
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
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "addressProofFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              title="Upload Address Proof"
              file={values.addressProofFile}
              prefilledUrl={form.addressProofDocumentPath}
              onClick={() => fileRefs.addressProofRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "addressProofFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("addressProof");
                setFieldValue("addressProofFile", null);
                setFieldValue("addressProofFileId", null);
                setFieldTouched("addressProofFile", true);
              }}
            />
            {touched.addressProofFile && errors.addressProofFile && !values.addressProofFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.addressProofFile as string}</p>
            )}

            {form.addressProofDocumentPath && !uploadBoxes.addressProof && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.addressProofDocumentPath), "Address Proof")}
                disabled={downloadingId === extractIdFromPath(form.addressProofDocumentPath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.addressProofDocumentPath) ? 'Downloading...' : 'Download Address Proof'}
              </button>
            )}
          </div>

          {/* SHAREHOLDERS SECTION */}
          <h3 className="text-[22px] mt-10 mb-4 font-bold text-[#C6A95F]">
            Ownership and Management Details
          </h3>

          <div className="mt-6">
            <h4 className="font-bold text-[20px] text-white">a. Shareholder Details <span className="text-red-500">*</span></h4>
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
                      const updatedShareholders = [...values.shareholders];
                      updatedShareholders[index] = { ...updatedShareholders[index], fullName: e.target.value };
                      setFieldValue("shareholders", updatedShareholders);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.shareholders?.[index]?.fullName && (errors.shareholders?.[index] as any)?.fullName && (
                    <p className="text-red-500 text-sm mt-1">{(errors.shareholders?.[index] as any)?.fullName}</p>
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
                      const updatedShareholders = [...values.shareholders];
                      updatedShareholders[index] = { ...updatedShareholders[index], shareholdingPercentage: value };
                      setFieldValue("shareholders", updatedShareholders);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.shareholders?.[index]?.shareholdingPercentage && (errors.shareholders?.[index] as any)?.shareholdingPercentage && (
                    <p className="text-red-500 text-sm mt-1">{(errors.shareholders?.[index] as any)?.shareholdingPercentage}</p>
                  )}
                </div>

                <div>
                  <Label>Nationality <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={s.nationality}
                    onChange={(e) => {
                      setShareholderField(index, "nationality", e.target.value);
                      const updatedShareholders = [...values.shareholders];
                      updatedShareholders[index] = { ...updatedShareholders[index], nationality: e.target.value };
                      setFieldValue("shareholders", updatedShareholders);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.shareholders?.[index]?.nationality && (errors.shareholders?.[index] as any)?.nationality && (
                    <p className="text-red-500 text-sm mt-1">{(errors.shareholders?.[index] as any)?.nationality}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mt-4">
                <div>
                  <Label>Passport ID <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={s.passportId}
                    onChange={(e) => {
                      setShareholderField(index, "passportId", e.target.value);
                      const updatedShareholders = [...values.shareholders];
                      updatedShareholders[index] = { ...updatedShareholders[index], passportId: e.target.value };
                      setFieldValue("shareholders", updatedShareholders);
                    }}
                    onBlur={() => setFieldTouched(`shareholders[${index}].passportId`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.shareholders?.[index]?.passportId && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && (errors.shareholders[index] as any).passportId && (
                    <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).passportId}</p>
                  )}
                </div>

                <div>
                  <Label>National ID Number <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={s.nationalIdNumber}
                    onChange={(e) => {
                      setShareholderField(index, "nationalIdNumber", e.target.value);
                      const updatedShareholders = [...values.shareholders];
                      updatedShareholders[index] = { ...updatedShareholders[index], nationalIdNumber: e.target.value };
                      setFieldValue("shareholders", updatedShareholders);
                    }}
                    onBlur={() => setFieldTouched(`shareholders[${index}].nationalIdNumber`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.shareholders?.[index]?.nationalIdNumber && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && (errors.shareholders[index] as any).nationalIdNumber && (
                    <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).nationalIdNumber}</p>
                  )}
                </div>

                <div>
                  <Label>Date of Appointment <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                        onBlur={() => setFieldTouched(`shareholders[${index}].dateOfAppointment`, true)}
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
                          const isoDate = date ? date.toISOString() : "";
                          setShareholderField(index, "dateOfAppointment", isoDate);
                          const updatedShareholders = [...values.shareholders];
                          updatedShareholders[index] = { ...updatedShareholders[index], dateOfAppointment: isoDate };
                          setFieldValue("shareholders", updatedShareholders);
                          setFieldTouched(`shareholders[${index}].dateOfAppointment`, true);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {touched.shareholders?.[index]?.dateOfAppointment && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && (errors.shareholders[index] as any).dateOfAppointment && (
                    <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).dateOfAppointment}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Label>Address <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={s.address}
                  onChange={(e) => {
                    setShareholderField(index, "address", e.target.value);
                    const updatedShareholders = [...values.shareholders];
                    updatedShareholders[index] = { ...updatedShareholders[index], address: e.target.value };
                    setFieldValue("shareholders", updatedShareholders);
                  }}
                  onBlur={() => setFieldTouched(`shareholders[${index}].address`, true)}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                />
                {touched.shareholders?.[index]?.address && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && (errors.shareholders[index] as any).address && (
                  <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).address}</p>
                )}
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
                    // Immediately update UI
                    setFieldValue(`shareholders[${index}].proofFile`, file);
                    handleShareholderFile(index, file);

                    if (file) {
                      // Background upload
                      setPendingUploads((prev) => prev + 1);
                      try {
                        const documentId = await uploadDocument(file);
                        setFieldValue(`shareholders[${index}].proofFileId`, documentId);
                        setFieldTouched(`shareholders[${index}].proofFile`, true);
                        toast.success("Shareholding proof uploaded successfully!");
                      } catch (error) {
                        toast.error("File upload failed. Please try again.");
                        setFieldValue(`shareholders[${index}].proofFile`, null);
                        setFieldValue(`shareholders[${index}].proofFileId`, null);
                        handleShareholderFile(index, null);
                        setFieldTouched(`shareholders[${index}].proofFile`, true);
                      } finally {
                        setPendingUploads((prev) => prev - 1);
                      }
                    } else {
                      setFieldValue(`shareholders[${index}].proofFileId`, null);
                      setFieldTouched(`shareholders[${index}].proofFile`, true);
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
                    // Immediately update UI
                    setFieldValue(`shareholders[${index}].proofFile`, file);
                    handleShareholderFile(index, file);

                    if (file) {
                      // Background upload
                      setPendingUploads((prev) => prev + 1);
                      try {
                        const documentId = await uploadDocument(file);
                        setFieldValue(`shareholders[${index}].proofFileId`, documentId);
                        setFieldTouched(`shareholders[${index}].proofFile`, true);
                        toast.success("Shareholding proof uploaded successfully!");
                      } catch (error) {
                        toast.error("File upload failed. Please try again.");
                        setFieldValue(`shareholders[${index}].proofFile`, null);
                        setFieldValue(`shareholders[${index}].proofFileId`, null);
                        handleShareholderFile(index, null);
                        setFieldTouched(`shareholders[${index}].proofFile`, true);
                      } finally {
                        setPendingUploads((prev) => prev - 1);
                      }
                    } else {
                      setFieldValue(`shareholders[${index}].proofFileId`, null);
                      setFieldTouched(`shareholders[${index}].proofFile`, true);
                    }
                  }}
                  onRemove={() => {
                    handleShareholderFile(index, null);
                    setFieldValue(`shareholders[${index}].proofFile`, null);
                    setFieldValue(`shareholders[${index}].proofFileId`, null);
                    setFieldTouched(`shareholders[${index}].proofFile`, true);
                  }}
                />
                {touched.shareholders?.[index]?.proofFile && errors.shareholders?.[index] && typeof errors.shareholders[index] === 'object' && (errors.shareholders[index] as any).proofFile && pendingUploads === 0 && (
                  <p className="text-red-500 text-sm mt-2">{(errors.shareholders[index] as any).proofFile}</p>
                )}

                {s.proofFilePath && !s.proofFile && (
                  <button
                    type="button"
                    onClick={() => downloadDocument(extractIdFromPath(s.proofFilePath), "Shareholding Proof")}
                    disabled={downloadingId === extractIdFromPath(s.proofFilePath)}
                    className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === extractIdFromPath(s.proofFilePath) ? 'Downloading...' : 'Download Shareholding Proof'}
                  </button>
                )}
              </div>

              <Button
                className="mt-4 border cursor-pointer border-red-400 text-red-400"
                onClick={() => {
                  removeShareholder(index);
                  const updatedShareholders = values.shareholders.filter((_, i) => i !== index);
                  setFieldValue("shareholders", updatedShareholders);
                }}
              >
                Remove Shareholder
              </Button>
            </div>
          ))}

          {touched.shareholders && typeof errors.shareholders === 'string' && (
            <p className="text-red-500 text-sm mt-1">{errors.shareholders}</p>
          )}

          <Button
            onClick={() => {
              // Check if the last shareholder is complete before adding a new one
              if (values.shareholders.length > 0) {
                const lastShareholder = values.shareholders[values.shareholders.length - 1];
                const isComplete = lastShareholder.fullName &&
                                 lastShareholder.passportId &&
                                 lastShareholder.nationalIdNumber &&
                                 lastShareholder.shareholdingPercentage &&
                                 lastShareholder.nationality &&
                                 lastShareholder.dateOfAppointment &&
                                 lastShareholder.address &&
                                 (lastShareholder.proofFile || lastShareholder.proofFileId);

                if (!isComplete) {
                  toast.error("Please complete the previous shareholder's details before adding a new one");
                  return;
                }
              }

              addShareholder();
              setFieldValue("shareholders", [...values.shareholders, {
                fullName: '',
                passportId: '',
                nationalIdNumber: '',
                shareholdingPercentage: 0,
                nationality: '',
                dateOfAppointment: '',
                address: '',
                proofFile: null,
                proofFilePath: '',
                proofFileId: null,
              }]);
            }}
            className="mt-4 border cursor-pointer border-white text-white"
          >
            Add Shareholder
          </Button>

          {/* UBO SECTION */}
          <h4 className="font-bold text-[20px] mt-10 text-white">
            b. Ultimate Beneficial Owner (UBO) Details <span className="text-red-500">*</span>
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
                      const updatedUbos = [...values.ubos];
                      updatedUbos[index] = { ...updatedUbos[index], fullName: e.target.value };
                      setFieldValue("ubos", updatedUbos);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.ubos?.[index]?.fullName && (errors.ubos?.[index] as any)?.fullName && (
                    <p className="text-red-500 text-sm mt-1">{(errors.ubos?.[index] as any)?.fullName}</p>
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
                      const updatedUbos = [...values.ubos];
                      updatedUbos[index] = { ...updatedUbos[index], ownershipPercentage: value };
                      setFieldValue("ubos", updatedUbos);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.ubos?.[index]?.ownershipPercentage && (errors.ubos?.[index] as any)?.ownershipPercentage && (
                    <p className="text-red-500 text-sm mt-1">{(errors.ubos?.[index] as any)?.ownershipPercentage}</p>
                  )}
                </div>

                <div>
                  <Label>Nationality <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={u.nationality}
                    onChange={(e) => {
                      setUboField(index, "nationality", e.target.value);
                      const updatedUbos = [...values.ubos];
                      updatedUbos[index] = { ...updatedUbos[index], nationality: e.target.value };
                      setFieldValue("ubos", updatedUbos);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.ubos?.[index]?.nationality && (errors.ubos?.[index] as any)?.nationality && (
                    <p className="text-red-500 text-sm mt-1">{(errors.ubos?.[index] as any)?.nationality}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <Label>Passport ID <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={u.passportId}
                    onChange={(e) => {
                      setUboField(index, "passportId", e.target.value);
                      const updatedUbos = [...values.ubos];
                      updatedUbos[index] = { ...updatedUbos[index], passportId: e.target.value };
                      setFieldValue("ubos", updatedUbos);
                    }}
                    onBlur={() => setFieldTouched(`ubos[${index}].passportId`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.ubos?.[index]?.passportId && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && (errors.ubos[index] as any).passportId && (
                    <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).passportId}</p>
                  )}
                </div>

                <div>
                  <Label>National ID Number <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={u.nationalIdNumber}
                    onChange={(e) => {
                      setUboField(index, "nationalIdNumber", e.target.value);
                      const updatedUbos = [...values.ubos];
                      updatedUbos[index] = { ...updatedUbos[index], nationalIdNumber: e.target.value };
                      setFieldValue("ubos", updatedUbos);
                    }}
                    onBlur={() => setFieldTouched(`ubos[${index}].nationalIdNumber`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.ubos?.[index]?.nationalIdNumber && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && (errors.ubos[index] as any).nationalIdNumber && (
                    <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).nationalIdNumber}</p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <Label>Address <span className="text-red-500">*</span></Label>
                <Input
                  type="text"
                  value={u.address}
                  onChange={(e) => {
                    setUboField(index, "address", e.target.value);
                    const updatedUbos = [...values.ubos];
                    updatedUbos[index] = { ...updatedUbos[index], address: e.target.value };
                    setFieldValue("ubos", updatedUbos);
                  }}
                  onBlur={() => setFieldTouched(`ubos[${index}].address`, true)}
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                />
                {touched.ubos?.[index]?.address && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && (errors.ubos[index] as any).address && (
                  <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).address}</p>
                )}
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
                    // Immediately update UI
                    setFieldValue(`ubos[${index}].confirmationFile`, file);
                    handleUboFile(index, file);

                    if (file) {
                      // Background upload
                      setPendingUploads((prev) => prev + 1);
                      try {
                        const documentId = await uploadDocument(file);
                        setFieldValue(`ubos[${index}].confirmationFileId`, documentId);
                        setFieldTouched(`ubos[${index}].confirmationFile`, true);
                        toast.success("UBO confirmation uploaded successfully!");
                      } catch (error) {
                        toast.error("File upload failed. Please try again.");
                        setFieldValue(`ubos[${index}].confirmationFile`, null);
                        setFieldValue(`ubos[${index}].confirmationFileId`, null);
                        handleUboFile(index, null);
                        setFieldTouched(`ubos[${index}].confirmationFile`, true);
                      } finally {
                        setPendingUploads((prev) => prev - 1);
                      }
                    } else {
                      setFieldValue(`ubos[${index}].confirmationFileId`, null);
                      setFieldTouched(`ubos[${index}].confirmationFile`, true);
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
                    // Immediately update UI
                    setFieldValue(`ubos[${index}].confirmationFile`, file);
                    handleUboFile(index, file);

                    if (file) {
                      // Background upload
                      setPendingUploads((prev) => prev + 1);
                      try {
                        const documentId = await uploadDocument(file);
                        setFieldValue(`ubos[${index}].confirmationFileId`, documentId);
                        setFieldTouched(`ubos[${index}].confirmationFile`, true);
                        toast.success("UBO confirmation uploaded successfully!");
                      } catch (error) {
                        toast.error("File upload failed. Please try again.");
                        setFieldValue(`ubos[${index}].confirmationFile`, null);
                        setFieldValue(`ubos[${index}].confirmationFileId`, null);
                        handleUboFile(index, null);
                        setFieldTouched(`ubos[${index}].confirmationFile`, true);
                      } finally {
                        setPendingUploads((prev) => prev - 1);
                      }
                    } else {
                      setFieldValue(`ubos[${index}].confirmationFileId`, null);
                      setFieldTouched(`ubos[${index}].confirmationFile`, true);
                    }
                  }}
                  onRemove={() => {
                    handleUboFile(index, null);
                    setFieldValue(`ubos[${index}].confirmationFile`, null);
                    setFieldValue(`ubos[${index}].confirmationFileId`, null);
                    setFieldTouched(`ubos[${index}].confirmationFile`, true);
                  }}
                />
                {touched.ubos?.[index]?.confirmationFile && errors.ubos?.[index] && typeof errors.ubos[index] === 'object' && (errors.ubos[index] as any).confirmationFile && pendingUploads === 0 && (
                  <p className="text-red-500 text-sm mt-2">{(errors.ubos[index] as any).confirmationFile}</p>
                )}

                {u.confirmationFilePath && !u.confirmationFile && (
                  <button
                    type="button"
                    onClick={() => downloadDocument(extractIdFromPath(u.confirmationFilePath), "UBO Confirmation")}
                    disabled={downloadingId === extractIdFromPath(u.confirmationFilePath)}
                    className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
                  >
                    {downloadingId === extractIdFromPath(u.confirmationFilePath) ? 'Downloading...' : 'Download UBO Confirmation'}
                  </button>
                )}
              </div>

              <Button
                className="mt-4 border cursor-pointer border-red-400 text-red-400"
                onClick={() => {
                  removeUbo(index);
                  const updatedUbos = values.ubos.filter((_, i) => i !== index);
                  setFieldValue("ubos", updatedUbos);
                }}
              >
                Remove UBO
              </Button>
            </div>
          ))}

          {touched.ubos && typeof errors.ubos === 'string' && (
            <p className="text-red-500 text-sm mt-1">{errors.ubos}</p>
          )}

          <Button
            onClick={() => {
              // Check if the last UBO is complete before adding a new one
              if (values.ubos.length > 0) {
                const lastUbo = values.ubos[values.ubos.length - 1];
                const isComplete = lastUbo.fullName &&
                                 lastUbo.passportId &&
                                 lastUbo.nationalIdNumber &&
                                 lastUbo.ownershipPercentage &&
                                 lastUbo.nationality &&
                                 lastUbo.address &&
                                 (lastUbo.confirmationFile || lastUbo.confirmationFileId);

                if (!isComplete) {
                  toast.error("Please complete the previous UBO's details before adding a new one");
                  return;
                }
              }

              addUbo();
              setFieldValue("ubos", [...values.ubos, {
                fullName: '',
                ownershipPercentage: 0,
                nationality: '',
                address: '',
                passportId: '',
                nationalIdNumber: '',
                confirmationFile: null,
                confirmationFilePath: '',
                confirmationFileId: null,
              }]);
            }}
            className="mt-4 border cursor-pointer border-white text-white"
          >
            Add UBO
          </Button>

          {/* DIRECTORS SECTION */}
          <h4 className="font-bold text-[20px] mt-10 text-white">
            c. Director Details <span className="text-red-500">*</span>
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
                      const updatedDirectors = [...values.directors];
                      updatedDirectors[index] = { ...updatedDirectors[index], fullName: e.target.value };
                      setFieldValue("directors", updatedDirectors);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.directors?.[index]?.fullName && (errors.directors?.[index] as any)?.fullName && (
                    <p className="text-red-500 text-sm mt-1">{(errors.directors?.[index] as any)?.fullName}</p>
                  )}
                </div>

                <div>
                  <Label>Date of Appointment <span className="text-red-500">*</span></Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                        onBlur={() => setFieldTouched(`directors[${index}].dateOfAppointment`, true)}
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
                          const isoDate = date ? date.toISOString() : "";
                          setDirectorField(index, "dateOfAppointment", isoDate);
                          const updatedDirectors = [...values.directors];
                          updatedDirectors[index] = { ...updatedDirectors[index], dateOfAppointment: isoDate };
                          setFieldValue("directors", updatedDirectors);
                          setFieldTouched(`directors[${index}].dateOfAppointment`, true);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  {touched.directors?.[index]?.dateOfAppointment && errors.directors?.[index] && typeof errors.directors[index] === 'object' && (errors.directors[index] as any).dateOfAppointment && (
                    <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).dateOfAppointment}</p>
                  )}
                </div>

                <div>
                  <Label>Nationality <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={d.nationality}
                    onChange={(e) => {
                      setDirectorField(index, "nationality", e.target.value);
                      const updatedDirectors = [...values.directors];
                      updatedDirectors[index] = { ...updatedDirectors[index], nationality: e.target.value };
                      setFieldValue("directors", updatedDirectors);
                    }}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.directors?.[index]?.nationality && (errors.directors?.[index] as any)?.nationality && (
                    <p className="text-red-500 text-sm mt-1">{(errors.directors?.[index] as any)?.nationality}</p>
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
                      const updatedDirectors = [...values.directors];
                      updatedDirectors[index] = { ...updatedDirectors[index], address: e.target.value };
                      setFieldValue("directors", updatedDirectors);
                    }}
                    onBlur={() => setFieldTouched(`directors[${index}].address`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.directors?.[index]?.address && errors.directors?.[index] && typeof errors.directors[index] === 'object' && (errors.directors[index] as any).address && (
                    <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).address}</p>
                  )}
                </div>

                <div>
                  <Label>Phone Number <span className="text-red-500">*</span></Label>
                  <Input
                    type="text"
                    value={d.phoneNumber}
                    onChange={(e) => {
                      setDirectorField(index, "phoneNumber", e.target.value);
                      const updatedDirectors = [...values.directors];
                      updatedDirectors[index] = { ...updatedDirectors[index], phoneNumber: e.target.value };
                      setFieldValue("directors", updatedDirectors);
                    }}
                    onBlur={() => setFieldTouched(`directors[${index}].phoneNumber`, true)}
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
                  />
                  {touched.directors?.[index]?.phoneNumber && errors.directors?.[index] && typeof errors.directors[index] === 'object' && (errors.directors[index] as any).phoneNumber && (
                    <p className="text-red-500 text-sm mt-2">{(errors.directors[index] as any).phoneNumber}</p>
                  )}
                </div>
              </div>

              <Button
                className="mt-4 border cursor-pointer border-red-400 text-red-400"
                onClick={() => {
                  removeDirector(index);
                  const updatedDirectors = values.directors.filter((_, i) => i !== index);
                  setFieldValue("directors", updatedDirectors);
                }}
              >
                Remove Director
              </Button>
            </div>
          ))}

          {touched.directors && typeof errors.directors === 'string' && (
            <p className="text-red-500 text-sm mt-1">{errors.directors}</p>
          )}

          <Button
            onClick={() => {
              // Check if the last director is complete before adding a new one
              if (values.directors.length > 0) {
                const lastDirector = values.directors[values.directors.length - 1];
                const isComplete = lastDirector.fullName &&
                                 lastDirector.dateOfAppointment &&
                                 lastDirector.nationality &&
                                 lastDirector.address &&
                                 lastDirector.phoneNumber;

                if (!isComplete) {
                  toast.error("Please complete the previous director's details before adding a new one");
                  return;
                }
              }

              addDirector();
              setFieldValue("directors", [...values.directors, {
                fullName: '',
                dateOfAppointment: '',
                nationality: '',
                address: '',
                phoneNumber: '',
              }]);
            }}
            className="mt-4 border cursor-pointer border-white text-white"
          >
            Add Director
          </Button>

          {/* PEP Questions */}
          <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
            d. Is any shareholder, director, UBO a Politically Exposed Person? <span className="text-red-500">*</span>
          </h4>
          <YesNoGroup
            value={values.anyShareholderDirectorUBOPEP}
            onChange={(v) => {
              setField("anyShareholderDirectorUBOPEP", v);
              setFieldValue("anyShareholderDirectorUBOPEP", v);
              setFieldTouched("anyShareholderDirectorUBOPEP", true);
            }}
            onNoClick={() => setIsDialogOpen(true)}
          />
          {touched.anyShareholderDirectorUBOPEP && errors.anyShareholderDirectorUBOPEP && (
            <p className="text-red-500 text-sm mt-2">{errors.anyShareholderDirectorUBOPEP as string}</p>
          )}

          <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
            e. Is any shareholder / beneficial owner / key managerial person related to a PEP? <span className="text-red-500">*</span>
          </h4>
          <YesNoGroup
            value={values.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP}
            onChange={(v) => {
              setField("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", v);
              setFieldValue("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", v);
              setFieldTouched("anyShareholderBeneficialOwnerKeyPersonRelatedToPEP", true);
            }}
            onNoClick={() => setIsDialogOpen(true)}
          />
          {touched.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP && errors.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP && (
            <p className="text-red-500 text-sm mt-2">{errors.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP as string}</p>
          )}

          <h4 className="font-bold text-[20px] mt-10 mb-3 text-white">
            f. Does your establishment check to identify PEP customers? <span className="text-red-500">*</span>
          </h4>
          <YesNoGroup
            value={values.hasCustomerPEPChecks}
            onChange={(v) => {
              setField("hasCustomerPEPChecks", v);
              setFieldValue("hasCustomerPEPChecks", v);
              setFieldTouched("hasCustomerPEPChecks", true);
            }}
            onNoClick={() => setIsDialogOpen(true)}
          />
          {touched.hasCustomerPEPChecks && errors.hasCustomerPEPChecks && (
            <p className="text-red-500 text-sm mt-2">{errors.hasCustomerPEPChecks as string}</p>
          )}

          {/* Trade Association */}
          <h4 className="font-bold text-[22px] mt-10 text-[#C6A95F]">
            Membership of Trade Association
          </h4>

          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>Name of Trade Association <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.tradeAssociationName || ""}
                onChange={(e) => {
                  setFieldValue("tradeAssociationName", e.target.value);
                  setField("tradeAssociationName", e.target.value);
                }}
                onBlur={() => setFieldTouched("tradeAssociationName", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.tradeAssociationName && errors.tradeAssociationName && (
                <p className="text-red-500 text-sm mt-2">{errors.tradeAssociationName as string}</p>
              )}
            </div>

            <div>
              <Label>Name of Member <span className="text-red-500">*</span></Label>
              <Input
                type="text"
                value={values.nameOfMember || ""}
                onChange={(e) => {
                  setFieldValue("nameOfMember", e.target.value);
                  setField("nameOfMember", e.target.value);
                }}
                onBlur={() => setFieldTouched("nameOfMember", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black"
              />
              {touched.nameOfMember && errors.nameOfMember && (
                <p className="text-red-500 text-sm mt-2">{errors.nameOfMember as string}</p>
              )}
            </div>

            <div>
              <Label>Date of Appointment <span className="text-red-500">*</span></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                    onBlur={() => setFieldTouched("dateOfAppointment", true)}
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
                      const isoDate = date ? date.toISOString() : "";
                      setField("dateOfAppointment", isoDate);
                      setFieldValue("dateOfAppointment", isoDate);
                      setFieldTouched("dateOfAppointment", true);
                    }}
                  />
                </PopoverContent>
              </Popover>
              {touched.dateOfAppointment && errors.dateOfAppointment && (
                <p className="text-red-500 text-sm mt-2">{errors.dateOfAppointment as string}</p>
              )}
            </div>
          </div>

          {/* Accreditations */}
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
                checked={values[key as keyof typeof values] as boolean}
                onChange={() => {
                  const newValue = !values[key as keyof typeof values];
                  setField(key as any, newValue);
                  setFieldValue(key, newValue);
                }}
              />
            ))}

            {/* Other */}
            <ServiceCheckbox
              label="Other (please specify)"
              checked={values.accreditationOther}
              onChange={() => {
                const newValue = !values.accreditationOther;
                setField("accreditationOther", newValue);
                setFieldValue("accreditationOther", newValue);
              }}
            />

            {values.accreditationOther && (
              <Input
                type="text"
                value={values.otherAccreditation}
                onChange={(e) => {
                  setFieldValue("otherAccreditation", e.target.value);
                  setField("otherAccreditation", e.target.value);
                }}
                className="w-full bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] mt-2 text-black placeholder:text-black/50"
                placeholder="Specify other accreditation"
              />
            )}
          </div>

          {/* Upload accreditation certificate */}
          <div className="mt-6">
            <Label>Copy of Valid Accreditation Certificate(s) <span className="text-red-500">*</span></Label>

            <input
              ref={fileRefs.accreditationRef}
              type="file"
              className="hidden"
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(file, "tradeAssociationCertificateFile", setFieldValue, setFieldTouched);
              }}
            />

            <UploadBox
              file={values.tradeAssociationCertificateFile}
              prefilledUrl={form.accreditationCertificatePath}
              title="Upload Accreditation Certificates"
              onClick={() => fileRefs.accreditationRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(file, "tradeAssociationCertificateFile", setFieldValue, setFieldTouched);
              }}
              onRemove={() => {
                removeFile("tradeAssociationCertificate");
                setFieldValue("tradeAssociationCertificateFile", null);
                setFieldValue("tradeAssociationCertificateFileId", null);
                setFieldTouched("tradeAssociationCertificateFile", true);
              }}
            />
            {touched.tradeAssociationCertificateFile && errors.tradeAssociationCertificateFile && !values.tradeAssociationCertificateFileId && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.tradeAssociationCertificateFile as string}</p>
            )}

            {form.accreditationCertificatePath && (
              <button
                type="button"
                onClick={() => downloadDocument(extractIdFromPath(form.accreditationCertificatePath), "Accreditation Certificate")}
                disabled={downloadingId === extractIdFromPath(form.accreditationCertificatePath)}
                className="text-[#C6A95F] underline mt-2 block cursor-pointer disabled:opacity-50"
              >
                {downloadingId === extractIdFromPath(form.accreditationCertificatePath) ? 'Downloading...' : 'Download Accreditation Certificate'}
              </button>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="mt-10 flex justify-start gap-4">
            <Button
              onClick={() => setCurrentStep(1)}
              className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
            >
              Back
            </Button>

            <Button
              onClick={async () => {
                console.log('🔍 === VALIDATION START ===');
                console.log('🔍 Current Form values:', values);
                console.log('🔍 Shareholders:', values.shareholders);
                console.log('🔍 UBOs:', values.ubos);
                console.log('🔍 Directors:', values.directors);

                const validationErrors = await validateForm();
                console.log('🔍 Validation errors:', validationErrors);
                console.log('🔍 Number of errors:', Object.keys(validationErrors).length);

                if (Object.keys(validationErrors).length === 0) {
                  console.log('✅ Form is valid, submitting...');
                  submitForm();
                } else {
                  console.error('❌ Validation failed with errors:', validationErrors);

                  // Mark all error fields as touched to show red error messages
                  // Use batch update to improve performance
                  const touchedFields: Record<string, boolean> = {};
                  Object.keys(validationErrors).forEach(fieldName => {
                    touchedFields[fieldName] = true;

                    // For nested arrays (shareholders, ubos, directors), mark nested fields
                    if (fieldName === 'shareholders' || fieldName === 'ubos' || fieldName === 'directors') {
                      const arrayErrors = validationErrors[fieldName];
                      if (Array.isArray(arrayErrors)) {
                        arrayErrors.forEach((itemError, index) => {
                          if (itemError && typeof itemError === 'object') {
                            Object.keys(itemError).forEach(nestedField => {
                              touchedFields[`${fieldName}[${index}].${nestedField}`] = true;
                            });
                          }
                        });
                      }
                    }
                  });

                  // Apply all touched fields at once
                  Object.keys(touchedFields).forEach(fieldName => {
                    setFieldTouched(fieldName, true, false);
                  });

                  // Show detailed error message
                  const errorCount = Object.keys(validationErrors).length;
                  toast.error(`Please fix ${errorCount} validation error(s) highlighted in red below`);

                  // Scroll to first error
                  setTimeout(() => {
                    const firstError = document.querySelector('.text-red-500');
                    if (firstError) {
                      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }, 100);
                }
              }}
              disabled={isSaving || pendingUploads > 0}
              variant="site_btn"
              className="w-[132px] h-[42px] rounded-[10px] text-white"
            >
              {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Save / Next'}
            </Button>
          </div>

          {/* Special Consideration Dialog */}
          <SpecialConsiderationDialog
            open={isDialogOpen}
            onOpenChange={setIsDialogOpen}
          />
        </div>
      )}
    </Formik>
  );
}
