import * as Yup from 'yup';
import { requiredBoolean } from '../../utils/conditionalValidation';

/**
 * Step 1 Applicability validation schema - Affiliate Member
 * Validates eligibility questions and required documents
 */
export const step1ApplicabilitySchema = Yup.lazy((values: any) => {
  console.log('🏗️ Building step1ApplicabilitySchema (Affiliate) with values:', values);

  let schema = Yup.object({
    // Membership type (should always be Affiliate Member)
    membership: Yup.string().nullable(),

    // UAE Office question
    hasUAEOffice: requiredBoolean('UAE office question'),

    // Operates in licensed bullion trading/refining for 3 years
    operatesInBullionOrRefining3Years: requiredBoolean('Licensed bullion/refining 3+ years question'),

    // International organization with UAE branch
    isInternationalOrgWithUAEBranch: requiredBoolean('International organization question'),

    // AML Notices question
    hasUnresolvedAMLNotices: requiredBoolean('AML notices question'),

    // Required documents - accept array of document IDs
    eligibilitySupportingDocuments: Yup.mixed()
      .nullable()
      .test('files-required', 'At least one trade license / proof document is required', function(value) {
        const { eligibilitySupportingDocumentsIds } = this.parent;
        console.log('🔍 Validating eligibilitySupportingDocuments (array):', {
          value,
          documentIds: eligibilitySupportingDocumentsIds,
          documentIdsLength: Array.isArray(eligibilitySupportingDocumentsIds) ? eligibilitySupportingDocumentsIds.length : 0,
          isValid: Array.isArray(eligibilitySupportingDocumentsIds) && eligibilitySupportingDocumentsIds.length > 0
        });
        // Valid if there's at least one document ID in the array
        if (Array.isArray(eligibilitySupportingDocumentsIds) && eligibilitySupportingDocumentsIds.length > 0) {
          return true;
        }
        return false;
      })
      .test('max-files', 'Maximum 5 documents allowed', function(_value) {
        const { eligibilitySupportingDocumentsIds } = this.parent;
        if (Array.isArray(eligibilitySupportingDocumentsIds) && eligibilitySupportingDocumentsIds.length > 5) {
          return false;
        }
        return true;
      }),

    signedAMLDeclaration: Yup.mixed()
      .nullable()
      .test('file-required', 'Signed AML declaration is required', function(value) {
        const { signedAMLDeclarationId } = this.parent;
        console.log('🔍 Validating signedAMLDeclaration:', {
          value,
          file: value instanceof File ? 'File present' : 'No file',
          documentId: signedAMLDeclarationId,
          documentIdType: typeof signedAMLDeclarationId,
          isValid: !!(value instanceof File || signedAMLDeclarationId)
        });
        // Valid if there's a new file OR an existing document ID
        if (value instanceof File) return true;
        if (signedAMLDeclarationId) return true;
        return false;
      }),

    // Optional fields for tracking existing document IDs (arrays for multi-upload)
    eligibilitySupportingDocumentsIds: Yup.array().of(Yup.number()).nullable(),
    signedAMLDeclarationId: Yup.number().nullable(),
  });

  // CONDITIONAL: If hasUAEOffice = true, require office proof documents (array)
  if (values.hasUAEOffice === true) {
    schema = schema.shape({
      uaeOfficeProofDocuments: Yup.mixed()
        .nullable()
        .test('files-required', 'At least one UAE office proof document is required', function(value) {
          const { uaeOfficeProofDocumentsIds } = this.parent;
          console.log('🔍 Validating uaeOfficeProofDocuments (array):', {
            value,
            documentIds: uaeOfficeProofDocumentsIds,
            documentIdsLength: Array.isArray(uaeOfficeProofDocumentsIds) ? uaeOfficeProofDocumentsIds.length : 0,
            isValid: Array.isArray(uaeOfficeProofDocumentsIds) && uaeOfficeProofDocumentsIds.length > 0
          });
          // Valid if there's at least one document ID in the array
          if (Array.isArray(uaeOfficeProofDocumentsIds) && uaeOfficeProofDocumentsIds.length > 0) {
            return true;
          }
          return false;
        })
        .test('max-files', 'Maximum 5 documents allowed', function(_value) {
          const { uaeOfficeProofDocumentsIds } = this.parent;
          if (Array.isArray(uaeOfficeProofDocumentsIds) && uaeOfficeProofDocumentsIds.length > 5) {
            return false;
          }
          return true;
        }),
      uaeOfficeProofDocumentsIds: Yup.array().of(Yup.number()).nullable(),
    });
  }

  console.log('✅ Affiliate step1ApplicabilitySchema created');

  return schema;
});
