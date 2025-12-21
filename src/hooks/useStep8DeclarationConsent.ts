"use client";

import { useState, useEffect } from "react";
import type { DeclarationConsent } from "../types/uploadDetails";

export function useStep8DeclarationConsent(declarationConsent?: DeclarationConsent) {
  // Checkbox states
  const [consentData, setConsentData] = useState(false);
  const [acknowledgeRetention, setAcknowledgeRetention] = useState(false);
  const [agreeCode, setAgreeCode] = useState(false);

  // Inputs
  const [applicantName, setApplicantName] = useState("");
  const [signatoryName, setSignatoryName] = useState("");
  const [designation, setDesignation] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  // Signature
  const [signatureURL, setSignatureURL] = useState<string>("");
  const [existingSignaturePath, setExistingSignaturePath] = useState<string | null>(null);

  // Prefill logic
  useEffect(() => {
    if (!declarationConsent) return;

    setConsentData(declarationConsent.consentsToDataProcessing ?? false);
    setAcknowledgeRetention(declarationConsent.acknowledgesDataRetention ?? false);
    setAgreeCode(declarationConsent.adheresToCodeOfConduct ?? false);
    setApplicantName(declarationConsent.applicantName ?? "");
    setSignatoryName(declarationConsent.authorisedSignatoryName ?? "");
    setDesignation(declarationConsent.designation ?? "");

    if (declarationConsent.date) {
      setSelectedDate(new Date(declarationConsent.date));
    }

    // Set existing signature path
    setExistingSignaturePath(declarationConsent.digitalSignatureFilePath ?? null);
  }, [declarationConsent]);

  return {
    // state
    consentData,
    acknowledgeRetention,
    agreeCode,
    applicantName,
    signatoryName,
    designation,
    selectedDate,
    signatureURL,
    existingSignaturePath,

    // setters
    setConsentData,
    setAcknowledgeRetention,
    setAgreeCode,
    setApplicantName,
    setSignatoryName,
    setDesignation,
    setSelectedDate,
    setSignatureURL,
    setExistingSignaturePath,
  } as const;
}
