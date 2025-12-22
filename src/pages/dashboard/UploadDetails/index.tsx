"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  getUploadDetails,
  selectCurrentStep,
  selectIsLoading,
  selectFormData,
  setCurrentStep,
} from "../../../store/uploadDetailsSlice";
import UploadStepper from "./comps/UploadStepper";
import Step1Applicability from "./comps/steps/Step1Applicability";
import Step2CompanyDetails from "./comps/steps/Step2CompanyDetails";
import Step3BankRelationshipRequirement from "./comps/steps/Step3BankRelationshipRequirement";
import Step4FinancialThresholds from "./comps/steps/Step4FinancialThresholds";
import Step5Regulatory from "./comps/steps/Step5Regulatory";
import Step6RequiredDocumentChecklist from "./comps/steps/Step6RequiredDocumentChecklist";
import Step7DataProtection from "./comps/steps/Step7DataProtection";
import Step8Agreement from "./comps/steps/Step8Agreement";
export default function UploadDetails() {
  const dispatch = useAppDispatch();
  const currentStep = useAppSelector(selectCurrentStep);
  const isLoadingFromStore = useAppSelector(selectIsLoading);
  const formData = useAppSelector(selectFormData);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUploadDetails(userId)).then((res: any) => {
        const data = res.payload?.data;
        console.log("first..",data)

        if (!data?.isCompleted) {
          const lastCompleted = data?.application?.lastCompletedSection ?? 0;
          const nextStep = lastCompleted + 1;
          dispatch(setCurrentStep(nextStep));
        }

        setLoading(false); // <- stop spinner when data is fetched
      }).catch(() => setLoading(false)); // stop spinner on error too
    } else {
      setLoading(false); // no userId, stop loading
    }
  }, [dispatch]);

  const steps = [
    <Step1Applicability key={1} />,
    <Step2CompanyDetails key={2} />,
    <Step3BankRelationshipRequirement key={3} />,
    <Step4FinancialThresholds key={4} />,
    <Step5Regulatory key={5} />,
    <Step6RequiredDocumentChecklist key={6} />,
    <Step7DataProtection key={7} />,
    <Step8Agreement key={8} />,
  ];

  if (loading || isLoadingFromStore) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  // Check if special consideration is pending or rejected
  const specialConsideration = formData?.applicability?.specialConsideration;
  const isSpecialConsiderationPending = specialConsideration?.status === 1;
  const isSpecialConsiderationRejected = specialConsideration?.status === 3;
 
  if (isSpecialConsiderationPending || isSpecialConsiderationRejected) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="bg-white shadow-2xl rounded-3xl max-w-lg w-full sm:w-96 p-8 sm:p-10 text-center border-t-8 border-[#C6A95F] flex flex-col items-center">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-[#C6A95F]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-2xl font-bold mb-4 text-gray-800">
            Special Consideration {isSpecialConsiderationPending ? 'Pending' : 'Rejected'}
          </h1>

          {/* Description */}
          <p className="text-gray-600 text-sm sm:text-base mb-8 px-2 sm:px-0">
            {isSpecialConsiderationPending
              ? 'Your special consideration request is under review. You will be notified once a decision is made.'
              : 'Your special consideration request has been rejected. Please contact support for more information.'
            }
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 w-full px-4 sm:px-0">
            <button
              className="w-full cursor-pointer sm:w-auto bg-[#C6A95F] hover:bg-[#b8974f] text-white px-4 py-2 rounded"
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      <UploadStepper currentStep={currentStep} totalSteps={8} />
      <div className="mt-4">{steps[currentStep - 1]}</div>
    </div>
  );
}
