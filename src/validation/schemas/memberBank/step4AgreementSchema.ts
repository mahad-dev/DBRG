import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';

/**
 * Step 4 Agreement validation schema - Member Bank
 * Validates declaration consent including checkboxes, personal details, and signature
 */
export const step4AgreementSchema = Yup.object({
  // Consent Checkboxes - must all be true
  consentData: Yup.boolean()
    .oneOf([true], 'You must consent to the processing, storage, and use of your data'),

  acknowledgeRetention: Yup.boolean()
    .oneOf([true], 'You must acknowledge data retention requirements'),

  agreeCode: Yup.boolean()
    .oneOf([true], 'You must agree to adhere to the DBRG Code of Conduct'),

  // Personal Details
  applicantName: requiredString('Name of the Applicant'),
  signatoryName: requiredString('Name of Authorised Signatory'),
  designation: requiredString('Designation'),

  // Date field
  selectedDate: Yup.date()
    .required('Date is required')
    .typeError('Please select a valid date'),

  // Signature - can be File or data URL string
  signatureURL: Yup.mixed()
    .test('signature-required', 'Signature is required', function(value) {
      const { existingSignaturePath, signatureDocumentId } = this.parent;

      // Valid if there's a new signature (File or data URL)
      if (value instanceof File) return true;
      if (typeof value === 'string' && value.trim().length > 0) return true;

      // Valid if there's an existing signature path or document ID
      if (existingSignaturePath || signatureDocumentId) return true;

      return false;
    }),

  // Optional fields for tracking existing signature
  existingSignaturePath: Yup.string().nullable(),
  signatureDocumentId: Yup.number().nullable(),
});
