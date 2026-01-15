import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { uploadDetailsApi } from '@/services/uploadDetailsApi';
import { MemberApplicationSection } from '@/types/uploadDetails';
import type { UploadDetailsState } from '@/types/uploadDetails';

// Define action types
type UploadDetailsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_SAVING'; payload: boolean }
  | { type: 'SET_CURRENT_STEP'; payload: number }
  | { type: 'UPDATE_FORM_DATA'; payload: any }
  | { type: 'SET_USER_ID'; payload: string }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_ERROR'; payload: { type: 'fetch' | 'save' | 'document'; message: string } }
  | { type: 'RESET_FORM' };

// Initial state
const initialState: UploadDetailsState = {
  data: {},
  currentStep: 1,
  completedSteps: [],
  isLoading: false,
  isSaving: false,
  userId: undefined,
  errors: {
    fetch: '',
    save: '',
    document: '',
  },
};

// Reducer function
function uploadDetailsReducer(state: UploadDetailsState, action: UploadDetailsAction): UploadDetailsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };
    case 'SET_CURRENT_STEP':
      return { ...state, currentStep: action.payload };
    case 'UPDATE_FORM_DATA':
      return { ...state, data: { ...state.data, ...action.payload } };
    case 'SET_USER_ID':
      return { ...state, userId: action.payload };
    case 'CLEAR_ERRORS':
      return { ...state, errors: { fetch: '', save: '', document: '' } };
    case 'SET_ERROR':
      return { ...state, errors: { ...state.errors, [action.payload.type]: action.payload.message } };
    case 'RESET_FORM':
      return initialState;
    default:
      return state;
  }
}

// Context type
interface UploadDetailsContextType {
  state: UploadDetailsState;
  dispatch: React.Dispatch<UploadDetailsAction>;
  uploadDocument: (file: File) => Promise<number>;
  saveUploadDetails: (payload: Partial<any>, sectionNumber: MemberApplicationSection) => Promise<void>;
  getUploadDetails: (userId: string) => Promise<any>;
  getDocumentPath: (id: number) => Promise<string>;
  setCurrentStep: (step: number) => void;
  updateFormData: (payload: any) => void;
}

// Create context
const UploadDetailsContext = createContext<UploadDetailsContextType | undefined>(undefined);

// Provider component
export function UploadDetailsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(uploadDetailsReducer, initialState);

  const uploadDocument = async (file: File): Promise<number> => {
    try {
      const documentId = await uploadDetailsApi.uploadDocument(file);
      return documentId;
    } catch (error: any) {
      // Re-throw the original error to preserve response data for parseApiError
      throw error;
    }
  };

  const saveUploadDetails = async (payload: Partial<any>, sectionNumber: MemberApplicationSection): Promise<void> => {
    try {
      await uploadDetailsApi.saveUploadDetails(payload, sectionNumber);
    } catch (error: any) {
      // Re-throw the original error to preserve response data for parseApiError
      throw error;
    }
  };

  const getUploadDetails = async (userId: string): Promise<any> => {
    try {
      const data = await uploadDetailsApi.getUploadDetails(userId);
      return data;
    } catch (error: any) {
      // Re-throw the original error to preserve response data for parseApiError
      throw error;
    }
  };

  const getDocumentPath = async (id: number): Promise<string> => {
    try {
      const path = await uploadDetailsApi.getDocumentPath(id);
      return path;
    } catch (error: any) {
      // Re-throw the original error to preserve response data for parseApiError
      throw error;
    }
  };

  const setCurrentStep = (step: number) => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: step });
  };

  const updateFormData = (payload: any) => {
    console.log("updateFormData called with payload:", payload);
    // Nest financialThresholds data from flat API response
    const nestedPayload = { ...payload };
    if (payload.paidUpCapital !== undefined || payload.annualTurnoverValue !== undefined ||
        payload.hasRequiredBullionTurnover !== undefined || payload.bullionTurnoverProofFileId !== undefined ||
        payload.bullionTurnoverProofFileIdPath !== undefined || payload.hasRequiredNetWorth !== undefined ||
        payload.netWorthProofFileId !== undefined || payload.netWorthProofPath !== undefined) {
      nestedPayload.financialThresholds = {
        paidUpCapital: payload.paidUpCapital,
        annualTurnoverValue: payload.annualTurnoverValue,
        hasRequiredBullionTurnover: payload.hasRequiredBullionTurnover,
        bullionTurnoverProofFileId: payload.bullionTurnoverProofFileId,
        bullionTurnoverProofFileIdPath: payload.bullionTurnoverProofFileIdPath,
        hasRequiredNetWorth: payload.hasRequiredNetWorth,
        netWorthProofFileId: payload.netWorthProofFileId,
        netWorthProofPath: payload.netWorthProofPath,
      };
      // Remove flat fields
      delete nestedPayload.paidUpCapital;
      delete nestedPayload.annualTurnoverValue;
      delete nestedPayload.hasRequiredBullionTurnover;
      delete nestedPayload.bullionTurnoverProofFileId;
      delete nestedPayload.bullionTurnoverProofFileIdPath;
      delete nestedPayload.hasRequiredNetWorth;
      delete nestedPayload.netWorthProofFileId;
      delete nestedPayload.netWorthProofPath;
    }

    // Nest regulatoryCompliance data from flat API response
    // Check if any regulatory compliance fields exist
    const hasRegulatoryFields = payload.compliantWithAmlCft !== undefined ||
        payload.complianceOfficerFullName !== undefined ||
        payload.complianceOfficerDesignation !== undefined ||
        payload.complianceOfficerContactNumber !== undefined ||
        payload.complianceOfficerEmail !== undefined ||
        payload.hasOngoingCases !== undefined ||
        payload.ongoingCasesDetails !== undefined ||
        payload.anyOnSanctionsList !== undefined ||
        payload.hasDocumentedAmlPolicies !== undefined ||
        payload.amlCftPolicyDocumentFilePath !== undefined ||
        payload.amlCftPolicyDocumentFileId !== undefined ||
        payload.conductsRegularAmlTraining !== undefined ||
        payload.hasCustomerVerificationProcess !== undefined ||
        payload.hasInternalRiskAssessment !== undefined ||
        payload.supplyChainCompliant !== undefined ||
        payload.hasResponsibleSourcingAuditEvidence !== undefined ||
        payload.hadRegulatoryPenalties !== undefined ||
        payload.penaltyExplanation !== undefined ||
        payload.declarationNoPenaltyFilePath !== undefined ||
        payload.declarationNoPenaltyFileId !== undefined ||
        payload.hasSupplyChainPolicy !== undefined ||
        payload.supplyChainPolicyDocumentFilePath !== undefined ||
        payload.supplyChainPolicyDocumentFileId !== undefined ||
        payload.responsibleSourcingAuditEvidence2 !== undefined ||
        payload.assuranceReportFilePath !== undefined ||
        payload.assuranceReportFileId !== undefined;

    console.log("Has regulatory fields:", hasRegulatoryFields, payload);

    if (hasRegulatoryFields) {
      console.log("Nesting regulatoryCompliance data");
      nestedPayload.regulatoryCompliance = {
        compliantWithAmlCft: payload.compliantWithAmlCft,
        complianceOfficerFullName: payload.complianceOfficerFullName,
        complianceOfficerDesignation: payload.complianceOfficerDesignation,
        complianceOfficerContactNumber: payload.complianceOfficerContactNumber,
        complianceOfficerEmail: payload.complianceOfficerEmail,
        hasOngoingCases: payload.hasOngoingCases,
        ongoingCasesDetails: payload.ongoingCasesDetails,
        anyOnSanctionsList: payload.anyOnSanctionsList,
        hasDocumentedAmlPolicies: payload.hasDocumentedAmlPolicies,
        amlCftPolicyDocumentFilePath: payload.amlCftPolicyDocumentFilePath,
        amlCftPolicyDocumentFileId: payload.amlCftPolicyDocumentFileId,
        conductsRegularAmlTraining: payload.conductsRegularAmlTraining,
        hasCustomerVerificationProcess: payload.hasCustomerVerificationProcess,
        hasInternalRiskAssessment: payload.hasInternalRiskAssessment,
        supplyChainCompliant: payload.supplyChainCompliant,
        hasResponsibleSourcingAuditEvidence: payload.hasResponsibleSourcingAuditEvidence,
        hadRegulatoryPenalties: payload.hadRegulatoryPenalties,
        penaltyExplanation: payload.penaltyExplanation,
        declarationNoPenaltyFilePath: payload.declarationNoPenaltyFilePath,
        declarationNoPenaltyFileId: payload.declarationNoPenaltyFileId,
        hasSupplyChainPolicy: payload.hasSupplyChainPolicy,
        supplyChainPolicyDocumentFilePath: payload.supplyChainPolicyDocumentFilePath,
        supplyChainPolicyDocumentFileId: payload.supplyChainPolicyDocumentFileId,
        responsibleSourcingAuditEvidence2: payload.responsibleSourcingAuditEvidence2,
        assuranceReportFilePath: payload.assuranceReportFilePath,
        assuranceReportFileId: payload.assuranceReportFileId,
      };
      console.log("Nested regulatoryCompliance:", nestedPayload.regulatoryCompliance);
      // Remove flat fields
      delete nestedPayload.compliantWithAmlCft;
      delete nestedPayload.complianceOfficerFullName;
      delete nestedPayload.complianceOfficerDesignation;
      delete nestedPayload.complianceOfficerContactNumber;
      delete nestedPayload.complianceOfficerEmail;
      delete nestedPayload.hasOngoingCases;
      delete nestedPayload.ongoingCasesDetails;
      delete nestedPayload.anyOnSanctionsList;
      delete nestedPayload.hasDocumentedAmlPolicies;
      delete nestedPayload.amlCftPolicyDocumentFilePath;
      delete nestedPayload.amlCftPolicyDocumentFileId;
      delete nestedPayload.conductsRegularAmlTraining;
      delete nestedPayload.hasCustomerVerificationProcess;
      delete nestedPayload.hasInternalRiskAssessment;
      delete nestedPayload.supplyChainCompliant;
      delete nestedPayload.hasResponsibleSourcingAuditEvidence;
      delete nestedPayload.hadRegulatoryPenalties;
      delete nestedPayload.penaltyExplanation;
      delete nestedPayload.declarationNoPenaltyFilePath;
      delete nestedPayload.declarationNoPenaltyFileId;
      delete nestedPayload.hasSupplyChainPolicy;
      delete nestedPayload.supplyChainPolicyDocumentFilePath;
      delete nestedPayload.supplyChainPolicyDocumentFileId;
      delete nestedPayload.responsibleSourcingAuditEvidence2;
      delete nestedPayload.assuranceReportFilePath;
      delete nestedPayload.assuranceReportFileId;
    }

    // Nest memberRequiredDocuments data from flat API response or from requiredDocs object
    let hasMemberRequiredDocumentsFields = payload.tradeLicenseAndMoaFileId !== undefined ||
        payload.isChecked_TradeLicenseAndMoa !== undefined ||
        payload.tradeLicenseAndMoaPath !== undefined ||
        payload.bankingRelationshipEvidenceFileId !== undefined ||
        payload.isChecked_BankingRelationshipEvidence !== undefined ||
        payload.bankingRelationshipEvidencePath !== undefined ||
        payload.auditedFinancialStatementsFileId !== undefined ||
        payload.isChecked_AuditedFinancialStatements !== undefined ||
        payload.auditedFinancialStatementsPath !== undefined ||
        payload.netWorthCertificateFileId !== undefined ||
        payload.isChecked_NetWorthCertificate !== undefined ||
        payload.netWorthCertificatePath !== undefined ||
        payload.amlCftPolicyFileId !== undefined ||
        payload.isChecked_AmlCftPolicy !== undefined ||
        payload.amlCftPolicyPath !== undefined ||
        payload.supplyChainCompliancePolicyFileId !== undefined ||
        payload.isChecked_SupplyChainCompliancePolicy !== undefined ||
        payload.supplyChainCompliancePolicyPath !== undefined ||
        payload.amlCftAndSupplyChainPoliciesFileId !== undefined ||
        payload.isChecked_AmlCftAndSupplyChainPolicies !== undefined ||
        payload.amlCftAndSupplyChainPoliciesPath !== undefined ||
        payload.declarationNoUnresolvedAmlNoticesFileId !== undefined ||
        payload.isChecked_DeclarationNoUnresolvedAmlNotices !== undefined ||
        payload.declarationNoUnresolvedAmlNoticesPath !== undefined ||
        payload.noUnresolvedAmlNoticesDeclarationFileId !== undefined ||
        payload.isChecked_NoUnresolvedAmlNoticesDeclaration !== undefined ||
        payload.noUnresolvedAmlNoticesDeclarationPath !== undefined ||
        payload.accreditationCertificatesFileId !== undefined ||
        payload.isChecked_AccreditationCertificates !== undefined ||
        payload.accreditationCertificatesPath !== undefined ||
        payload.boardResolutionFileId !== undefined ||
        payload.isChecked_BoardResolution !== undefined ||
        payload.boardResolutionPath !== undefined ||
        payload.ownershipStructureFileId !== undefined ||
        payload.isChecked_OwnershipStructure !== undefined ||
        payload.ownershipStructurePath !== undefined ||
        payload.certifiedTrueCopyFileId !== undefined ||
        payload.isChecked_CertifiedTrueCopy !== undefined ||
        payload.certifiedTrueCopyPath !== undefined ||
        payload.latestAssuranceReportFileId !== undefined ||
        payload.isChecked_LatestAssuranceReport !== undefined ||
        payload.latestAssuranceReportPath !== undefined ||
        payload.responsibleSourcingAssuranceReportFileId !== undefined ||
        payload.isChecked_ResponsibleSourcingAssuranceReport !== undefined ||
        payload.responsibleSourcingAssuranceReportPath !== undefined ||
        payload.uboProofDocumentsFileId !== undefined ||
        payload.isChecked_UboProofDocuments !== undefined ||
        payload.uboProofDocumentsPath !== undefined ||
        payload.certifiedIdsFileId !== undefined ||
        payload.isChecked_CertifiedIds !== undefined ||
        payload.certifiedIdsPath !== undefined ||
        payload.otherForms !== undefined;

    // Check if backend sends it as requiredDocs object
    if (payload.requiredDocs && typeof payload.requiredDocs === 'object') {
      hasMemberRequiredDocumentsFields = true;
      // Merge requiredDocs fields into payload for processing
      Object.assign(payload, payload.requiredDocs);
      delete payload.requiredDocs;
    }

    console.log("Has member required documents fields:", hasMemberRequiredDocumentsFields, payload);

    if (hasMemberRequiredDocumentsFields) {
      console.log("Nesting memberRequiredDocuments data");
      console.log("Payload before nesting memberRequiredDocuments:", payload);
      nestedPayload.memberRequiredDocuments = {
        tradeLicenseAndMoaFileId: payload.tradeLicenseAndMoaFileId,
        isChecked_TradeLicenseAndMoa: payload.isChecked_TradeLicenseAndMoa,
        tradeLicenseAndMoaPath: payload.tradeLicenseAndMoaPath,
        bankingRelationshipEvidenceFileId: payload.bankingRelationshipEvidenceFileId,
        isChecked_BankingRelationshipEvidence: payload.isChecked_BankingRelationshipEvidence,
        bankingRelationshipEvidencePath: payload.bankingRelationshipEvidencePath,
        auditedFinancialStatementsFileId: payload.auditedFinancialStatementsFileId,
        isChecked_AuditedFinancialStatements: payload.isChecked_AuditedFinancialStatements,
        auditedFinancialStatementsPath: payload.auditedFinancialStatementsPath,
        netWorthCertificateFileId: payload.netWorthCertificateFileId,
        isChecked_NetWorthCertificate: payload.isChecked_NetWorthCertificate,
        netWorthCertificatePath: payload.netWorthCertificatePath,
        amlCftPolicyFileId: payload.amlCftPolicyFileId,
        isChecked_AmlCftPolicy: payload.isChecked_AmlCftPolicy,
        amlCftPolicyPath: payload.amlCftPolicyPath,
        supplyChainCompliancePolicyFileId: payload.supplyChainCompliancePolicyFileId,
        isChecked_SupplyChainCompliancePolicy: payload.isChecked_SupplyChainCompliancePolicy,
        supplyChainCompliancePolicyPath: payload.supplyChainCompliancePolicyPath,
        amlCftAndSupplyChainPoliciesFileId: payload.amlCftAndSupplyChainPoliciesFileId,
        isChecked_AmlCftAndSupplyChainPolicies: payload.isChecked_AmlCftAndSupplyChainPolicies,
        amlCftAndSupplyChainPoliciesPath: payload.amlCftAndSupplyChainPoliciesPath,
        declarationNoUnresolvedAmlNoticesFileId: payload.declarationNoUnresolvedAmlNoticesFileId,
        isChecked_DeclarationNoUnresolvedAmlNotices: payload.isChecked_DeclarationNoUnresolvedAmlNotices,
        declarationNoUnresolvedAmlNoticesPath: payload.declarationNoUnresolvedAmlNoticesPath,
        noUnresolvedAmlNoticesDeclarationFileId: payload.noUnresolvedAmlNoticesDeclarationFileId,
        isChecked_NoUnresolvedAmlNoticesDeclaration: payload.isChecked_NoUnresolvedAmlNoticesDeclaration,
        noUnresolvedAmlNoticesDeclarationPath: payload.noUnresolvedAmlNoticesDeclarationPath,
        accreditationCertificatesFileId: payload.accreditationCertificatesFileId,
        isChecked_AccreditationCertificates: payload.isChecked_AccreditationCertificates,
        accreditationCertificatesPath: payload.accreditationCertificatesPath,
        boardResolutionFileId: payload.boardResolutionFileId,
        isChecked_BoardResolution: payload.isChecked_BoardResolution,
        boardResolutionPath: payload.boardResolutionPath,
        ownershipStructureFileId: payload.ownershipStructureFileId,
        isChecked_OwnershipStructure: payload.isChecked_OwnershipStructure,
        ownershipStructurePath: payload.ownershipStructurePath,
        certifiedTrueCopyFileId: payload.certifiedTrueCopyFileId,
        isChecked_CertifiedTrueCopy: payload.isChecked_CertifiedTrueCopy,
        certifiedTrueCopyPath: payload.certifiedTrueCopyPath,
        latestAssuranceReportFileId: payload.latestAssuranceReportFileId,
        isChecked_LatestAssuranceReport: payload.isChecked_LatestAssuranceReport,
        latestAssuranceReportPath: payload.latestAssuranceReportPath,
        responsibleSourcingAssuranceReportFileId: payload.responsibleSourcingAssuranceReportFileId,
        isChecked_ResponsibleSourcingAssuranceReport: payload.isChecked_ResponsibleSourcingAssuranceReport,
        responsibleSourcingAssuranceReportPath: payload.responsibleSourcingAssuranceReportPath,
        uboProofDocumentsFileId: payload.uboProofDocumentsFileId,
        isChecked_UboProofDocuments: payload.isChecked_UboProofDocuments,
        uboProofDocumentsPath: payload.uboProofDocumentsPath,
        certifiedIdsFileId: payload.certifiedIdsFileId,
        isChecked_CertifiedIds: payload.isChecked_CertifiedIds,
        certifiedIdsPath: payload.certifiedIdsPath,
        otherForms: payload.otherForms,
      };
      console.log("Nested memberRequiredDocuments:", nestedPayload.memberRequiredDocuments);
      // Remove flat fields
      delete nestedPayload.tradeLicenseAndMoaFileId;
      delete nestedPayload.isChecked_TradeLicenseAndMoa;
      delete nestedPayload.tradeLicenseAndMoaPath;
      delete nestedPayload.bankingRelationshipEvidenceFileId;
      delete nestedPayload.isChecked_BankingRelationshipEvidence;
      delete nestedPayload.bankingRelationshipEvidencePath;
      delete nestedPayload.auditedFinancialStatementsFileId;
      delete nestedPayload.isChecked_AuditedFinancialStatements;
      delete nestedPayload.auditedFinancialStatementsPath;
      delete nestedPayload.netWorthCertificateFileId;
      delete nestedPayload.isChecked_NetWorthCertificate;
      delete nestedPayload.netWorthCertificatePath;
      delete nestedPayload.amlCftPolicyFileId;
      delete nestedPayload.isChecked_AmlCftPolicy;
      delete nestedPayload.amlCftPolicyPath;
      delete nestedPayload.supplyChainCompliancePolicyFileId;
      delete nestedPayload.isChecked_SupplyChainCompliancePolicy;
      delete nestedPayload.supplyChainCompliancePolicyPath;
      delete nestedPayload.amlCftAndSupplyChainPoliciesFileId;
      delete nestedPayload.isChecked_AmlCftAndSupplyChainPolicies;
      delete nestedPayload.amlCftAndSupplyChainPoliciesPath;
      delete nestedPayload.declarationNoUnresolvedAmlNoticesFileId;
      delete nestedPayload.isChecked_DeclarationNoUnresolvedAmlNotices;
      delete nestedPayload.declarationNoUnresolvedAmlNoticesPath;
      delete nestedPayload.noUnresolvedAmlNoticesDeclarationFileId;
      delete nestedPayload.isChecked_NoUnresolvedAmlNoticesDeclaration;
      delete nestedPayload.noUnresolvedAmlNoticesDeclarationPath;
      delete nestedPayload.accreditationCertificatesFileId;
      delete nestedPayload.isChecked_AccreditationCertificates;
      delete nestedPayload.accreditationCertificatesPath;
      delete nestedPayload.boardResolutionFileId;
      delete nestedPayload.isChecked_BoardResolution;
      delete nestedPayload.boardResolutionPath;
      delete nestedPayload.ownershipStructureFileId;
      delete nestedPayload.isChecked_OwnershipStructure;
      delete nestedPayload.ownershipStructurePath;
      delete nestedPayload.certifiedTrueCopyFileId;
      delete nestedPayload.isChecked_CertifiedTrueCopy;
      delete nestedPayload.certifiedTrueCopyPath;
      delete nestedPayload.latestAssuranceReportFileId;
      delete nestedPayload.isChecked_LatestAssuranceReport;
      delete nestedPayload.latestAssuranceReportPath;
      delete nestedPayload.responsibleSourcingAssuranceReportFileId;
      delete nestedPayload.isChecked_ResponsibleSourcingAssuranceReport;
      delete nestedPayload.responsibleSourcingAssuranceReportPath;
      delete nestedPayload.uboProofDocumentsFileId;
      delete nestedPayload.isChecked_UboProofDocuments;
      delete nestedPayload.uboProofDocumentsPath;
      delete nestedPayload.certifiedIdsFileId;
      delete nestedPayload.isChecked_CertifiedIds;
      delete nestedPayload.certifiedIdsPath;
      delete nestedPayload.otherForms;
    }

    console.log("Final nestedPayload:", nestedPayload);
    dispatch({ type: 'UPDATE_FORM_DATA', payload: nestedPayload });
  };

  return (
    <UploadDetailsContext.Provider value={{
      state,
      dispatch,
      uploadDocument,
      saveUploadDetails,
      getUploadDetails,
      getDocumentPath,
      setCurrentStep,
      updateFormData,
    }}>
      {children}
    </UploadDetailsContext.Provider>
  );
}

// Hook to use the context
export function useUploadDetails() {
  const context = useContext(UploadDetailsContext);
  if (context === undefined) {
    throw new Error('useUploadDetails must be used within a UploadDetailsProvider');
  }
  return context;
}
