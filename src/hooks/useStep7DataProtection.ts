"use client";

import { useState, useEffect, useRef } from "react";
import type { DataProtectionPrivacy } from "../types/uploadDetails";

export function useStep7DataProtection(dataProtectionPrivacy?: DataProtectionPrivacy) {
  // Yes/No Questions (required validation)
  const [gdprCompliant, setGdprCompliant] = useState<boolean | null>(null);
  const [hasDataProtectionPolicy, setHasDataProtectionPolicy] = useState<boolean | null>(null);
  const [hasDataBreachProcedures, setHasDataBreachProcedures] = useState<boolean | null>(null);
  const [conductsDataProtectionTraining, setConductsDataProtectionTraining] = useState<boolean | null>(null);

  // Consent Checkboxes (NO required validation)
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);
  const [consentDataSharing, setConsentDataSharing] = useState(false);
  const [consentDataRetention, setConsentDataRetention] = useState(false);

  // File upload state
  const [dataProtectionPolicyFile, setDataProtectionPolicyFile] = useState<File | null>(null);
  const [existingDataProtectionPolicyPath, setExistingDataProtectionPolicyPath] = useState<string | null>(null);
  const [dataProtectionPolicyDocumentId, setDataProtectionPolicyDocumentId] = useState<number | null>(null);
  const dataProtectionPolicyRef = useRef<HTMLInputElement>(null);

  // Prefill logic
  useEffect(() => {
    if (!dataProtectionPrivacy) return;

    setGdprCompliant(dataProtectionPrivacy.gdprCompliant ?? null);
    setHasDataProtectionPolicy(dataProtectionPrivacy.hasDataProtectionPolicy ?? null);
    setHasDataBreachProcedures(dataProtectionPrivacy.hasDataBreachProcedures ?? null);
    setConductsDataProtectionTraining(dataProtectionPrivacy.conductsDataProtectionTraining ?? null);

    setConsentDataProcessing(dataProtectionPrivacy.consentDataProcessing ?? false);
    setConsentDataSharing(dataProtectionPrivacy.consentDataSharing ?? false);
    setConsentDataRetention(dataProtectionPrivacy.consentDataRetention ?? false);

    // Set existing file path
    setExistingDataProtectionPolicyPath(dataProtectionPrivacy.dataProtectionPolicyFilePath ?? null);
  }, [dataProtectionPrivacy]);

  const removeDataProtectionPolicyFile = () => {
    setDataProtectionPolicyFile(null);
    if (dataProtectionPolicyRef.current) {
      dataProtectionPolicyRef.current.value = '';
    }
  };

  return {
    // Yes/No Question States
    gdprCompliant,
    hasDataProtectionPolicy,
    hasDataBreachProcedures,
    conductsDataProtectionTraining,

    // Consent Checkbox States
    consentDataProcessing,
    consentDataSharing,
    consentDataRetention,

    // File Upload States
    dataProtectionPolicyFile,
    existingDataProtectionPolicyPath,
    dataProtectionPolicyDocumentId,
    dataProtectionPolicyRef,

    // Setters for Yes/No Questions
    setGdprCompliant,
    setHasDataProtectionPolicy,
    setHasDataBreachProcedures,
    setConductsDataProtectionTraining,

    // Setters for Consent Checkboxes
    setConsentDataProcessing,
    setConsentDataSharing,
    setConsentDataRetention,

    // Setters for File Upload
    setDataProtectionPolicyFile,
    setDataProtectionPolicyDocumentId,
    removeDataProtectionPolicyFile,
  } as const;
}
