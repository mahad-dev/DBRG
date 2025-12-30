import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 3 Bank Relationship Requirement validation schema - Affiliate Member
 * This is Step 4 in the Affiliate Member flow
 * Validates banking relationship information including bank details and supporting documents
 */
export const step3BankRelationshipSchema = Yup.object({
  // Client of UAE-regulated bank for 12+ months
  isClient24Months: Yup.boolean()
    .nullable()
    .test(
      'is-selected',
      'Please select Yes or No',
      (value) => value !== null && value !== undefined
    ),

  // Bank Reference Letter
  bankReferenceLetterFile: requiredFile('Bank reference letter or account confirmation'),

  // Bank Details
  bankName: requiredString('Bank name'),
  accountNumber: requiredString('Account number'),
  accountType: requiredString('Account type'),
  bankingSince: requiredString('Banking relation since'),
  address: requiredString('Bank address'),
});
