"use client";

import { useState, useRef, useCallback } from "react";

/* -------------------------------
   Types
--------------------------------*/
export interface Shareholder {
  fullName: string;
  percentage: string;
  nationality: string;
  address: string;
  proofFile: File | null;
}

export interface UBO {
  fullName: string;
  percentage: string;
  nationality: string;
  address: string;
  confirmationFile: File | null;
}

export interface Director {
  fullName: string;
  dateOfAppointment: string;
  nationality: string;
  address: string;
}

export function useStep2CompanyDetails() {
  /* -----------------------------------------
     Company Fields
  ------------------------------------------*/
  const [form, setForm] = useState({
    legalEntityName: "",
    entityType: "",
    tradeLicenseNo: "",
    licensingAuthority: "",
    dateIssued: "",
    dateExpiry: "",
    country: "",
    dateIncorp: "",
    passportId: "",
    nationalId: "",
    vatNumber: "",
    taxRegNumber: "",
    website: "",
    emailOfficial: "",
    phoneNumber: "",
    primaryContactName: "",
    primaryContactDesignation: "",
    primaryContactEmail: "",
    registeredOfficeAddress: "",
    pepShareholders: null as boolean | null,
    pepBeneficialOwners: null as boolean | null,
    pepCustomers: null as boolean | null,
    tradeAssociationName: "",
    tradeAssociationMember: "",
    tradeAssociationDate: "",
    lbma: false,
    dmccDgd: false,
    dmccMdb: false,
    rjc: false,
    iages: false,
    accreditationOther: false,
    accreditationOtherName: "",
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
    setShareholders((prev:any) => [
      ...prev,
      {
        fullName: "",
        percentage: "",
        nationality: "",
        address: "",
        proofFile: null,
      },
    ]);
  };

  const removeShareholder = (index: number) =>
    setShareholders((prev) => prev.filter((_, i) => i !== index));

  const setShareholderField = (
    index: number,
    field: keyof Shareholder,
    value: any
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
    setUbos((prev:any) => [
      ...prev,
      {
        fullName: "",
        percentage: "",
        nationality: "",
        address: "",
        confirmationFile: null,
      },
    ]);
  };

  const removeUbo = (index: number) =>
    setUbos((prev) => prev.filter((_, i) => i !== index));

  const setUboField = (
    index: number,
    field: keyof UBO,
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
