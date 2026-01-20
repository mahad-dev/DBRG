"use client";

import { useEffect, useState } from "react";
import UploadStepper from "./comps/UploadStepper";
import Step1Applicability from "./comps/steps/Step1Applicability";
import Step2CompanyDetails from "./comps/steps/Step2CompanyDetails";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useAuth } from '@/context/AuthContext';
import Step3DataProtection from "./comps/steps/Step3DataProtection";
import Step4Agreement from "./comps/steps/Step4Agreement";
import SubmitMoreDetailsModal from "../comps/SubmitMoreDetailsModal";

export default function UploadDetailsMemberBank() {
  const { state, getUploadDetails, updateFormData } = useUploadDetails();
  const { user, application } = useAuth();
  const currentStep = state.currentStep;
  const [showMoreDetailsModal, setShowMoreDetailsModal] = useState(false);
  const [showSpecialConsiderationModal, setShowSpecialConsiderationModal] = useState(false);

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

  // Check if there's an askMoreDetailsRequest from admin in application (general)
  useEffect(() => {
    if (application?.askMoreDetailsRequest && !application?.askMoreDetailsResponse) {
      setShowMoreDetailsModal(true);
    }
  }, [application]);

  // Check if there's an askMoreDetailsRequest from admin in special consideration
  useEffect(() => {
    const specialConsideration = state.data.specialConsideration;
    if (specialConsideration?.askMoreDetailsRequest && !specialConsideration?.askMoreDetailsResponse) {
      setShowSpecialConsiderationModal(true);
    }
  }, [state.data.specialConsideration]);

  const steps = [
    <Step1Applicability key={1} />,
    <Step2CompanyDetails key={2} />,
    <Step3DataProtection key={3} />,
    <Step4Agreement key={4} />,
  ];

  const handleMoreDetailsSuccess = async () => {
    // Modal already updated the application in AuthContext
    setShowMoreDetailsModal(false);
  };

  const handleSpecialConsiderationSuccess = () => {
    if (user?.userId) {
      getUploadDetails(user.userId).then((data) => {
        if (data) {
          updateFormData(data);
        }
      });
    }
    setShowSpecialConsiderationModal(false);
  };

  const handleCancel = () => {
    setShowMoreDetailsModal(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <UploadStepper currentStep={currentStep} totalSteps={4} />
        <div className="mt-4">{steps[currentStep - 1]}</div>
      </div>

      {/* General Application More Details Modal */}
      {application?.askMoreDetailsRequest && (
        <SubmitMoreDetailsModal
          open={showMoreDetailsModal}
          onOpenChange={setShowMoreDetailsModal}
          askMoreDetailsRequest={application.askMoreDetailsRequest}
          onSuccess={handleMoreDetailsSuccess}
          onCancel={handleCancel}
          allowCancel={true}
        />
      )}

      {/* Special Consideration More Details Modal */}
      {state.data.specialConsideration?.askMoreDetailsRequest && (
        <SubmitMoreDetailsModal
          open={showSpecialConsiderationModal}
          onOpenChange={setShowSpecialConsiderationModal}
          askMoreDetailsRequest={state.data.specialConsideration.askMoreDetailsRequest}
          onSuccess={handleSpecialConsiderationSuccess}
          allowCancel={false}
        />
      )}
    </>
  );
}
