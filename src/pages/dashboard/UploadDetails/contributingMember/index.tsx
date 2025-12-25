"use client";

import { useEffect } from "react";
import UploadStepper from "./comps/UploadStepper";
import Step1Applicability from "./comps/steps/Step1Applicability";
import Step2CompanyDetails from "./comps/steps/Step2CompanyDetails";
import Step7DataProtection from "./comps/steps/Step6DataProtection";
import Step8Agreement from "./comps/steps/Step7Agreement";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useAuth } from '@/context/AuthContext';
import Step3Regulatory from "./comps/steps/Step3Regulatory";
import Step4BankRelationshipRequirement from "./comps/steps/Step4BankRelationshipRequirement";
import Step5RequiredDocumentChecklist from "./comps/steps/Step5RequiredDocumentChecklist";
export default function UploadDetailsContributingMember() {
  const { state, getUploadDetails, updateFormData } = useUploadDetails();
  const { user } = useAuth();
  const currentStep = state.currentStep;

  useEffect(() => {
    if (user?.userId) {
      getUploadDetails(user.userId).then((data) => {
        if (data) {
          updateFormData(data);
        }
      }).catch((error) => {
        console.error("Failed to fetch upload details:", error);
      });
    }
  }, [currentStep]);

  const steps = [
    <Step1Applicability key={1} />,
    <Step2CompanyDetails key={2} />,
    <Step3Regulatory key={5} />,
    <Step4BankRelationshipRequirement key={3} />,
    <Step5RequiredDocumentChecklist key={6} />,
    <Step7DataProtection key={7} />,
    <Step8Agreement key={8} />,
  ];

  // Special consideration check removed since Redux is not used

  // if (isCompleted) {
  //   return (
  //     <div className="flex items-center justify-center p-4">
  //       <div className="bg-white shadow-2xl rounded-3xl max-w-lg w-full sm:w-96 p-8 sm:p-10 text-center border-t-8 border-[#C6A95F] flex flex-col items-center">
  //         {/* Icon */}
  //         <div className="flex justify-center mb-6">
  //           <svg
  //             xmlns="http://www.w3.org/2000/svg"
  //             className="h-24 w-24 text-[#C6A95F]"
  //             fill="none"
  //             viewBox="0 0 24 24"
  //             stroke="currentColor"
  //             strokeWidth={2}
  //           >
  //             <path
  //               strokeLinecap="round"
  //               strokeLinejoin="round"
  //               d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
  //             />
  //           </svg>
  //         </div>

  //         {/* Title */}
  //         <h1 className="text-3xl sm:text-2xl font-bold mb-4 text-gray-800">
  //           Form Already Submitted
  //         </h1>

  //         {/* Description */}
  //         <p className="text-gray-600 text-sm sm:text-base mb-8 px-2 sm:px-0">
  //           You have already completed this form. <br />
  //           Your submission is successfully recorded and cannot be modified.
  //         </p>

  //         {/* Action Buttons */}
  //         <div className="flex flex-col sm:flex-row justify-center gap-4 w-full px-4 sm:px-0">
  //           <Button
  //             variant="default"
  //             className="w-full cursor-pointer sm:w-auto bg-[#C6A95F] hover:bg-[#b8974f] text-white"
  //             onClick={() => navigate("/dashboard")}
  //           >
  //             Go to Dashboard
  //           </Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex flex-col gap-4">
      <UploadStepper currentStep={currentStep} totalSteps={7} />
      <div className="mt-4">{steps[currentStep - 1]}</div>
    </div>
  );
}
