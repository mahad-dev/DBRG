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
  const [officerName, setOfficerName] = React.useState<string>("");
  const [officerDesignation, setOfficerDesignation] = React.useState<string>("");
  const [officerContact, setOfficerContact] = React.useState<string>("");
  const [officerEmail, setOfficerEmail] = React.useState<string>("");

  // Additional details fields
  const [ongoingCasesDetails, setOngoingCasesDetails] = React.useState<string>("");
  const [penaltyExplanation, setPenaltyExplanation] = React.useState<string>("");

  // Files
  const [ongoingDetailsFile, setOngoingDetailsFile] = React.useState<File | null>(null);
  const [amlPolicyFile, setAmlPolicyFile] = React.useState<File | null>(null);
  const [declarationFile, setDeclarationFile] = React.useState<File | null>(null);
  const [supplyChainDueDiligenceFile, setSupplyChainDueDiligenceFile] = React.useState<File | null>(null);
  const [responsibleSourcingFile, setResponsibleSourcingFile] = React.useState<File | null>(null);

  // Document IDs (for upload optimization - files upload on selection, not on submit)
  const [ongoingDetailsDocumentId, setOngoingDetailsDocumentId] = React.useState<number | null>(null);
  const [amlPolicyDocumentId, setAmlPolicyDocumentId] = React.useState<number | null>(null);
  const [declarationDocumentId, setDeclarationDocumentId] = React.useState<number | null>(null);
  const [supplyChainDocumentId, setSupplyChainDocumentId] = React.useState<number | null>(null);
  const [responsibleSourcingDocumentId, setResponsibleSourcingDocumentId] = React.useState<number | null>(null);

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

  // Helper to extract document ID from S3 path
  const extractIdFromPath = (path: string | null): number | null => {
    if (!path) return null;
    // Remove query parameters first (everything after ?)
    const pathWithoutQuery = path.split('?')[0];
    // Extract the filename from the URL
    const filename = pathWithoutQuery.split('/').pop();
    if (!filename) return null;
    // Match pattern: documentId_filename (e.g., "780_Screenshot.png")
    const match = filename.match(/^(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  };

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

    // Prefill document IDs from existing data
    // Try to get ID from backend first, otherwise extract from path
    setAmlPolicyDocumentId(
      regulatorCompliance.amlCftPolicyDocumentFileId ??
      extractIdFromPath(regulatorCompliance.amlCftPolicyDocumentFilePath ?? null)
    );
    setDeclarationDocumentId(
      regulatorCompliance.declarationNoPenaltyFileId ??
      extractIdFromPath(regulatorCompliance.declarationNoPenaltyFilePath ?? null)
    );
    setSupplyChainDocumentId(
      regulatorCompliance.supplyChainPolicyDocumentFileId ??
      extractIdFromPath(regulatorCompliance.supplyChainPolicyDocumentFilePath ?? null)
    );
    setResponsibleSourcingDocumentId(
      regulatorCompliance.assuranceReportFileId ??
      extractIdFromPath(regulatorCompliance.assuranceReportFilePath ?? null)
    );
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

    // Document IDs
    ongoingDetailsDocumentId,
    amlPolicyDocumentId,
    declarationDocumentId,
    supplyChainDocumentId,
    responsibleSourcingDocumentId,

    // Document paths for prefilled URLs
    amlCftPolicyDocumentFilePath: regulatorCompliance?.amlCftPolicyDocumentFilePath || "",
    declarationNoPenaltyFilePath: regulatorCompliance?.declarationNoPenaltyFilePath || "",
    supplyChainPolicyDocumentFilePath: regulatorCompliance?.supplyChainPolicyDocumentFilePath || "",
    assuranceReportFilePath: regulatorCompliance?.assuranceReportFilePath || "",

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

    // Document ID setters
    setOngoingDetailsDocumentId,
    setAmlPolicyDocumentId,
    setDeclarationDocumentId,
    setSupplyChainDocumentId,
    setResponsibleSourcingDocumentId,

    handleSelectFile,
    handleDropFile,
    removeFile,
  } as const;
}

