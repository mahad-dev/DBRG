import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { useStep5Regulatory } from "@/hooks/useStep5Regulatory";
import { Input } from "@/components/ui/input";
export default function Step5Regulatory({
  onNext,
  onBack,
}: {
  onNext?: () => void;
  onBack?: () => void;
}) {
  const hook = useStep5Regulatory();

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
          />

          {/* conditional details upload */}
          {hook.ongoingCases && (
            <div className="mt-3 max-w-md">
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
                title="If yes, please provide details:"
                file={hook.ongoingDetailsFile}
                onClick={() => hook.ongoingRef.current?.click()}
                onDrop={(e) =>
                  hook.handleDropFile(e, hook.setOngoingDetailsFile)
                }
                onRemove={() => hook.removeFile(hook.setOngoingDetailsFile)}
              />
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
          <YesNoGroup value={hook.idProcesses} onChange={hook.setIdProcesses} />
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
          <YesNoGroup value={hook.penalties} onChange={hook.setPenalties} />
          {hook.penalties && (
            <div className="mt-3 max-w-md">
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
                title="If yes, explain: Upload: Declaration of no penalty/AML notice"
                file={hook.declarationFile}
                onClick={() => hook.declarationRef.current?.click()}
                onDrop={(e) => hook.handleDropFile(e, hook.setDeclarationFile)}
                onRemove={() => hook.removeFile(hook.setDeclarationFile)}
              />
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
        {onBack && (
          <Button
            onClick={onBack}
            className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white font-gilroySemiBold"
          >
            Back
          </Button>
        )}

        {onNext && (
          <Button
            onClick={onNext}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
          >
            Save / Next
          </Button>
        )}
      </div>
    </div>
  );
}
