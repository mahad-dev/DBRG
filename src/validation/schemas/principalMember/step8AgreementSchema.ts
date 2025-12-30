import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';

/**
 * Step 8 Agreement validation schema - Principal Member
 * Validates signature, declarations, and agreement checkboxes
 */
export const step8AgreementSchema = Yup.object({
  // Checkboxes (NO required validation per instructions)
  consentData: Yup.boolean(),
  acknowledgeRetention: Yup.boolean(),
  agreeCode: Yup.boolean(),

  // Required text fields
  applicantName: requiredString('Applicant name'),
  signatoryName: requiredString('Signatory name'),
  designation: requiredString('Designation'),

  // Date validation - required
  selectedDate: Yup.date()
    .nullable()
    .required('Date is required')
    .typeError('Please select a valid date'),

  // Signature - can be either File (uploaded) or string (canvas signature)
  // Also checks for existing signature path
  signatureURL: Yup.mixed()
    .nullable()
    .test('signature-required', 'Signature is required', function (value) {
      const { parent } = this;
      const hasSignatureURL = typeof value === 'string' && value.length > 0;
      const hasExistingPath = !!parent.existingSignaturePath;
      const hasDocumentId = !!parent.signatureDocumentId;

      return hasSignatureURL || hasExistingPath || hasDocumentId;
    }),

  // Hidden fields for tracking existing signature
  existingSignaturePath: Yup.string().nullable(),
  signatureDocumentId: Yup.number().nullable(),
});
