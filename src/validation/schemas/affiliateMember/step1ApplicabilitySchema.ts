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

    // Required documents - accept File OR existing document ID
    eligibilitySupportingDocuments: Yup.mixed()
      .nullable()
      .test('file-required', 'Trade license / proof of years / trade association certificate is required', function(value) {
        const { eligibilitySupportingDocumentsId } = this.parent;
        console.log('🔍 Validating eligibilitySupportingDocuments:', {
          value,
          file: value instanceof File ? 'File present' : 'No file',
          documentId: eligibilitySupportingDocumentsId,
          documentIdType: typeof eligibilitySupportingDocumentsId,
          isValid: !!(value instanceof File || eligibilitySupportingDocumentsId)
        });
        // Valid if there's a new file OR an existing document ID
        if (value instanceof File) return true;
        if (eligibilitySupportingDocumentsId) return true;
        return false;
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

    // Optional fields for tracking existing document IDs
    eligibilitySupportingDocumentsId: Yup.number().nullable(),
    signedAMLDeclarationId: Yup.number().nullable(),
  });

  // CONDITIONAL: If hasUAEOffice = true, require office proof document
  if (values.hasUAEOffice === true) {
    schema = schema.shape({
      uaeOfficeProofDocuments: Yup.mixed()
        .nullable()
        .test('file-required', 'UAE office proof document is required', function(value) {
          const { uaeOfficeProofDocumentsId } = this.parent;
          console.log('🔍 Validating uaeOfficeProofDocuments:', {
            value,
            file: value instanceof File ? 'File present' : 'No file',
            documentId: uaeOfficeProofDocumentsId,
            documentIdType: typeof uaeOfficeProofDocumentsId,
            isValid: !!(value instanceof File || uaeOfficeProofDocumentsId)
          });
          // Valid if there's a new file OR an existing document ID
          if (value instanceof File) return true;
          if (uaeOfficeProofDocumentsId) return true;
          return false;
        }),
      uaeOfficeProofDocumentsId: Yup.number().nullable(),
    });
  }

  console.log('✅ Affiliate step1ApplicabilitySchema created');

  return schema;
});
