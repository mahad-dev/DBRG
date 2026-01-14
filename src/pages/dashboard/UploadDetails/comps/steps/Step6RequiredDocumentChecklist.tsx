import React, { useRef, useState } from "react";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Button } from "@/components/ui/button";
import { useStep6RequiredDocuments } from "@/hooks/useStep6RequiredDocuments";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';

export default function Step6RequiredDocumentChecklist(): React.ReactElement {
  const { state, uploadDocument, saveUploadDetails, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  console.log("Step6RequiredDocumentChecklist formData?.memberRequiredDocuments:", formData?.memberRequiredDocuments);

  const {
    items,
    checked,
    files,
    otherForms,
    refs,
    setItemChecked,
    setItemFile,
    removeItemFile,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    handleSelectFile,
    handleDropFile,
  } = useStep6RequiredDocuments(formData?.memberRequiredDocuments);

  const [selectedDocType, setSelectedDocType] = useState<string>(""); // radio toggle state

  // Auto-select otherForms if there are other forms in the data
  React.useEffect(() => {
    if (formData?.memberRequiredDocuments?.otherForms && formData.memberRequiredDocuments.otherForms.length > 0) {
      setSelectedDocType("otherForms");
    }
  }, [formData?.memberRequiredDocuments?.otherForms]);
  const otherRefs = useRef<Record<string, HTMLInputElement | null>>({}); // refs for other forms

  const pathMap: Record<string, string> = {
    trade_license: 'tradeLicenseAndMoaPath',
    banking_evidence: 'bankingRelationshipEvidencePath',
    audited_fs: 'auditedFinancialStatementsPath',
    net_worth: 'netWorthCertificatePath',
    aml_policy: 'amlCftPolicyPath',
    supply_chain: 'supplyChainCompliancePolicyPath',
    amlCftAndSupplyChainPolicies: 'amlCftAndSupplyChainPoliciesPath',
    declaration_aml: 'declarationNoUnresolvedAmlNoticesPath',
    noUnresolvedAmlNoticesDeclaration: 'noUnresolvedAmlNoticesDeclarationPath',
    accreditation: 'accreditationCertificatesPath',
    board_resolution: 'boardResolutionPath',
    ownership_structure: 'ownershipStructurePath',
    certified_true_copy: 'certifiedTrueCopyPath',
    assurance_report: 'latestAssuranceReportPath',
    responsibleSourcingAssuranceReport: 'responsibleSourcingAssuranceReportPath',
    uboProofDocuments: 'uboProofDocumentsPath',
    certifiedIds: 'certifiedIdsPath',
  };

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Upload files if present and collect document IDs
      const fileIds: Record<string, number> = {};
      const otherFormIds: Record<string, number> = {};

      // Upload item files
      for (const [key, file] of Object.entries(files)) {
        if (file) {
          fileIds[key] = await uploadDocument(file);
        }
      }

      // Upload other form files
      for (const of of otherForms) {
        if (of.file) {
          otherFormIds[of.id] = await uploadDocument(of.file);
        }
      }

      // Save form data
      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        memberRequiredDocuments: {
          tradeLicenseAndMoaFileId: fileIds.trade_license || extractIdFromPath((formData.memberRequiredDocuments as any)?.tradeLicenseAndMoaPath) || null,
          isChecked_TradeLicenseAndMoa: checked.trade_license,
          bankingRelationshipEvidenceFileId: fileIds.banking_evidence || extractIdFromPath((formData.memberRequiredDocuments as any)?.bankingRelationshipEvidencePath) || null,
          isChecked_BankingRelationshipEvidence: checked.banking_evidence,
          auditedFinancialStatementsFileId: fileIds.audited_fs || extractIdFromPath((formData.memberRequiredDocuments as any)?.auditedFinancialStatementsPath) || null,
          isChecked_AuditedFinancialStatements: checked.audited_fs,
          netWorthCertificateFileId: fileIds.net_worth || extractIdFromPath((formData.memberRequiredDocuments as any)?.netWorthCertificatePath) || null,
          isChecked_NetWorthCertificate: checked.net_worth,
          amlCftPolicyFileId: fileIds.aml_policy || extractIdFromPath((formData.memberRequiredDocuments as any)?.amlCftPolicyPath) || null,
          isChecked_AmlCftPolicy: checked.aml_policy,
          supplyChainCompliancePolicyFileId: fileIds.supply_chain || extractIdFromPath((formData.memberRequiredDocuments as any)?.supplyChainCompliancePolicyPath) || null,
          isChecked_SupplyChainCompliancePolicy: checked.supply_chain,
          amlCftAndSupplyChainPoliciesFileId: fileIds.amlCftAndSupplyChainPolicies || extractIdFromPath((formData.memberRequiredDocuments as any)?.amlCftAndSupplyChainPoliciesPath) || null,
          isChecked_AmlCftAndSupplyChainPolicies: checked.amlCftAndSupplyChainPolicies || false,
          declarationNoUnresolvedAmlNoticesFileId: fileIds.declaration_aml || extractIdFromPath((formData.memberRequiredDocuments as any)?.declarationNoUnresolvedAmlNoticesPath) || null,
          isChecked_DeclarationNoUnresolvedAmlNotices: checked.declaration_aml,
          noUnresolvedAmlNoticesDeclarationFileId: fileIds.noUnresolvedAmlNoticesDeclaration || extractIdFromPath((formData.memberRequiredDocuments as any)?.noUnresolvedAmlNoticesDeclarationPath) || null,
          isChecked_NoUnresolvedAmlNoticesDeclaration: checked.noUnresolvedAmlNoticesDeclaration || false,
          accreditationCertificatesFileId: fileIds.accreditation || extractIdFromPath((formData.memberRequiredDocuments as any)?.accreditationCertificatesPath) || null,
          isChecked_AccreditationCertificates: checked.accreditation,
          boardResolutionFileId: fileIds.board_resolution || extractIdFromPath((formData.memberRequiredDocuments as any)?.boardResolutionPath) || null,
          isChecked_BoardResolution: checked.board_resolution,
          ownershipStructureFileId: fileIds.ownership_structure || extractIdFromPath((formData.memberRequiredDocuments as any)?.ownershipStructurePath) || null,
          isChecked_OwnershipStructure: checked.ownership_structure,
          certifiedTrueCopyFileId: fileIds.certified_true_copy || extractIdFromPath((formData.memberRequiredDocuments as any)?.certifiedTrueCopyPath) || null,
          isChecked_CertifiedTrueCopy: checked.certified_true_copy,
          latestAssuranceReportFileId: fileIds.assurance_report || extractIdFromPath((formData.memberRequiredDocuments as any)?.latestAssuranceReportPath) || null,
          isChecked_LatestAssuranceReport: checked.assurance_report,
          responsibleSourcingAssuranceReportFileId: fileIds.responsibleSourcingAssuranceReport || extractIdFromPath((formData.memberRequiredDocuments as any)?.responsibleSourcingAssuranceReportPath) || null,
          isChecked_ResponsibleSourcingAssuranceReport: checked.responsibleSourcingAssuranceReport || false,
          uboProofDocumentsFileId: fileIds.uboProofDocuments || extractIdFromPath((formData.memberRequiredDocuments as any)?.uboProofDocumentsPath) || null,
          isChecked_UboProofDocuments: checked.uboProofDocuments || false,
          certifiedIdsFileId: fileIds.certifiedIds || extractIdFromPath((formData.memberRequiredDocuments as any)?.certifiedIdsPath) || null,
          isChecked_CertifiedIds: checked.certifiedIds || false,
          otherForms: otherForms.map(of => ({ otherFormName: of.name, otherFormFileId: otherFormIds[of.id] || null }))
        }
      }, MemberApplicationSection.RequiredDocs);

      toast.success('Required document checklist saved successfully!');
      setCurrentStep(7);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save required document checklist. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg text-white font-gilroy">
      <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F] leading-[100%] mb-6">
        Section 6 – Required Document Checklist
      </h2>

      <div className="grid grid-cols-1 gap-6">
        {items.map((it) => (
          <div key={it.id} className="flex gap-4 items-start">
            <div className="flex flex-col w-full">
              <ServiceCheckbox
                id={it.id}
                label={it.label}
                checked={!!checked[it.id]}
                onChange={() => setItemChecked(it.id, !checked[it.id])}
              />

              <div className="mt-2 w-full md:w-[420px]">
                <input
                  ref={refs[it.id]}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={(e) =>
                    handleSelectFile(e, (f) => setItemFile(it.id, f))
                  }
                />

                <UploadBox
                  id={`upload_${it.id}`}
                  file={files[it.id]}
                  onClick={() => refs[it.id]?.current?.click()}
                  onDrop={(e: React.DragEvent) =>
                    handleDropFile(e, (f) => setItemFile(it.id, f))
                  }
                  onRemove={() => removeItemFile(it.id)}
                />
                {(formData.memberRequiredDocuments as any)?.[pathMap[it.id]] && !files[it.id] && (
                  <a
                    href={(formData.memberRequiredDocuments as any)[pathMap[it.id]]}
                    target="_blank"
                    className="text-[#C6A95F] underline mt-2 block"
                  >
                    View previously uploaded {it.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Other Forms Radio */}

        <div
          className="flex items-center gap-2 mb-4 cursor-pointer"
          onClick={() =>
            setSelectedDocType((prev) =>
              prev === "otherForms" ? "" : "otherForms"
            )
          }
        >
          <div
            className={`w-5 h-5 border-2 rounded-full flex items-center justify-center transition-colors ${
              selectedDocType === "otherForms"
                ? "bg-[#353535] border-[#C6A95F]"
                : "border-[#C6A95F] bg-transparent"
            }`}
          >
            {selectedDocType === "otherForms" && (
              <span className="w-3 h-3 ml-[0.5px] bg-[#C6A95F] rounded-full"></span>
            )}
          </div>
          <span className="text-[20px] font-medium">Other Forms</span>
        </div>

        {/* Other Forms Section */}
        {selectedDocType === "otherForms" && (
          <div className="space-y-4">
            {/* Forms List (One per line) */}
            <div className="space-y-4">
              {otherForms.map((of) => (
                <div
                  key={of.id}
                  className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent p-3 rounded-md"
                >
                  {/* Form Name Input */}
                  <input
                    type="text"
                    value={of.name}
                    onChange={(e) => updateOtherFormName(of.id, e.target.value)}
                    placeholder="Form Name"
                    className="bg-white text-black rounded-md px-4 py-2 w-full sm:w-60 h-[45px]"
                  />

                  {/* Upload Box */}
                  <div className="w-full sm:flex-1">
                    <input
                      ref={(el) => {
                        otherRefs.current[of.id] = el;
                      }}
                      type="file"
                      className="hidden"
                      accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={(e) =>
                        handleSelectFile(e, (f) => setOtherFormFile(of.id, f))
                      }
                    />

                    <UploadBox
                      id={`other_${of.id}`}
                      file={of.file}
                      onClick={() => otherRefs.current[of.id]?.click()}
                      onDrop={(e: React.DragEvent) =>
                        handleDropFile(e, (f) => setOtherFormFile(of.id, f))
                      }
                      onRemove={() => setOtherFormFile(of.id, null)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <Button
              onClick={() => addOtherForm("")}
              variant={'site_btn'}
              className="px-6 py-3 rounded-md w-full sm:w-auto"
            >
              Add Form
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex justify-start gap-4">
        <Button
          onClick={() => setCurrentStep(5)}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
        >
          Back
        </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
          >
            {isSaving ? 'Saving...' : 'Save / Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}
