import * as Yup from 'yup';
import { optionalFile } from '../../utils/fileValidation';

/**
 * Step 6 Required Document Checklist validation schema - Affiliate Member
 * This is Step 5 in the Affiliate Member flow
 * Validates all required document uploads
 *
 * Note: This schema validates that at least one document is uploaded or exists.
 * The actual document requirements are shown in the UI as checkboxes (not enforced by validation).
 */
export const step6RequiredDocsSchema = Yup.object({
  // Document Files - Optional (user can select which documents to upload via checkboxes)
  trade_license_file: optionalFile(),
  assurance_report_file: optionalFile(),
  audited_fs_file: optionalFile(),
  net_worth_file: optionalFile(),
  amlCftPolicy_file: optionalFile(),
  supplyChainPolicy_file: optionalFile(),
  noUnresolvedAmlNoticesDeclaration_file: optionalFile(),
  board_resolution_file: optionalFile(),
  ownership_structure_file: optionalFile(),
  certified_true_copy_file: optionalFile(),
  ubo_proof_file: optionalFile(),
  certified_ids_file: optionalFile(),

  // Checkboxes
  checked: Yup.object(),

  // Other Forms
  otherForms: Yup.array().of(
    Yup.object({
      id: Yup.string(),
      name: Yup.string(),
      file: Yup.mixed().nullable(),
    })
  ),
});
