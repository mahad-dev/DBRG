import React, { useCallback, useMemo, useState, useEffect } from "react";
import type { MemberRequiredDocuments } from "../types/uploadDetails";

/** Types */
export type DocItem = {
  id: string;
  label: string;
  required?: boolean;
};

export type OtherForm = {
  id: string;
  name: string;
  file: File | null;
};

export function useStep6RequiredDocuments(memberRequiredDocuments?: MemberRequiredDocuments) {
  const defaultItems: DocItem[] = [
    { id: "trade_license", label: "Valid UAE Trade License, Memorandum of Association" },
    { id: "assurance_report", label: "Latest Assurance report issued for Compliance with Regulation for Responsible Sourcing of Gold" },
    { id: "audited_fs", label: "Audited Financial Statements" },
    { id: "net_worth", label: "Net Worth Certificate" },
    { id: "amlCftPolicy", label: "AML/CFT Policy" },
    { id: "supplyChainPolicy", label: "Supply Chain Compliance Policy" },
    { id: "noUnresolvedAmlNoticesDeclaration", label: "Declaration of No Unresolved AML Notices" },
    { id: "board_resolution", label: "Copy of Board Resolution" },
    { id: "ownership_structure", label: "Completed ownership structure on the entity letterhead, signed by entity's authorised signatory" },
    { id: "certified_true_copy", label: "Certified true copy by compliance officer" },
    { id: "ubo_proof", label: "Copy of official documents (MOAs, AOAs, Share Certificate, Authorities Extract, Trade Licenses, Official Companies Profiles, etc.) which prove the Ultimate Beneficial Owner(s)" },
    { id: "certified_ids", label: "A certified true copy of the passports / Emirates ID for shareholders, directors, ultimate beneficial owners, authorized signatory" },
  ];

  const [items] = useState<DocItem[]>(defaultItems);

  const [checked, setChecked] = useState<Record<string, boolean>>(() =>
    defaultItems.reduce((acc, it) => {
      acc[it.id] = false;
      return acc;
    }, {} as Record<string, boolean>)
  );

  const [files, setFiles] = useState<Record<string, File | null>>(() =>
    defaultItems.reduce((acc, it) => {
      acc[it.id] = null;
      return acc;
    }, {} as Record<string, File | null>)
  );

  // Document IDs state for each file (for upload optimization)
  const [documentIds, setDocumentIds] = useState<Record<string, number | null>>(() =>
    defaultItems.reduce((acc, it) => {
      acc[it.id] = null;
      return acc;
    }, {} as Record<string, number | null>)
  );

  // Document paths state for prefilled files
  const [documentPaths, setDocumentPaths] = useState<Record<string, string>>(() =>
    defaultItems.reduce((acc, it) => {
      acc[it.id] = "";
      return acc;
    }, {} as Record<string, string>)
  );

  const setItemChecked = useCallback((id: string, val: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: val }));
  }, []);

  const setItemFile = useCallback((id: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  }, []);

  const removeItemFile = useCallback((id: string) => {
    setFiles((prev) => ({ ...prev, [id]: null }));
  }, []);

  const setItemDocumentId = useCallback((id: string, docId: number | null) => {
    setDocumentIds((prev) => ({ ...prev, [id]: docId }));
  }, []);

  const setItemDocumentPath = useCallback((id: string, path: string) => {
    setDocumentPaths((prev) => ({ ...prev, [id]: path }));
  }, []);

  const [otherForms, setOtherForms] = useState<OtherForm[]>([]);

  // Document IDs for other forms
  const [otherFormDocumentIds, setOtherFormDocumentIds] = useState<Record<string, number | null>>({});

  // Helper to extract document ID from S3 path
  const extractIdFromPath = useCallback((path: string | null): number | null => {
    if (!path) return null;
    // Remove query parameters first (everything after ?)
    const pathWithoutQuery = path.split('?')[0];
    // Extract the filename from the URL
    const filename = pathWithoutQuery.split('/').pop();
    if (!filename) return null;
    // Match pattern: documentId_filename (e.g., "780_Screenshot.png")
    const match = filename.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  }, []);

  // Prefill logic
  useEffect(() => {
    console.log("useStep6RequiredDocuments useEffect triggered with:", memberRequiredDocuments);
    if (!memberRequiredDocuments) {
      console.log("No memberRequiredDocuments data, returning");
      return;
    }

    console.log("Setting checked states from memberRequiredDocuments data");
    // Set checked states based on API data
    setChecked({
      trade_license: memberRequiredDocuments.isChecked_TradeLicenseAndMoa ?? false,
      assurance_report: memberRequiredDocuments.isChecked_LatestAssuranceReport ?? false,
      audited_fs: memberRequiredDocuments.isChecked_AuditedFinancialStatements ?? false,
      net_worth: memberRequiredDocuments.isChecked_NetWorthCertificate ?? false,
      amlCftPolicy: memberRequiredDocuments.isChecked_AmlCftPolicy ?? false,
      supplyChainPolicy: memberRequiredDocuments.isChecked_SupplyChainCompliancePolicy ?? false,
      noUnresolvedAmlNoticesDeclaration: memberRequiredDocuments.isChecked_NoUnresolvedAmlNoticesDeclaration ?? false,
      board_resolution: memberRequiredDocuments.isChecked_BoardResolution ?? false,
      ownership_structure: memberRequiredDocuments.isChecked_OwnershipStructure ?? false,
      certified_true_copy: memberRequiredDocuments.isChecked_CertifiedTrueCopy ?? false,
      ubo_proof: memberRequiredDocuments.isChecked_UboProofDocuments ?? false,
      certified_ids: memberRequiredDocuments.isChecked_CertifiedIds ?? false,
    });

    // Prefill document IDs from existing data
    setDocumentIds({
      trade_license: memberRequiredDocuments.tradeLicenseAndMoaFileId ?? extractIdFromPath(memberRequiredDocuments.tradeLicenseAndMoaPath ?? null),
      assurance_report: memberRequiredDocuments.latestAssuranceReportFileId ?? extractIdFromPath(memberRequiredDocuments.latestAssuranceReportPath ?? null),
      audited_fs: memberRequiredDocuments.auditedFinancialStatementsFileId ?? extractIdFromPath(memberRequiredDocuments.auditedFinancialStatementsPath ?? null),
      net_worth: memberRequiredDocuments.netWorthCertificateFileId ?? extractIdFromPath(memberRequiredDocuments.netWorthCertificatePath ?? null),
      amlCftPolicy: memberRequiredDocuments.amlCftPolicyFileId ?? extractIdFromPath(memberRequiredDocuments.amlCftPolicyPath ?? null),
      supplyChainPolicy: memberRequiredDocuments.supplyChainCompliancePolicyFileId ?? extractIdFromPath(memberRequiredDocuments.supplyChainCompliancePolicyPath ?? null),
      noUnresolvedAmlNoticesDeclaration: memberRequiredDocuments.noUnresolvedAmlNoticesDeclarationFileId ?? extractIdFromPath(memberRequiredDocuments.noUnresolvedAmlNoticesDeclarationPath ?? null),
      board_resolution: memberRequiredDocuments.boardResolutionFileId ?? extractIdFromPath(memberRequiredDocuments.boardResolutionPath ?? null),
      ownership_structure: memberRequiredDocuments.ownershipStructureFileId ?? extractIdFromPath(memberRequiredDocuments.ownershipStructurePath ?? null),
      certified_true_copy: memberRequiredDocuments.certifiedTrueCopyFileId ?? extractIdFromPath(memberRequiredDocuments.certifiedTrueCopyPath ?? null),
      ubo_proof: memberRequiredDocuments.uboProofDocumentsFileId ?? extractIdFromPath(memberRequiredDocuments.uboProofDocumentsPath ?? null),
      certified_ids: memberRequiredDocuments.certifiedIdsFileId ?? extractIdFromPath(memberRequiredDocuments.certifiedIdsPath ?? null),
    });

    // Prefill document paths
    setDocumentPaths({
      trade_license: memberRequiredDocuments.tradeLicenseAndMoaPath ?? "",
      assurance_report: memberRequiredDocuments.latestAssuranceReportPath ?? "",
      audited_fs: memberRequiredDocuments.auditedFinancialStatementsPath ?? "",
      net_worth: memberRequiredDocuments.netWorthCertificatePath ?? "",
      amlCftPolicy: memberRequiredDocuments.amlCftPolicyPath ?? "",
      supplyChainPolicy: memberRequiredDocuments.supplyChainCompliancePolicyPath ?? "",
      noUnresolvedAmlNoticesDeclaration: memberRequiredDocuments.noUnresolvedAmlNoticesDeclarationPath ?? "",
      board_resolution: memberRequiredDocuments.boardResolutionPath ?? "",
      ownership_structure: memberRequiredDocuments.ownershipStructurePath ?? "",
      certified_true_copy: memberRequiredDocuments.certifiedTrueCopyPath ?? "",
      ubo_proof: memberRequiredDocuments.uboProofDocumentsPath ?? "",
      certified_ids: memberRequiredDocuments.certifiedIdsPath ?? "",
    });

    // Handle other forms if they exist
    if (memberRequiredDocuments.otherForms && memberRequiredDocuments.otherForms.length > 0) {
      console.log("Setting other forms:", memberRequiredDocuments.otherForms);
      const otherFormsData = memberRequiredDocuments.otherForms.map((form, index) => ({
        id: `other_${index}`,
        name: form.otherFormName || "",
        file: null, // Files are not prefilled, only the names
      }));
      setOtherForms(otherFormsData);
    }
  }, [memberRequiredDocuments, extractIdFromPath]);

  const addOtherForm = useCallback((name = "") => {
    setOtherForms((o) => [...o, { id: `other_${Date.now()}`, name, file: null }]);
  }, []);

  const updateOtherFormName = useCallback((id: string, name: string) => {
    setOtherForms((o) => o.map((it) => (it.id === id ? { ...it, name } : it)));
  }, []);

  const setOtherFormFile = useCallback((id: string, file: File | null) => {
    setOtherForms((o) => o.map((it) => (it.id === id ? { ...it, file } : it)));
  }, []);

  const removeOtherForm = useCallback((id: string) => {
    setOtherForms((o) => o.filter((it) => it.id !== id));
  }, []);

  const setOtherFormDocumentId = useCallback((id: string, docId: number | null) => {
    setOtherFormDocumentIds((prev) => ({ ...prev, [id]: docId }));
  }, []);

  // Generic handlers: accept a setter that receives File | null
  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
      const file = e.target.files?.[0] ?? null;
      setter(file);
    },
    []
  );

  const handleDropFile = useCallback(
    (e: React.DragEvent, setter: (f: File | null) => void) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0] ?? null;
      setter(file);
    },
    []
  );

  // refs map for each static item to trigger its hidden input
  const refs = useMemo(() => {
    const map: Record<string, React.RefObject<HTMLInputElement | null>> = {};
    defaultItems.forEach((it) => {
      map[it.id] = React.createRef<HTMLInputElement>();
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    items,
    checked,
    files,
    documentIds,
    documentPaths,
    otherForms,
    otherFormDocumentIds,
    refs,
    // actions
    setItemChecked,
    setItemFile,
    removeItemFile,
    setItemDocumentId,
    setItemDocumentPath,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    removeOtherForm,
    setOtherFormDocumentId,
    handleSelectFile,
    handleDropFile,
  } as const;
}
