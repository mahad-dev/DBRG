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
}

export interface UBO {
  fullName: string;
  ownershipPercentage: number;
  nationality: string;
  address: string;
  passportId: string;
  nationalIdNumber: string;
  confirmationFile: File | null;
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
  });

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

  // Prefill logic
  useEffect(() => {
    if (!companyDetails) return;

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
      lbma: companyDetails.lbma || false,
      dmccDgd: companyDetails.dmccDgd || false,
      dmccMdb: companyDetails.dmccMdb || false,
      rjc: companyDetails.rjc || false,
      iages: companyDetails.iages || false,
      accreditationOther: companyDetails.accreditationOther || false,
      otherAccreditation: companyDetails.otherAccreditation || "",
    });

    // Shareholders
    if (companyDetails.shareholders && Array.isArray(companyDetails.shareholders)) {
      const mappedShareholders = companyDetails.shareholders.map((s: any) => ({
        fullName: s.fullName || "",
        passportId: s.passportId || "",
        nationalIdNumber: s.nationalIdNumber || "",
        shareholdingPercentage: s.shareholdingPercentage || 0,
        nationality: s.nationality || "",
        dateOfAppointment: s.dateOfAppointment || "",
        address: s.address || "",
        proofFile: null, // Files can't be prefilled from URLs
      }));
      setShareholders(mappedShareholders);
    }

    // UBOs
    if (companyDetails.ultimateBeneficialOwners && Array.isArray(companyDetails.ultimateBeneficialOwners)) {
      const mappedUbos = companyDetails.ultimateBeneficialOwners.map((u: any) => ({
        fullName: u.fullName || "",
        ownershipPercentage: u.ownershipPercentage || 0,
        nationality: u.nationality || "",
        address: u.address || "",
        passportId: u.passportId || "",
        nationalIdNumber: u.nationalIdNumber || "",
        confirmationFile: null, // Files can't be prefilled from URLs
      }));
      setUbos(mappedUbos);
    }

    // Directors
    if (companyDetails.directors && Array.isArray(companyDetails.directors)) {
      const mappedDirectors = companyDetails.directors.map((d: any) => ({
        fullName: d.fullName || "",
        dateOfAppointment: d.dateOfAppointment || "",
        nationality: d.nationality || "",
        address: d.address || "",
        phoneNumber: d.phoneNumber || "",
      }));
      setDirectors(mappedDirectors);
    }
  }, [companyDetails]);

  /* -----------------------------------------
       Return all
  ------------------------------------------*/

  return {
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
  };
}
