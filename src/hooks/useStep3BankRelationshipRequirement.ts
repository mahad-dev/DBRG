import { useState, useRef } from "react";
import type { ChangeEvent } from "react";

export function useStep3BankRelationshipRequirement() {
  // YesNoGroup expects boolean | null
  const [isClient24Months, setIsClient24Months] = useState<boolean | null>(null);

  const [bankFile, setBankFile] = useState<File | null>(null);
  const bankRef = useRef<HTMLInputElement | null>(null);

  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState("");
  const [bankingSince, setBankingSince] = useState("");
  const [address, setAddress] = useState("");

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
