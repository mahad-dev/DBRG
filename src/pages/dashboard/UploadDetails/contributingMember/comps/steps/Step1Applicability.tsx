"use client";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import UploadBox from "@/components/custom/ui/UploadBox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useAuth } from '@/context/AuthContext';
import {
  MemberApplicationSection,
  MembershipType,
} from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Step1Applicability() {
  const { state, dispatch, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, getUploadDetails } = useUploadDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const formData = state.data;
  const isSaving = state.isSaving;
  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  const hasAnyNoAnswer = () => {
    return isUAEBasedEntity === false || hasUnresolvedAMLNotices === false  || (yearsOfOperation !== null && yearsOfOperation < 1) || servicesProvided.length === 0;
  };

  // Local states for contributing member
  const [isUAEBasedEntity, setIsUAEBasedEntity] = useState<boolean | null>(null);
  const [yearsOfOperation, setYearsOfOperation] = useState<number | null>(null);
  const [servicesProvided, setServicesProvided] = useState<number[]>([]);
  const [otherServiceDetail, setOtherServiceDetail] = useState<string>("");
  const [hasUnresolvedAMLNotices, setHasUnresolvedAMLNotices] = useState<boolean | null>(null);

  // Use the custom hook for file handling
  const {
    membership,
    setMembership,
    signedAMLFile,
    existingSignedAMLPath,
    signedRef,
    setSignedAMLFile,
    removeSignedAMLFile,
    handleSelectFile,
    handleDropFile,
  } = useStep1Applicability(formData.applicability, formData.application);

  // Redirect based on existing membershipType
  useEffect(() => {
    if (formData.application?.membershipType) {
      const membershipType = formData.application.membershipType;
      let redirectPath = "";

      switch (membershipType) {
        case MembershipType.PrincipalMember:
          redirectPath = "/dashboard/member-type/principal-member/upload-details";
          break;
        case MembershipType.MemberBank:
          redirectPath = "/dashboard/member-type/member-bank/upload-details";
          break;
        case MembershipType.ContributingMember:
          redirectPath = "/dashboard/member-type/contributing-member/upload-details";
          break;
        case MembershipType.AffiliateMember:
          redirectPath = "/dashboard/member-type/affiliate-member/upload-details";
          break;
      }

      if (redirectPath && window.location.pathname !== `/dashboard${redirectPath}`) {
        navigate(redirectPath);
      }
    }
  }, [formData.application?.membershipType, navigate]);

  // Prefill local states from formData
  useEffect(() => {
    if (formData.applicability) {
      setIsUAEBasedEntity(formData.applicability.isUAEBasedEntity ?? null);
      setYearsOfOperation(formData.applicability.yearsOfOperation ?? null);
      setServicesProvided(formData.applicability.servicesProvided ? formData.applicability.servicesProvided.split(',').map(Number) : []);
      setOtherServiceDetail(formData.applicability.otherServiceDetail ?? "");
      setHasUnresolvedAMLNotices(formData.applicability.hasUnresolvedAMLNotices ?? null);
    }
    if (formData.application) {
      if (formData.application.membershipType === MembershipType.ContributingMember) {
        setMembership("contributing");
      } else if (formData.application.membershipType === MembershipType.PrincipalMember) {
        setMembership("principal");
      } else if (formData.application.membershipType === MembershipType.MemberBank) {
        setMembership("member_bank");
      } else if (formData.application.membershipType === MembershipType.AffiliateMember) {
        setMembership("affiliate");
      }
    }
  }, [formData.applicability, formData.application, setMembership]);

  const serviceOptions = [
    { id: 1, label: "Customs clearance" },
    { id: 2, label: "Bullion-focused tech solutions provider (e.g., documentation, vaulting systems)" },
    { id: 3, label: "Legal Firm" },
    { id: 4, label: "Assay/testing services (Lab Providing Assaying services)" },
    { id: 5, label: "Consulting Firm/Compliance Firm" },
    { id: 6, label: "Insurance" },
    { id: 7, label: "Board-invited trade bodies." },
    { id: 8, label: "Other" },
  ] as const;

  const handleSave = async () => {
    // 🚫 Block if special consideration exists but not approved
    if (formData?.specialConsideration && formData.isSpecialConsiderationApproved !== true) {
      toast.info(
        "Your special consideration request is under review. You can continue once it is approved."
      );
      return;
    }

    // If ANY answer is NO and special consideration not approved → open modal, STOP save
    if (formData.isSpecialConsiderationApproved !== true && hasAnyNoAnswer()) {
      setSpecialConsiderationOpen(true);
      return;
    }

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Upload files if present, or use existing IDs from paths
      let signedAMLDocumentId: number | null = null;
      console.log(" signedAMLFile", signedAMLFile);

      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      if (signedAMLFile) {
        signedAMLDocumentId = await uploadDocument(signedAMLFile);
      } else if (existingSignedAMLPath) {
        signedAMLDocumentId = extractIdFromPath(existingSignedAMLPath);
      }

      // Prepare applicability data based on membership type
      let applicabilityData: any = {};

      applicabilityData.contributingMember = {
        isUAEBasedEntity: isUAEBasedEntity || false,
        yearsOfOperation: yearsOfOperation || 0,
        servicesProvided: servicesProvided.filter(id => id !== 8),
        otherServiceDetail: servicesProvided.includes(8) ? otherServiceDetail : "",
        hasUnresolvedAMLNotices: hasUnresolvedAMLNotices || false,
        signedAMLDeclaration: signedAMLDocumentId,
      };

      // Include special consideration if it exists
      if (formData.applicability?.specialConsideration) {
        applicabilityData.specialConsideration = formData.applicability.specialConsideration;
      }

      const payload = {
        membershipType: MembershipType.ContributingMember,
        applicability: applicabilityData,
      };
      console.log("first...", payload);
      console.log("seconfd...", MemberApplicationSection.Applicability);

      updateFormData(payload);
      await saveUploadDetails(payload, MemberApplicationSection.Applicability);

      // Fetch updated data to check special consideration status
      const updatedData = await getUploadDetails(user?.userId || '');

      // Check if special consideration is present
      if (updatedData.applicability?.specialConsideration) {
        if (updatedData.isSpecialConsiderationApproved) {
          toast.success("Applicability saved successfully!");
          // Move to next step after successful save
          setCurrentStep(2);
        } else {
          toast.success("Applicability saved successfully. You can continue after admin approval.");
        }
      } else {
        toast.success("Applicability saved successfully!");
        // Move to next step after successful save
        setCurrentStep(2);
      }

      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error("Failed to save applicability. Please try again.");
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

return (
  <div className="w-full min-h-screen bg-[#353535] rounded-xl p-6 md:p-10 shadow-lg">
    {/* Heading */}
    <h2 className="text-[28px] sm:text-[22px] font-gilroy font-bold text-[#C6A95F] leading-[100%]">
      Section 1 - Applicability
    </h2>

    {/* a) Membership */}
    <div className="mt-8">
      <Label className="block text-[22px] sm:text-[18px] font-gilroy text-white">
        a) Which DBRG Membership Category are you applying for?
      </Label>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { id: "principal", label: "Principal Member", path: "/dashboard/member-type/principal-member/upload-details" },
          { id: "member_bank", label: "Member Bank", path: "/dashboard/member-type/member-bank/upload-details" },
          { id: "contributing", label: "Contributing Member", path: "/dashboard/member-type/contributing-member/upload-details" },
          { id: "affiliate", label: "Affiliate Member", path: "/dashboard/member-type/affiliate-member/upload-details" },
        ].map((opt) => (
          <Button
            key={opt.id}
            disabled={!!formData.application?.membershipType && membership !== opt.id}
            onClick={() => {
              if (!formData.application?.membershipType) {
                setMembership(opt.id);
                navigate(opt.path);
              }
            }}
            className={`h-[48px] rounded-lg text-[18px] font-gilroySemiBold border transition
              ${
                membership === opt.id
                  ? "bg-[#C6A95F] text-black border-[#C6A95F]"
                  : "bg-transparent text-white border-white"
              } ${!!formData.application?.membershipType && membership !== opt.id ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>

    {/* b) UAE Based */}
    <div className="mt-8">
      <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
        b) Are you a UAE-based entity?
      </p>

      <div className="mt-3">
        <YesNoGroup
          value={isUAEBasedEntity}
          onChange={setIsUAEBasedEntity}
        />
      </div>
    </div>

    {/* Years of operation */}
    <div className="mt-8">
      <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
        If yes, Years of operation in the UAE
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        {[0, 1, 3, 5].map((val) => (
          <Button
            key={val}
            variant="outline"
            onClick={() => setYearsOfOperation(val)}
            className={`h-[40px] px-5 rounded-md
              ${
                yearsOfOperation === val
                  ? "bg-[#C6A95F] text-black border-[#C6A95F]"
                  : "text-white border-white"
              }`}
          >
            {val === 0 ? "<1" : val === 1 ? "1–3" : val === 3 ? "3–5" : "5+"}
          </Button>
        ))}
      </div>
    </div>

    {/* d) Services */}
    <div className="mt-10">
      <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
        d) Do you provide any of the services below, for the bullion and / or refinery industry?
      </p>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
        {serviceOptions.map((opt) => (
          <ServiceCheckbox
            key={opt.id}
            label={opt.label}
            checked={servicesProvided.includes(opt.id)}
            onChange={() =>
              setServicesProvided((prev) =>
                prev.includes(opt.id)
                  ? prev.filter((id) => id !== opt.id)
                  : [...prev, opt.id]
              )
            }
          />
        ))}
      </div>

      {servicesProvided.includes(8) && (
        <textarea
          value={otherServiceDetail}
          onChange={(e) => setOtherServiceDetail(e.target.value)}
          className="mt-4 w-full bg-[#2C2C2C] border border-white/30 rounded-md p-3 text-white"
          placeholder="Please specify other service"
        />
      )}
    </div>

    {/* e) AML */}
    <div className="mt-10">
      <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
        e) Any unresolved UAE AML notices?
      </p>

      <div className="mt-3">
        <YesNoGroup
          value={hasUnresolvedAMLNotices}
          onChange={setHasUnresolvedAMLNotices}
        />
      </div>

      <div className="mt-6 max-w-[420px]">
        <input
          ref={signedRef}
          type="file"
          hidden
          onChange={(e) => handleSelectFile(e, setSignedAMLFile)}
        />

        <UploadBox
          title="Signed AML Declaration"
          file={signedAMLFile}
          onClick={() => signedRef.current?.click()}
          onDrop={(e) => handleDropFile(e, setSignedAMLFile)}
          onRemove={removeSignedAMLFile}
        />

        {existingSignedAMLPath && !signedAMLFile && (
          <a
            href={existingSignedAMLPath}
            target="_blank"
            className="mt-2 inline-block text-[#C6A95F] underline"
          >
            View previously uploaded AML Declaration
          </a>
        )}
      </div>
    </div>

    {/* Save */}
      <div className="mt-6 flex justify-start">
        <Button
          onClick={handleSave}
          disabled={isSaving || (formData.applicability?.specialConsideration && formData.isSpecialConsiderationApproved === false)}
          variant="site_btn"
          className={` h-[42px] px-4 py-2 rounded-[10px] text-[18px] sm:text-[16px] font-gilroySemiBold font-normal leading-[100%] transition ${
            formData?.specialConsideration && formData.isSpecialConsiderationApproved === false
              ? "bg-gray-400 w-[192px] sm:w-full md:w-[192px] cursor-not-allowed text-black/60"
              : "text-white w-[132px] sm:w-full md:w-[132px]"
          }`}
        >
          {formData?.specialConsideration && formData.isSpecialConsiderationApproved === false
            ? "Waiting for Approval"
            : isSaving
            ? "Saving..."
            : "Save / Next"}
        </Button>
      </div>
        {formData.specialConsideration && formData.isSpecialConsiderationApproved === false && (
          <p className="mt-3 text-sm text-[#C6A95F]">
            Your special consideration request is under admin review.
            You will be able to continue once it is approved.
          </p>
        )}

    <SpecialConsiderationDialog
      open={specialConsiderationOpen}
      onOpenChange={setSpecialConsiderationOpen}
      onSubmit={async (message: string) => {
        try {
          // Extract ID from S3 path
          const extractIdFromPath = (path: string | null): number | null => {
            if (!path) return null;
            const match = path.match(/\/(\d+)_/);
            return match ? parseInt(match[1], 10) : null;
          };

          let signedAMLDocumentId = extractIdFromPath(existingSignedAMLPath);

          // Prepare applicability data based on membership type
          let applicabilityData: any = {};

          applicabilityData.contributingMember = {
            isUAEBasedEntity: isUAEBasedEntity || false,
            yearsOfOperation: yearsOfOperation || 0,
            servicesProvided: servicesProvided.filter(id => id !== 8),
            otherServiceDetail: servicesProvided.includes(8) ? otherServiceDetail : "",
            hasUnresolvedAMLNotices: hasUnresolvedAMLNotices || false,
            signedAMLDeclaration: signedAMLDocumentId,
          };

          // Add special consideration
          applicabilityData.specialConsideration = { message };

          const payload = {
            membershipType: MembershipType.ContributingMember,
            applicability: applicabilityData,
          };

          updateFormData(payload);
          await saveUploadDetails(payload, MemberApplicationSection.Applicability);

          // Fetch updated data to check special consideration status
          const updatedData = await getUploadDetails(user?.userId || '');

          // Update the form data with the fetched data to prefill fields
          updateFormData(updatedData);

          // Check if special consideration is present
          if (updatedData.applicability?.specialConsideration) {
            toast.success("Special consideration request submitted successfully. You can continue after admin approval.");
          }

          // No currentSetValue needed for contributing member
        } catch (error) {
          console.log("error", error);
          toast.error("Failed to submit special consideration request. Please try again.");
        }
      }}
      onCloseWithoutSubmit={() => setSpecialConsiderationOpen(false)}
    />
  </div>
);

}

