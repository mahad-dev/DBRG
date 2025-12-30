import * as Yup from 'yup';
import { requiredString, requiredNumber } from './conditionalValidation';

/**
 * Validation schema for shareholder array items
 * Used in Step 2 Company Details
 */
export const shareholderSchema = Yup.object({
  fullName: requiredString('Shareholder name'),
  passportId: requiredString('Passport ID'),
  nationalIdNumber: requiredString('National ID number'),
  shareholdingPercentage: requiredNumber('Shareholding percentage')
    .min(0, 'Must be at least 0%')
    .max(100, 'Cannot exceed 100%'),
  nationality: requiredString('Nationality'),
  dateOfAppointment: requiredString('Date of appointment'),
  address: requiredString('Address'),
  proofFile: Yup.mixed()
    .test('proof-required', 'Proof document is required', function (value) {
      const { parent } = this;
      // Valid if: new File exists OR existing document path exists OR document ID exists
      return (
        value instanceof File ||
        !!parent.shareholdingDocumentPath ||
        !!parent.shareholdingDocumentId
      );
    }),
});

/**
 * Validation schema for UBO (Ultimate Beneficial Owner) array items
 * Used in Step 2 Company Details
 */
export const uboSchema = Yup.object({
  fullName: requiredString('UBO name'),
  ownershipPercentage: requiredNumber('Ownership percentage')
    .min(0, 'Must be at least 0%')
    .max(100, 'Cannot exceed 100%'),
  nationality: requiredString('Nationality'),
  address: requiredString('Address'),
  passportId: requiredString('Passport ID'),
  nationalIdNumber: requiredString('National ID number'),
  confirmationFile: Yup.mixed()
    .test('confirmation-required', 'Confirmation document is required', function (value) {
      const { parent } = this;
      // Valid if: new File exists OR existing document path exists OR document ID exists
      return (
        value instanceof File ||
        !!parent.uboConfirmationDocumentPath ||
        !!parent.uboConfirmationDocument
      );
    }),
});

/**
 * Validation schema for director array items
 * Used in Step 2 Company Details
 */
export const directorSchema = Yup.object({
  fullName: requiredString('Director name'),
  dateOfAppointment: requiredString('Date of appointment'),
  nationality: requiredString('Nationality'),
  address: requiredString('Address'),
  phoneNumber: requiredString('Phone number'),
});

/**
 * Helper to validate minimum array length
 *
 * @param minLength - Minimum number of items required
 * @param itemName - Name of the item (e.g., 'shareholder', 'UBO')
 * @returns Yup array validation schema
 */
export const requiredArrayWithMin = (minLength: number, itemName: string) =>
  Yup.array()
    .min(minLength, `At least ${minLength} ${itemName}${minLength > 1 ? 's are' : ' is'} required`);

/**
 * Helper to validate maximum array length
 *
 * @param maxLength - Maximum number of items allowed
 * @param itemName - Name of the item (e.g., 'shareholder', 'UBO')
 * @returns Yup array validation schema
 */
export const arrayWithMax = (maxLength: number, itemName: string) =>
  Yup.array()
    .max(maxLength, `Maximum ${maxLength} ${itemName}${maxLength > 1 ? 's are' : ' is'} allowed`);
