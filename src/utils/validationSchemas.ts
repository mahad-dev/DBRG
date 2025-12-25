import * as Yup from 'yup';

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports international formats)
const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;

// Date validation - must be a valid date and not in the future
const dateSchema = Yup.date()
  .required('Date is required')
  .max(new Date(), 'Date cannot be in the future');

// File validation schema
const fileSchema = Yup.mixed<File>()
  .test('fileRequired', 'File is required', function(value) {
    return !!value;
  })
  .test('fileType', 'Only PDF and image files are allowed', function(value) {
    if (!value) return true;
    const file = value as File;
    return file.type === 'application/pdf' ||
           file.type.startsWith('image/');
  })
  .test('fileSize', 'File size must be less than 10MB', function(value) {
    if (!value) return true;
    const file = value as File;
    return file.size <= 10 * 1024 * 1024; // 10MB
  });

// Step 1: Applicability Validation Schema
export const applicabilitySchema = Yup.object().shape({
  membershipType: Yup.number().required('Please select a membership type'),
  services: Yup.array().min(1, 'At least one service must be selected').required('Services are required'),
  refiningOrTradingCategory: Yup.number().required('Please select a category'),
  isAccreditedRefinery: Yup.boolean().required('This field is required'),
  operatedUnderUAEML5Years: Yup.boolean().required('This field is required'),
  refiningOutputOver10Tons: Yup.boolean().required('This field is required'),
  ratedCompliantByMinistry: Yup.boolean().required('This field is required'),
  involvedInWholesaleBullionTrading: Yup.boolean().required('This field is required'),
  hasBankingRelationships3Years: Yup.boolean().required('This field is required'),
  hasUnresolvedAMLNotices: Yup.boolean().required('This field is required'),
  bankingRelationshipEvidence: fileSchema,
  signedAMLDeclaration: fileSchema,
});

// Step 2: Company Details Validation Schema
export const companyDetailsSchema = Yup.object().shape({
  legalEntityName: Yup.string().required('Legal entity name is required'),
  entityType: Yup.string().required('Entity type is required'),
  entityLegalType: Yup.string().required('Entity legal type is required'),
  tradeLicenseNo: Yup.string().required('Trade license number is required'),
  licensingAuthority: Yup.string().required('Licensing authority is required'),
  dateIssued: dateSchema,
  dateExpiry: dateSchema,
  country: Yup.string().required('Country of incorporation is required'),
  dateIncorp: dateSchema,
  passportId: Yup.string().required('Passport ID is required'),
  nationalId: Yup.string().required('National ID is required'),
  vatNumber: Yup.string().required('VAT number is required'),
  taxRegNumber: Yup.string().required('Tax registration number is required'),
  website: Yup.string().url('Please enter a valid website URL').required('Website is required'),
  emailOfficial: Yup.string()
    .matches(emailRegex, 'Please enter a valid email address')
    .required('Official email is required'),
  phoneNumber: Yup.string()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .required('Phone number is required'),
  primaryContactName: Yup.string().required('Primary contact name is required'),
  primaryContactDesignation: Yup.string().required('Primary contact designation is required'),
  primaryContactEmail: Yup.string()
    .matches(emailRegex, 'Please enter a valid email address')
    .required('Primary contact email is required'),
  registeredOfficeAddress: Yup.string().required('Registered office address is required'),
  anyShareholderDirectorUBOPEP: Yup.boolean().required('This field is required'),
  pepShareholders: Yup.boolean().required('This field is required'),
  pepBeneficialOwners: Yup.boolean().required('This field is required'),
  pepCustomers: Yup.boolean().required('This field is required'),
  shareholdingType: Yup.number().required('Shareholding type is required'),
  shareholders: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required('Full name is required'),
      passportId: Yup.string().required('Passport ID is required'),
      nationalIdNumber: Yup.string().required('National ID number is required'),
      shareholdingPercentage: Yup.number()
        .min(0, 'Percentage must be at least 0')
        .max(100, 'Percentage cannot exceed 100')
        .required('Shareholding percentage is required'),
      nationality: Yup.string().required('Nationality is required'),
      dateOfAppointment: dateSchema,
      address: Yup.string().required('Address is required'),
      passportDocument: fileSchema,
      nationalIdDocument: fileSchema,
      shareholdingDocumentId: fileSchema
    })
  ).min(1, 'At least one shareholder is required'),
  ultimateBeneficialOwners: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required('Full name is required'),
      ownershipPercentage: Yup.number()
        .min(0, 'Percentage must be at least 0')
        .max(100, 'Percentage cannot exceed 100')
        .required('Ownership percentage is required'),
      nationality: Yup.string().required('Nationality is required'),
      address: Yup.string().required('Address is required'),
      passportId: Yup.string().required('Passport ID is required'),
      nationalIdNumber: Yup.string().required('National ID number is required'),
      passportDocument: fileSchema,
      nationalIdDocument: fileSchema,
      uboConfirmationDocument: fileSchema
    })
  ).min(1, 'At least one UBO is required'),
  directors: Yup.array().of(
    Yup.object().shape({
      fullName: Yup.string().required('Full name is required'),
      nationality: Yup.string().required('Nationality is required'),
      dateOfAppointment: dateSchema,
      phoneNumber: Yup.string()
        .matches(phoneRegex, 'Please enter a valid phone number')
        .required('Phone number is required'),
      address: Yup.string().required('Address is required')
    })
  ).min(1, 'At least one director is required'),
  tradeAssociationName: Yup.string().required('Trade association name is required'),
  tradeAssociationMember: Yup.string().required('Trade association member is required'),
  tradeAssociationDate: dateSchema,
  refineryAccreditations: Yup.array().min(1, 'At least one accreditation is required'),
  accreditationOther: Yup.boolean().required('This field is required'),
  accreditationOtherName: Yup.string().when('accreditationOther', {
    is: true,
    then: (schema) => schema.required('Please specify other accreditation')
  }),
  tradeLicenseDocument: fileSchema,
  certificateOfIncorporation: fileSchema,
  taxRegistrationDocument: fileSchema,
  vatDocument: fileSchema,
  addressProofDocument: fileSchema,
  accreditationCertificate: fileSchema,
  shareholdingProof: fileSchema,
  uboConfirmationDocument: fileSchema,
  tradeLicenseNumber: Yup.string().required('Trade license number is required'),
  isRegisteredForCorporateTax: Yup.boolean().required('This field is required'),
  taxRegistrationNumber: Yup.string().required('Tax registration number is required'),
  isRegisteredForVAT: Yup.boolean().required('This field is required'),
  officialEmail: Yup.string()
    .matches(emailRegex, 'Please enter a valid email address')
    .required('Official email is required'),
  countryOfIncorporation: Yup.string().required('Country of incorporation is required'),
  dateOfIncorporation: dateSchema,
  anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: Yup.boolean().required('This field is required'),
  hasCustomerPEPChecks: Yup.boolean().required('This field is required'),
  nameOfMember: Yup.string().required('Name of member is required'),
  dateOfAppointment: dateSchema,
  otherAccreditation: Yup.string().required('Other accreditation is required'),
  lbma: Yup.boolean().required('This field is required'),
  dmccDgd: Yup.boolean().required('This field is required'),
  dmccMdb: Yup.boolean().required('This field is required'),
  rjc: Yup.boolean().required('This field is required'),
  iages: Yup.boolean().required('This field is required')
});

// Step 3: Bank Relationship Requirement Validation Schema
export const bankRelationshipSchema = Yup.object().shape({
  isClientOfDBRGMemberBank24Months: Yup.boolean().required('This field is required'),
  bankReferenceLetterFileId: Yup.mixed().when('isClientOfDBRGMemberBank24Months', {
    is: true,
    then: () => fileSchema
  }),
  bankName: Yup.string().when('isClientOfDBRGMemberBank24Months', {
    is: false,
    then: (schema) => schema.required('Bank name is required')
  }),
  accountNumber: Yup.string().when('isClientOfDBRGMemberBank24Months', {
    is: false,
    then: (schema) => schema.required('Account number is required')
  }),
  accountType: Yup.string().when('isClientOfDBRGMemberBank24Months', {
    is: false,
    then: (schema) => schema.required('Account type is required')
  }),
  bankingRelationSince: Yup.date().when('isClientOfDBRGMemberBank24Months', {
    is: false,
    then: () => dateSchema
  }),
  bankAddress: Yup.string().when('isClientOfDBRGMemberBank24Months', {
    is: false,
    then: (schema) => schema.required('Bank address is required')
  })
});

// Step 4: Financial Thresholds Validation Schema
export const financialThresholdsSchema = Yup.object().shape({
  paidUpCapital: Yup.number().required('Paid up capital is required'),
  annualTurnoverValue: Yup.number().required('Annual turnover value is required'),
  hasRequiredBullionTurnover: Yup.boolean().required('This field is required'),
  bullionTurnoverProofFileId: Yup.mixed().when('hasRequiredBullionTurnover', {
    is: true,
    then: () => fileSchema
  }),
  hasRequiredNetWorth: Yup.boolean().required('This field is required'),
  netWorthProofFileId: Yup.mixed().when('hasRequiredNetWorth', {
    is: true,
    then: () => fileSchema
  })
});

// Step 5: Regulatory Compliance Validation Schema
export const regulatoryComplianceSchema = Yup.object().shape({
  compliantWithAmlCft: Yup.boolean().required('This field is required'),
  complianceOfficerFullName: Yup.string().required('Compliance officer full name is required'),
  complianceOfficerDesignation: Yup.string().required('Compliance officer designation is required'),
  complianceOfficerContactNumber: Yup.string()
    .matches(phoneRegex, 'Please enter a valid phone number')
    .required('Compliance officer contact number is required'),
  complianceOfficerEmail: Yup.string()
    .matches(emailRegex, 'Please enter a valid email address')
    .required('Compliance officer email is required'),
  hasOngoingCases: Yup.boolean().required('This field is required'),
  ongoingCasesDetails: Yup.string().when('hasOngoingCases', {
    is: true,
    then: (schema) => schema.required('Please provide details of ongoing cases')
  }),
  anyOnSanctionsList: Yup.boolean().required('This field is required'),
  hasDocumentedAmlPolicies: Yup.boolean().required('This field is required'),
  amlCftPolicyDocumentFileId: Yup.mixed().when('hasDocumentedAmlPolicies', {
    is: true,
    then: () => fileSchema
  }),
  conductsRegularAmlTraining: Yup.boolean().required('This field is required'),
  hasCustomerVerificationProcess: Yup.boolean().required('This field is required'),
  hasInternalRiskAssessment: Yup.boolean().required('This field is required'),
  supplyChainCompliant: Yup.boolean().required('This field is required'),
  hasResponsibleSourcingAuditEvidence: Yup.boolean().required('This field is required'),
  hadRegulatoryPenalties: Yup.boolean().required('This field is required'),
  penaltyExplanation: Yup.string().when('hadRegulatoryPenalties', {
    is: true,
    then: (schema) => schema.required('Please explain the penalties')
  }),
  declarationNoPenaltyFileId: Yup.mixed().when('hadRegulatoryPenalties', {
    is: false,
    then: () => fileSchema
  }),
  hasSupplyChainPolicy: Yup.boolean().required('This field is required'),
  supplyChainPolicyDocumentFileId: Yup.mixed().when('hasSupplyChainPolicy', {
    is: true,
    then: () => fileSchema
  }),
  responsibleSourcingAuditEvidence2: Yup.boolean().required('This field is required'),
  assuranceReportFileId: Yup.mixed().when('responsibleSourcingAuditEvidence2', {
    is: true,
    then: () => fileSchema
  })
});

// Step 6: Member Required Documents Validation Schema
export const memberRequiredDocumentsSchema = Yup.object().shape({
  tradeLicenseAndMoaFileId: fileSchema,
  isChecked_TradeLicenseAndMoa: Yup.boolean().required('This field is required'),
  bankingRelationshipEvidenceFileId: fileSchema,
  isChecked_BankingRelationshipEvidence: Yup.boolean().required('This field is required'),
  auditedFinancialStatementsFileId: fileSchema,
  isChecked_AuditedFinancialStatements: Yup.boolean().required('This field is required'),
  netWorthCertificateFileId: fileSchema,
  isChecked_NetWorthCertificate: Yup.boolean().required('This field is required'),
  amlCftPolicyFileId: fileSchema,
  isChecked_AmlCftPolicy: Yup.boolean().required('This field is required'),
  supplyChainCompliancePolicyFileId: fileSchema,
  isChecked_SupplyChainCompliancePolicy: Yup.boolean().required('This field is required'),
  amlCftAndSupplyChainPoliciesFileId: fileSchema,
  isChecked_AmlCftAndSupplyChainPolicies: Yup.boolean().required('This field is required'),
  declarationNoUnresolvedAmlNoticesFileId: fileSchema,
  isChecked_DeclarationNoUnresolvedAmlNotices: Yup.boolean().required('This field is required'),
  noUnresolvedAmlNoticesDeclarationFileId: fileSchema,
  isChecked_NoUnresolvedAmlNoticesDeclaration: Yup.boolean().required('This field is required'),
  accreditationCertificatesFileId: fileSchema,
  isChecked_AccreditationCertificates: Yup.boolean().required('This field is required'),
  boardResolutionFileId: fileSchema,
  isChecked_BoardResolution: Yup.boolean().required('This field is required'),
  ownershipStructureFileId: fileSchema,
  isChecked_OwnershipStructure: Yup.boolean().required('This field is required'),
  certifiedTrueCopyFileId: fileSchema,
  isChecked_CertifiedTrueCopy: Yup.boolean().required('This field is required'),
  latestAssuranceReportFileId: fileSchema,
  isChecked_LatestAssuranceReport: Yup.boolean().required('This field is required'),
  responsibleSourcingAssuranceReportFileId: fileSchema,
  isChecked_ResponsibleSourcingAssuranceReport: Yup.boolean().required('This field is required'),
  uboProofDocumentsFileId: fileSchema,
  isChecked_UboProofDocuments: Yup.boolean().required('This field is required'),
  certifiedIdsFileId: fileSchema,
  isChecked_CertifiedIds: Yup.boolean().required('This field is required'),
  otherForms: Yup.array().of(
    Yup.object().shape({
      otherFormName: Yup.string().required('Form name is required'),
      otherFormFileId: fileSchema
    })
  )
});

// Step 7: Data Protection Privacy Validation Schema
export const dataProtectionSchema = Yup.object().shape({
  acknowledge: Yup.boolean()
    .oneOf([true], 'You must acknowledge the data protection policy')
    .required('You must acknowledge the data protection policy')
});

// Step 8: Declaration Consent Validation Schema
export const declarationConsentSchema = Yup.object().shape({
  consentsToDataProcessing: Yup.boolean()
    .oneOf([true], 'You must consent to data processing')
    .required('You must consent to data processing'),
  acknowledgesDataRetention: Yup.boolean()
    .oneOf([true], 'You must acknowledge data retention policy')
    .required('You must acknowledge data retention policy'),
  adheresToCodeOfConduct: Yup.boolean()
    .oneOf([true], 'You must adhere to the code of conduct')
    .required('You must adhere to the code of conduct'),
  applicantName: Yup.string().required('Applicant name is required'),
  authorisedSignatoryName: Yup.string().required('Authorised signatory name is required'),
  designation: Yup.string().required('Designation is required'),
  date: dateSchema,
  digitalSignatureFileId: fileSchema
});
