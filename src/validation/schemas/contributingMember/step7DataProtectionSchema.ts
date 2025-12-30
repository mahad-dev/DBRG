import * as Yup from 'yup';

/**
 * Step 7 Data Protection validation schema - Contributing Member
 * Note: This is Step 6 in Contributing Member flow
 *
 * Contributing Member has a simplified data protection step that only requires acknowledgment.
 * Unlike Principal Member, there are no Yes/No questions or file uploads.
 * The user simply acknowledges the data protection policy by proceeding.
 */
export const step7DataProtectionSchema = Yup.object({
  // Simple acknowledgment field - no validation required
  // The step automatically saves with acknowledge: true when user proceeds
  acknowledge: Yup.boolean(),
});
