import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import type { BankRelationshipRequirement } from "../types/uploadDetails";

export function useStep3BankRelationshipRequirement(bankRelationshipRequirement?: BankRelationshipRequirement) {
  // YesNoGroup expects boolean | null
  const [isClient24Months, setIsClient24Months] = useState<boolean | null>(null);

  const [bankFile, setBankFile] = useState<File | null>(null);
  const [bankReferenceLetterFileId, setBankReferenceLetterFileId] = useState<number | null>(null);
  const [bankReferenceLetterFilePath, setBankReferenceLetterFilePath] = useState("");
  const bankRef = useRef<HTMLInputElement | null>(null);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankingSince, setBankingSince] = useState("");
  const [address, setAddress] = useState("");

  // Prefill logic
  useEffect(() => {
    if (!bankRelationshipRequirement) return;
    setIsClient24Months(bankRelationshipRequirement.isClientOfDBRGMemberBank24Months ?? null);
    setBankReferenceLetterFileId(bankRelationshipRequirement.bankReferenceLetterFileId ?? null);
    setBankReferenceLetterFilePath(bankRelationshipRequirement.bankReferenceLetterFilePath || "");
    setBankName(bankRelationshipRequirement.bankName || "");
    setAccountNumber(bankRelationshipRequirement.accountNumber || "");
    setAccountType(bankRelationshipRequirement.accountType || "");
    setAddress(bankRelationshipRequirement.bankAddress || "");

    // Convert bankingRelationSince to DD/MM/YYYY format
    if (bankRelationshipRequirement.bankingRelationSince) {
      const date = new Date(bankRelationshipRequirement.bankingRelationSince);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      setBankingSince(`${day}/${month}/${year}`);
    } else {
      setBankingSince("");
    }
  }, [bankRelationshipRequirement]);

  // ----- File Select -----
  const handleSelectFile = (
    e: ChangeEvent<HTMLInputElement>,
    setter: (file: File | null) => void
  ) => {
    const files = e.target.files;
    if (files && files[0]) setter(files[0]);
  };

  // ----- Drag & Drop -----
  const handleDropFile = (
    e: React.DragEvent<HTMLDivElement>,
    setter: (file: File | null) => void
  ) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) setter(file);
  };

  return {
    isClient24Months,
    setIsClient24Months,

    bankFile,
    setBankFile,
    bankRef,

    bankReferenceLetterFileId,
    setBankReferenceLetterFileId,
    bankReferenceLetterFilePath,
    setBankReferenceLetterFilePath,

    bankName,
    setBankName,

    accountNumber,
    setAccountNumber,

    accountType,
    setAccountType,

    bankingSince,
    setBankingSince,

    address,
    setAddress,

    handleSelectFile,
    handleDropFile,
  };
}
