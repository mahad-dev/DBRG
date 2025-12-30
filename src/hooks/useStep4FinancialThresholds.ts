// FULL WORKING HOOK + FULL COMPONENT (100% MATCHING THE IMAGE)


"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useUploadDetails } from '@/context/UploadDetailsContext';

/** --- HOOK: useStep4FinancialThresholds --- */
export function useStep4FinancialThresholds() {
  const { state } = useUploadDetails();
  const financialThresholds = state.data.financialThreshold;
// 1 & 2: Inputs
const [paidUpCapital, setPaidUpCapital] = useState("");
const [annualTurnover, setAnnualTurnover] = useState("");


// 3: Bullion turnover Yes/No
const [bullionTurnover, setBullionTurnover] = useState<boolean | null>(null);

// Bullion file ID
const [bullionTurnoverProofFileId, setBullionTurnoverProofFileId] = useState<number | null>(null);

// Bullion file path
const [bullionTurnoverProofFileIdPath, setBullionTurnoverProofFileIdPath] = useState<string | null>(null);

// Bullion file
const [bullionFile, setBullionFile] = useState<File | null>(null);
const bullionRef = useRef<HTMLInputElement | null>(null);


// 4: Net worth Yes/No
const [netWorth, setNetWorth] = useState<boolean | null>(null);

// Net worth file ID
const [netWorthProofFileId, setNetWorthProofFileId] = useState<number | null>(null);

// Net worth file path
const [netWorthProofPath, setNetWorthProofPath] = useState<string | null>(null);

// Net worth file
const [netWorthFile, setNetWorthFile] = useState<File | null>(null);
const netWorthRef = useRef<HTMLInputElement | null>(null);

// Document IDs for uploads
const [bullionTurnoverDocumentId, setBullionTurnoverDocumentId] = useState<number | null>(null);
const [netWorthDocumentId, setNetWorthDocumentId] = useState<number | null>(null);

// Prefill logic
useEffect(() => {
  if (!financialThresholds) return;
  console.log("financialThresholds", financialThresholds);
  setPaidUpCapital(financialThresholds.paidUpCapital?.toString() || "");
  setAnnualTurnover(financialThresholds.annualTurnoverValue?.toString() || "");
  setBullionTurnover(financialThresholds.hasRequiredBullionTurnover ?? null);
  setBullionTurnoverProofFileId(financialThresholds.bullionTurnoverProofFileId ?? null);
  setBullionTurnoverProofFileIdPath(financialThresholds.bullionTurnoverProofFileIdPath ?? null);
  setBullionTurnoverDocumentId(financialThresholds.bullionTurnoverProofFileId ?? null);
  setNetWorth(financialThresholds.hasRequiredNetWorth ?? null);
  setNetWorthProofFileId(financialThresholds.netWorthProofFileId ?? null);
  setNetWorthProofPath(financialThresholds.netWorthProofPath ?? null);
  setNetWorthDocumentId(financialThresholds.netWorthProofFileId ?? null);
}, [financialThresholds]);


// File Handlers
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

// Remove file handlers
const removeBullionFile = useCallback(() => {
  setBullionFile(null);
}, []);

const removeNetWorthFile = useCallback(() => {
  setNetWorthFile(null);
}, []);


return {
paidUpCapital,
annualTurnover,
bullionTurnover,
bullionTurnoverProofFileId,
bullionTurnoverProofFileIdPath,
bullionFile,
netWorth,
netWorthProofFileId,
netWorthProofPath,
netWorthFile,
bullionRef,
netWorthRef,


setPaidUpCapital,
setAnnualTurnover,
setBullionTurnover,
setNetWorth,


setBullionFile,
setNetWorthFile,


handleSelectFile,
handleDropFile,

removeBullionFile,
removeNetWorthFile,

bullionTurnoverDocumentId,
netWorthDocumentId,
setBullionTurnoverDocumentId,
setNetWorthDocumentId,
} as const;
}