import * as Yup from 'yup';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 7 Data Protection validation schema - Principal Member
 * Validates data protection compliance and policies
 */
export const step7DataProtectionSchema = Yup.lazy((values: any) => {
  let schema = Yup.object({
    // Data Protection Compliance Questions
    gdprCompliant: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for GDPR compliance',
        (value) => value !== null && value !== undefined
      ),

    hasDataProtectionPolicy: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for data protection policy',
        (value) => value !== null && value !== undefined
      ),

    hasDataBreachProcedures: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for data breach procedures',
        (value) => value !== null && value !== undefined
      ),

    conductsDataProtectionTraining: Yup.boolean()
      .nullable()
      .test(
        'is-selected',
        'Please select Yes or No for data protection training',
        (value) => value !== null && value !== undefined
      ),

    // Consent Checkboxes (NO required validation - just boolean)
    consentDataProcessing: Yup.boolean(),
    consentDataSharing: Yup.boolean(),
    consentDataRetention: Yup.boolean(),
  });

  // CONDITIONAL: If has data protection policy, require the policy document
  if (values.hasDataProtectionPolicy === true) {
    schema = schema.shape({
      dataProtectionPolicyFile: requiredFile('Data protection policy document'),
    });
  }

  return schema;
});
