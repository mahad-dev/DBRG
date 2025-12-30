import * as Yup from 'yup';

/**
 * Step 1 Applicability validation schema - Contributing Member
 * Validates UAE entity status, years of operation, services provided, and AML notices
 */
export const step1ApplicabilitySchema = Yup.object({
  // Membership type
  membership: Yup.string()
    .required('Membership type is required')
    .trim(),

  // UAE-based entity question
  isUAEBasedEntity: Yup.boolean()
    .nullable()
    .test(
      'is-selected',
      'Please select Yes or No for UAE-based entity',
      (value) => value !== null && value !== undefined
    ),

  // Years of operation (0, 1, 3, 5 corresponding to <1, 1-3, 3-5, 5+)
  yearsOfOperation: Yup.number()
    .nullable()
    .test(
      'is-selected',
      'Please select years of operation',
      (value) => value !== null && value !== undefined
    ),

  // Services provided - at least one must be selected
  servicesProvided: Yup.array()
    .of(Yup.number())
    .min(1, 'Please select at least one service')
    .required('Services provided is required'),

  // Other service detail (conditional - if service 8 is selected)
  otherServiceDetail: Yup.string()
    .nullable()
    .trim(),

  // Unresolved AML notices question
  hasUnresolvedAMLNotices: Yup.boolean()
    .nullable()
    .test(
      'is-selected',
      'Please select Yes or No for unresolved AML notices',
      (value) => value !== null && value !== undefined
    ),

  // Signed AML Declaration file - accept File OR existing document ID
  signedAMLFile: Yup.mixed()
    .nullable()
    .test('file-required', 'Signed AML declaration is required', function(value) {
      const { signedAMLFileId } = this.parent;
      console.log('🔍 Validating signedAMLFile:', {
        file: value instanceof File ? 'File present' : 'No file',
        documentId: signedAMLFileId,
        isValid: !!(value instanceof File || signedAMLFileId)
      });
      // Valid if there's a new file OR an existing document ID
      if (value instanceof File) return true;
      if (signedAMLFileId) return true;
      return false;
    }),
  signedAMLFileId: Yup.number().nullable(),
});
