"use client";

import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  getUploadDetails,
  selectCurrentStep,
  selectIsLoading,
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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function UploadDetails() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentStep = useAppSelector(selectCurrentStep);
  const isLoadingFromStore = useAppSelector(selectIsLoading);

  const [isCompleted, setIsCompleted] = useState(false);
  const [submittedDate, setSubmittedDate] = useState<string>("");
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      dispatch(getUploadDetails(userId)).then((res: any) => {
        const data = res.payload?.data;

        if (data?.isCompleted) {
          setIsCompleted(true);
          setSubmittedDate(data.completedAt ?? new Date().toISOString());
        } else {
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
