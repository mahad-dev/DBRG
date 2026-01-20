"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { MembershipType } from "../types/uploadDetails";

/** Types */
export type ServicesState = Record<"trading" | "refining" | "logistics" | "financial", boolean>;
export type AnswersState = Record<string, boolean | null>;

export function useStep1Applicability(applicability?: any, application?: any, defaultMembershipFromRoute?: string) {
  // Membership - initialize with route-based default if provided
  const [membership, setMembership] = useState<string | null>(defaultMembershipFromRoute || null);

  // Services
  const [services, setServices] = useState<ServicesState>({
    trading: false,
    refining: false,
    logistics: false,
    financial: false,
  });

  const toggleService = useCallback((id: keyof ServicesState) => {
    setServices((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  // Category
  const [category, setCategory] = useState<{ refiner: boolean; trading: boolean }>({
    refiner: false,
    trading: false,
  });

  const toggleCategory = useCallback((key: "refiner" | "trading") => {
    setCategory((c) => {
      if (c[key]) {
        // If already checked, uncheck it
        return { ...c, [key]: false };
      } else {
        // If not checked, check it and uncheck the other
        const newCategory = key === "refiner" ? { refiner: true, trading: false } : { refiner: false, trading: true };
        // Reset answers for the unselected category
        if (key === "refiner") {
          setTradingAnswers({
            wholesaleBullion: null,
            bankRelationships: null,
          });
        } else {
          setRefinerAnswers({
            accredited: null,
            aml5yrs: null,
            output10tons: null,
            ratedCompliant: null,
          });
        }
        return newCategory;
      }
    });
  }, []);

  // Answers
  const [refinerAnswers, setRefinerAnswers] = useState<AnswersState>({
    accredited: null,
    aml5yrs: null,
    output10tons: null,
    ratedCompliant: null,
  });

  const [tradingAnswers, setTradingAnswers] = useState<AnswersState>({
    wholesaleBullion: null,
    bankRelationships: null,
  });

  const setRefinerAnswer = useCallback((key: string, val: boolean) => {
    setRefinerAnswers((p) => ({ ...p, [key]: val }));
  }, []);

  const setTradingAnswer = useCallback((key: string, val: boolean) => {
    setTradingAnswers((p) => ({ ...p, [key]: val }));
  }, []);

  // AML notices
  const [anyAMLNotices, setAnyAMLNotices] = useState<boolean | null>(null);

  // Member Bank specific
  const [regulatedByCBA, setRegulatedByCBA] = useState<boolean | null>(null);
  const [hasRelationshipWithUAEGoodDeliveryBrand, setHasRelationshipWithUAEGoodDeliveryBrand] = useState<boolean | null>(null);
  const [brandName, setBrandName] = useState<string | null>(null);

  // File uploads and refs
  const [signedAMLFile, setSignedAMLFile] = useState<File | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // Existing file paths for display
  const [existingSignedAMLPath, setExistingSignedAMLPath] = useState<string | null>(null);
  const [existingEvidencePath, setExistingEvidencePath] = useState<string | null>(null);

  // Document IDs (for upload optimization - files upload on selection, not on submit)
  const [signedAMLDocumentId, setSignedAMLDocumentId] = useState<number | null>(null);
  const [evidenceDocumentId, setEvidenceDocumentId] = useState<number | null>(null)

  const signedRef = useRef<HTMLInputElement | null>(null);
  const evidenceRef = useRef<HTMLInputElement | null>(null);

  // Generic handlers for file selection & drop
  const handleSelectFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
      setter(e.target.files?.[0] ?? null);
    },
    []
  );

  const handleDropFile = useCallback((e: React.DragEvent, setter: (f: File | null) => void) => {
    e.preventDefault();
    setter(e.dataTransfer?.files?.[0] ?? null);
  }, []);

  const removeSignedAMLFile = useCallback(() => setSignedAMLFile(null), []);
  const removeEvidenceFile = useCallback(() => setEvidenceFile(null), []);

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
    if (!applicability) return;

    console.log('🔄 useStep1Applicability prefilling data...');

    // Membership
    if (application?.membershipType === MembershipType.PrincipalMember) {
      setMembership("principal");
    } else if (application?.membershipType === MembershipType.MemberBank) {
      setMembership("member_bank");
    } else if (application?.membershipType === MembershipType.ContributingMember) {
      setMembership("contributing");
    } else if (application?.membershipType === MembershipType.AffiliateMember) {
      setMembership("affiliate");
    }

    // Services
    const serviceIds = applicability.services?.split(",").map(Number) ?? [];
    setServices({
      trading: serviceIds.includes(1),
      refining: serviceIds.includes(2),
      logistics: serviceIds.includes(3),
      financial: serviceIds.includes(4),
    });

    // Category
    setCategory({
      refiner: applicability.refiningOrTradingCategory === 1,
      trading: applicability.refiningOrTradingCategory === 2,
    });

    // Refiner Answers
    setRefinerAnswers({
      accredited: applicability.isAccreditedRefinery ?? null,
      aml5yrs: applicability.operatedUnderUAEML5Years ?? null,
      output10tons: applicability.refiningOutputOver10Tons ?? null,
      ratedCompliant: applicability.ratedCompliantByMinistry ?? null,
    });

    // Trading Answers
    setTradingAnswers({
      wholesaleBullion: applicability.involvedInWholesaleBullionTrading ?? null,
      bankRelationships: applicability.hasBankingRelationships3Years ?? null,
    });

    // AML Notices
    setAnyAMLNotices(applicability.hasUnresolvedAMLNotices ?? null);

    // Member Bank specific
    setRegulatedByCBA(applicability.isRegulatedByUAEAuthorities ?? null);
    setHasRelationshipWithUAEGoodDeliveryBrand(applicability.hasRelationshipWithUAEGoodDeliveryBrand ?? null);
    setBrandName(applicability.brandName || null);

    // Existing file paths
    const signedAMLPath = applicability.signedAMLDeclarationPath ?? null;
    const evidencePath = applicability.bankingRelationshipEvidencePath ?? null;
    setExistingSignedAMLPath(signedAMLPath);
    setExistingEvidencePath(evidencePath);

    // Prefill document IDs from existing data
    // Try to get ID from backend first, otherwise extract from path
    const signedAMLId = applicability.signedAMLDeclarationFileId ?? extractIdFromPath(signedAMLPath);
    const evidenceId = applicability.bankingRelationshipEvidenceFileId ?? extractIdFromPath(evidencePath);

    console.log('📋 Extracted document IDs:', {
      signedAMLPath,
      signedAMLId,
      evidencePath,
      evidenceId
    });

    setSignedAMLDocumentId(signedAMLId);
    setEvidenceDocumentId(evidenceId);
  }, [applicability, extractIdFromPath]);

  return {
    // state
    membership,
    services,
    category,
    refinerAnswers,
    tradingAnswers,
    anyAMLNotices,
    regulatedByCBA,
    hasRelationshipWithUAEGoodDeliveryBrand,
    brandName,
    signedAMLFile,
    evidenceFile,
    existingSignedAMLPath,
    existingEvidencePath,

    // Document IDs
    signedAMLDocumentId,
    evidenceDocumentId,

    // refs
    signedRef,
    evidenceRef,

    // setters / handlers
    setMembership,
    toggleService,
    toggleCategory,
    setRefinerAnswer,
    setTradingAnswer,
    setAnyAMLNotices: setAnyAMLNotices,
    setRegulatedByCBA,
    setHasRelationshipWithUAEGoodDeliveryBrand,
    setBrandName,
    handleSelectFile,
    handleDropFile,
    setSignedAMLFile,
    setEvidenceFile,
    removeSignedAMLFile,
    removeEvidenceFile,

    // Document ID setters
    setSignedAMLDocumentId,
    setEvidenceDocumentId,
  } as const;
}
