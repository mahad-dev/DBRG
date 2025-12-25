"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { useAuth } from '@/context/AuthContext';
import {
  MemberApplicationSection,
  MembershipType,
} from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';

export default function Step1Applicability() {
  const { state, dispatch, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, getUploadDetails } = useUploadDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const formData = state.data;
  const isSaving = state.isSaving;

  // Local states for affiliate member
  const [membership, setMembership] = useState<string | null>("affiliate");
  const [hasUAEOffice, setHasUAEOffice] = useState<boolean | null>(null);
  const [licensedBullion, setLicensedBullion] = useState<boolean | null>(null);
  const [internationalOrg, setInternationalOrg] = useState<boolean | null>(null);
  const [hasAMLNotices, setHasAMLNotices] = useState<boolean | null>(null);

  // Use the custom hook for file handling
  const {
    signedAMLFile,
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

  // Additional refs and states for other files
  const [officeProofFile, setOfficeProofFile] = useState<File | null>(null);
  const [existingOfficeProofPath, setExistingOfficeProofPath] = useState<string | null>(null);
  const [tradeLicenseFile, setTradeLicenseFile] = useState<File | null>(null);
  const [existingTradeLicensePath, setExistingTradeLicensePath] = useState<string | null>(null);
  const [existingSignedAMLPath, setExistingSignedAMLPath] = useState<string | null>(null);
  const officeProofRef = useRef<HTMLInputElement>(null);
  const tradeLicenseRef = useRef<HTMLInputElement>(null);

  // Prefill local states from formData
  useEffect(() => {
    if (formData.applicability) {
      const affiliateData = (formData.applicability.affiliateMember || formData.applicability) as any;
      setHasUAEOffice(affiliateData.hasUAEOffice ?? null);
      setLicensedBullion(affiliateData.operatesInBullionOrRefining3Years ?? null);
      setInternationalOrg(affiliateData.isInternationalOrgWithUAEBranch ?? null);
      setHasAMLNotices(affiliateData.hasUnresolvedAMLNotices ?? null);

      // Set existing paths for files
      if (affiliateData.uaeOfficeProofDocumentPaths && affiliateData.uaeOfficeProofDocumentPaths.length > 0) {
        setExistingOfficeProofPath(affiliateData.uaeOfficeProofDocumentPaths[0]);
      }
      if (affiliateData.eligibilitySupportingDocumentPath && affiliateData.eligibilitySupportingDocumentPath.length > 0) {
        setExistingTradeLicensePath(affiliateData.eligibilitySupportingDocumentPath[0]);
      }
      if (affiliateData.signedAMLDeclarationPath) {
        setExistingSignedAMLPath(affiliateData.signedAMLDeclarationPath);
      }
    }
    if (formData.application) {
      if (formData.application.membershipType === MembershipType.AffiliateMember) {
        setMembership("Affiliate Member");
      }
    }
  }, [formData.applicability, formData.application]);

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Upload files if present, or use existing IDs from paths
      let officeProofDocumentId: number | null = null;
      let tradeLicenseDocumentId: number | null = null;
      let signedAMLDocumentId: number | null = null;

      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      if (officeProofFile) {
        officeProofDocumentId = await uploadDocument(officeProofFile);
      } else if (existingOfficeProofPath) {
        officeProofDocumentId = extractIdFromPath(existingOfficeProofPath);
      }

      if (tradeLicenseFile) {
        tradeLicenseDocumentId = await uploadDocument(tradeLicenseFile);
      } else if (existingTradeLicensePath) {
        tradeLicenseDocumentId = extractIdFromPath(existingTradeLicensePath);
      }

      if (signedAMLFile) {
        signedAMLDocumentId = await uploadDocument(signedAMLFile);
      } else if (existingSignedAMLPath) {
        signedAMLDocumentId = extractIdFromPath(existingSignedAMLPath);
      }

      // Prepare applicability data based on membership type
      let applicabilityData: any = {};

      applicabilityData.affiliateMember = {
        hasUAEOffice: hasUAEOffice || false,
        operatesInBullionOrRefining3Years: licensedBullion || false,
        isInternationalOrgWithUAEBranch: internationalOrg || false,
        hasUnresolvedAMLNotices: hasAMLNotices || false,
        uaeOfficeProofDocuments: officeProofDocumentId ? [officeProofDocumentId] : [],
        eligibilitySupportingDocuments: tradeLicenseDocumentId ? [tradeLicenseDocumentId] : [],
        signedAMLDeclaration: signedAMLDocumentId,
      };

      const payload = {
        membershipType: MembershipType.AffiliateMember,
        applicability: applicabilityData,
      };

      updateFormData(payload);
      await saveUploadDetails(payload, MemberApplicationSection.Applicability);

      toast.success("Applicability saved successfully!");
      // Move to next step after successful save
      setCurrentStep(2);

      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error) {
      toast.error("Failed to save applicability. Please try again.");
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#353535] flex justify-center">
      <div className="w-full max-w-[1100px] p-8 rounded-xl">

        {/* Section Title */}
        <h2 className="text-[26px] font-gilroy font-bold text-[#C6A95F]">
          Section 1 - Applicability
        </h2>

        {/* Membership */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            a) Which DBRG Membership Category are you Applying for?
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: "Principal Member", path: "/dashboard/member-type/principal-member/upload-details" },
              { id: "Member Bank", path: "/dashboard/member-type/member-bank/upload-details" },
              { id: "Contributing Member", path: "/dashboard/member-type/contributing-member/upload-details" },
              { id: "Affiliate Member", path: "/dashboard/member-type/affiliate-member/upload-details" },
            ].map((item) => (
              <button
                key={item.id}
                disabled={formData.application?.membershipType !== null && membership !== item.id}
                onClick={() => {
                  if (formData.application?.membershipType === null) {
                    setMembership(item.id);
                    navigate(item.path);
                  }
                }}
                className={`h-[48px] rounded-lg border text-[16px] transition
                  ${
                    membership === item.id
                      ? "bg-[#C6A95F] text-black border-[#C6A95F]"
                      : "border-white/70 text-white"
                  } ${formData.application?.membershipType !== null && membership !== item.id ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {item.id}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1A */}
        <h3 className="mt-12 text-[22px] font-gilroy font-semibold text-[#C6A95F]">
          Section 1A Eligibility Confirmation (must meet all conditions to apply)
        </h3>

        {/* UAE Office */}
        <div className="mt-8">
          <p className="text-[20px] text-white">
           1) Does your company have a UAE office?
          </p>
          <div className="mt-3">
            <YesNoGroup value={hasUAEOffice} onChange={setHasUAEOffice} />
          </div>
          {hasUAEOffice === true && (
            <div className="mt-6 ">
              <p className="text-[20px] text-white mb-3">
                Proof of office (lease agreement, utility bill, etc.)
              </p>
              <input
                ref={officeProofRef}
                type="file"
                hidden
                onChange={(e) => handleSelectFile(e, setOfficeProofFile)}
              />
              <UploadBox
                title=""
                file={officeProofFile}
                onClick={() => officeProofRef.current?.click()}
                onDrop={(e) => handleDropFile(e, setOfficeProofFile)}
                onRemove={() => setOfficeProofFile(null)}
              />
              {existingOfficeProofPath && !officeProofFile && (
                <a
                  href={existingOfficeProofPath}
                  target="_blank"
                  className="mt-2 inline-block text-[#C6A95F] underline"
                >
                  View previously uploaded document
                </a>
              )}
            </div>
          )}
        </div>

        {/* Operates licensed bullion */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            a) Operates in licensed bullion trading or refining in UAE for at least 3 years OR 36 months
          </p>
          <div className="mt-3">
            <YesNoGroup value={licensedBullion} onChange={setLicensedBullion} />
          </div>
        </div>

        {/* International org */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            b) International organization with over 10 years of experience and have a UAE branch.
          </p>
          <div className="mt-3">
            <YesNoGroup value={internationalOrg} onChange={setInternationalOrg} />
          </div>
        </div>

        {/* Upload: Trade license */}
        <div className="mt-10 ">
          <p className="text-[20px] text-white w-full mb-3">
            Trade license, proof of years in operation, and/or global trade association membership certificate
          </p>
          <input
            ref={tradeLicenseRef}
            type="file"
            hidden
            onChange={(e) => handleSelectFile(e, setTradeLicenseFile)}
          />
          <UploadBox
            title=""
            file={tradeLicenseFile}
            onClick={() => tradeLicenseRef.current?.click()}
            onDrop={(e) => handleDropFile(e, setTradeLicenseFile)}
            onRemove={() => setTradeLicenseFile(null)}
          />
          {existingTradeLicensePath && !tradeLicenseFile && (
            <a
              href={existingTradeLicensePath}
              target="_blank"
              className="mt-2 inline-block text-[#C6A95F] underline"
            >
              View previously uploaded document
            </a>
          )}
        </div>

        {/* Upload: AML */}
        <div className="mt-8 max-w-[420px]">
          <p className="text-[20px] text-white mb-3">
            Signed AML declaration
          </p>
          <input
            ref={signedRef}
            type="file"
            hidden
            onChange={(e) => handleSelectFile(e, setSignedAMLFile)}
          />
          <UploadBox
            title=""
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

        {/* AML Notices */}
        <div className="mt-10">
          <p className="text-[18px] text-white">
            Any unresolved UAE AML notices?
          </p>
          <div className="mt-3">
            <YesNoGroup value={hasAMLNotices} onChange={setHasAMLNotices} />
          </div>
        </div>

        {/* Save */}
        <div className="mt-12">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="h-[42px] w-[150px] bg-[#C6A95F] text-black rounded-md"
          >
            {isSaving ? "Saving..." : "Save / Next"}
          </Button>
        </div>

      </div>
    </div>
  );
}
