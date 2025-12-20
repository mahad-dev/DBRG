"use client";

import { useRef, useState, useCallback, useEffect } from "react";

/** Types */
export type ServicesState = Record<"trading" | "refining" | "logistics" | "financial", boolean>;
export type AnswersState = Record<string, boolean | null>;

export function useStep1Applicability(applicability?: any) {
  // Membership
  const [membership, setMembership] = useState<string | null>(null);

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
    setCategory((c) => ({ ...c, [key]: !c[key] }));
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

  // File uploads and refs
  const [signedAMLFile, setSignedAMLFile] = useState<File | null>(null);
  const [evidenceFile, setEvidenceFile] = useState<File | null>(null);

  // Existing file paths for display
  const [existingSignedAMLPath, setExistingSignedAMLPath] = useState<string | null>(null);
  const [existingEvidencePath, setExistingEvidencePath] = useState<string | null>(null);

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

  // Prefill logic
  useEffect(() => {
    if (!applicability) return;

    // Membership
    if (applicability.principalMember) {
      setMembership("principal");
    } else if (applicability.memberBank) {
      setMembership("member_bank");
    } else if (applicability.contributingMember) {
      setMembership("contributing");
    } else if (applicability.affiliateMember) {
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

    // Existing file paths
    setExistingSignedAMLPath(applicability.signedAMLDeclarationPath ?? null);
    setExistingEvidencePath(applicability.bankingRelationshipEvidencePath ?? null);
  }, [applicability]);

  return {
    // state
    membership,
    services,
    category,
    refinerAnswers,
    tradingAnswers,
    anyAMLNotices,
    signedAMLFile,
    evidenceFile,
    existingSignedAMLPath,
    existingEvidencePath,

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
    handleSelectFile,
    handleDropFile,
    setSignedAMLFile,
    setEvidenceFile,
    removeSignedAMLFile,
    removeEvidenceFile,
  } as const;
}
