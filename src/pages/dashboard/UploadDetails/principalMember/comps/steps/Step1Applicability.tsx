"use client";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import UploadBox from "@/components/custom/ui/UploadBox";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useAuth } from '@/context/AuthContext';
import {
  MemberApplicationSection,
  MembershipType,
  ServiceType,
  RefiningOrTradingType,
} from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Step1Applicability() {
  const { state, dispatch, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, getUploadDetails } = useUploadDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const formData = state.data;
  const isSaving = state.isSaving;
  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  const hasAnyNoAnswer = () => {
    const selectedCategoryAnswers = category.refiner ? refinerAnswers : category.trading ? tradingAnswers : {};
    return Object.values(selectedCategoryAnswers).some(v => v === false) || anyAMLNotices === false;
  };

  // Use the custom hook
  const {
    membership,
    services,
    category,
    refinerAnswers,
    tradingAnswers,
    anyAMLNotices,
    signedAMLFile,
    evidenceFile,
    existingSignedAMLPath,
    existingEvidencePath,
    signedRef,
    evidenceRef,
    setMembership,
    toggleService,
    toggleCategory,
    setRefinerAnswer,
    setTradingAnswer,
    setAnyAMLNotices,
    handleSelectFile,
    handleDropFile,
    setSignedAMLFile,
    setEvidenceFile,
    removeSignedAMLFile,
    removeEvidenceFile,
  } = useStep1Applicability(formData.applicability,formData.application);

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

  const serviceOptions = [
    { id: "trading", label: "Trading in precious metals products" },
    { id: "refining", label: "Gold refining" },
    { id: "logistics", label: "Logistics & vaulting services" },
    { id: "financial", label: "Financial services in the UAE" },
  ] as const;

  const handleSave = async () => {
    // 🚫 If special consideration exists & not approved → block
    if (
      formData.applicability?.specialConsideration &&
      formData.isSpecialConsiderationApproved === false
    ) {
      toast.info("Special consideration pending admin approval.");
      return;
    }

    // 🔴 If ANY answer is NO and special consideration not approved → open modal, STOP save
    if (formData.isSpecialConsiderationApproved !== true && (hasAnyNoAnswer() || anyAMLNotices === false)) {
      setSpecialConsiderationOpen(true);
      return;
    }

    // ✅ ALL YES → Normal Save
    dispatch({ type: "SET_SAVING", payload: true });

    try {
      // Upload files if present, or use existing IDs from paths
      let signedAMLDocumentId: number | null = null;
      let evidenceDocumentId: number | null = null;
      console.log(" signedAMLFile", signedAMLFile);
      console.log(" evidenceFile", evidenceFile);

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

      if (evidenceFile) {
        evidenceDocumentId = await uploadDocument(evidenceFile);
      } else if (existingEvidencePath) {
        evidenceDocumentId = extractIdFromPath(existingEvidencePath);
      }

      // Prepare applicability data based on membership type
      let applicabilityData: any = {};

      if (membership === "principal") {
        applicabilityData.principalMember = {
          hasOfficeInUAE: true, // Assuming based on context
          services: Object.keys(services)
            .filter((key) => services[key as keyof typeof services])
            .map((key) => {
              switch (key) {
                case "trading":
                  return ServiceType.TradingInPreciousMetals;
                case "refining":
                  return ServiceType.GoldRefining;
                case "logistics":
                  return ServiceType.LogisticsAndVaulting;
                case "financial":
                  return ServiceType.FinancialServicesInUAE;
                default:
                  return ServiceType.TradingInPreciousMetals;
              }
            }),
          ...(category.refiner && {
            refiningOrTradingCategory: RefiningOrTradingType.Refiner,
            isAccreditedRefinery: refinerAnswers.accredited || false,
            operatedUnderUAEML5Years: refinerAnswers.aml5yrs || false,
            refiningOutputOver10Tons: refinerAnswers.output10tons || false,
            ratedCompliantByMinistry: refinerAnswers.ratedCompliant || false,
          }),
          ...(category.trading && {
            refiningOrTradingCategory: RefiningOrTradingType.TradingCompany,
            involvedInWholesaleBullionTrading:
              tradingAnswers.wholesaleBullion || false,
            hasBankingRelationships3Years:
              tradingAnswers.bankRelationships || false,
            bankingRelationshipEvidence: evidenceDocumentId,
          }),
          hasUnresolvedAMLNotices: anyAMLNotices || false,
          signedAMLDeclaration: signedAMLDocumentId,
        };
      }

      const payload = {
        membershipType: MembershipType.PrincipalMember,
        applicability: applicabilityData,
      };
      console.log("first...", payload);
      console.log("seconfd...", MemberApplicationSection.Applicability);

      updateFormData(payload);
      await saveUploadDetails(payload, MemberApplicationSection.Applicability);

      toast.success("Applicability saved successfully!");
      setCurrentStep(2);
    } catch (e) {
      toast.error("Failed to save applicability");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
      {/* Heading */}
      <h2 className="text-[30px] sm:text-[22px] leading-[100%] font-bold text-[#C6A95F] font-gilroy">
        Section 1 - Applicability
      </h2>

      {/* Membership Category */}
      <div className="mt-6">
        <Label className="font-gilroy text-[22px] sm:text-[18px] leading-[100%] text-[#ffffff]">
          a) Which DBRG Membership Category are you applying for?
        </Label>
        <div className="mt-5 flex flex-wrap gap-3">
          {[
            { id: "principal", label: "Principal Member", path: "/dashboard/member-type/principal-member/upload-details" },
            { id: "member_bank", label: "Member Bank", path: "/dashboard/member-type/member-bank/upload-details" },
            { id: "contributing", label: "Contributing Member", path: "/dashboard/member-type/contributing-member/upload-details" },
            { id: "affiliate", label: "Affiliate Member", path: "/dashboard/member-type/affiliate-member/upload-details" },
          ].map((opt) => (
            <Button
              key={opt.id}
              variant="site_btn"
              disabled={!!formData?.application?.membershipType && membership !== opt.id}
              onClick={() => {
                if (!formData?.application?.membershipType) {
                  setMembership(opt.id);
                  navigate(opt.path);
                }
              }}
              className={`w-[241px] md:w-[241px] sm:w-full h-[47px] rounded-[10px] font-gilroySemiBold text-[22px] sm:text-[18px] leading-[100%] transition border
                ${
                  membership === opt.id
                    ? "text-white border-none"
                    : "bg-transparent text-white border border-white"
                } ${!!formData?.application?.membershipType && membership !== opt.id ? "opacity-50 cursor-not-allowed" : ""}`}
              aria-pressed={membership === opt.id}
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Services */}
      <div className="mt-6">
        <Label className="font-gilroy text-[22px] sm:text-[18px] leading-[1.2] text-[#ffffff]">
          b) Does your institution have an office in the UAE and has been
          engaged in at least one of the following services for more than five
          years, servicing both the domestic and international markets? Select
          all applicable services: [Multi-Select Checkboxes]
        </Label>
        <div className="mt-3 grid grid-cols-1 gap-3">
          {serviceOptions.map((opt) => (
            <ServiceCheckbox
              key={opt.id}
              id={opt.id}
              label={opt.label}
              checked={!!services[opt.id]}
              onChange={() => toggleService(opt.id as any)}
            />
          ))}
        </div>
      </div>

      {/* Refining or Trading Category */}
      <div className="mt-6">
        <Label className="font-gilroy text-[22px] sm:text-[18px] leading-[100%] text-[#ffffff]">
          c) Refining or Trading Category
        </Label>
        <div className="mt-3 flex gap-4 items-center flex-wrap">
          <ServiceCheckbox
            label="Refiner"
            checked={category.refiner}
            onChange={() => toggleCategory("refiner")}
          />
          <ServiceCheckbox
            label="Gold/Bullion Trading Company"
            checked={category.trading}
            onChange={() => toggleCategory("trading")}
          />
        </div>
      </div>

      {/* Refiners Section */}
      {category.refiner && (
        <div className="mt-6">
          <Label className="font-gilroy text-[22px] sm:text-[18px] leading-[100%] text-[#ffffff]">
            For Refiners:
          </Label>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {[
              {
                id: "accredited",
                label: "1. Accredited gold and/or silver refinery?",
              },
              {
                id: "aml5yrs",
                label: "2. Operated under UAE AML standards for 5+ years?",
              },
              {
                id: "output10tons",
                label: "3. Output over 10 tons/year (3 years)?",
              },
              {
                id: "ratedCompliant",
                label: "4. Rated compliant by UAE Ministry of Economy?",
              },
            ].map((item) => (
              <div key={item.id}>
                <div className="text-[22px] sm:text-[18px] font-gilroySemiBold text-white leading-[100%] mb-2">
                  {item.label}
                </div>
                <div className="flex gap-10 mt-4 sm:flex-col sm:gap-3">
                  <YesNoGroup
                    value={refinerAnswers[item.id]}
                    onChange={(v) => setRefinerAnswer(item.id, v)}
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trading Section */}
      {category.trading && (
        <div className="mt-6 pt-6">
          <Label className="font-gilroy text-[22px] sm:text-[18px] leading-[100%] text-[#ffffff]">
            For Trading Companies:
          </Label>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {[
              {
                id: "wholesaleBullion",
                label: "1. Involved in wholesale bullion trading?",
              },
              {
                id: "bankRelationships",
                label:
                  "2. Banking relationships with bullion banks for 3+ years?",
              },
            ].map((item) => (
              <div key={item.id}>
                <div className="text-[22px] sm:text-[18px] font-gilroySemiBold text-white leading-[100%] mb-2">
                  {item.label}
                </div>
                <div className="flex gap-10 sm:flex-col sm:gap-3">
                  <YesNoGroup
                    value={tradingAnswers[item.id]}
                    onChange={(v) => setTradingAnswer(item.id, v)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Evidence File */}
          <div className="mt-4">
            <input
              ref={evidenceRef}
              type="file"
              className="hidden"
              accept="application/pdf,image/*"
              onChange={(e) => handleSelectFile(e, setEvidenceFile)}
            />
            <UploadBox
              title="Evidence of banking relationships & trade contracts"
              file={evidenceFile}
              onClick={() => evidenceRef.current?.click()}
              onDrop={(e) => handleDropFile(e, setEvidenceFile)}
              id="evidence-upload"
              onRemove={removeEvidenceFile}
            />
            {existingEvidencePath && !evidenceFile && (
              <a
                href={existingEvidencePath}
                target="_blank"
                className="text-[#C6A95F] underline mt-2 block"
              >
                View previously uploaded evidence
              </a>
            )}
          </div>
        </div>
      )}

      {/* AML Notices */}
      <div className="mt-6 pt-6">
        <div className="text-[26px] sm:text-[20px] font-gilroyMedium font-normal leading-[100%] mb-2 text-white">
          Any unresolved UAE AML notices?
        </div>
        <div className="flex gap-10 sm:flex-col sm:gap-3">
          <YesNoGroup
            value={anyAMLNotices}
            onChange={(v) => setAnyAMLNotices(v)}
          />
        </div>

        {/* Signed AML Upload */}
        <div className="mt-5">
          <input
            ref={signedRef}
            type="file"
            className="hidden"
            accept="application/pdf,image/*"
            onChange={(e) => handleSelectFile(e, setSignedAMLFile)}
          />
          <UploadBox
            title="Signed AML Declaration"
            file={signedAMLFile}
            onClick={() => signedRef.current?.click()}
            onDrop={(e) => handleDropFile(e, setSignedAMLFile)}
            id="signed-aml-upload"
            onRemove={removeSignedAMLFile}
          />
          {existingSignedAMLPath && !signedAMLFile && (
            <a
              href={existingSignedAMLPath}
              target="_blank"
              className="text-[#C6A95F] underline mt-2 block"
            >
              View previously uploaded AML Declaration
            </a>
          )}
        </div>
      </div>

      {/* Save / Next Button */}
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
            let evidenceDocumentId = extractIdFromPath(existingEvidencePath);

            // Prepare applicability data based on membership type
            let applicabilityData: any = {};

            if (membership === "principal") {
              applicabilityData.principalMember = {
                hasOfficeInUAE: true, // Assuming based on context
                services: Object.keys(services)
                  .filter((key) => services[key as keyof typeof services])
                  .map((key) => {
                    switch (key) {
                      case "trading":
                        return ServiceType.TradingInPreciousMetals;
                      case "refining":
                        return ServiceType.GoldRefining;
                      case "logistics":
                        return ServiceType.LogisticsAndVaulting;
                      case "financial":
                        return ServiceType.FinancialServicesInUAE;
                      default:
                        return ServiceType.TradingInPreciousMetals;
                    }
                  }),
                refiningOrTradingCategory: category.refiner
                  ? RefiningOrTradingType.Refiner
                  : RefiningOrTradingType.TradingCompany,
                isAccreditedRefinery: refinerAnswers.accredited || false,
                operatedUnderUAEML5Years: refinerAnswers.aml5yrs || false,
                refiningOutputOver10Tons: refinerAnswers.output10tons || false,
                ratedCompliantByMinistry: refinerAnswers.ratedCompliant || false,
                involvedInWholesaleBullionTrading:
                  tradingAnswers.wholesaleBullion || false,
                hasBankingRelationships3Years:
                  tradingAnswers.bankRelationships || false,
                hasUnresolvedAMLNotices: anyAMLNotices || false,
                bankingRelationshipEvidence: evidenceDocumentId,
                signedAMLDeclaration: signedAMLDocumentId,
              };
            }

            // Add special consideration
            applicabilityData.specialConsideration = { message };

            const payload = {
              membershipType:
                membership === "principal"
                  ? MembershipType.PrincipalMember
                  : membership === "member_bank"
                  ? MembershipType.MemberBank
                  : membership === "contributing"
                  ? MembershipType.ContributingMember
                  : MembershipType.AffiliateMember,
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

            setSpecialConsiderationOpen(false);
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
