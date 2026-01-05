import React, { useRef, useState } from "react";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Button } from "@/components/ui/button";
import { useStep6RequiredDocuments } from "@/hooks/useStep6RequiredDocuments";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { contributingMemberStep6Schema } from '@/validation';

export default function Step5RequiredDocumentChecklist(): React.ReactElement {
  const { state, uploadDocument, saveUploadDetails, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  console.log("Step6RequiredDocumentChecklist formData?.memberRequiredDocuments:", formData?.memberRequiredDocuments);

  const {
    items,
    checked,
    files,
    otherForms,
    documentIds,
    documentPaths,
    otherFormDocumentIds,
    refs,
    setItemChecked,
    setItemFile,
    removeItemFile,
    setItemDocumentId,
    setItemDocumentPath,
    addOtherForm,
    updateOtherFormName,
    setOtherFormFile,
    setOtherFormDocumentId,
    handleSelectFile,
    handleDropFile,
  } = useStep6RequiredDocuments(formData?.memberRequiredDocuments);

  const [selectedDocType, setSelectedDocType] = useState<string>(""); // radio toggle state
  const [pendingUploads, setPendingUploads] = useState<Record<string, boolean>>({});

  // Auto-select otherForms if there are other forms in the data
  React.useEffect(() => {
    if (formData?.memberRequiredDocuments?.otherForms && formData.memberRequiredDocuments.otherForms.length > 0) {
      setSelectedDocType("otherForms");
    }
  }, [formData?.memberRequiredDocuments?.otherForms]);
  const otherRefs = useRef<Record<string, HTMLInputElement | null>>({}); // refs for other forms

  const checkboxOnlyItems = [
    "ownership_structure",
    "certified_true_copy",
    "ubo_proof",
    "certified_ids",
  ];

  // Handle file upload immediately when selected
  const handleFileUpload = async (itemId: string, file: File | null, isOtherForm = false) => {
    if (!file) return;

    // Clear old path when new file is uploaded so anchor tag disappears
    if (!isOtherForm) {
      setItemDocumentPath(itemId, "");
    }

    // Set uploading state
    setPendingUploads(prev => ({ ...prev, [itemId]: true }));

    try {
      const documentId = await uploadDocument(file);

      // Store document ID based on type
      if (isOtherForm) {
        setOtherFormDocumentId(itemId, documentId);
      } else {
        setItemDocumentId(itemId, documentId);
      }

      toast.success('File uploaded successfully!');
    } catch (error) {
      toast.error('Failed to upload file. Please try again.');
      console.error('File upload error:', error);
    } finally {
      setPendingUploads(prev => ({ ...prev, [itemId]: false }));
    }
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

      // Save form data using document IDs from state (files already uploaded)
      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        memberRequiredDocuments: {
          tradeLicenseAndMoaFileId: documentIds.trade_license || extractIdFromPath((formData.memberRequiredDocuments as any)?.tradeLicenseAndMoaPath) || null,
          isChecked_TradeLicenseAndMoa: checked.trade_license,
          latestAssuranceReportFileId: documentIds.assurance_report || extractIdFromPath((formData.memberRequiredDocuments as any)?.latestAssuranceReportPath) || null,
          isChecked_LatestAssuranceReport: checked.assurance_report,
          auditedFinancialStatementsFileId: documentIds.audited_fs || extractIdFromPath((formData.memberRequiredDocuments as any)?.auditedFinancialStatementsPath) || null,
          isChecked_AuditedFinancialStatements: checked.audited_fs,
          netWorthCertificateFileId: documentIds.net_worth || extractIdFromPath((formData.memberRequiredDocuments as any)?.netWorthCertificatePath) || null,
          isChecked_NetWorthCertificate: checked.net_worth,
          amlCftPolicyFileId: documentIds.amlCftPolicy || extractIdFromPath((formData.memberRequiredDocuments as any)?.amlCftPolicyPath) || null,
          isChecked_AmlCftPolicy: checked.amlCftPolicy,
          supplyChainCompliancePolicyFileId: documentIds.supplyChainPolicy || extractIdFromPath((formData.memberRequiredDocuments as any)?.supplyChainCompliancePolicyPath) || null,
          isChecked_SupplyChainCompliancePolicy: checked.supplyChainPolicy,
          noUnresolvedAmlNoticesDeclarationFileId: documentIds.noUnresolvedAmlNoticesDeclaration || extractIdFromPath((formData.memberRequiredDocuments as any)?.noUnresolvedAmlNoticesDeclarationPath) || null,
          isChecked_NoUnresolvedAmlNoticesDeclaration: checked.noUnresolvedAmlNoticesDeclaration,
          boardResolutionFileId: documentIds.board_resolution || extractIdFromPath((formData.memberRequiredDocuments as any)?.boardResolutionPath) || null,
          isChecked_BoardResolution: checked.board_resolution,
          ownershipStructureFileId: documentIds.ownership_structure || extractIdFromPath((formData.memberRequiredDocuments as any)?.ownershipStructurePath) || null,
          isChecked_OwnershipStructure: checked.ownership_structure,
          certifiedTrueCopyFileId: documentIds.certified_true_copy || extractIdFromPath((formData.memberRequiredDocuments as any)?.certifiedTrueCopyPath) || null,
          isChecked_CertifiedTrueCopy: checked.certified_true_copy,
          uboProofDocumentsFileId: documentIds.ubo_proof || extractIdFromPath((formData.memberRequiredDocuments as any)?.uboProofDocumentsPath) || null,
          isChecked_UboProofDocuments: checked.ubo_proof,
          certifiedIdsFileId: documentIds.certified_ids || extractIdFromPath((formData.memberRequiredDocuments as any)?.certifiedIdsPath) || null,
          isChecked_CertifiedIds: checked.certified_ids,
          otherForms: otherForms.map(of => ({
            otherFormName: of.name,
            otherFormFileId: otherFormDocumentIds[of.id] || null
          }))
        }
      }, MemberApplicationSection.RequiredDocs);

      toast.success('Required document checklist saved successfully!');
      setCurrentStep(6);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error('Failed to save required document checklist. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Create initial values for Formik
  const initialValues = {
    // File fields for each item
    trade_license_file: files.trade_license,
    trade_license_fileId: documentIds.trade_license,
    trade_license_filePath: documentPaths.trade_license,
    assurance_report_file: files.assurance_report,
    assurance_report_fileId: documentIds.assurance_report,
    assurance_report_filePath: documentPaths.assurance_report,
    audited_fs_file: files.audited_fs,
    audited_fs_fileId: documentIds.audited_fs,
    audited_fs_filePath: documentPaths.audited_fs,
    net_worth_file: files.net_worth,
    net_worth_fileId: documentIds.net_worth,
    net_worth_filePath: documentPaths.net_worth,
    amlCftPolicy_file: files.amlCftPolicy,
    amlCftPolicy_fileId: documentIds.amlCftPolicy,
    amlCftPolicy_filePath: documentPaths.amlCftPolicy,
    supplyChainPolicy_file: files.supplyChainPolicy,
    supplyChainPolicy_fileId: documentIds.supplyChainPolicy,
    supplyChainPolicy_filePath: documentPaths.supplyChainPolicy,
    noUnresolvedAmlNoticesDeclaration_file: files.noUnresolvedAmlNoticesDeclaration,
    noUnresolvedAmlNoticesDeclaration_fileId: documentIds.noUnresolvedAmlNoticesDeclaration,
    noUnresolvedAmlNoticesDeclaration_filePath: documentPaths.noUnresolvedAmlNoticesDeclaration,
    board_resolution_file: files.board_resolution,
    board_resolution_fileId: documentIds.board_resolution,
    board_resolution_filePath: documentPaths.board_resolution,
    ownership_structure_file: files.ownership_structure,
    ownership_structure_fileId: documentIds.ownership_structure,
    ownership_structure_filePath: documentPaths.ownership_structure,
    certified_true_copy_file: files.certified_true_copy,
    certified_true_copy_fileId: documentIds.certified_true_copy,
    certified_true_copy_filePath: documentPaths.certified_true_copy,
    ubo_proof_file: files.ubo_proof,
    ubo_proof_fileId: documentIds.ubo_proof,
    ubo_proof_filePath: documentPaths.ubo_proof,
    certified_ids_file: files.certified_ids,
    certified_ids_fileId: documentIds.certified_ids,
    certified_ids_filePath: documentPaths.certified_ids,
    // Checkboxes
    checked,
    // Other forms
    otherForms,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={contributingMemberStep6Schema}
      onSubmit={handleSave}
      enableReinitialize
      validateOnChange={true}
      validateOnBlur={true}
      validateOnMount={false}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => {
        const hasAnyUploadInProgress = Object.values(pendingUploads).some(uploading => uploading);

        return (
          <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg text-white font-gilroy">
            <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F] leading-[100%] mb-6">
              Section 5 – Required Document Checklist
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
                        const newValue = !checked[it.id];
                        setItemChecked(it.id, newValue);
                        setFieldValue(`checked.${it.id}`, newValue);
                        setFieldTouched(`checked.${it.id}`, true);
                      }}
                    />
                    {(errors as any)?.checked?.[it.id] && (touched as any)?.checked?.[it.id] && (
                      <p className="text-red-500 text-sm mt-1">{(errors as any).checked[it.id] as string}</p>
                    )}

                    {/* Only show upload box if not checkbox-only items */}
                    {!checkboxOnlyItems.includes(it.id) && (
                      <div className="mt-2 w-full md:w-[420px]">
                        <input
                          ref={refs[it.id]}
                          type="file"
                          className="hidden"
                          accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                          onChange={(e) => {
                            handleSelectFile(e, async (f) => {
                              setItemFile(it.id, f);
                              setFieldValue(`${it.id}_file`, f);
                              setFieldTouched(`${it.id}_file`, true);
                              await handleFileUpload(it.id, f, false);
                            });
                          }}
                        />

                        <UploadBox
                          id={`upload_${it.id}`}
                          file={files[it.id]}
                          prefilledUrl={documentPaths[it.id]}
                          onClick={() => refs[it.id]?.current?.click()}
                          onDrop={(e: React.DragEvent) => {
                            handleDropFile(e, async (f) => {
                              setItemFile(it.id, f);
                              setFieldValue(`${it.id}_file`, f);
                              setFieldTouched(`${it.id}_file`, true);
                              await handleFileUpload(it.id, f, false);
                            });
                          }}
                          onRemove={() => {
                            removeItemFile(it.id);
                            setItemDocumentPath(it.id, "");
                            setFieldValue(`${it.id}_file`, null);
                            setFieldTouched(`${it.id}_file`, true);
                          }}
                        />
                        {errors[`${it.id}_file` as keyof typeof errors] && touched[`${it.id}_file` as keyof typeof touched] && !documentIds[it.id] && (
                          <p className="text-red-500 text-sm mt-1">
                            {errors[`${it.id}_file` as keyof typeof errors] as string}
                          </p>
                        )}
                        {documentPaths[it.id] && (
                          <a
                            href={documentPaths[it.id]}
                            target="_blank"
                            className="text-[#C6A95F] underline mt-2 block"
                          >
                            View previously uploaded {it.label}
                          </a>
                        )}
                      </div>
                    )}
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
                    {otherForms.map((of, index) => (
                      <div
                        key={of.id}
                        className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-transparent p-3 rounded-md"
                      >
                        {/* Form Name Input */}
                        <input
                          type="text"
                          value={of.name}
                          onChange={(e) => {
                            updateOtherFormName(of.id, e.target.value);
                            setFieldValue(`otherForms[${index}].name`, e.target.value);
                            setFieldTouched(`otherForms[${index}].name`, true);
                          }}
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
                            onChange={(e) => {
                              handleSelectFile(e, async (f) => {
                                setOtherFormFile(of.id, f);
                                setFieldValue(`otherForms[${index}].file`, f);
                                setFieldTouched(`otherForms[${index}].file`, true);
                                await handleFileUpload(of.id, f, true);
                              });
                            }}
                          />

                          <UploadBox
                            id={`other_${of.id}`}
                            file={of.file}
                            onClick={() => otherRefs.current[of.id]?.click()}
                            onDrop={(e: React.DragEvent) => {
                              handleDropFile(e, async (f) => {
                                setOtherFormFile(of.id, f);
                                setFieldValue(`otherForms[${index}].file`, f);
                                setFieldTouched(`otherForms[${index}].file`, true);
                                await handleFileUpload(of.id, f, true);
                              });
                            }}
                            onRemove={() => {
                              setOtherFormFile(of.id, null);
                              setFieldValue(`otherForms[${index}].file`, null);
                              setFieldTouched(`otherForms[${index}].file`, true);
                            }}
                          />
                          {errors.otherForms?.[index] && typeof errors.otherForms[index] === 'object' && (errors.otherForms[index] as any)?.file && touched.otherForms?.[index]?.file && (
                            <p className="text-red-500 text-sm mt-1">
                              {(errors.otherForms[index] as any).file as string}
                            </p>
                          )}
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
                      // Update Formik array
                      const newOtherForms = [...otherForms, { id: `other_${Date.now()}`, name: "", file: null }];
                      setFieldValue('otherForms', newOtherForms);
                    }}
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
                  onClick={() => setCurrentStep(4)}
                  className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
                >
                  Back
                </Button>

                <Button
                  onClick={submitForm}
                  disabled={isSaving || hasAnyUploadInProgress}
                  variant="site_btn"
                  className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
                >
                  {isSaving ? 'Saving...' : hasAnyUploadInProgress ? 'Uploading...' : 'Save / Next'}
                </Button>
              </div>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}
