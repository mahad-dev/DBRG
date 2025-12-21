import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useStep5Regulatory } from "@/hooks/useStep5Regulatory";
import { Input } from "@/components/ui/input";
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { selectFormData, selectIsSaving, saveUploadDetails, uploadDocument, setCurrentStep } from '../../../../../store/uploadDetailsSlice';
import { MemberApplicationSection } from '../../../../../types/uploadDetails';
import { toast } from 'react-toastify';

export default function Step5Regulatory() {
  const dispatch = useAppDispatch();
  const formData = useAppSelector(selectFormData);
  const isSaving = useAppSelector(selectIsSaving);
  console.log("Step5Regulatory formData.regulatoryCompliance:", formData.regulatoryCompliance);

  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  const hook = useStep5Regulatory(formData.regulatoryCompliance);

  const handleSave = async () => {
    try {
      // Upload files if present and collect document IDs
      let amlCftPolicyDocumentFileId: number | null = null;
      let declarationNoPenaltyFileId: number | null = null;
      let supplyChainPolicyDocumentFileId: number | null = null;
      let assuranceReportFileId: number | null = null;

      if (hook.amlPolicyFile) {
        const result = await dispatch(uploadDocument(hook.amlPolicyFile));
        if (uploadDocument.fulfilled.match(result)) {
          amlCftPolicyDocumentFileId = result.payload;
        }
      }

      if (hook.declarationFile) {
        const result = await dispatch(uploadDocument(hook.declarationFile));
        if (uploadDocument.fulfilled.match(result)) {
          declarationNoPenaltyFileId = result.payload;
        }
      }

      if (hook.supplyChainDueDiligenceFile) {
        const result = await dispatch(uploadDocument(hook.supplyChainDueDiligenceFile));
        if (uploadDocument.fulfilled.match(result)) {
          supplyChainPolicyDocumentFileId = result.payload;
        }
      }

      if (hook.responsibleSourcingFile) {
        const result = await dispatch(uploadDocument(hook.responsibleSourcingFile));
        if (uploadDocument.fulfilled.match(result)) {
          assuranceReportFileId = result.payload;
        }
      }

      // Upload ongoing details file if present (though not used in payload)
      if (hook.ongoingDetailsFile) {
        await dispatch(uploadDocument(hook.ongoingDetailsFile));
      }

      // Save form data
      await dispatch(saveUploadDetails({
        payload: {
          ...formData,
          regulatoryCompliance: {
            compliantWithAmlCft: hook.compliantUAE ?? false,
            complianceOfficerFullName: hook.officerName,
            complianceOfficerDesignation: hook.officerDesignation,
            complianceOfficerContactNumber: hook.officerContact,
            complianceOfficerEmail: hook.officerEmail,
            hasOngoingCases: hook.ongoingCases ?? false,
            ongoingCasesDetails: hook.ongoingCasesDetails,
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
        },
        sectionNumber: MemberApplicationSection.RegulatorCompliance
      }));

      toast.success('Regulatory compliance details saved successfully!');
    } catch (error) {
      toast.error('Failed to save regulatory compliance details. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
      <h2
        className="
    text-[30px] 
    sm:text-[22px] 
    font-bold 
    font-gilory
    leading-[100%]
    text-[#C6A95F] 
    mb-4
  "
      >
        Section 5 – Regulatory & Compliance
      </h2>
      <p
        className="
    text-[26px]
    sm:text-[20px]
    font-semibold
    leading-[100%]
    text-[#C6A95F]
    mt-6
  "
      >
        Please provide details below:
      </p>

      <div className="space-y-6">
        {/* Compliant with UAE AML/CFT Regulations? */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Compliant with UAE AML/CFT Regulations?
          </Label>

          <div className="mt-2">
            <YesNoGroup
              value={hook.compliantUAE}
              onChange={hook.setCompliantUAE}
            onNoClick={() => setSpecialConsiderationOpen(true)}
            />
          </div>
        </div>

        {/* Compliance Officer Details */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Compliance Officer Details
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              value={hook.officerName}
              onChange={(e) => hook.setOfficerName(e.target.value)}
              placeholder="Full Name"
              className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
            />
            <Input
              value={hook.officerDesignation}
              onChange={(e) => hook.setOfficerDesignation(e.target.value)}
              placeholder="Designation"
              className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3  rounded-md"
            />
            <Input
              value={hook.officerContact}
              onChange={(e) => hook.setOfficerContact(e.target.value)}
              placeholder="Contact number"
              className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
            />
            <Input
              value={hook.officerEmail}
              onChange={(e) => hook.setOfficerEmail(e.target.value)}
              placeholder="Email"
              className="bg-white text-black placeholder-gray-400 font-inter placeholder:font-inter border-none p-3 rounded-md"
            />
          </div>
        </div>

        {/* Ongoing cases */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Are there any ongoing cases in court or investigations against the
            company or its key executives?
          </Label>
          <YesNoGroup
            value={hook.ongoingCases}
            onChange={hook.setOngoingCases}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />

          {/* conditional details input and upload */}
          {hook.ongoingCases && (
            <div className="mt-3 space-y-3">
              <div>
                <Label className="text-white text-sm mb-2 block">Please provide details:</Label>
                <textarea
                  value={hook.ongoingCasesDetails}
                  onChange={(e) => hook.setOngoingCasesDetails(e.target.value)}
                  placeholder="Enter details about ongoing cases..."
                  className="w-full bg-white text-black placeholder-gray-400 font-inter border-none p-3 rounded-md min-h-[80px] resize-vertical"
                />
              </div>
              <div className="max-w-md">
                <input
                  ref={hook.ongoingRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    hook.handleSelectFile(e, hook.setOngoingDetailsFile)
                  }
                  accept="image/*,application/pdf"
                />
                <UploadBox
                  title="Upload supporting documents:"
                  file={hook.ongoingDetailsFile}
                  onClick={() => hook.ongoingRef.current?.click()}
                  onDrop={(e) =>
                    hook.handleDropFile(e, hook.setOngoingDetailsFile)
                  }
                  onRemove={() => hook.removeFile(hook.setOngoingDetailsFile)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Sanctions list */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Any key executive, director, shareholder, or UBO listed on any
            international sanctions list (eg, UN, OFAC, EU, UK, UAE Cabinet
            list)?
          </Label>
          <YesNoGroup
            value={hook.sanctionsListed}
            onChange={hook.setSanctionsListed}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
        </div>

        {/* Policies and AML/CFT policy document */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Did your company prepare a documented set of Policies and Procedures
            with regards to combating money laundering and terrorist financing
            according to FATF standards and controls? If yes, please provide a
            copy
          </Label>
          <YesNoGroup
            value={hook.policiesPrepared}
            onChange={hook.setPoliciesPrepared}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
          {hook.policiesPrepared && (
            <div className="mt-3 max-w-md">
              <input
                ref={hook.amlRef}
                type="file"
                className="hidden"
                onChange={(e) =>
                  hook.handleSelectFile(e, hook.setAmlPolicyFile)
                }
                accept="application/pdf,image/*"
              />
              <UploadBox
                title="AML/CFT policy document"
                file={hook.amlPolicyFile}
                onClick={() => hook.amlRef.current?.click()}
                onDrop={(e) => hook.handleDropFile(e, hook.setAmlPolicyFile)}
                onRemove={() => hook.removeFile(hook.setAmlPolicyFile)}
              />
            </div>
          )}
        </div>

        {/* Training */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Does your establishment conduct regular ongoing AML/CFT training for
            staff?
          </Label>
          <YesNoGroup
            value={hook.trainingOngoing}
            onChange={hook.setTrainingOngoing}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
        </div>

        {/* Identification processes */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Has your organisation implemented processes for the identification
            and verification of your customers and beneficial owners?
          </Label>
          <YesNoGroup value={hook.idProcesses} onChange={hook.setIdProcesses} onNoClick={() => setSpecialConsiderationOpen(true)} />
        </div>

        {/* Risk assessment */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Did your company carry out and document an internal risk assessment
            to understand its money laundering and terrorist financing risks?
          </Label>
          <YesNoGroup
            value={hook.riskAssessment}
            onChange={hook.setRiskAssessment}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />
        </div>

        {/* Penalties */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Have you had any penalties from Regulatory Authorities in the past
            due to non-compliance in AML/CFT procedures?
          </Label>
          <YesNoGroup value={hook.penalties} onChange={hook.setPenalties} onNoClick={() => setSpecialConsiderationOpen(true)} />
          {hook.penalties && (
            <div className="mt-3 space-y-3">
              <div>
                <Label className="text-white text-sm mb-2 block">Please explain the penalties:</Label>
                <textarea
                  value={hook.penaltyExplanation}
                  onChange={(e) => hook.setPenaltyExplanation(e.target.value)}
                  placeholder="Enter details about the penalties..."
                  className="w-full bg-white text-black placeholder-gray-400 font-inter border-none p-3 rounded-md min-h-[80px] resize-vertical"
                />
              </div>
              <div className="max-w-md">
                <input
                  ref={hook.declarationRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    hook.handleSelectFile(e, hook.setDeclarationFile)
                  }
                  accept="application/pdf,image/*"
                />
                <UploadBox
                  title="Upload: Declaration of no penalty/AML notice"
                  file={hook.declarationFile}
                  onClick={() => hook.declarationRef.current?.click()}
                  onDrop={(e) => hook.handleDropFile(e, hook.setDeclarationFile)}
                  onRemove={() => hook.removeFile(hook.setDeclarationFile)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Supply Chain */}
        <div>
          <Label
            className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
          >
            Is your company Supply Chain Compliant?
          </Label>
          <YesNoGroup
            value={hook.supplyChainCompliant}
            onChange={hook.setSupplyChainCompliant}
            onNoClick={() => setSpecialConsiderationOpen(true)}
          />

          <div className="mt-4">
            <Label
              className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
            >
              Does the Company have precious metals Supply Chain Policy,
              procedures, and practices?
            </Label>
            <YesNoGroup
              value={hook.preciousPolicy}
              onChange={hook.setPreciousPolicy}
              onNoClick={() => setSpecialConsiderationOpen(true)}
            />
            {hook.preciousPolicy && (
              <div className="mt-3 max-w-md">
                <input
                  ref={hook.supplyRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    hook.handleSelectFile(
                      e,
                      hook.setSupplyChainDueDiligenceFile
                    )
                  }
                  accept="application/pdf,image/*"
                />
                <UploadBox
                  title="Supply chain due diligence policy"
                  file={hook.supplyChainDueDiligenceFile}
                  onClick={() => hook.supplyRef.current?.click()}
                  onDrop={(e) =>
                    hook.handleDropFile(e, hook.setSupplyChainDueDiligenceFile)
                  }
                  onRemove={() =>
                    hook.removeFile(hook.setSupplyChainDueDiligenceFile)
                  }
                />
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label
              className="
    text-[22px]
    sm:text-[18px]
    font-normal
    leading-[100%]
    text-white
    my-3
    font-gilory
  "
            >
              Responsible Sourcing Audit Evidence:
            </Label>
            <YesNoGroup
              value={hook.responsibleSourcingAudit}
              onChange={hook.setResponsibleSourcingAudit}
              onNoClick={() => setSpecialConsiderationOpen(true)}
            />
            {hook.responsibleSourcingAudit && (
              <div className="mt-3 max-w-md">
                <input
                  ref={hook.responsibleRef}
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    hook.handleSelectFile(e, hook.setResponsibleSourcingFile)
                  }
                  accept="application/pdf,image/*"
                />
                <UploadBox
                  title="Responsible Sourcing Audit Evidence"
                  file={hook.responsibleSourcingFile}
                  onClick={() => hook.responsibleRef.current?.click()}
                  onDrop={(e) =>
                    hook.handleDropFile(e, hook.setResponsibleSourcingFile)
                  }
                  onRemove={() =>
                    hook.removeFile(hook.setResponsibleSourcingFile)
                  }
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-10 flex justify-start gap-4">
                <Button
                  onClick={() => dispatch(setCurrentStep(4))}
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

      {/* Special Consideration Dialog */}
      <SpecialConsiderationDialog
        open={specialConsiderationOpen}
        onOpenChange={setSpecialConsiderationOpen}
      />
    </div>
  );
}
