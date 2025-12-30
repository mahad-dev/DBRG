import * as Yup from 'yup';
import { requiredString } from '../../utils/conditionalValidation';

/**
 * Step 1 Applicability validation schema - Member Bank
 * Validates membership selection, regulatory questions, and AML declaration
 */
export const step1ApplicabilitySchema = Yup.lazy((values: any) => {
  let schema = Yup.object({
    // Membership type selection
    membership: requiredString('Membership type'),

    // Regulated by CBA question
    regulatedByCBA: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for CBA regulation',
        (value) => value !== null && value !== undefined
      ),

    // Relationship with UAE Good Delivery Brand question
    hasRelationshipWithUAEGoodDeliveryBrand: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for UAE Good Delivery Brand relationship',
        (value) => value !== null && value !== undefined
      ),

    // AML Notices question
    anyAMLNotices: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for AML notices question',
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

  // CONDITIONAL: If has relationship with brand, require brand name
  if (values.hasRelationshipWithUAEGoodDeliveryBrand === true) {
    schema = schema.shape({
      brandName: requiredString('Brand name'),
    });
  }

  return schema;
});
