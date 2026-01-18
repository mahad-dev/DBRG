// Enums
export enum MemberApplicationSection {
  Applicability = 1,
  CompanyDetails = 2,
  BankRelationReq = 3,
  FinancialThreshold = 4,
  RegulatorCompliance = 5,
  RequiredDocs = 6,
  DataProtectionPrivacy = 7,
  DeclarationConsent = 8
}

export enum MembershipType {
  PrincipalMember = 1,
  MemberBank = 2,
  ContributingMember = 3,
  AffiliateMember = 4
}

export enum ApplicationStatus {
  Approved = 1,
  Rejected = 2,
  AskForMoreDetails = 3
}

export enum ServiceType {
  TradingInPreciousMetals = 1,
  GoldRefining = 2,
  LogisticsAndVaulting = 3,
  FinancialServicesInUAE = 4
}

export enum RefiningOrTradingType {
  Refiner = 1,
  TradingCompany = 2
}

export enum YearsOfOperationInUAE {
  LessThan1 = 1,
  OneToThree = 2,
  ThreeToFive = 3,
  FivePlus = 4
}

export enum ServiceOffering {
  Insurance = 1,
  CustomsClearance = 2,
  ConsultingOrComplianceFirm = 3,
  LegalFirm = 4,
  BoardInvitedTradeBody = 5,
  AssayTestingServices = 6,
  BullionFocusedTechSolutions = 7,
  Other = 8
}

export enum RefineryAccreditation {
  LBMA_LondonGoodDelivery,
  DMCC_DubaiGoodDelivery_DGD,
  DMCC_MarketDeliverableBrand_MDB,
  RJC_ResponsibleJewelleryCouncil,
  IAGES_IndianAssociationGoldExcellence,
  Other
}

export enum ShareholdingType {
  Corporate = 1,
  Individual = 2
}

export enum MemberApplicationStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3
}

// Interfaces
export interface PrincipalMember {
  hasOfficeInUAE: boolean;
  services: (typeof ServiceType[keyof typeof ServiceType])[];
  refiningOrTradingCategory: typeof RefiningOrTradingType[keyof typeof RefiningOrTradingType];
  isAccreditedRefinery: boolean;
  operatedUnderUAEML5Years: boolean;
  refiningOutputOver10Tons: boolean;
  ratedCompliantByMinistry: boolean;
  involvedInWholesaleBullionTrading: boolean;
  hasBankingRelationships3Years: boolean;
  hasUnresolvedAMLNotices: boolean;
  bankingRelationshipEvidence: number;
  signedAMLDeclaration: number;
}

export interface MemberBank {
  isRegulatedByUAEAuthorities: boolean;
  hasRelationshipWithUAEGoodDeliveryBrand: boolean;
  brandName: string;
  hasUnresolvedAMLNotices: boolean;
  signedAMLDeclaration: number;
}

export interface ContributingMember {
  isUAEBasedEntity: boolean;
  yearsOfOperation: YearsOfOperationInUAE;
  servicesProvided: ServiceOffering[];
  otherServiceDetail: string;
  hasUnresolvedAMLNotices: boolean;
  signedAMLDeclaration: number;
}

export interface AffiliateMember {
  hasUAEOffice: boolean;
  uaeOfficeProofDocuments: number[];
  operatesInBullionOrRefining3Years: boolean;
  isInternationalOrgWithUAEBranch: boolean;
  eligibilitySupportingDocuments: number[];
  hasUnresolvedAMLNotices: boolean;
  signedAMLDeclaration: number;
}

export interface SpecialConsideration {
  message: string;
  status?: number; // 1: Pending, 2: Approved, 3: Rejected
  askMoreDetailsRequest?: string | null;
  askMoreDetailsResponse?: string | null;
}

export interface Applicability {
  hasUnresolvedAMLNotices: null;
  otherServiceDetail: string;
  servicesProvided: any;
  yearsOfOperation: null;
  isUAEBasedEntity: null;
  principalMember?: PrincipalMember;
  memberBank?: MemberBank;
  contributingMember?: ContributingMember;
  affiliateMember?: AffiliateMember;
  specialConsideration?: SpecialConsideration;
}

export interface Shareholder {
  fullName: string;
  passportId: string;
  nationalIdNumber: string;
  shareholdingPercentage: number;
  nationality: string;
  dateOfAppointment: string;
  address: string;
  passportDocument: number | null;
  nationalIdDocument: number | null;
  shareholdingDocumentId: number | null;
  shareholdingDocumentPath?: string;
  proofFile: File | null;
}

export interface UltimateBeneficialOwner {
  fullName: string;
  ownershipPercentage: number;
  nationality: string;
  address: string;
  passportId: string;
  nationalIdNumber: string;
  passportDocument: number | null;
  nationalIdDocument: number | null;
  confirmationFile: File | null;
  uboConfirmationDocument: number | null;
  uboConfirmationDocumentPath?: string;
}

export interface Director {
  fullName: string;
  nationality: string;
  dateOfAppointment: string;
  phoneNumber: string;
  address: string;
}

export interface CompanyDetails {
  legalEntityName: string;
  entityLegalType: string;
  tradeLicenseNumber: string;
  licensingAuthority: string;
  dateOfIssuance: string;
  dateOfExpiry: string;
  countryOfIncorporation: string;
  dateOfIncorporation: string;
  passportId: string;
  nationalId: string;
  vatNumber: string;
  taxRegistrationNumber: string;
  website: string;
  officialEmail: string;
  phoneNumber: string;
  primaryContactName: string;
  primaryContactDesignation: string;
  primaryContactEmail: string;
  registeredOfficeAddress: string;
  anyShareholderDirectorUBOPEP: boolean;
  anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: boolean;
  hasCustomerPEPChecks: boolean;
  tradeAssociationName: string;
  nameOfMember: string;
  dateOfAppointment: string;
  lbma: boolean;
  dmccDgd: boolean;
  dmccMdb: boolean;
  rjc: boolean;
  iages: boolean;
  accreditationOther: boolean;
  otherAccreditation: string;
  tradeLicenseDocument: number | null;
  tradeLicensePath?: string;
  certificateOfIncorporation: number | null;
  certificateOfIncorporationPath?: string;
  taxRegistrationDocument: number | null;
  taxRegistrationDocumentPath?: string;
  vatDocument: number | null;
  vatDocumentPath?: string;
  addressProofDocument: number | null;
  addressProofDocumentPath?: string;
  accreditationCertificate: number | null;
  accreditationCertificatePath?: string;
  shareholdingProof: number | null;
  uboConfirmationDocument: number | null;
  shareholders: Shareholder[];
  ultimateBeneficialOwners: UltimateBeneficialOwner[];
  directors: Director[];
}

export interface BankRelationshipRequirement {
  isClientOfDBRGMemberBank24Months: boolean | null;
  bankReferenceLetterFileId: number | null;
  bankReferenceLetterFilePath?: string;
  bankName: string;
  accountNumber: string;
  accountType: string;
  bankingRelationSince: string;
  bankAddress: string;
}

export interface FinancialThresholds {
  paidUpCapital: number | null;
  annualTurnoverValue: number | null;
  hasRequiredBullionTurnover: boolean;
  bullionTurnoverProofFileId: number | null;
  bullionTurnoverProofFileIdPath?: string;
  hasRequiredNetWorth: boolean;
  netWorthProofFileId: number | null;
  netWorthProofPath?: string;
}

export interface RegulatoryCompliance {
  compliantWithAmlCft: boolean;
  complianceOfficerPhotoFileId: number | null;
  complianceOfficerPhotoFilePath?: string;
  complianceOfficerFullName: string;
  complianceOfficerDesignation: string;
  complianceOfficerContactNumber: string;
  complianceOfficerEmail: string;
  hasOngoingCases: boolean;
  ongoingCasesDetails: string;
  investigationSupportingDocuments: number[];
  investigationSupportingDocumentPath?: string[];
  anyOnSanctionsList: boolean;
  hasDocumentedAmlPolicies: boolean;
  amlCftPolicyDocumentFileId: number | null;
  amlCftPolicyDocumentFilePath?: string;
  conductsRegularAmlTraining: boolean;
  hasCustomerVerificationProcess: boolean;
  hasInternalRiskAssessment: boolean;
  supplyChainCompliant: boolean;
  hasResponsibleSourcingAuditEvidence: boolean;
  hadRegulatoryPenalties: boolean;
  penaltyExplanation: string;
  declarationNoPenaltyFileId: number | null;
  declarationNoPenaltyFilePath?: string;
  hasSupplyChainPolicy: boolean;
  supplyChainPolicyDocumentFileId: number | null;
  supplyChainPolicyDocumentFilePath?: string;
  responsibleSourcingAuditEvidence2: boolean;
  assuranceReportFileId: number | null;
  assuranceReportFilePath?: string;
}

export interface MemberRequiredDocuments {
  tradeLicenseAndMoaFileId: number | null;
  isChecked_TradeLicenseAndMoa: boolean;
  tradeLicenseAndMoaPath?: string;
  bankingRelationshipEvidenceFileId: number | null;
  isChecked_BankingRelationshipEvidence: boolean;
  bankingRelationshipEvidencePath?: string;
  auditedFinancialStatementsFileId: number | null;
  isChecked_AuditedFinancialStatements: boolean;
  auditedFinancialStatementsPath?: string;
  netWorthCertificateFileId: number | null;
  isChecked_NetWorthCertificate: boolean;
  netWorthCertificatePath?: string;
  amlCftPolicyFileId: number | null;
  isChecked_AmlCftPolicy: boolean;
  amlCftPolicyPath?: string;
  supplyChainCompliancePolicyFileId: number | null;
  isChecked_SupplyChainCompliancePolicy: boolean;
  supplyChainCompliancePolicyPath?: string;
  amlCftAndSupplyChainPoliciesFileId: number | null;
  isChecked_AmlCftAndSupplyChainPolicies: boolean;
  amlCftAndSupplyChainPoliciesPath?: string;
  declarationNoUnresolvedAmlNoticesFileId: number | null;
  isChecked_DeclarationNoUnresolvedAmlNotices: boolean;
  declarationNoUnresolvedAmlNoticesPath?: string;
  noUnresolvedAmlNoticesDeclarationFileId: number | null;
  isChecked_NoUnresolvedAmlNoticesDeclaration: boolean;
  noUnresolvedAmlNoticesDeclarationPath?: string;
  accreditationCertificatesFileId: number | null;
  isChecked_AccreditationCertificates: boolean;
  accreditationCertificatesPath?: string;
  boardResolutionFileId: number | null;
  isChecked_BoardResolution: boolean;
  boardResolutionPath?: string;
  ownershipStructureFileId: number | null;
  isChecked_OwnershipStructure: boolean;
  ownershipStructurePath?: string;
  certifiedTrueCopyFileId: number | null;
  isChecked_CertifiedTrueCopy: boolean;
  certifiedTrueCopyPath?: string;
  latestAssuranceReportFileId: number | null;
  isChecked_LatestAssuranceReport: boolean;
  latestAssuranceReportPath?: string;
  responsibleSourcingAssuranceReportFileId: number | null;
  isChecked_ResponsibleSourcingAssuranceReport: boolean;
  responsibleSourcingAssuranceReportPath?: string;
  uboProofDocumentsFileId: number | null;
  isChecked_UboProofDocuments: boolean;
  uboProofDocumentsPath?: string;
  certifiedIdsFileId: number | null;
  isChecked_CertifiedIds: boolean;
  certifiedIdsPath?: string;
  otherForms: {
    otherFormName: string;
    otherFormFileId: number | null;
  }[];
}

export interface DataProtectionPrivacy {
  // Data Protection Compliance Questions (Yes/No - required)
  gdprCompliant: boolean | null;
  hasDataProtectionPolicy: boolean | null;
  hasDataBreachProcedures: boolean | null;
  conductsDataProtectionTraining: boolean | null;

  // Consent Checkboxes (NO required validation)
  consentDataProcessing: boolean;
  consentDataSharing: boolean;
  consentDataRetention: boolean;

  // Conditional file upload (required if hasDataProtectionPolicy === true)
  dataProtectionPolicyFileId?: number | null;
  dataProtectionPolicyFilePath?: string;
}

export interface DeclarationConsent {
  consentsToDataProcessing: boolean;
  acknowledgesDataRetention: boolean;
  adheresToCodeOfConduct: boolean;
  applicantName: string;
  date: string;
  authorisedSignatoryName: string;
  designation: string;
  digitalSignatureFileId: number | null;
  digitalSignatureFilePath?: string;
}

export interface UploadDetailsPayload {
  membershipType: typeof MembershipType[keyof typeof MembershipType];
  sectionNumber: typeof MemberApplicationSection[keyof typeof MemberApplicationSection];
  application?: any;
  applicability?: Applicability;
  companyDetails?: CompanyDetails;
  bankRelationshipRequirement?: BankRelationshipRequirement;
  bankRelationReq?: BankRelationshipRequirement;
  financialThreshold?: FinancialThresholds;
  regulatorCompliance?: RegulatoryCompliance;
  memberRequiredDocuments?: MemberRequiredDocuments;
  dataProtectionPrivacy?: DataProtectionPrivacy;
  declarationConsent?: DeclarationConsent;
  specialConsideration?: SpecialConsideration;
  isSpecialConsiderationApproved?: boolean;
}

// API Response types
export interface ApiResponse<T = any> {
  documentId: number | PromiseLike<number>;
  data: T;
  message: string;
  status: boolean;
}

// Redux state types
export interface UploadDetailsState {
  data: Partial<UploadDetailsPayload>;
  currentStep: number;
  isLoading: boolean;
  isSaving: boolean;
  errors: Record<string, string>;
  completedSteps: MemberApplicationSection[];
  userId?: string;
}
