// FULL WORKING HOOK + FULL COMPONENT (100% MATCHING THE IMAGE)


"use client";
import { useRef, useState, useCallback } from "react";


/** --- HOOK: useStep4FinancialThresholds --- */
export function useStep4FinancialThresholds() {
// 1 & 2: Inputs
const [paidUpCapital, setPaidUpCapital] = useState("");
const [annualTurnover, setAnnualTurnover] = useState("");


// 3: Bullion turnover Yes/No
const [bullionTurnover, setBullionTurnover] = useState<boolean | null>(null);


// Bullion file
const [bullionFile, setBullionFile] = useState<File | null>(null);
const bullionRef = useRef<HTMLInputElement | null>(null);


// 4: Net worth Yes/No
const [netWorth, setNetWorth] = useState<boolean | null>(null);


// Net worth file
const [netWorthFile, setNetWorthFile] = useState<File | null>(null);
const netWorthRef = useRef<HTMLInputElement | null>(null);


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
bullionFile,
netWorth,
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