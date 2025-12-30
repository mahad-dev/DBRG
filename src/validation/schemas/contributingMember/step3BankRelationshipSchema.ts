import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 3 Bank Relationship Requirement validation schema - Contributing Member
 * Note: This is Step 4 in Contributing Member flow (after Step 2 Company Details, no Step 3)
 * Validates banking relationship information including bank details and supporting documents
 * Requirement changed from 24 months to 12+ months for Contributing Member
 */
export const step3BankRelationshipSchema = Yup.object({
  // Client of UAE-regulated bank for 12+ months (Contributing Member requirement)
  isClient24Months: Yup.boolean()
    .nullable()
    .test(
      'is-selected',
      'Please select Yes or No',
      (value) => value !== null && value !== undefined
    ),

  // Bank Reference Letter
  bankReferenceLetterFile: requiredFile('Bank reference letter or account confirmation'),
  bankReferenceLetterFileId: Yup.number().nullable(),

  // Bank Details
  bankName: requiredString('Bank name'),
  accountNumber: requiredString('Account number'),
  accountType: requiredString('Account type'),
  bankingSince: requiredString('Banking relation since'),
  address: requiredString('Bank address'),
});
