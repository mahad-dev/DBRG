import * as Yup from 'yup';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 6 Required Document Checklist validation schema - Affiliate Member
 * This is Step 5 in the Affiliate Member flow
 * Validates all required document uploads
 *
 * All documents are required for Affiliate Member.
 */
export const step6RequiredDocsSchema = Yup.object({
  // Document Files - All Required
  trade_license_file: requiredFile('Trade License and MOA'),
  trade_license_fileId: Yup.number().nullable(),
  trade_license_filePath: Yup.string().nullable(),

  assurance_report_file: requiredFile('Latest Assurance Report'),
  assurance_report_fileId: Yup.number().nullable(),
  assurance_report_filePath: Yup.string().nullable(),

  audited_fs_file: requiredFile('Audited Financial Statements'),
  audited_fs_fileId: Yup.number().nullable(),
  audited_fs_filePath: Yup.string().nullable(),

  net_worth_file: requiredFile('Net Worth Certificate'),
  net_worth_fileId: Yup.number().nullable(),
  net_worth_filePath: Yup.string().nullable(),

  amlCftPolicy_file: requiredFile('AML/CFT Policy'),
  amlCftPolicy_fileId: Yup.number().nullable(),
  amlCftPolicy_filePath: Yup.string().nullable(),

  supplyChainPolicy_file: requiredFile('Supply Chain Compliance Policy'),
  supplyChainPolicy_fileId: Yup.number().nullable(),
  supplyChainPolicy_filePath: Yup.string().nullable(),

  noUnresolvedAmlNoticesDeclaration_file: requiredFile('Declaration - No Unresolved AML Notices'),
  noUnresolvedAmlNoticesDeclaration_fileId: Yup.number().nullable(),
  noUnresolvedAmlNoticesDeclaration_filePath: Yup.string().nullable(),

  board_resolution_file: requiredFile('Board Resolution'),
  board_resolution_fileId: Yup.number().nullable(),
  board_resolution_filePath: Yup.string().nullable(),

  // Checkboxes - All Required
  checked: Yup.object({
    trade_license: Yup.boolean().oneOf([true], 'You must check this item'),
    assurance_report: Yup.boolean().oneOf([true], 'You must check this item'),
    audited_fs: Yup.boolean().oneOf([true], 'You must check this item'),
    net_worth: Yup.boolean().oneOf([true], 'You must check this item'),
    amlCftPolicy: Yup.boolean().oneOf([true], 'You must check this item'),
    supplyChainPolicy: Yup.boolean().oneOf([true], 'You must check this item'),
    noUnresolvedAmlNoticesDeclaration: Yup.boolean().oneOf([true], 'You must check this item'),
    board_resolution: Yup.boolean().oneOf([true], 'You must check this item'),
    ownership_structure: Yup.boolean().oneOf([true], 'You must check this item'),
    certified_true_copy: Yup.boolean().oneOf([true], 'You must check this item'),
    ubo_proof: Yup.boolean().oneOf([true], 'You must check this item'),
    certified_ids: Yup.boolean().oneOf([true], 'You must check this item'),
  }),

  // Other Forms
  otherForms: Yup.array().of(
    Yup.object({
      id: Yup.string(),
      name: Yup.string(),
      file: Yup.mixed().nullable(),
    })
  ),
});
