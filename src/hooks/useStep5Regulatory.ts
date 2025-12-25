"use client";

import React from "react";
import { useRef, useEffect } from "react";
import type { RegulatoryCompliance } from "../types/uploadDetails";


// Hook: useStep5Regulatory
export function useStep5Regulatory(regulatorCompliance?: RegulatoryCompliance) {

  const [compliantUAE, setCompliantUAE] = React.useState<boolean | null>(null);
  const [ongoingCases, setOngoingCases] = React.useState<boolean | null>(null);
  const [sanctionsListed, setSanctionsListed] = React.useState<boolean | null>(null);
  const [policiesPrepared, setPoliciesPrepared] = React.useState<boolean | null>(null);
  const [trainingOngoing, setTrainingOngoing] = React.useState<boolean | null>(null);
  const [idProcesses, setIdProcesses] = React.useState<boolean | null>(null);
  const [riskAssessment, setRiskAssessment] = React.useState<boolean | null>(null);
  const [penalties, setPenalties] = React.useState<boolean | null>(null);
  const [supplyChainCompliant, setSupplyChainCompliant] = React.useState<boolean | null>(null);
  const [preciousPolicy, setPreciousPolicy] = React.useState<boolean | null>(null);
  const [responsibleSourcingAudit, setResponsibleSourcingAudit] = React.useState<boolean | null>(null);

  // Compliance officer fields
  const [officerPhotoFile, setOfficerPhotoFile] = React.useState<File | null>(null);
  const [officerName, setOfficerName] = React.useState("");
  const [officerDesignation, setOfficerDesignation] = React.useState("");
  const [officerContact, setOfficerContact] = React.useState("");
  const [officerEmail, setOfficerEmail] = React.useState("");

  // Additional details fields
  const [ongoingCasesDetails, setOngoingCasesDetails] = React.useState("");
  const [penaltyExplanation, setPenaltyExplanation] = React.useState("");

  // Files
  const [ongoingDetailsFile, setOngoingDetailsFile] = React.useState<File | null>(null);
  const [amlPolicyFile, setAmlPolicyFile] = React.useState<File | null>(null);
  const [declarationFile, setDeclarationFile] = React.useState<File | null>(null);
  const [supplyChainDueDiligenceFile, setSupplyChainDueDiligenceFile] = React.useState<File | null>(null);
  const [responsibleSourcingFile, setResponsibleSourcingFile] = React.useState<File | null>(null);

  const ongoingRef = useRef<HTMLInputElement | null>(null);
  const amlRef = useRef<HTMLInputElement | null>(null);
  const declarationRef = useRef<HTMLInputElement | null>(null);
  const supplyRef = useRef<HTMLInputElement | null>(null);
  const responsibleRef = useRef<HTMLInputElement | null>(null);

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) => {
    setter(e.target.files?.[0] ?? null);
  };

  const handleDropFile = (e: React.DragEvent, setter: (f: File | null) => void) => {
    e.preventDefault();
    setter(e.dataTransfer?.files?.[0] ?? null);
  };

  const removeFile = (setter: (f: File | null) => void) => setter(null);

  // Prefill logic
  useEffect(() => {
    console.log("useStep5Regulatory useEffect triggered with:", regulatorCompliance);
    if (!regulatorCompliance) {
      console.log("No regulatorCompliance data, returning");
      return;
    }

    console.log("Setting form fields from regulatorCompliance data");
    setCompliantUAE(regulatorCompliance.compliantWithAmlCft ?? null);
    setOngoingCases(regulatorCompliance.hasOngoingCases ?? null);
    setSanctionsListed(regulatorCompliance.anyOnSanctionsList ?? null);
    setPoliciesPrepared(regulatorCompliance.hasDocumentedAmlPolicies ?? null);
    setTrainingOngoing(regulatorCompliance.conductsRegularAmlTraining ?? null);
    setIdProcesses(regulatorCompliance.hasCustomerVerificationProcess ?? null);
    setRiskAssessment(regulatorCompliance.hasInternalRiskAssessment ?? null);
    setPenalties(regulatorCompliance.hadRegulatoryPenalties ?? null);
    setSupplyChainCompliant(regulatorCompliance.supplyChainCompliant ?? null);
    setPreciousPolicy(regulatorCompliance.hasSupplyChainPolicy ?? null);
    setResponsibleSourcingAudit(regulatorCompliance.hasResponsibleSourcingAuditEvidence ?? null);

    setOfficerName(regulatorCompliance.complianceOfficerFullName || "");
    setOfficerDesignation(regulatorCompliance.complianceOfficerDesignation || "");
    setOfficerContact(regulatorCompliance.complianceOfficerContactNumber || "");
    setOfficerEmail(regulatorCompliance.complianceOfficerEmail || "");
    // Note: officerPhotoFile is not prefilled from server data as it's a file upload

    setOngoingCasesDetails(regulatorCompliance.ongoingCasesDetails || "");
    setPenaltyExplanation(regulatorCompliance.penaltyExplanation || "");
  }, [regulatorCompliance]);

  return {
    // states
    compliantUAE,
    ongoingCases,
    sanctionsListed,
    policiesPrepared,
    trainingOngoing,
    idProcesses,
    riskAssessment,
    penalties,
    supplyChainCompliant,
    preciousPolicy,
    responsibleSourcingAudit,

    officerPhotoFile,
    officerName,
    officerDesignation,
    officerContact,
    officerEmail,

    ongoingCasesDetails,
    penaltyExplanation,

    ongoingDetailsFile,
    amlPolicyFile,
    declarationFile,
    supplyChainDueDiligenceFile,
    responsibleSourcingFile,

    // refs
    ongoingRef,
    amlRef,
    declarationRef,
    supplyRef,
    responsibleRef,

    // setters
    setCompliantUAE,
    setOngoingCases,
    setSanctionsListed,
    setPoliciesPrepared,
    setTrainingOngoing,
    setIdProcesses,
    setRiskAssessment,
    setPenalties,
    setSupplyChainCompliant,
    setPreciousPolicy,
    setResponsibleSourcingAudit,

    setOfficerPhotoFile,
    setOfficerName,
    setOfficerDesignation,
    setOfficerContact,
    setOfficerEmail,

    setOngoingCasesDetails,
    setPenaltyExplanation,

    setOngoingDetailsFile,
    setAmlPolicyFile,
    setDeclarationFile,
    setSupplyChainDueDiligenceFile,
    setResponsibleSourcingFile,

    handleSelectFile,
    handleDropFile,
    removeFile,
  } as const;
}

