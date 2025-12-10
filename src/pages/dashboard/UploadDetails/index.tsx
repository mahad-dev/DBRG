"use client";

import { useState } from "react";
import Step1Applicability from "./comps/steps/Step1Applicability";
import UploadStepper from "./comps/UploadStepper";
import Step2CompanyDetails from "./comps/steps/Step2CompanyDetails";
import Step3BankRelationshipRequirement from "./comps/steps/Step3BankRelationshipRequirement";
import Step4FinancialThresholds from "./comps/steps/Step4FinancialThresholds";
import Step5Regulatory from "./comps/steps/Step5Regulatory";
import Step6RequiredDocumentChecklist from "./comps/steps/Step6RequiredDocumentChecklist";
import Step7DataProtection from "./comps/steps/Step7DataProtection";
import Step8Agreement from "./comps/steps/Step8Agreement";

export default function UploadDetails() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 8));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const steps = [
    <Step1Applicability onNext={nextStep} />,
    <Step2CompanyDetails onNext={nextStep} onBack={prevStep} />,
    <Step3BankRelationshipRequirement onNext={nextStep} onBack={prevStep} />,
    <Step4FinancialThresholds onNext={nextStep} onBack={prevStep} />,
    <Step5Regulatory onNext={nextStep} onBack={prevStep} />,
    <Step6RequiredDocumentChecklist onNext={nextStep} onBack={prevStep} />,
    <Step7DataProtection onNext={nextStep} onBack={prevStep} />,
    <Step8Agreement onBack={prevStep} />,
  ];

  return (
    <div className="flex flex-col gap-4">
      <UploadStepper currentStep={currentStep} totalSteps={8} />
      <div className="mt-4">{steps[currentStep - 1]}</div>
    </div>
  );
}
