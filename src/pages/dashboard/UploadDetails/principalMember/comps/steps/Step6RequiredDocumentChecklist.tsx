import React, { useRef, useState } from "react";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Button } from "@/components/ui/button";
import { useStep6RequiredDocuments } from "@/hooks/useStep6RequiredDocuments";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { principalMemberStep6Schema } from '@/validation';
import { extractDocumentIdFromPath } from '@/validation/utils/fileValidation';

export default function Step6RequiredDocumentChecklist(): React.ReactElement {
  const { state, uploadDocument, saveUploadDetails, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;
  const [pendingUploads, setPendingUploads] = useState<number>(0);

  const {
    items,
    checked,
    files,
    documentIds,
    otherForms,
    otherFormDocumentIds,
    refs,
    setItemChecked,
    setItemFile,
    removeItemFile,
    setItemDocumentId,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    setOtherFormDocumentId,
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
    amlCftPolicy: 'amlCftPolicyPath',
    supplyChainPolicy: 'supplyChainCompliancePolicyPath',
    amlCftAndSupplyChainPolicies: 'amlCftAndSupplyChainPoliciesPath',
    declaration_aml: 'declarationNoUnresolvedAmlNoticesPath',
    noUnresolvedAmlNoticesDeclaration: 'noUnresolvedAmlNoticesDeclarationPath',
    accreditation: 'accreditationCertificatesPath',
    board_resolution: 'boardResolutionPath',
    ownership_structure: 'ownershipStructurePath',
    certified_true_copy: 'certifiedTrueCopyPath',
    assurance_report: 'latestAssuranceReportPath',
    responsibleSourcingAssuranceReport: 'responsibleSourcingAssuranceReportPath',
    ubo_proof: 'uboProofDocumentsPath',
    certified_ids: 'certifiedIdsPath',
  };

  // Upload file immediately when selected
  const handleFileUpload = async (
    itemId: string,
    file: File | null,
    setFieldValue: any
  ) => {
    setItemFile(itemId, file);
    setFieldValue(`${itemId}_file`, file);
    setFieldValue(`${itemId}_fileTouched`, true);

    if (file) {
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setItemDocumentId(itemId, documentId);
        setFieldValue(`${itemId}_fileId`, documentId);
        toast.success('File uploaded successfully!');
      } catch (error: any) {
        toast.error(error?.message || 'File upload failed');
        setItemFile(itemId, null);
        setFieldValue(`${itemId}_file`, null);
      } finally {
        setPendingUploads(prev => prev - 1);
      }
    }
  };

  // Upload other form file immediately when selected
  const handleOtherFormFileUpload = async (
    formId: string,
    file: File | null,
    _setFieldValue: any
  ) => {
    setOtherFormFile(formId, file);

    if (file) {
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setOtherFormDocumentId(formId, documentId);
        toast.success('File uploaded successfully!');
      } catch (error: any) {
        toast.error(error?.message || 'File upload failed');
        setOtherFormFile(formId, null);
      } finally {
        setPendingUploads(prev => prev - 1);
      }
    }
  };

  const handleSubmit = async (_values: any, _helpers: any) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Use stored document IDs or extract from existing paths
      const getDocumentId = (itemId: string): number | null => {
        return documentIds[itemId] ?? extractDocumentIdFromPath((formData.memberRequiredDocuments as any)?.[pathMap[itemId]] ?? null);
      };

      // Prepare other forms data with document IDs
      const otherFormsData = otherForms.map(of => ({
        otherFormName: of.name,
        otherFormFileId: otherFormDocumentIds[of.id] ?? null,
      }));

      // Save form data
      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        memberRequiredDocuments: {
          tradeLicenseAndMoaFileId: getDocumentId('trade_license'),
          isChecked_TradeLicenseAndMoa: checked.trade_license ?? false,
          bankingRelationshipEvidenceFileId: null,
          isChecked_BankingRelationshipEvidence: false,
          auditedFinancialStatementsFileId: getDocumentId('audited_fs'),
          isChecked_AuditedFinancialStatements: checked.audited_fs ?? false,
          netWorthCertificateFileId: getDocumentId('net_worth'),
          isChecked_NetWorthCertificate: checked.net_worth ?? false,
          amlCftPolicyFileId: getDocumentId('amlCftPolicy'),
          isChecked_AmlCftPolicy: checked.amlCftPolicy ?? false,
          supplyChainCompliancePolicyFileId: getDocumentId('supplyChainPolicy'),
          isChecked_SupplyChainCompliancePolicy: checked.supplyChainPolicy ?? false,
          amlCftAndSupplyChainPoliciesFileId: null,
          isChecked_AmlCftAndSupplyChainPolicies: false,
          declarationNoUnresolvedAmlNoticesFileId: null,
          isChecked_DeclarationNoUnresolvedAmlNotices: false,
          noUnresolvedAmlNoticesDeclarationFileId: getDocumentId('noUnresolvedAmlNoticesDeclaration'),
          isChecked_NoUnresolvedAmlNoticesDeclaration: checked.noUnresolvedAmlNoticesDeclaration ?? false,
          accreditationCertificatesFileId: null,
          isChecked_AccreditationCertificates: false,
          boardResolutionFileId: getDocumentId('board_resolution'),
          isChecked_BoardResolution: checked.board_resolution ?? false,
          ownershipStructureFileId: getDocumentId('ownership_structure'),
          isChecked_OwnershipStructure: checked.ownership_structure ?? false,
          certifiedTrueCopyFileId: getDocumentId('certified_true_copy'),
          isChecked_CertifiedTrueCopy: checked.certified_true_copy ?? false,
          latestAssuranceReportFileId: getDocumentId('assurance_report'),
          isChecked_LatestAssuranceReport: checked.assurance_report ?? false,
          responsibleSourcingAssuranceReportFileId: null,
          isChecked_ResponsibleSourcingAssuranceReport: false,
          uboProofDocumentsFileId: getDocumentId('ubo_proof'),
          isChecked_UboProofDocuments: checked.ubo_proof ?? false,
          certifiedIdsFileId: getDocumentId('certified_ids'),
          isChecked_CertifiedIds: checked.certified_ids ?? false,
          otherForms: otherFormsData,
        }
      }, MemberApplicationSection.RequiredDocs);

      toast.success('Required document checklist saved successfully!');
      setCurrentStep(7);
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save required document checklist. Please try again.');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    checked: {
      trade_license: checked.trade_license ?? false,
      audited_fs: checked.audited_fs ?? false,
      net_worth: checked.net_worth ?? false,
      amlCftPolicy: checked.amlCftPolicy ?? false,
      supplyChainPolicy: checked.supplyChainPolicy ?? false,
      noUnresolvedAmlNoticesDeclaration: checked.noUnresolvedAmlNoticesDeclaration ?? false,
      board_resolution: checked.board_resolution ?? false,
      ownership_structure: checked.ownership_structure ?? false,
      certified_true_copy: checked.certified_true_copy ?? false,
      assurance_report: checked.assurance_report ?? false,
      ubo_proof: checked.ubo_proof ?? false,
      certified_ids: checked.certified_ids ?? false,
    },
    otherForms: otherForms,
    ...items.reduce((acc, item) => {
      acc[`${item.id}_file`] = files[item.id];
      acc[`${item.id}_filePath`] = (formData.memberRequiredDocuments as any)?.[pathMap[item.id]] ?? null;
      acc[`${item.id}_fileId`] = documentIds[item.id];
      return acc;
    }, {} as Record<string, any>),
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={principalMemberStep6Schema}
      onSubmit={handleSubmit}
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
      enableReinitialize={true}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
        <Form>
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
                label={
                  <span>
                    {it.label} <span className="text-red-500">*</span>
                  </span>
                }
                checked={!!checked[it.id]}
                onChange={() => {
                  setItemChecked(it.id, !checked[it.id]);
                  setFieldValue(`checked.${it.id}`, !checked[it.id]);
                  setFieldTouched(`checked.${it.id}`, true);
                }}
              />
              {(touched as any)?.checked?.[it.id] && (errors as any)?.checked?.[it.id] && (
                <p className="text-red-500 text-sm mt-1">{(errors as any).checked[it.id] as string}</p>
              )}

              <div className="mt-2 w-full md:w-[420px]">
                <input
                  ref={refs[it.id]}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] ?? null;
                    await handleFileUpload(it.id, file, setFieldValue);
                  }}
                />

                <UploadBox
                  id={`upload_${it.id}`}
                  file={files[it.id]}
                  prefilledUrl={(formData.memberRequiredDocuments as any)?.[pathMap[it.id]]}
                  onClick={() => refs[it.id]?.current?.click()}
                  onDrop={async (e: React.DragEvent) => {
                    const file = e.dataTransfer?.files?.[0] ?? null;
                    await handleFileUpload(it.id, file, setFieldValue);
                  }}
                  onRemove={() => {
                    removeItemFile(it.id);
                    setItemDocumentId(it.id, null);
                    setFieldValue(`${it.id}_file`, null);
                    setFieldValue(`${it.id}_fileId`, null);
                    setFieldTouched(`${it.id}_file`, true);
                  }}
                />
                {(formData.memberRequiredDocuments as any)?.[pathMap[it.id]] && !files[it.id] && (
                  <a
                    href={(formData.memberRequiredDocuments as any)[pathMap[it.id]]}
                    target="_blank"
                    className="mt-2 inline-block text-[#C6A95F] underline cursor-pointer"
                  >
                    View Previous Document
                  </a>
                )}
                {(touched as any)[`${it.id}_file`] && (errors as any)[`${it.id}_file`] && (
                  <p className="text-red-500 text-sm mt-2">{(errors as any)[`${it.id}_file`] as string}</p>
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
                      onChange={async (e) => {
                        const file = e.target.files?.[0] ?? null;
                        await handleOtherFormFileUpload(of.id, file, setFieldValue);
                      }}
                    />

                    <UploadBox
                      id={`other_${of.id}`}
                      file={of.file}
                      onClick={() => otherRefs.current[of.id]?.click()}
                      onDrop={async (e: React.DragEvent) => {
                        const file = e.dataTransfer?.files?.[0] ?? null;
                        await handleOtherFormFileUpload(of.id, file, setFieldValue);
                      }}
                      onRemove={() => {
                        setOtherFormFile(of.id, null);
                        setOtherFormDocumentId(of.id, null);
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Add Button */}
            <Button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                addOtherForm("");
              }}
              variant={'site_btn'}
              className="px-6 py-3 rounded-md w-full sm:w-auto cursor-pointer"
            >
              Add Form
            </Button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 flex justify-start gap-4">
        <Button
          type="button"
          onClick={() => setCurrentStep(5)}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
        >
          Back
        </Button>

          <Button
            type="button"
            onClick={submitForm}
            disabled={isSaving || pendingUploads > 0}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold cursor-pointer disabled:cursor-not-allowed"
          >
            {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Save / Next'}
          </Button>
        </div>
      </div>
    </div>
        </Form>
      )}
    </Formik>
  );
}
