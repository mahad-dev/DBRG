"use client";

import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import UploadBox from "@/components/custom/ui/UploadBox";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";

import { useUploadDetails } from "@/context/UploadDetailsContext";
import { useAuth } from "@/context/AuthContext";
import { useStep1Applicability } from "@/hooks/useStep1Applicability";

import {
  MemberApplicationSection,
  MembershipType,
  ServiceType,
  RefiningOrTradingType,
} from "@/types/uploadDetails";

/* --------------------------------------------------------------------- */
/* Helpers                                                               */
/* --------------------------------------------------------------------- */

const serviceMap: Record<string, ServiceType> = {
  trading: ServiceType.TradingInPreciousMetals,
  refining: ServiceType.GoldRefining,
  logistics: ServiceType.LogisticsAndVaulting,
  financial: ServiceType.FinancialServicesInUAE,
};

const extractIdFromPath = (path: string | null): number | null => {
  if (!path) return null;
  const match = path.match(/\/(\d+)_/);
  return match ? Number(match[1]) : null;
};

/* --------------------------------------------------------------------- */

export default function Step1Applicability() {
  const {
    state,
    dispatch,
    uploadDocument,
    saveUploadDetails,
    updateFormData,
    setCurrentStep,
    getUploadDetails,
  } = useUploadDetails();

  const { user } = useAuth();
  const navigate = useNavigate();
  const formData = state.data;
  const isSaving = state.isSaving;

  const [specialConsiderationOpen, setSpecialConsiderationOpen] =
    useState(false);
  const [currentSetValue] =
    useState<((v: boolean) => void) | null>(null);

  const hasAnyNoAnswer = () => {
    return regulatedByCBA === false || anyAMLNotices === false || hasRelationshipWithUAEGoodDeliveryBrand === false;
  };

  const {
    membership,
    services,
    category,
    refinerAnswers,
    tradingAnswers,
    anyAMLNotices,
    regulatedByCBA,
    hasRelationshipWithUAEGoodDeliveryBrand,
    brandName,
    signedAMLFile,
    evidenceFile,
    existingSignedAMLPath,
    existingEvidencePath,
    signedRef,
    setMembership,
    setAnyAMLNotices,
    setRegulatedByCBA,
    setHasRelationshipWithUAEGoodDeliveryBrand,
    setBrandName,
    handleSelectFile,
    handleDropFile,
    setSignedAMLFile,
    removeSignedAMLFile,
  } = useStep1Applicability(
    formData.applicability,
    formData.application
  );

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

  /* ------------------------------------------------------------------- */
  /* Payload Builder – UI DRIVEN ONLY                                     */
  /* ------------------------------------------------------------------- */

  const buildApplicability = (
    signedId?: number | null,
    evidenceId?: number | null,
    specialMessage?: string
  ) => {
    if (membership === "principal") {
      const principalMember: any = {};

      /* Services */
      const selectedServices = Object.keys(services)
        .filter((k) => services[k as keyof typeof services])
        .map((k) => serviceMap[k]);

      if (selectedServices.length) {
        principalMember.services = selectedServices;
      }

      /* Category */
      if (category.refiner !== undefined) {
        principalMember.refiningOrTradingCategory = category.refiner
          ? RefiningOrTradingType.Refiner
          : RefiningOrTradingType.TradingCompany;
      }

      /* Refiner answers */
      if (refinerAnswers.accredited !== null)
        principalMember.isAccreditedRefinery = refinerAnswers.accredited;

      if (refinerAnswers.aml5yrs !== null)
        principalMember.operatedUnderUAEML5Years =
          refinerAnswers.aml5yrs;

      if (refinerAnswers.output10tons !== null)
        principalMember.refiningOutputOver10Tons =
          refinerAnswers.output10tons;

      if (refinerAnswers.ratedCompliant !== null)
        principalMember.ratedCompliantByMinistry =
          refinerAnswers.ratedCompliant;

      /* Trading answers */
      if (tradingAnswers.wholesaleBullion !== null)
        principalMember.involvedInWholesaleBullionTrading =
          tradingAnswers.wholesaleBullion;

      if (tradingAnswers.bankRelationships !== null)
        principalMember.hasBankingRelationships3Years =
          tradingAnswers.bankRelationships;

      /* AML */
      if (anyAMLNotices !== null)
        principalMember.hasUnresolvedAMLNotices =
          anyAMLNotices;

      /* Documents */
      if (signedId)
        principalMember.signedAMLDeclaration = signedId;

      if (evidenceId)
        principalMember.bankingRelationshipEvidence =
          evidenceId;

      const applicability: any = { principalMember };

      if (specialMessage) {
        applicability.specialConsideration = {
          message: specialMessage,
        };
      }

      return applicability;
    } else if (membership === "member_bank") {
      const memberBank: any = {};

      if (regulatedByCBA !== null)
        memberBank.isRegulatedByUAEAuthorities = regulatedByCBA;

      if (hasRelationshipWithUAEGoodDeliveryBrand !== null)
        memberBank.hasRelationshipWithUAEGoodDeliveryBrand = hasRelationshipWithUAEGoodDeliveryBrand;

      if (brandName)
        memberBank.brandName = brandName;

      if (anyAMLNotices !== null)
        memberBank.hasUnresolvedAMLNotices = anyAMLNotices;

      if (signedId)
        memberBank.signedAMLDeclaration = signedId;

      const applicability: any = { memberBank };

      if (specialMessage) {
        applicability.specialConsideration = {
          message: specialMessage,
        };
      }

      return applicability;
    }

    return {};
  };

  /* ------------------------------------------------------------------- */
  /* Save                                                               */
  /* ------------------------------------------------------------------- */

  const handleSave = async () => {
    // 🚫 Block if special consideration exists but not approved
    if (formData.applicability?.specialConsideration && formData.isSpecialConsiderationApproved !== true) {
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

    dispatch({ type: "SET_SAVING", payload: true });

    try {
      const signedId = signedAMLFile
        ? await uploadDocument(signedAMLFile)
        : extractIdFromPath(existingSignedAMLPath);

      const evidenceId = evidenceFile
        ? await uploadDocument(evidenceFile)
        : extractIdFromPath(existingEvidencePath);

      const membershipType = membership === "principal" ? MembershipType.PrincipalMember :
                           membership === "member_bank" ? MembershipType.MemberBank :
                           membership === "contributing" ? MembershipType.ContributingMember :
                           MembershipType.AffiliateMember;

      const payload = {
        membershipType,
        applicability: buildApplicability(
          signedId,
          evidenceId
        ),
      };

      updateFormData(payload);
      await saveUploadDetails(
        payload,
        MemberApplicationSection.Applicability
      );

      const updated = await getUploadDetails(
        user?.userId || ""
      );

      updateFormData(updated);

      if (!updated.applicability?.specialConsideration) {
        setCurrentStep(2);
        toast.success("Applicability saved!");
      } else {
        if (updated.isSpecialConsiderationApproved) {
          setCurrentStep(2);
          toast.success("Applicability saved!");
        } else {
          toast.success(
            "Saved. Awaiting admin approval."
          );
        }
      }
    } catch {
      toast.error("Failed to save applicability");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  /* ------------------------------------------------------------------- */
  /* UI                                                                 */
  /* ------------------------------------------------------------------- */

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6">
      <h2 className="text-[30px] font-bold text-[#C6A95F]">
        Section 1 – Applicability
      </h2>

      {/* Membership */}
      <div className="mt-6">
        <Label className="text-white text-[18px]">
          Membership Category
        </Label>

        <div className="mt-4 flex flex-wrap gap-3">
          {[
            { id: "principal", label: "Principal Member", path: "/dashboard/member-type/principal-member/upload-details" },
            { id: "member_bank", label: "Member Bank", path: "/dashboard/member-type/member-bank/upload-details" },
            { id: "contributing", label: "Contributing Member", path: "/dashboard/member-type/contributing-member/upload-details" },
            { id: "affiliate", label: "Affiliate Member", path: "/dashboard/member-type/affiliate-member/upload-details" },
          ].map((opt) => (
            <Button
              key={opt.id}
              variant="site_btn"
              disabled={formData.application?.membershipType !== null && membership !== opt.id}
              onClick={() => {
                if (formData.application?.membershipType === null) {
                  setMembership(opt.id);
                  navigate(opt.path);
                }
              }}
              className={`w-[240px] ${
                membership === opt.id
                  ? "text-white"
                  : "bg-transparent border border-white"
              } ${formData.application?.membershipType !== null && membership !== opt.id ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Member Bank Questions */}
      {membership === "member_bank" && (
        <>
          <div className="mt-8">
            <div className="text-white text-[20px] mb-2">
              Is your bank regulated by CB UAE/DFSA/ADGM and active in specific services like bullion or trade financing?
            </div>
            <YesNoGroup
              value={regulatedByCBA}
              onChange={setRegulatedByCBA}
            />
          </div>

          <div className="mt-8">
            <div className="text-white text-[20px] mb-2">
              Do you have a relationship with UAE Good Delivery Brand?
            </div>
            <YesNoGroup
              value={hasRelationshipWithUAEGoodDeliveryBrand}
              onChange={setHasRelationshipWithUAEGoodDeliveryBrand}
            />
          </div>

          <div className="mt-8">
            <div className="text-white text-[20px] mb-2">
              Please provide the name of the brand.
            </div>
            <Input
              type="text"
              placeholder="Enter brand name"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="mt-2"
            />
          </div>
        </>
      )}

      {/* AML */}
      <div className="mt-8">
        <div className="text-white text-[20px] mb-2">
          Any unresolved UAE AML notices?
        </div>

        <YesNoGroup
          value={anyAMLNotices}
          onChange={setAnyAMLNotices}
        />

        <div className="mt-5">
          <input
            ref={signedRef}
            type="file"
            hidden
            accept="application/pdf,image/*"
            onChange={(e) =>
              handleSelectFile(e, setSignedAMLFile)
            }
          />

          <UploadBox
            title="Signed AML Declaration"
            file={signedAMLFile}
            onClick={() => signedRef.current?.click()}
            onDrop={(e) =>
              handleDropFile(e, setSignedAMLFile)
            }
            onRemove={removeSignedAMLFile}
          />

          {existingSignedAMLPath && !signedAMLFile && (
            <a
              href={existingSignedAMLPath}
              target="_blank"
              className="text-[#C6A95F] underline block mt-2"
            >
              View uploaded document
            </a>
          )}
        </div>
      </div>

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
        onSubmit={async (message) => {
          try {
            const payload = {
              membershipType: MembershipType.PrincipalMember,
              applicability: buildApplicability(
                null,
                null,
                message
              ),
            };

            updateFormData(payload);
            await saveUploadDetails(
              payload,
              MemberApplicationSection.Applicability
            );

            toast.success(
              "Special consideration submitted"
            );

            currentSetValue?.(false);
          } catch {
            toast.error("Submission failed");
          }
        }}
        onCloseWithoutSubmit={() =>
          currentSetValue?.(true)
        }
      />
    </div>
  );
}
