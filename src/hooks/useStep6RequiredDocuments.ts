import React, { useCallback, useMemo, useState } from "react";

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

export function useStep6RequiredDocuments(initialItems?: DocItem[]) {
  const defaultItems: DocItem[] =
    initialItems ??
    [
      { id: "trade_license", label: "Valid UAE Trade License, Memorandum of Association" },
      { id: "ownership_structure", label: "Completed ownership structure on the entity letterhead, signed by entity's authorised signatory" },
      { id: "certified_true_copy", label: "Certified true copy by compliance officer" },
      { id: "assurance_report", label: "Latest Assurance report Issued for Compliance with Regulation for Responsible Sourcing of gold" },
      { id: "banking_evidence", label: "Banking Relationship Evidence (24+ months)" },
      { id: "audited_fs", label: "Audited Financial Statements" },
      { id: "net_worth", label: "Net Worth Certificate" },
      { id: "aml_policy", label: "AML/CFT Policy" },
      { id: "supply_chain", label: "Supply Chain Compliance Policy" },
      { id: "declaration_aml", label: "Declaration of No Unresolved AML Notices" },
      { id: "accreditation", label: "Copy of valid accreditation certificate(s)" },
      { id: "board_resolution", label: "Copy of Board Resolution" },
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

  const setItemChecked = useCallback((id: string, val: boolean) => {
    setChecked((prev) => ({ ...prev, [id]: val }));
  }, []);

  const setItemFile = useCallback((id: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [id]: file }));
  }, []);

  const removeItemFile = useCallback((id: string) => {
    setFiles((prev) => ({ ...prev, [id]: null }));
  }, []);

  const [otherForms, setOtherForms] = useState<OtherForm[]>([]);

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
    otherForms,
    refs,
    // actions
    setItemChecked,
    setItemFile,
    removeItemFile,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    removeOtherForm,
    handleSelectFile,
    handleDropFile,
  } as const;
}
