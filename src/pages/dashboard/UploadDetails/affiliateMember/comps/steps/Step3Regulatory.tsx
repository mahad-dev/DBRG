import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useStep5Regulatory } from "@/hooks/useStep5Regulatory";
import { Input } from "@/components/ui/input";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { affiliateMemberStep5Schema } from '@/validation';

export default function Step3Regulatory() {
  const { state, dispatch, uploadDocument, saveUploadDetails, setCurrentStep } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<number>(0);

  const hook = useStep5Regulatory(formData.regulatorCompliance);

  // Upload file immediately when selected
  const handleFileUpload = async (
    file: File | null,
    setFile: (f: File | null) => void,
    setDocumentId: (id: number | null) => void,
    setFieldValue: any,
    fieldName: string
  ) => {
    setFile(file);
    setFieldValue(fieldName, file);
    setFieldValue(`${fieldName}Touched`, true);

    if (file) {
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setDocumentId(documentId);
        setFieldValue(`${fieldName}Id`, documentId);
        toast.success('File uploaded successfully!');
      } catch (error) {
        toast.error('File upload failed');
        setFile(null);
        setFieldValue(fieldName, null);
      } finally {
        setPendingUploads(prev => prev - 1);
      }
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

      // Use document IDs from hook (no upload on save)
      const ongoingDetailsFileId = hook.ongoingDetailsDocumentId || null;
      const amlCftPolicyDocumentFileId = hook.amlPolicyDocumentId || extractIdFromPath(formData.regulatorCompliance?.amlCftPolicyDocumentFilePath || null);
      const declarationNoPenaltyFileId = hook.declarationDocumentId || extractIdFromPath(formData.regulatorCompliance?.declarationNoPenaltyFilePath || null);
      const supplyChainPolicyDocumentFileId = hook.supplyChainDocumentId || extractIdFromPath(formData.regulatorCompliance?.supplyChainPolicyDocumentFilePath || null);
      const assuranceReportFileId = hook.responsibleSourcingDocumentId || extractIdFromPath(formData.regulatorCompliance?.assuranceReportFilePath || null);

      // Save form data
      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        regulatorCompliance: {
          compliantWithAmlCft: hook.compliantUAE ?? false,
          complianceOfficerFullName: hook.officerName,
          complianceOfficerDesignation: hook.officerDesignation,
          complianceOfficerContactNumber: hook.officerContact,
          complianceOfficerEmail: hook.officerEmail,
          hasOngoingCases: hook.ongoingCases ?? false,
          ongoingCasesDetails: hook.ongoingCasesDetails,
          investigationSupportingDocuments: ongoingDetailsFileId ? [ongoingDetailsFileId] : [],
          anyOnSanctionsList: hook.sanctionsListed ?? false,
          hasDocumentedAmlPolicies: hook.policiesPrepared ?? false,
          amlCftPolicyDocumentFileId,
          conductsRegularAmlTraining: hook.trainingOngoing ?? false,
          hasCustomerVerificationProcess: hook.idProcesses ?? false,
          hasInternalRiskAssessment: hook.riskAssessment ?? false,
          supplyChainCompliant: hook.supplyChainCompliant ?? false,
          hasResponsibleSourcingAuditEvidence: hook.responsibleSourcingAudit ?? false,
          hadRegulatoryPenalties: hook.penalties ?? false,
          penaltyExplanation: hook.penaltyExplanation,
          declarationNoPenaltyFileId,
          hasSupplyChainPolicy: hook.preciousPolicy ?? false,
          supplyChainPolicyDocumentFileId,
          responsibleSourcingAuditEvidence2: hook.responsibleSourcingAudit ?? false,
          assuranceReportFileId,
        }
      }, MemberApplicationSection.RegulatorCompliance);

      toast.success('Regulatory compliance details saved successfully!');
      setCurrentStep(4);
      dispatch({ type: 'SET_SAVING', payload: false });

    } catch (error) {
      toast.error('Failed to save regulatory compliance details. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    compliantUAE: hook.compliantUAE,
    officerName: hook.officerName,
    officerDesignation: hook.officerDesignation,
    officerContact: hook.officerContact,
    officerEmail: hook.officerEmail,
    ongoingCases: hook.ongoingCases,
    ongoingCasesDetails: hook.ongoingCasesDetails,
    ongoingDetailsFile: hook.ongoingDetailsFile,
    ongoingDetailsFileId: hook.ongoingDetailsDocumentId,
    sanctionsListed: hook.sanctionsListed,
    policiesPrepared: hook.policiesPrepared,
    amlPolicyFile: hook.amlPolicyFile,
    amlPolicyFileId: hook.amlPolicyDocumentId,
    trainingOngoing: hook.trainingOngoing,
    idProcesses: hook.idProcesses,
    riskAssessment: hook.riskAssessment,
    penalties: hook.penalties,
    penaltyExplanation: hook.penaltyExplanation,
    declarationFile: hook.declarationFile,
    declarationFileId: hook.declarationDocumentId,
    supplyChainCompliant: hook.supplyChainCompliant,
    preciousPolicy: hook.preciousPolicy,
    supplyChainDueDiligenceFile: hook.supplyChainDueDiligenceFile,
    supplyChainDueDiligenceFileId: hook.supplyChainDocumentId,
    responsibleSourcingAudit: hook.responsibleSourcingAudit,
    responsibleSourcingFile: hook.responsibleSourcingFile,
    responsibleSourcingFileId: hook.responsibleSourcingDocumentId,
  };

  const handleSubmit = async () => {
    await handleSave();
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={affiliateMemberStep5Schema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
        <Form>
          <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
            <h2 className="text-[30px] sm:text-[22px] font-bold font-gilory leading-[100%] text-[#C6A95F] mb-4">
              Section 3 – Regulatory & Compliance
            </h2>
            <p className="text-[26px] sm:text-[20px] font-semibold leading-[100%] text-[#C6A95F] mt-6">
              Please provide details below:
            </p>

            <div className="space-y-6">
              {/* Compliant with UAE AML/CFT Regulations? */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Compliant with UAE AML/CFT Regulations? <span className="text-red-500">*</span>
                </Label>
                <div className="mt-2">
                  <YesNoGroup
                    value={hook.compliantUAE}
                    onChange={(val) => {
                      hook.setCompliantUAE(val);
                      setFieldValue('compliantUAE', val);
                      setFieldTouched('compliantUAE', true);
                    }}
                    onNoClick={() => setSpecialConsiderationOpen(true)}
                  />
                </div>
                {touched.compliantUAE && errors.compliantUAE && (
                  <p className="text-red-500 text-sm mt-1">{errors.compliantUAE as string}</p>
                )}
              </div>

              {/* Compliance Officer Details */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Compliance Officer Details
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-white text-sm mb-2 block">
                      Full Name: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hook.officerName}
                      onChange={(e) => {
                        hook.setOfficerName(e.target.value);
                        setFieldValue('officerName', e.target.value);
                        setFieldTouched('officerName', true);
                      }}
                      placeholder="Full Name"
                      className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
                    />
                    {touched.officerName && errors.officerName && (
                      <p className="text-red-500 text-sm mt-1">{errors.officerName as string}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-white text-sm mb-2 block">
                      Designation: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hook.officerDesignation}
                      onChange={(e) => {
                        hook.setOfficerDesignation(e.target.value);
                        setFieldValue('officerDesignation', e.target.value);
                        setFieldTouched('officerDesignation', true);
                      }}
                      placeholder="Designation"
                      className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
                    />
                    {touched.officerDesignation && errors.officerDesignation && (
                      <p className="text-red-500 text-sm mt-1">{errors.officerDesignation as string}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-white text-sm mb-2 block">
                      Contact number: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hook.officerContact}
                      onChange={(e) => {
                        hook.setOfficerContact(e.target.value);
                        setFieldValue('officerContact', e.target.value);
                        setFieldTouched('officerContact', true);
                      }}
                      placeholder="Contact number"
                      className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
                    />
                    {touched.officerContact && errors.officerContact && (
                      <p className="text-red-500 text-sm mt-1">{errors.officerContact as string}</p>
                    )}
                  </div>
                  <div>
                    <Label className="text-white text-sm mb-2 block">
                      Email: <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={hook.officerEmail}
                      onChange={(e) => {
                        hook.setOfficerEmail(e.target.value);
                        setFieldValue('officerEmail', e.target.value);
                        setFieldTouched('officerEmail', true);
                      }}
                      placeholder="Email"
                      className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
                    />
                    {touched.officerEmail && errors.officerEmail && (
                      <p className="text-red-500 text-sm mt-1">{errors.officerEmail as string}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ongoing cases */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Are there any ongoing cases in court or investigations against the company or its key executives? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.ongoingCases}
                  onChange={(val) => {
                    hook.setOngoingCases(val);
                    setFieldValue('ongoingCases', val);
                    setFieldTouched('ongoingCases', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.ongoingCases && errors.ongoingCases && (
                  <p className="text-red-500 text-sm mt-1">{errors.ongoingCases as string}</p>
                )}

                {/* conditional details input and upload */}
                {hook.ongoingCases && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <Label className="text-white text-sm mb-2 block">
                        Please provide details: <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        value={hook.ongoingCasesDetails}
                        onChange={(e) => {
                          hook.setOngoingCasesDetails(e.target.value);
                          setFieldValue('ongoingCasesDetails', e.target.value);
                          setFieldTouched('ongoingCasesDetails', true);
                        }}
                        placeholder="Enter details about ongoing cases..."
                        className="w-full bg-white text-black placeholder-gray-400 font-inter border-none p-3 rounded-md min-h-[80px] resize-vertical"
                      />
                      {touched.ongoingCasesDetails && errors.ongoingCasesDetails && (
                        <p className="text-red-500 text-sm mt-1">{errors.ongoingCasesDetails as string}</p>
                      )}
                    </div>
                    <div className="max-w-md">
                      <Label className="text-white text-sm mb-2 block">
                        Upload supporting documents: <span className="text-red-500">*</span>
                      </Label>
                      <input
                        ref={hook.ongoingRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(file, hook.setOngoingDetailsFile, hook.setOngoingDetailsDocumentId, setFieldValue, 'ongoingDetailsFile');
                        }}
                        accept="image/*,application/pdf"
                      />
                      <UploadBox
                        title="Upload supporting documents"
                        file={hook.ongoingDetailsFile}
                        prefilledUrl={formData.regulatorCompliance?.investigationSupportingDocumentPath?.[0] || ''}
                        onClick={() => hook.ongoingRef.current?.click()}
                        onDrop={(e) => {
                          const file = e.dataTransfer?.files?.[0] || null;
                          handleFileUpload(file, hook.setOngoingDetailsFile, hook.setOngoingDetailsDocumentId, setFieldValue, 'ongoingDetailsFile');
                        }}
                        onRemove={() => {
                          hook.removeFile(hook.setOngoingDetailsFile);
                          hook.setOngoingDetailsDocumentId(null);
                          setFieldValue('ongoingDetailsFile', null);
                          setFieldValue('ongoingDetailsFileId', null);
                        }}
                      />
                      {touched.ongoingDetailsFile && errors.ongoingDetailsFile && (
                        <p className="text-red-500 text-sm mt-1">{errors.ongoingDetailsFile as string}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sanctions list */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Any key executive, director, shareholder, or UBO listed on any international sanctions list (eg, UN, OFAC, EU, UK, UAE Cabinet list)? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.sanctionsListed}
                  onChange={(val) => {
                    hook.setSanctionsListed(val);
                    setFieldValue('sanctionsListed', val);
                    setFieldTouched('sanctionsListed', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.sanctionsListed && errors.sanctionsListed && (
                  <p className="text-red-500 text-sm mt-1">{errors.sanctionsListed as string}</p>
                )}
              </div>

              {/* Policies and AML/CFT policy document */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Did your company prepare a documented set of Policies and Procedures with regards to combating money laundering and terrorist financing according to FATF standards and controls? If yes, please provide a copy <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.policiesPrepared}
                  onChange={(val) => {
                    hook.setPoliciesPrepared(val);
                    setFieldValue('policiesPrepared', val);
                    setFieldTouched('policiesPrepared', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.policiesPrepared && errors.policiesPrepared && (
                  <p className="text-red-500 text-sm mt-1">{errors.policiesPrepared as string}</p>
                )}
                {hook.policiesPrepared && (
                  <div className="mt-3 max-w-md">
                    <Label className="text-white text-sm mb-2 block">
                      AML/CFT policy document <span className="text-red-500">*</span>
                    </Label>
                    <input
                      ref={hook.amlRef}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0] || null;
                        handleFileUpload(file, hook.setAmlPolicyFile, hook.setAmlPolicyDocumentId, setFieldValue, 'amlPolicyFile');
                      }}
                      accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    />
                    <UploadBox
                      title="AML/CFT policy document"
                      file={hook.amlPolicyFile}
                      prefilledUrl={formData.regulatorCompliance?.amlCftPolicyDocumentFilePath || ''}
                      onClick={() => hook.amlRef.current?.click()}
                      onDrop={(e) => {
                        const file = e.dataTransfer?.files?.[0] || null;
                        handleFileUpload(file, hook.setAmlPolicyFile, hook.setAmlPolicyDocumentId, setFieldValue, 'amlPolicyFile');
                      }}
                      onRemove={() => {
                        hook.removeFile(hook.setAmlPolicyFile);
                        hook.setAmlPolicyDocumentId(null);
                        setFieldValue('amlPolicyFile', null);
                        setFieldValue('amlPolicyFileId', null);
                      }}
                    />
                    {touched.amlPolicyFile && errors.amlPolicyFile && (
                      <p className="text-red-500 text-sm mt-1">{errors.amlPolicyFile as string}</p>
                    )}
                    {formData.regulatorCompliance?.amlCftPolicyDocumentFilePath && !hook.amlPolicyFile && (
                      <a
                        href={formData.regulatorCompliance.amlCftPolicyDocumentFilePath}
                        target="_blank"
                        className="text-[#C6A95F] underline mt-2 block"
                      >
                        View previously uploaded AML/CFT policy document
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Training */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Does your establishment conduct regular ongoing AML/CFT training for staff? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.trainingOngoing}
                  onChange={(val) => {
                    hook.setTrainingOngoing(val);
                    setFieldValue('trainingOngoing', val);
                    setFieldTouched('trainingOngoing', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.trainingOngoing && errors.trainingOngoing && (
                  <p className="text-red-500 text-sm mt-1">{errors.trainingOngoing as string}</p>
                )}
              </div>

              {/* Identification processes */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Has your organisation implemented processes for the identification and verification of your customers and beneficial owners? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.idProcesses}
                  onChange={(val) => {
                    hook.setIdProcesses(val);
                    setFieldValue('idProcesses', val);
                    setFieldTouched('idProcesses', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.idProcesses && errors.idProcesses && (
                  <p className="text-red-500 text-sm mt-1">{errors.idProcesses as string}</p>
                )}
              </div>

              {/* Risk assessment */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Did your company carry out and document an internal risk assessment to understand its money laundering and terrorist financing risks? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.riskAssessment}
                  onChange={(val) => {
                    hook.setRiskAssessment(val);
                    setFieldValue('riskAssessment', val);
                    setFieldTouched('riskAssessment', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.riskAssessment && errors.riskAssessment && (
                  <p className="text-red-500 text-sm mt-1">{errors.riskAssessment as string}</p>
                )}
              </div>

              {/* Penalties */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Have you had any penalties from Regulatory Authorities in the past due to non-compliance in AML/CFT procedures? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.penalties}
                  onChange={(val) => {
                    hook.setPenalties(val);
                    setFieldValue('penalties', val);
                    setFieldTouched('penalties', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.penalties && errors.penalties && (
                  <p className="text-red-500 text-sm mt-1">{errors.penalties as string}</p>
                )}
                {hook.penalties && (
                  <div className="mt-3 space-y-3">
                    <div>
                      <Label className="text-white text-sm mb-2 block">
                        Please explain the penalties: <span className="text-red-500">*</span>
                      </Label>
                      <textarea
                        value={hook.penaltyExplanation}
                        onChange={(e) => {
                          hook.setPenaltyExplanation(e.target.value);
                          setFieldValue('penaltyExplanation', e.target.value);
                          setFieldTouched('penaltyExplanation', true);
                        }}
                        placeholder="Enter details about the penalties..."
                        className="w-full bg-white text-black placeholder-gray-400 font-inter border-none p-3 rounded-md min-h-[80px] resize-vertical"
                      />
                      {touched.penaltyExplanation && errors.penaltyExplanation && (
                        <p className="text-red-500 text-sm mt-1">{errors.penaltyExplanation as string}</p>
                      )}
                    </div>
                    <div className="max-w-md">
                      <Label className="text-white text-sm mb-2 block">
                        Upload: Declaration of no penalty/AML notice <span className="text-red-500">*</span>
                      </Label>
                      <input
                        ref={hook.declarationRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(file, hook.setDeclarationFile, hook.setDeclarationDocumentId, setFieldValue, 'declarationFile');
                        }}
                        accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      />
                      <UploadBox
                        title="Upload: Declaration of no penalty/AML notice"
                        file={hook.declarationFile}
                        prefilledUrl={formData.regulatorCompliance?.declarationNoPenaltyFilePath || ''}
                        onClick={() => hook.declarationRef.current?.click()}
                        onDrop={(e) => {
                          const file = e.dataTransfer?.files?.[0] || null;
                          handleFileUpload(file, hook.setDeclarationFile, hook.setDeclarationDocumentId, setFieldValue, 'declarationFile');
                        }}
                        onRemove={() => {
                          hook.removeFile(hook.setDeclarationFile);
                          hook.setDeclarationDocumentId(null);
                          setFieldValue('declarationFile', null);
                          setFieldValue('declarationFileId', null);
                        }}
                      />
                      {touched.declarationFile && errors.declarationFile && (
                        <p className="text-red-500 text-sm mt-1">{errors.declarationFile as string}</p>
                      )}
                      {formData.regulatorCompliance?.declarationNoPenaltyFilePath && !hook.declarationFile && (
                        <a
                          href={formData.regulatorCompliance.declarationNoPenaltyFilePath}
                          target="_blank"
                          className="text-[#C6A95F] underline mt-2 block"
                        >
                          View previously uploaded declaration document
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Supply Chain */}
              <div>
                <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                  Is your company Supply Chain Compliant? <span className="text-red-500">*</span>
                </Label>
                <YesNoGroup
                  value={hook.supplyChainCompliant}
                  onChange={(val) => {
                    hook.setSupplyChainCompliant(val);
                    setFieldValue('supplyChainCompliant', val);
                    setFieldTouched('supplyChainCompliant', true);
                  }}
                  onNoClick={() => setSpecialConsiderationOpen(true)}
                />
                {touched.supplyChainCompliant && errors.supplyChainCompliant && (
                  <p className="text-red-500 text-sm mt-1">{errors.supplyChainCompliant as string}</p>
                )}

                <div className="mt-4">
                  <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                    Does the Company have precious metals Supply Chain Policy, procedures, and practices? <span className="text-red-500">*</span>
                  </Label>
                  <YesNoGroup
                    value={hook.preciousPolicy}
                    onChange={(val) => {
                      hook.setPreciousPolicy(val);
                      setFieldValue('preciousPolicy', val);
                      setFieldTouched('preciousPolicy', true);
                    }}
                    onNoClick={() => setSpecialConsiderationOpen(true)}
                  />
                  {touched.preciousPolicy && errors.preciousPolicy && (
                    <p className="text-red-500 text-sm mt-1">{errors.preciousPolicy as string}</p>
                  )}
                  {hook.preciousPolicy && (
                    <div className="mt-3 max-w-md">
                      <Label className="text-white text-sm mb-2 block">
                        Supply chain due diligence policy <span className="text-red-500">*</span>
                      </Label>
                      <input
                        ref={hook.supplyRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(file, hook.setSupplyChainDueDiligenceFile, hook.setSupplyChainDocumentId, setFieldValue, 'supplyChainDueDiligenceFile');
                        }}
                        accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      />
                      <UploadBox
                        title="Supply chain due diligence policy"
                        file={hook.supplyChainDueDiligenceFile}
                        prefilledUrl={formData.regulatorCompliance?.supplyChainPolicyDocumentFilePath || ''}
                        onClick={() => hook.supplyRef.current?.click()}
                        onDrop={(e) => {
                          const file = e.dataTransfer?.files?.[0] || null;
                          handleFileUpload(file, hook.setSupplyChainDueDiligenceFile, hook.setSupplyChainDocumentId, setFieldValue, 'supplyChainDueDiligenceFile');
                        }}
                        onRemove={() => {
                          hook.removeFile(hook.setSupplyChainDueDiligenceFile);
                          hook.setSupplyChainDocumentId(null);
                          setFieldValue('supplyChainDueDiligenceFile', null);
                          setFieldValue('supplyChainDueDiligenceFileId', null);
                        }}
                      />
                      {touched.supplyChainDueDiligenceFile && errors.supplyChainDueDiligenceFile && (
                        <p className="text-red-500 text-sm mt-1">{errors.supplyChainDueDiligenceFile as string}</p>
                      )}
                      {formData.regulatorCompliance?.supplyChainPolicyDocumentFilePath && !hook.supplyChainDueDiligenceFile && (
                        <a
                          href={formData.regulatorCompliance.supplyChainPolicyDocumentFilePath}
                          target="_blank"
                          className="text-[#C6A95F] underline mt-2 block"
                        >
                          View previously uploaded supply chain policy document
                        </a>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <Label className="text-[22px] sm:text-[18px] font-normal leading-[100%] text-white my-3 font-gilory">
                    Responsible Sourcing Audit Evidence: <span className="text-red-500">*</span>
                  </Label>
                  <YesNoGroup
                    value={hook.responsibleSourcingAudit}
                    onChange={(val) => {
                      hook.setResponsibleSourcingAudit(val);
                      setFieldValue('responsibleSourcingAudit', val);
                      setFieldTouched('responsibleSourcingAudit', true);
                    }}
                    onNoClick={() => setSpecialConsiderationOpen(true)}
                  />
                  {touched.responsibleSourcingAudit && errors.responsibleSourcingAudit && (
                    <p className="text-red-500 text-sm mt-1">{errors.responsibleSourcingAudit as string}</p>
                  )}
                  {hook.responsibleSourcingAudit && (
                    <div className="mt-3 max-w-md">
                      <Label className="text-white text-sm mb-2 block">
                        Responsible Sourcing Audit Evidence <span className="text-red-500">*</span>
                      </Label>
                      <input
                        ref={hook.responsibleRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0] || null;
                          handleFileUpload(file, hook.setResponsibleSourcingFile, hook.setResponsibleSourcingDocumentId, setFieldValue, 'responsibleSourcingFile');
                        }}
                        accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      />
                      <UploadBox
                        title="Responsible Sourcing Audit Evidence"
                        file={hook.responsibleSourcingFile}
                        prefilledUrl={formData.regulatorCompliance?.assuranceReportFilePath || ''}
                        onClick={() => hook.responsibleRef.current?.click()}
                        onDrop={(e) => {
                          const file = e.dataTransfer?.files?.[0] || null;
                          handleFileUpload(file, hook.setResponsibleSourcingFile, hook.setResponsibleSourcingDocumentId, setFieldValue, 'responsibleSourcingFile');
                        }}
                        onRemove={() => {
                          hook.removeFile(hook.setResponsibleSourcingFile);
                          hook.setResponsibleSourcingDocumentId(null);
                          setFieldValue('responsibleSourcingFile', null);
                          setFieldValue('responsibleSourcingFileId', null);
                        }}
                      />
                      {touched.responsibleSourcingFile && errors.responsibleSourcingFile && (
                        <p className="text-red-500 text-sm mt-1">{errors.responsibleSourcingFile as string}</p>
                      )}
                      {formData.regulatorCompliance?.assuranceReportFilePath && !hook.responsibleSourcingFile && (
                        <a
                          href={formData.regulatorCompliance.assuranceReportFilePath}
                          target="_blank"
                          className="text-[#C6A95F] underline mt-2 block"
                        >
                          View previously uploaded responsible sourcing audit evidence
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-10 flex justify-start gap-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={() => submitForm()}
                disabled={isSaving || pendingUploads > 0}
                variant="site_btn"
                className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
              >
                {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Save / Next'}
              </Button>
            </div>

            {/* Special Consideration Dialog */}
            <SpecialConsiderationDialog
              open={specialConsiderationOpen}
              onOpenChange={setSpecialConsiderationOpen}
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}
