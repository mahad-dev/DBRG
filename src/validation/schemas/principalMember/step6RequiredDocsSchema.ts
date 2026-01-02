import * as Yup from 'yup';
import { requiredFile } from '../../utils/fileValidation';

/**
 * Step 6 Required Document Checklist validation schema - Principal Member
 * Validates all required document uploads
 *
 * All documents are now required for Principal Member applications.
 */
export const step6RequiredDocsSchema = Yup.object({
  // Document Files - All Required
  trade_license_file: requiredFile('Trade License and MOA'),
  assurance_report_file: requiredFile('Latest Assurance Report'),
  audited_fs_file: requiredFile('Audited Financial Statements'),
  net_worth_file: requiredFile('Net Worth Certificate'),
  amlCftPolicy_file: requiredFile('AML/CFT Policy'),
  supplyChainPolicy_file: requiredFile('Supply Chain Compliance Policy'),
  noUnresolvedAmlNoticesDeclaration_file: requiredFile('Declaration - No Unresolved AML Notices'),
  board_resolution_file: requiredFile('Board Resolution'),
  ownership_structure_file: requiredFile('Ownership Structure'),
  certified_true_copy_file: requiredFile('Certified True Copy'),
  ubo_proof_file: requiredFile('UBO Proof Documents'),
  certified_ids_file: requiredFile('Certified IDs'),

  // Checkboxes - All Required to be checked
  checked: Yup.object({
    trade_license: Yup.boolean().oneOf([true], 'You must confirm Trade License and MOA'),
    audited_fs: Yup.boolean().oneOf([true], 'You must confirm Audited Financial Statements'),
    net_worth: Yup.boolean().oneOf([true], 'You must confirm Net Worth Certificate'),
    amlCftPolicy: Yup.boolean().oneOf([true], 'You must confirm AML/CFT Policy'),
    supplyChainPolicy: Yup.boolean().oneOf([true], 'You must confirm Supply Chain Compliance Policy'),
    noUnresolvedAmlNoticesDeclaration: Yup.boolean().oneOf([true], 'You must confirm Declaration - No Unresolved AML Notices'),
    board_resolution: Yup.boolean().oneOf([true], 'You must confirm Board Resolution'),
    ownership_structure: Yup.boolean().oneOf([true], 'You must confirm Ownership Structure'),
    certified_true_copy: Yup.boolean().oneOf([true], 'You must confirm Certified True Copy'),
    assurance_report: Yup.boolean().oneOf([true], 'You must confirm Latest Assurance Report'),
    ubo_proof: Yup.boolean().oneOf([true], 'You must confirm UBO Proof Documents'),
    certified_ids: Yup.boolean().oneOf([true], 'You must confirm Certified IDs'),
  }).required('All checkboxes must be checked'),

  // Other Forms - Optional section
  otherForms: Yup.array().of(
    Yup.object({
      id: Yup.string(),
      name: Yup.string(),
      file: Yup.mixed().nullable(),
    })
  ),
});
