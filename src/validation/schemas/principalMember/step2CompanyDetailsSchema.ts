import * as Yup from 'yup';
import { requiredString, optionalString } from '../../utils/conditionalValidation';
import { requiredFile, optionalFile } from '../../utils/fileValidation';

/**
 * Step 2 Company Details validation schema - Principal Member
 * Validates company info, shareholders, UBOs, directors with dynamic arrays
 */

// Shareholder validation schema
const shareholderSchema = Yup.object({
  fullName: requiredString('Shareholder full name'),
  passportId: requiredString('Passport ID'),
  nationalIdNumber: requiredString('National ID number'),
  shareholdingPercentage: Yup.number()
    .required('Shareholding percentage is required')
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
  nationality: requiredString('Nationality'),
  dateOfAppointment: requiredString('Date of appointment'),
  address: requiredString('Address'),
  proofFile: Yup.mixed()
    .nullable()
    .test('file-required', 'Shareholding proof document is required', function(value) {
      const { proofFileId } = this.parent;
      console.log('🔍 Validating shareholder proofFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: proofFileId,
        isValid: !!(value instanceof File || proofFileId)
      });
      if (value instanceof File) return true;
      if (proofFileId) return true;
      return false;
    }),
  proofFilePath: optionalString(),
  proofFileId: Yup.number().nullable(),
});

// UBO validation schema
const uboSchema = Yup.object({
  fullName: requiredString('UBO full name'),
  ownershipPercentage: Yup.number()
    .required('Ownership percentage is required')
    .min(0, 'Percentage must be at least 0')
    .max(100, 'Percentage cannot exceed 100'),
  nationality: requiredString('Nationality'),
  address: requiredString('Address'),
  passportId: requiredString('Passport ID'),
  nationalIdNumber: requiredString('National ID number'),
  confirmationFile: Yup.mixed()
    .nullable()
    .test('file-required', 'UBO confirmation document is required', function(value) {
      const { confirmationFileId } = this.parent;
      console.log('🔍 Validating UBO confirmationFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: confirmationFileId,
        isValid: !!(value instanceof File || confirmationFileId)
      });
      if (value instanceof File) return true;
      if (confirmationFileId) return true;
      return false;
    }),
  confirmationFilePath: optionalString(),
  confirmationFileId: Yup.number().nullable(),
});

// Director validation schema
const directorSchema = Yup.object({
  fullName: requiredString('Director full name'),
  dateOfAppointment: requiredString('Date of appointment'),
  nationality: requiredString('Nationality'),
  address: requiredString('Address'),
  phoneNumber: requiredString('Phone number'),
});

export const step2CompanyDetailsSchema = Yup.object({
  // Company Information
  legalEntityName: requiredString('Legal entity name'),
  entityLegalType: requiredString('Entity legal type'),
  tradeLicenseNumber: requiredString('Trade license number'),
  licensingAuthority: requiredString('Licensing authority'),
  dateOfIssuance: requiredString('Date of issuance'),
  dateOfExpiry: requiredString('Date of expiry'),
  countryOfIncorporation: requiredString('Country of incorporation'),
  dateOfIncorporation: requiredString('Date of incorporation'),

  // Documents - Trade License & COI
  tradeLicenseFile: requiredFile('Trade license document'),
  tradeLicenseFilePath: optionalString(),
  tradeLicenseFileId: Yup.number().nullable(),

  coiFile: requiredFile('Certificate of incorporation'),
  coiFilePath: optionalString(),
  coiFileId: Yup.number().nullable(),

  // Identity Documents
  passportId: requiredString('Passport ID'),
  passportFile: Yup.mixed()
    .nullable()
    .test('file-required', 'Passport document is required', function(value) {
      const { passportFileId } = this.parent;
      console.log('🔍 Validating passportFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: passportFileId,
        isValid: !!(value instanceof File || passportFileId)
      });
      if (value instanceof File) return true;
      if (passportFileId) return true;
      return false;
    }),
  passportFilePath: optionalString(),
  passportFileId: Yup.number().nullable(),

  nationalId: requiredString('National ID'),
  nationalIdFile: Yup.mixed()
    .nullable()
    .test('file-required', 'National ID document is required', function(value) {
      const { nationalIdFileId } = this.parent;
      console.log('🔍 Validating nationalIdFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: nationalIdFileId,
        isValid: !!(value instanceof File || nationalIdFileId)
      });
      if (value instanceof File) return true;
      if (nationalIdFileId) return true;
      return false;
    }),
  nationalIdFilePath: optionalString(),
  nationalIdFileId: Yup.number().nullable(),

  // VAT & Tax
  vatNumber: requiredString('VAT Number'),
  vatDocFile: Yup.mixed()
    .nullable()
    .test('file-required', 'VAT document is required', function(value) {
      const { vatDocFileId } = this.parent;
      console.log('🔍 Validating vatDocFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: vatDocFileId,
        isValid: !!(value instanceof File || vatDocFileId)
      });
      if (value instanceof File) return true;
      if (vatDocFileId) return true;
      return false;
    }),
  vatDocFilePath: optionalString(),
  vatDocFileId: Yup.number().nullable(),

  taxRegistrationNumber: requiredString('Tax Registration Number'),
  taxRegDocFile: Yup.mixed()
    .nullable()
    .test('file-required', 'Tax registration document is required', function(value) {
      const { taxRegDocFileId } = this.parent;
      console.log('🔍 Validating taxRegDocFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: taxRegDocFileId,
        isValid: !!(value instanceof File || taxRegDocFileId)
      });
      if (value instanceof File) return true;
      if (taxRegDocFileId) return true;
      return false;
    }),
  taxRegDocFilePath: optionalString(),
  taxRegDocFileId: Yup.number().nullable(),

  // Contact Information
  website: requiredString('Website'),
  officialEmail: Yup.string()
    .required('Official email is required')
    .email('Invalid email format')
    .trim(),
  phoneNumber: requiredString('Phone number'),

  // Primary Contact
  primaryContactName: requiredString('Primary contact name'),
  primaryContactDesignation: requiredString('Primary contact designation'),
  primaryContactEmail: Yup.string()
    .required('Primary contact email is required')
    .email('Invalid email format')
    .trim(),

  // Registered Address
  registeredOfficeAddress: requiredString('Registered office address'),
  addressProofFile: Yup.mixed()
    .nullable()
    .test('file-required', 'Address proof document is required', function(value) {
      const { addressProofFileId } = this.parent;
      console.log('🔍 Validating addressProofFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: addressProofFileId,
        isValid: !!(value instanceof File || addressProofFileId)
      });
      if (value instanceof File) return true;
      if (addressProofFileId) return true;
      return false;
    }),
  addressProofFilePath: optionalString(),
  addressProofFileId: Yup.number().nullable(),

  // Dynamic Arrays
  shareholders: Yup.array()
    .of(shareholderSchema)
    .min(1, 'At least one shareholder is required'),

  ubos: Yup.array()
    .of(uboSchema)
    .min(1, 'At least one UBO is required'),

  directors: Yup.array()
    .of(directorSchema)
    .min(1, 'At least one director is required'),

  // PEP Questions
  anyShareholderDirectorUBOPEP: Yup.boolean()
    .required('Please answer if any shareholder/director/UBO is a PEP')
    .nullable(),
  anyShareholderBeneficialOwnerKeyPersonRelatedToPEP: Yup.boolean()
    .required('Please answer if any shareholder/beneficial owner/key person is related to a PEP')
    .nullable(),
  hasCustomerPEPChecks: Yup.boolean()
    .required('Please answer if your establishment checks for PEP customers')
    .nullable(),

  // Trade Association - Optional
  tradeAssociationName: optionalString(),
  nameOfMember: optionalString(),
  dateOfAppointment: optionalString(),

  // Accreditations - Optional
  lbma: Yup.boolean(),
  dmccDgd: Yup.boolean(),
  dmccMdb: Yup.boolean(),
  rjc: Yup.boolean(),
  iages: Yup.boolean(),
  accreditationOther: Yup.boolean(),
  otherAccreditation: optionalString(),
  tradeAssociationCertificateFile: optionalFile(),
  tradeAssociationCertificateFilePath: optionalString(),
  tradeAssociationCertificateFileId: Yup.number().nullable(),
});
