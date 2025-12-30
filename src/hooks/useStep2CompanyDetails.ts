"use client";

import { useState, useRef, useCallback, useEffect } from "react";

/* -------------------------------
   Types
--------------------------------*/
export interface Shareholder {
  fullName: string;
  passportId: string;
  nationalIdNumber: string;
  shareholdingPercentage: number;
  nationality: string;
  dateOfAppointment: string;
  address: string;
  proofFile: File | null;
  proofFileId?: number | null;
  proofFilePath?: string;
}

export interface UBO {
  fullName: string;
  ownershipPercentage: number;
  nationality: string;
  address: string;
  passportId: string;
  nationalIdNumber: string;
  confirmationFile: File | null;
  confirmationFileId?: number | null;
  confirmationFilePath?: string;
}

export interface Director {
  fullName: string;
  dateOfAppointment: string;
  nationality: string;
  address: string;
  phoneNumber: string;
}

export function useStep2CompanyDetails(payload?: any, sectionNumber?: number) {
  const companyDetails = sectionNumber === 2 ? payload?.companyDetails : payload;

  console.log('🔍 useStep2CompanyDetails - payload:', payload);
  console.log('🔍 useStep2CompanyDetails - sectionNumber:', sectionNumber);
  console.log('🔍 useStep2CompanyDetails - companyDetails:', companyDetails);
  console.log('🔍 useStep2CompanyDetails - shareholders:', companyDetails?.shareholders);
  console.log('🔍 useStep2CompanyDetails - UBOs:', companyDetails?.ultimateBeneficialOwners);
  console.log('🔍 useStep2CompanyDetails - directors:', companyDetails?.directors);
  /* -----------------------------------------
     Company Fields
  ------------------------------------------*/
  const [form, setForm] = useState({
    legalEntityName: "",
    entityLegalType: "",
    tradeLicenseNumber: "",
    licensingAuthority: "",
    dateOfIssuance: "",
    dateOfExpiry: "",
    countryOfIncorporation: "",
    dateOfIncorporation: "",
    passportId: "",
    nationalId: "",
    vatNumber: "",
    taxRegistrationNumber: "",
    website: "",
    officialEmail: "",
    phoneNumber: "",
    primaryContactName: "",
    primaryContactDesignation: "",
    primaryContactEmail: "",
    registeredOfficeAddress: "",
    anyShareholderDirectorUBOPEP: null as boolean | null,
    anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: null as boolean | null,
    hasCustomerPEPChecks: null as boolean | null,
    tradeAssociationName: "",
    nameOfMember: "",
    dateOfAppointment: "",
    lbma: false,
    dmccDgd: false,
    dmccMdb: false,
    rjc: false,
    iages: false,
    accreditationOther: false,
    otherAccreditation: "",
    tradeLicenseDocument: null as number | null,
    tradeLicenseDocumentPath: "",
    certificateOfIncorporation: null as number | null,
    certificateOfIncorporationPath: "",
    passportDocument: null as number | null,
    passportDocumentPath: "",
    nationalIdDocument: null as number | null,
    nationalIdDocumentPath: "",
    vatDocument: null as number | null,
    vatDocumentPath: "",
    taxRegistrationDocument: null as number | null,
    taxRegistrationDocumentPath: "",
    addressProofDocument: null as number | null,
    addressProofDocumentPath: "",
    accreditationCertificate: null as number | null,
    accreditationCertificatePath: "",
  });

  // Document IDs (for upload optimization - files upload on selection, not on submit)
  const [tradeLicenseDocumentId, setTradeLicenseDocumentId] = useState<number | null>(null);
  const [coiDocumentId, setCoiDocumentId] = useState<number | null>(null);
  const [passportDocumentId, setPassportDocumentId] = useState<number | null>(null);
  const [nationalIdDocumentId, setNationalIdDocumentId] = useState<number | null>(null);
  const [vatDocumentId, setVatDocumentId] = useState<number | null>(null);
  const [taxRegDocumentId, setTaxRegDocumentId] = useState<number | null>(null);
  const [addressProofDocumentId, setAddressProofDocumentId] = useState<number | null>(null);
  const [tradeAssociationCertificateDocumentId, setTradeAssociationCertificateDocumentId] = useState<number | null>(null);

  const setField = (field: keyof typeof form, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  /* -----------------------------------------
     Upload Files
  ------------------------------------------*/

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

  /* -----------------------------------------
      Dynamic Shareholders
  ------------------------------------------*/

  const [shareholders, setShareholders] = useState<Shareholder[]>([]);
  const shareholderRefs = useRef(new Map<number, HTMLInputElement>());

  const addShareholder = () => {
    setShareholders((prev) => [
      ...prev,
      {
        fullName: "",
        passportId: "",
        nationalIdNumber: "",
        shareholdingPercentage: 0,
        nationality: "",
        dateOfAppointment: "",
        address: "",
        proofFile: null,
      },
    ]);
  };

  const removeShareholder = (index: number) =>
    setShareholders((prev) => prev.filter((_, i) => i !== index));

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
      // Clear the old path when new file is uploaded so anchor tag disappears
      if (file) {
        updated[index].proofFilePath = "";
      }
      return updated;
    });
  };

  /* -----------------------------------------
      Dynamic UBOs
  ------------------------------------------*/

  const [ubos, setUbos] = useState<UBO[]>([]);
  const uboRefs = useRef(new Map<number, HTMLInputElement>());

  const addUbo = () => {
    setUbos((prev) => [
      ...prev,
      {
        fullName: "",
        ownershipPercentage: 0,
        nationality: "",
        address: "",
        passportId: "",
        nationalIdNumber: "",
        confirmationFile: null,
      },
    ]);
  };

  const removeUbo = (index: number) =>
    setUbos((prev) => prev.filter((_, i) => i !== index));

  const setUboField = <K extends keyof UBO>(
    index: number,
    field: K,
    value: UBO[K]
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
      // Clear the old path when new file is uploaded so anchor tag disappears
      if (file) {
        updated[index].confirmationFilePath = "";
      }
      return updated;
    });
  };

  /* -----------------------------------------
      Directors
  ------------------------------------------*/

  const [directors, setDirectors] = useState<Director[]>([]);

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

  const setDirectorField = <K extends keyof Director>(
    index: number,
    field: K,
    value: Director[K]
  ) => {
    setDirectors((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  // Helper to extract document ID from S3 path
  const extractIdFromPath = (path: string | null): number | null => {
    if (!path) return null;
    // Remove query parameters first (everything after ?)
    const pathWithoutQuery = path.split('?')[0];
    // Extract the filename from the URL
    const filename = pathWithoutQuery.split('/').pop();
    if (!filename) return null;
    // Match pattern: documentId_filename (e.g., "780_Screenshot.png")
    const match = filename.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  };

  // Prefill logic
  useEffect(() => {
    console.log('🚀🚀🚀 useEffect FIRED! - companyDetails.id:', companyDetails?.id);
    console.log('🔍 useEffect triggered - companyDetails:', companyDetails);
    console.log('🔍 Checking arrays:');
    console.log('  - shareholders:', companyDetails?.shareholders);
    console.log('  - UBOs:', companyDetails?.ultimateBeneficialOwners);
    console.log('  - directors:', companyDetails?.directors);

    if (!companyDetails) {
      console.log('⚠️ companyDetails is null/undefined, skipping prefill');
      return;
    }

    console.log('✅ companyDetails exists, starting prefill...');

    // Parse refineryAccreditations from comma-separated string
    let accreditationNumbers: number[] = [];
    if (companyDetails.refineryAccreditations) {
      if (typeof companyDetails.refineryAccreditations === 'string') {
        accreditationNumbers = companyDetails.refineryAccreditations
          .split(',')
          .map((num: string) => parseInt(num.trim(), 10))
          .filter((num: number) => !isNaN(num));
      } else if (Array.isArray(companyDetails.refineryAccreditations)) {
        accreditationNumbers = companyDetails.refineryAccreditations;
      }
    }

    // Company form fields
    setForm({
      legalEntityName: companyDetails.legalEntityName || "",
      entityLegalType: companyDetails.entityLegalType || "",
      tradeLicenseNumber: companyDetails.tradeLicenseNumber || "",
      licensingAuthority: companyDetails.licensingAuthority || "",
      dateOfIssuance: companyDetails.dateOfIssuance || "",
      dateOfExpiry: companyDetails.dateOfExpiry || "",
      countryOfIncorporation: companyDetails.countryOfIncorporation || "",
      dateOfIncorporation: companyDetails.dateOfIncorporation || "",
      passportId: companyDetails.passportId || "",
      nationalId: companyDetails.nationalId || "",
      vatNumber: companyDetails.vatNumber || "",
      taxRegistrationNumber: companyDetails.taxRegistrationNumber || "",
      website: companyDetails.website || "",
      officialEmail: companyDetails.officialEmail || "",
      phoneNumber: companyDetails.phoneNumber || "",
      primaryContactName: companyDetails.primaryContactName || "",
      primaryContactDesignation: companyDetails.primaryContactDesignation || "",
      primaryContactEmail: companyDetails.primaryContactEmail || "",
      registeredOfficeAddress: companyDetails.registeredOfficeAddress || "",
      anyShareholderDirectorUBOPEP: companyDetails.anyShareholderDirectorUBOPEP ?? null,
      anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: companyDetails.anyShareholderBeneficialOwnerKeyPersonRelatedToPEP ?? null,
      hasCustomerPEPChecks: companyDetails.hasCustomerPEPChecks ?? null,
      tradeAssociationName: companyDetails.tradeAssociationName || "",
      nameOfMember: companyDetails.nameOfMember || "",
      dateOfAppointment: companyDetails.dateOfAppointment || "",
      lbma: accreditationNumbers.includes(0),
      dmccDgd: accreditationNumbers.includes(1),
      dmccMdb: accreditationNumbers.includes(2),
      rjc: accreditationNumbers.includes(3),
      iages: accreditationNumbers.includes(4),
      accreditationOther: accreditationNumbers.includes(5),
      otherAccreditation: companyDetails.otherAccreditation || "",
      tradeLicenseDocument: companyDetails.tradeLicenseDocument || null,
      tradeLicenseDocumentPath: companyDetails.tradeLicenseDocumentPath || "",
      certificateOfIncorporation: companyDetails.certificateOfIncorporation || null,
      certificateOfIncorporationPath: companyDetails.certificateOfIncorporationPath || "",
      passportDocument: companyDetails.passportDocument || null,
      passportDocumentPath: companyDetails.passportDocumentPath || "",
      nationalIdDocument: companyDetails.nationalIdDocument || null,
      nationalIdDocumentPath: companyDetails.nationalIdDocumentPath || "",
      vatDocument: companyDetails.vatDocument || null,
      vatDocumentPath: companyDetails.vatDocumentPath || "",
      taxRegistrationDocument: companyDetails.taxRegistrationDocument || null,
      taxRegistrationDocumentPath: companyDetails.taxRegistrationDocumentPath || "",
      addressProofDocument: companyDetails.addressProofDocument || null,
      addressProofDocumentPath: companyDetails.addressProofDocumentPath || "",
      accreditationCertificate: companyDetails.accreditationCertificate || null,
      accreditationCertificatePath: companyDetails.accreditationCertificatePath || "",
    });

    // Prefill document IDs from existing data
    setTradeLicenseDocumentId(
      companyDetails.tradeLicenseDocument ??
      extractIdFromPath(companyDetails.tradeLicenseDocumentPath ?? null)
    );
    setCoiDocumentId(
      companyDetails.certificateOfIncorporation ??
      extractIdFromPath(companyDetails.certificateOfIncorporationPath ?? null)
    );
    setPassportDocumentId(
      companyDetails.passportDocument ??
      extractIdFromPath(companyDetails.passportDocumentPath ?? null)
    );
    setNationalIdDocumentId(
      companyDetails.nationalIdDocument ??
      extractIdFromPath(companyDetails.nationalIdDocumentPath ?? null)
    );
    setVatDocumentId(
      companyDetails.vatDocument ??
      extractIdFromPath(companyDetails.vatDocumentPath ?? null)
    );
    setTaxRegDocumentId(
      companyDetails.taxRegistrationDocument ??
      extractIdFromPath(companyDetails.taxRegistrationDocumentPath ?? null)
    );
    setAddressProofDocumentId(
      companyDetails.addressProofDocument ??
      extractIdFromPath(companyDetails.addressProofDocumentPath ?? null)
    );
    setTradeAssociationCertificateDocumentId(
      companyDetails.accreditationCertificate ??
      extractIdFromPath(companyDetails.accreditationCertificatePath ?? null)
    );

    // Shareholders
    if (companyDetails.shareholders && Array.isArray(companyDetails.shareholders)) {
      console.log('✅ Prefilling shareholders, count:', companyDetails.shareholders.length);
      const mappedShareholders = companyDetails.shareholders.map((s: any) => ({
        fullName: s.fullName || "",
        passportId: s.passportId || "",
        nationalIdNumber: s.nationalIdNumber || "",
        shareholdingPercentage: s.shareholdingPercentage || 0,
        nationality: s.nationality || "",
        dateOfAppointment: s.dateOfAppointment || "",
        address: s.address || "",
        proofFile: null, // Files can't be prefilled from URLs
        proofFileId: s.shareholdingDocumentId || s.shareholdingDocument || null,
        proofFilePath: s.shareholdingDocumentPath || "",
      }));
      console.log('✅ Mapped shareholders:', mappedShareholders);
      setShareholders(mappedShareholders);
    } else {
      console.log('⚠️ No shareholders found or not an array');
    }

    // UBOs
    if (companyDetails.ultimateBeneficialOwners && Array.isArray(companyDetails.ultimateBeneficialOwners)) {
      console.log('✅ Prefilling UBOs, count:', companyDetails.ultimateBeneficialOwners.length);
      const mappedUbos = companyDetails.ultimateBeneficialOwners.map((u: any) => ({
        fullName: u.fullName || "",
        ownershipPercentage: u.ownershipPercentage || 0,
        nationality: u.nationality || "",
        address: u.address || "",
        passportId: u.passportId || "",
        nationalIdNumber: u.nationalIdNumber || "",
        confirmationFile: null, // Files can't be prefilled from URLs
        confirmationFileId: u.uboConfirmationDocument || null,
        confirmationFilePath: u.uboConfirmationDocumentPath || "",
      }));
      console.log('✅ Mapped UBOs:', mappedUbos);
      setUbos(mappedUbos);
    } else {
      console.log('⚠️ No UBOs found or not an array');
    }

    // Directors
    if (companyDetails.directors && Array.isArray(companyDetails.directors)) {
      console.log('✅ Prefilling directors, count:', companyDetails.directors.length);
      const mappedDirectors = companyDetails.directors.map((d: any) => ({
        fullName: d.fullName || "",
        dateOfAppointment: d.dateOfAppointment || "",
        nationality: d.nationality || "",
        address: d.address || "",
        phoneNumber: d.phoneNumber || "",
      }));
      console.log('✅ Mapped directors:', mappedDirectors);
      setDirectors(mappedDirectors);
    } else {
      console.log('⚠️ No directors found or not an array');
    }
  }, [companyDetails?.id]);

  /* -----------------------------------------
       Return all
  ------------------------------------------*/

  return {
    form,
    setField,

    uploadBoxes,
    setUploadBoxes,
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

    // Document IDs
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
  };
}
