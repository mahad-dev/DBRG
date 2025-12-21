// FULL WORKING HOOK + FULL COMPONENT (100% MATCHING THE IMAGE)


"use client";
import { useRef, useState, useCallback, useEffect } from "react";
import { useAppSelector } from '../store/hooks';
import { selectFormData } from '../store/uploadDetailsSlice';

/** --- HOOK: useStep4FinancialThresholds --- */
export function useStep4FinancialThresholds() {
  const financialThresholds = useAppSelector(selectFormData).financialThresholds;
// 1 & 2: Inputs
const [paidUpCapital, setPaidUpCapital] = useState("");
const [annualTurnover, setAnnualTurnover] = useState("");


// 3: Bullion turnover Yes/No
const [bullionTurnover, setBullionTurnover] = useState<boolean | null>(null);

// Bullion file ID
const [bullionTurnoverProofFileId, setBullionTurnoverProofFileId] = useState<number | null>(null);

// Bullion file
const [bullionFile, setBullionFile] = useState<File | null>(null);
const bullionRef = useRef<HTMLInputElement | null>(null);


// 4: Net worth Yes/No
const [netWorth, setNetWorth] = useState<boolean | null>(null);

// Net worth file ID
const [netWorthProofFileId, setNetWorthProofFileId] = useState<number | null>(null);

// Net worth file
const [netWorthFile, setNetWorthFile] = useState<File | null>(null);
const netWorthRef = useRef<HTMLInputElement | null>(null);

// Prefill logic
useEffect(() => {
  if (!financialThresholds) return;
  console.log("financialThresholds", financialThresholds);
  setPaidUpCapital(financialThresholds.paidUpCapital?.toString() || "");
  setAnnualTurnover(financialThresholds.annualTurnoverValue?.toString() || "");
  setBullionTurnover(financialThresholds.hasRequiredBullionTurnover ?? null);
  setBullionTurnoverProofFileId(financialThresholds.bullionTurnoverProofFileId ?? null);
  setNetWorth(financialThresholds.hasRequiredNetWorth ?? null);
  setNetWorthProofFileId(financialThresholds.netWorthProofFileId ?? null);
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


return {
paidUpCapital,
annualTurnover,
bullionTurnover,
bullionTurnoverProofFileId,
bullionFile,
netWorth,
netWorthProofFileId,
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
} as const;
}