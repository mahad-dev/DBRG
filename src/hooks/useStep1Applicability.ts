"use client";

import { useRef, useState, useCallback } from "react";

/** Types */
export type ServicesState = Record<"trading" | "refining" | "logistics" | "financial", boolean>;
export type AnswersState = Record<string, boolean | null>;

export function useStep1Applicability() {
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
