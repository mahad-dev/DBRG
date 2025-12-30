import * as Yup from 'yup';
import { optionalFile } from '../../utils/fileValidation';

/**
 * Step 6 Required Document Checklist validation schema - Contributing Member
 * Note: This is Step 5 in Contributing Member flow
 * Validates all required document uploads
 *
 * Note: This schema validates that at least one document is uploaded or exists.
 * The actual document requirements are shown in the UI as checkboxes (not enforced by validation).
 */
export const step6RequiredDocsSchema = Yup.object({
  // Document Files - Optional (user can select which documents to upload via checkboxes)
  trade_license_file: optionalFile(),
  trade_license_fileId: Yup.number().nullable(),
  assurance_report_file: optionalFile(),
  assurance_report_fileId: Yup.number().nullable(),
  audited_fs_file: optionalFile(),
  audited_fs_fileId: Yup.number().nullable(),
  net_worth_file: optionalFile(),
  net_worth_fileId: Yup.number().nullable(),
  amlCftPolicy_file: optionalFile(),
  amlCftPolicy_fileId: Yup.number().nullable(),
  supplyChainPolicy_file: optionalFile(),
  supplyChainPolicy_fileId: Yup.number().nullable(),
  noUnresolvedAmlNoticesDeclaration_file: optionalFile(),
  noUnresolvedAmlNoticesDeclaration_fileId: Yup.number().nullable(),
  board_resolution_file: optionalFile(),
  board_resolution_fileId: Yup.number().nullable(),
  ownership_structure_file: optionalFile(),
  ownership_structure_fileId: Yup.number().nullable(),
  certified_true_copy_file: optionalFile(),
  certified_true_copy_fileId: Yup.number().nullable(),
  ubo_proof_file: optionalFile(),
  ubo_proof_fileId: Yup.number().nullable(),
  certified_ids_file: optionalFile(),
  certified_ids_fileId: Yup.number().nullable(),

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
