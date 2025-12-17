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

export interface Applicability {
  principalMember?: PrincipalMember;
  memberBank?: MemberBank;
  contributingMember?: ContributingMember;
  affiliateMember?: AffiliateMember;
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
  proofFile: File | null;
}

export interface UltimateBeneficialOwner {
  fullName: string;
  percentage: string;
  nationality: string;
  address: string;
  passportId: string;
  nationalIdNumber: string;
  passportDocument: number | null;
  nationalIdDocument: number | null;
  confirmationFile: File | null;
  uboConfirmationDocument: number | null;
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
  entityType: string;
  tradeLicenseNumber: string;
  tradeLicenseNo: string;
  licensingAuthority: string;
  isRegisteredForCorporateTax: boolean;
  taxRegistrationNumber: string;
  taxRegNumber: string;
  isRegisteredForVAT: boolean;
  vatNumber: string;
  website: string;
  primaryContactName: string;
  primaryContactDesignation: string;
  primaryContactEmail: string;
  officialEmail: string;
  emailOfficial: string;
  phoneNumber: string;
  registeredOfficeAddress: string;
  countryOfIncorporation: string;
  country: string;
  dateOfIncorporation: string;
  dateIncorp: string;
  dateIssued: string;
  dateExpiry: string;
  passportId: string;
  nationalId: string;
  anyShareholderDirectorUBOPEP: boolean;
  anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: boolean;
  hasCustomerPEPChecks: boolean;
  shareholdingType: typeof ShareholdingType[keyof typeof ShareholdingType];
  shareholders: Shareholder[];
  ultimateBeneficialOwners: UltimateBeneficialOwner[];
  directors: Director[];
  tradeAssociationName: string;
  nameOfMember: string;
  tradeAssociationMember: string;
  dateOfAppointment: string;
  tradeAssociationDate: string;
  refineryAccreditations: number[];
  otherAccreditation: string;
  accreditationOther: boolean;
  accreditationOtherName: string;
  lbma: boolean;
  dmccDgd: boolean;
  dmccMdb: boolean;
  rjc: boolean;
  iages: boolean;
  pepShareholders: boolean;
  pepBeneficialOwners: boolean;
  pepCustomers: boolean;
  tradeLicenseDocument: number | null;
  certificateOfIncorporation: number | null;
  taxRegistrationDocument: number | null;
  vatDocument: number | null;
  addressProofDocument: number | null;
  accreditationCertificate: number | null;
  shareholdingProof: number | null;
  uboConfirmationDocument: number | null;
}

export interface BankRelationshipRequirement {
  isClientOfDBRGMemberBank24Months: boolean | null;
  bankReferenceLetterFileId: number | null;
  bankName: string;
  accountNumber: string;
  accountType: string;
  bankingRelationSince: string;
  bankAddress: string;
}

export interface FinancialThresholds {
  paidUpCapital: number;
  annualTurnoverValue: number;
  hasRequiredBullionTurnover: boolean;
  bullionTurnoverProofFileId: number | null;
  hasRequiredNetWorth: boolean;
  netWorthProofFileId: number | null;
}

export interface RegulatoryCompliance {
  compliantWithAmlCft: boolean;
  complianceOfficerFullName: string;
  complianceOfficerDesignation: string;
  complianceOfficerContactNumber: string;
  complianceOfficerEmail: string;
  hasOngoingCases: boolean;
  ongoingCasesDetails: string;
  anyOnSanctionsList: boolean;
  hasDocumentedAmlPolicies: boolean;
  amlCftPolicyDocumentFileId: number;
  conductsRegularAmlTraining: boolean;
  hasCustomerVerificationProcess: boolean;
  hasInternalRiskAssessment: boolean;
  supplyChainCompliant: boolean;
  hasResponsibleSourcingAuditEvidence: boolean;
  hadRegulatoryPenalties: boolean;
  penaltyExplanation: string;
  declarationNoPenaltyFileId: number;
  hasSupplyChainPolicy: boolean;
  supplyChainPolicyDocumentFileId: number;
  responsibleSourcingAuditEvidence2: boolean;
  assuranceReportFileId: number;
}

export interface MemberRequiredDocuments {
  tradeLicenseAndMoaFileId: number;
  isChecked_TradeLicenseAndMoa: boolean;
  bankingRelationshipEvidenceFileId: number;
  isChecked_BankingRelationshipEvidence: boolean;
  auditedFinancialStatementsFileId: number;
  isChecked_AuditedFinancialStatements: boolean;
  netWorthCertificateFileId: number;
  isChecked_NetWorthCertificate: boolean;
  amlCftPolicyFileId: number;
  isChecked_AmlCftPolicy: boolean;
  supplyChainCompliancePolicyFileId: number;
  isChecked_SupplyChainCompliancePolicy: boolean;
  amlCftAndSupplyChainPoliciesFileId: number;
  isChecked_AmlCftAndSupplyChainPolicies: boolean;
  declarationNoUnresolvedAmlNoticesFileId: number;
  isChecked_DeclarationNoUnresolvedAmlNotices: boolean;
  noUnresolvedAmlNoticesDeclarationFileId: number;
  isChecked_NoUnresolvedAmlNoticesDeclaration: boolean;
  accreditationCertificatesFileId: number;
  isChecked_AccreditationCertificates: boolean;
  boardResolutionFileId: number;
  isChecked_BoardResolution: boolean;
  ownershipStructureFileId: number;
  isChecked_OwnershipStructure: boolean;
  certifiedTrueCopyFileId: number;
  isChecked_CertifiedTrueCopy: boolean;
  latestAssuranceReportFileId: number;
  isChecked_LatestAssuranceReport: boolean;
  responsibleSourcingAssuranceReportFileId: number;
  isChecked_ResponsibleSourcingAssuranceReport: boolean;
  uboProofDocumentsFileId: number;
  isChecked_UboProofDocuments: boolean;
  certifiedIdsFileId: number;
  isChecked_CertifiedIds: boolean;
  otherForms: {
    otherFormName: string;
    otherFormFileId: number;
  }[];
}

export interface DataProtectionPrivacy {
  acknowledge: boolean;
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
}

export interface UploadDetailsPayload {
  membershipType: typeof MembershipType[keyof typeof MembershipType];
  sectionNumber: typeof MemberApplicationSection[keyof typeof MemberApplicationSection];
  applicability?: Applicability;
  companyDetails?: CompanyDetails;
  bankRelationshipRequirement?: BankRelationshipRequirement;
  financialThresholds?: FinancialThresholds;
  regulatoryCompliance?: RegulatoryCompliance;
  memberRequiredDocuments?: MemberRequiredDocuments;
  dataProtectionPrivacy?: DataProtectionPrivacy;
  declarationConsent?: DeclarationConsent;
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
