import * as Yup from 'yup';

/**
 * Step 7 Data Protection validation schema - Affiliate Member
 * This is Step 6 in the Affiliate Member flow
 * Validates data protection compliance and acknowledgment
 *
 * Note: For Affiliate Member, this is a simple acknowledgment step
 * No file uploads or complex questions required
 */
export const step7DataProtectionSchema = Yup.object({
  // Acknowledgment (optional - just tracks if user proceeded through this step)
  acknowledge: Yup.boolean(),
});
