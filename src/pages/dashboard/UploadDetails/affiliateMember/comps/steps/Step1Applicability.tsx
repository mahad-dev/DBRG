"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import MultiUploadBox from "@/components/custom/ui/MultiUploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection, MembershipType } from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { parseApiError } from "@/utils/errorHandler";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';
import { useAuth } from '@/context/AuthContext';
import { useDocumentDownload } from '@/hooks/useDocumentDownload';

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

  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<number>(0);
  const { downloadDocument, downloadingId } = useDocumentDownload();

  // ─── Special Consideration ───────────────────────────────────────────────────
  const isSpecialConsiderationPresent = !!formData?.specialConsideration;
  const isSpecialConsiderationApproved = formData?.isSpecialConsiderationApproved === true;
  const specialConsiderationStatus = formData?.specialConsideration?.status;
  const isSpecialConsiderationRejected = specialConsiderationStatus === 3;
  const isSpecialConsiderationInProgress = specialConsiderationStatus === 1;
  const disableNextDueToSpecialConsideration = isSpecialConsiderationPresent && !isSpecialConsiderationApproved;

  const getSpecialConsiderationStatusMessage = () => {
    if (!formData?.specialConsideration) return "";
    if (isSpecialConsiderationApproved) return "";
    if (isSpecialConsiderationRejected) return "Your special consideration request was rejected.";
    if (isSpecialConsiderationInProgress) return "Your special consideration request is in progress.";
    return "Your special consideration request is under review.";
  };

  // ─── Local YES/NO States ──────────────────────────────────────────────────────
  const [membership, setMembership] = useState<string | null>("Affiliate Member");
  const [hasUAEOffice, setHasUAEOffice] = useState<boolean | null>(null);
  const [licensedBullion, setLicensedBullion] = useState<boolean | null>(null);
  const [internationalOrg, setInternationalOrg] = useState<boolean | null>(null);
  const [hasAMLNotices, setHasAMLNotices] = useState<boolean | null>(null);

  const hasAnyNoAnswer = () =>
    hasUAEOffice === false || hasAMLNotices === false || licensedBullion === false || internationalOrg === false;

  // ─── AML single-file via hook ─────────────────────────────────────────────────
  const { signedAMLFile, signedRef, setSignedAMLFile } =
    useStep1Applicability(formData.applicability, formData.application, "affiliate");

  // ─── Document ID + Path States ────────────────────────────────────────────────
  const [officeProofDocumentIds, setOfficeProofDocumentIds] = useState<number[]>([]);
  const [tradeLicenseDocumentIds, setTradeLicenseDocumentIds] = useState<number[]>([]);
  const [signedAMLDocumentId, setSignedAMLDocumentId] = useState<number | null>(null);

  const [existingOfficeProofPaths, setExistingOfficeProofPaths] = useState<string[]>([]);
  const [existingTradeLicensePaths, setExistingTradeLicensePaths] = useState<string[]>([]);
  const [existingSignedAMLPath, setExistingSignedAMLPath] = useState<string | null>(null);

  // ─── Validation Errors (manual — no Formik) ───────────────────────────────────
  // FIX: We drop Formik entirely for this form. The complexity of syncing Formik
  // fields with async uploads and component state was the root cause of Save/Next
  // not working. Manual validation is simpler and more reliable here.
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false); // show errors only after first submit

  // ─── Path Helper ─────────────────────────────────────────────────────────────
  const extractIdFromPathLocal = (path: string | null): number | null => {
    if (!path) return null;
    const match = path.match(/\/(\d+)_/);
    if (match) return parseInt(match[1], 10);
    const pathWithoutQuery = path.split('?')[0];
    const filename = pathWithoutQuery.split('/').pop();
    if (!filename) return null;
    const filenameMatch = filename.match(/^(\d+)_/);
    return filenameMatch ? parseInt(filenameMatch[1], 10) : null;
  };

  // ─── Extract IDs from API response ───────────────────────────────────────────
  const extractedDocumentIds = useMemo(() => {
    if (!formData.applicability) {
      return { officeProofIds: [], tradeLicenseIds: [], signedAML: null };
    }
    const d = (formData.applicability.affiliateMember || formData.applicability) as any;

    const parseIds = (arr: any, paths: string[]): number[] => {
      if (Array.isArray(arr)) {
        const ids = arr.map((item: any) =>
          typeof item === 'number' ? item : parseInt(String(item), 10)
        ).filter((id: number) => !isNaN(id));
        if (ids.length > 0) return ids;
      } else if (arr) {
        const str = String(arr);
        const ids = str.split(',').map((s: string) => parseInt(s.trim(), 10)).filter((id: number) => !isNaN(id));
        if (ids.length > 0) return ids;
      }
      // fallback: extract from paths
      return paths.map(extractIdFromPathLocal).filter((id): id is number => id !== null);
    };

    const officeProofPaths = Array.isArray(d.uaeOfficeProofDocumentPaths)
      ? d.uaeOfficeProofDocumentPaths
      : d.uaeOfficeProofDocumentPaths ? [d.uaeOfficeProofDocumentPaths] : [];

    const tradeLicensePaths = Array.isArray(d.eligibilitySupportingDocumentPath)
      ? d.eligibilitySupportingDocumentPath
      : d.eligibilitySupportingDocumentPath ? [d.eligibilitySupportingDocumentPath] : [];

    const officeProofIds = officeProofPaths.length > 0
      ? parseIds(d.uaeOfficeProofDocuments, officeProofPaths)
      : [];

    const tradeLicenseIds = tradeLicensePaths.length > 0
      ? parseIds(d.eligibilitySupportingDocuments, tradeLicensePaths)
      : [];

    let signedAML: number | null = null;
    if (d.signedAMLDeclarationPath) {
      if (typeof d.signedAMLDeclaration === 'number') signedAML = d.signedAMLDeclaration;
      else if (typeof d.signedAMLDeclaration === 'string') signedAML = parseInt(d.signedAMLDeclaration, 10);
      if (!signedAML || isNaN(signedAML)) signedAML = extractIdFromPathLocal(d.signedAMLDeclarationPath);
    }

    return {
      officeProofIds,
      tradeLicenseIds,
      signedAML: signedAML && !isNaN(signedAML) ? signedAML : null,
    };
  }, [formData.applicability]);

  // ─── Redirect ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (formData.application?.membershipType) {
      const map: Record<string, string> = {
        [MembershipType.PrincipalMember]: "/dashboard/member-type/principal-member/upload-details",
        [MembershipType.MemberBank]: "/dashboard/member-type/member-bank/upload-details",
        [MembershipType.ContributingMember]: "/dashboard/member-type/contributing-member/upload-details",
        [MembershipType.AffiliateMember]: "/dashboard/member-type/affiliate-member/upload-details",
      };
      const path = map[formData.application.membershipType];
      if (path && window.location.pathname !== `/dashboard${path}`) navigate(path);
    }
  }, [formData.application?.membershipType, navigate]);

  // ─── Sync extracted IDs → state ───────────────────────────────────────────────
  useEffect(() => {
    setOfficeProofDocumentIds(extractedDocumentIds.officeProofIds);
    setTradeLicenseDocumentIds(extractedDocumentIds.tradeLicenseIds);
    setSignedAMLDocumentId(extractedDocumentIds.signedAML);
  }, [extractedDocumentIds]);

  // ─── Prefill from formData ────────────────────────────────────────────────────
  useEffect(() => {
    if (formData.applicability) {
      const d = (formData.applicability.affiliateMember || formData.applicability) as any;
      setHasUAEOffice(d.hasUAEOffice ?? null);
      setLicensedBullion(d.operatesInBullionOrRefining3Years ?? null);
      setInternationalOrg(d.isInternationalOrgWithUAEBranch ?? null);
      setHasAMLNotices(d.hasUnresolvedAMLNotices ?? null);

      if (Array.isArray(d.uaeOfficeProofDocumentPaths)) setExistingOfficeProofPaths(d.uaeOfficeProofDocumentPaths);
      else if (d.uaeOfficeProofDocumentPaths) setExistingOfficeProofPaths([d.uaeOfficeProofDocumentPaths]);

      if (Array.isArray(d.eligibilitySupportingDocumentPath)) setExistingTradeLicensePaths(d.eligibilitySupportingDocumentPath);
      else if (d.eligibilitySupportingDocumentPath) setExistingTradeLicensePaths([d.eligibilitySupportingDocumentPath]);

      if (d.signedAMLDeclarationPath) setExistingSignedAMLPath(d.signedAMLDeclarationPath);
    }
    if (formData.application?.membershipType === MembershipType.AffiliateMember) {
      setMembership("Affiliate Member");
    }
  }, [formData.applicability, formData.application]);

  // ─── Validate (manual) ────────────────────────────────────────────────────────
  const validate = () => {
    const errs: Record<string, string> = {};

    if (hasUAEOffice === null) errs.hasUAEOffice = 'Please answer this question';
    if (licensedBullion === null) errs.operatesInBullionOrRefining3Years = 'Please answer this question';
    if (internationalOrg === null) errs.isInternationalOrgWithUAEBranch = 'Please answer this question';
    if (hasAMLNotices === null) errs.hasUnresolvedAMLNotices = 'Please answer this question';

    if (hasUAEOffice === true && officeProofDocumentIds.length === 0) {
      errs.uaeOfficeProofDocumentsIds = 'At least one office proof document is required';
    }

    if (tradeLicenseDocumentIds.length === 0) {
      errs.eligibilitySupportingDocumentsIds = 'At least one trade license / proof document is required';
    }

    if (!signedAMLDocumentId && !existingSignedAMLPath) {
      errs.signedAMLDeclarationId = 'Signed AML declaration is required';
    }

    return errs;
  };

  // Re-validate whenever relevant state changes (after first submit attempt)
  useEffect(() => {
    if (submitted) setErrors(validate());
  }, [
    submitted,
    hasUAEOffice,
    licensedBullion,
    internationalOrg,
    hasAMLNotices,
    officeProofDocumentIds,
    tradeLicenseDocumentIds,
    signedAMLDocumentId,
    existingSignedAMLPath,
  ]);

  // ─── AML single-file upload ───────────────────────────────────────────────────
  const handleAMLFileUpload = async (file: File | null) => {
    setSignedAMLFile(file);
    if (file) {
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setSignedAMLDocumentId(documentId);
        toast.success('File uploaded successfully!');
      } catch (error: any) {
        toast.error(parseApiError(error, 'File upload failed. Please try again.'));
        setSignedAMLFile(null);
        setSignedAMLDocumentId(null);
      } finally {
        setPendingUploads(prev => prev - 1);
      }
    } else {
      setSignedAMLDocumentId(null);
    }
  };

  // ─── Save / Next ──────────────────────────────────────────────────────────────
  const handleSaveNext = async () => {
    // Mark as submitted so errors show
    setSubmitted(true);

    if (disableNextDueToSpecialConsideration) {
      toast.info("Your special consideration request is under review. You can continue once it is approved.");
      return;
    }

    if (formData.isSpecialConsiderationApproved !== true && hasAnyNoAnswer()) {
      setSpecialConsiderationOpen(true);
      return;
    }

    // Run validation
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error('Please fill in all required fields and upload all required documents.');
      return;
    }

    if (pendingUploads > 0) {
      toast.info('Please wait for uploads to finish.');
      return;
    }

    // ─── CRITICAL FIX: Snapshot ALL IDs into local consts RIGHT NOW before any
    // async operation or state change can wipe them. These consts are captured in
    // this closure and cannot be affected by re-renders or context updates.
    const snapshotOfficeProofIds: number[] = officeProofDocumentIds.length > 0
      ? [...officeProofDocumentIds]
      : existingOfficeProofPaths.map(extractIdFromPathLocal).filter((id): id is number => id !== null);

    const snapshotTradeLicenseIds: number[] = tradeLicenseDocumentIds.length > 0
      ? [...tradeLicenseDocumentIds]
      : existingTradeLicensePaths.map(extractIdFromPathLocal).filter((id): id is number => id !== null);

    const snapshotSignedAMLId: number | null =
      signedAMLDocumentId ??
      (existingSignedAMLPath ? extractIdFromPathLocal(existingSignedAMLPath) : null);

    // Snapshot all scalar values too
    const snapshotHasUAEOffice = hasUAEOffice;
    const snapshotLicensedBullion = licensedBullion;
    const snapshotInternationalOrg = internationalOrg;
    const snapshotHasAMLNotices = hasAMLNotices;

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      const applicabilityData = {
        affiliateMember: {
          hasUAEOffice: snapshotHasUAEOffice || false,
          operatesInBullionOrRefining3Years: snapshotLicensedBullion || false,
          isInternationalOrgWithUAEBranch: snapshotInternationalOrg || false,
          hasUnresolvedAMLNotices: snapshotHasAMLNotices || false,
          uaeOfficeProofDocuments: snapshotOfficeProofIds.length > 0 ? snapshotOfficeProofIds : null,
          eligibilitySupportingDocuments: snapshotTradeLicenseIds.length > 0 ? snapshotTradeLicenseIds : null,
          signedAMLDeclaration: snapshotSignedAMLId,
        },
      };

      const payload = {
        membershipType: MembershipType.AffiliateMember,
        applicability: applicabilityData,
      };

      // ─── CRITICAL FIX: Do NOT call updateFormData(payload) before or during save.
      // updateFormData triggers a context state update → re-render → useMemo re-runs
      // → extractedDocumentIds recalculates → useEffect syncs empty arrays to
      // component state → docs appear to vanish for 1 second.
      // We only call updateFormData AFTER the API call succeeds, and immediately
      // navigate away so the flicker never shows.
      await saveUploadDetails(payload, MemberApplicationSection.Applicability);

      // Now safe to update context — we're navigating away immediately after
      updateFormData(payload);
      toast.success("Applicability saved successfully!");
      setCurrentStep(2);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error: any) {
      toast.error(parseApiError(error, "Failed to save applicability. Please try again."));
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────
  const isButtonDisabled =
    isSaving ||
    pendingUploads > 0 ||
    !!(formData.applicability?.specialConsideration && !isSpecialConsiderationApproved);

  return (
    <div className="w-full min-h-screen bg-[#353535] flex justify-center">
      <div className="w-full max-w-[1100px] p-8 rounded-xl">

        {/* Section Title */}
        <h2 className="text-[26px] font-gilroy font-bold text-[#C6A95F]">
          Section 1 - Applicability
        </h2>

        {/* Membership Type */}
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
                type="button"
                disabled={!!formData.application?.membershipType && membership !== item.id}
                onClick={() => {
                  if (!formData.application?.membershipType) {
                    setMembership(item.id);
                    navigate(item.path);
                  }
                }}
                className={`h-[48px] rounded-lg border text-[16px] transition
                  ${membership === item.id
                    ? "bg-[#C6A95F] text-black border-[#C6A95F]"
                    : "border-white/70 text-white"
                  }
                  ${!!formData.application?.membershipType && membership !== item.id
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                  }`}
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
            1) Does your company have a UAE office? <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={hasUAEOffice}
              onChange={(val) => {
                setHasUAEOffice(val);
                // If toggled to No, clear office proof so it doesn't block save
                if (!val) {
                  setOfficeProofDocumentIds([]);
                  setExistingOfficeProofPaths([]);
                }
              }}
            />
          </div>
          {submitted && errors.hasUAEOffice && (
            <p className="text-red-500 text-sm mt-1">{errors.hasUAEOffice}</p>
          )}

          {hasUAEOffice === true && (
            <div className="mt-6">
              <p className="text-[20px] text-white mb-3">
                Proof of office (lease agreement, utility bill, etc.) <span className="text-red-500">*</span>
              </p>
              <MultiUploadBox
                title=""
                documentIds={officeProofDocumentIds}
                prefilledPaths={existingOfficeProofPaths}
                onUploadComplete={(newIds, newPaths) => {
                  setOfficeProofDocumentIds(newIds);
                  setExistingOfficeProofPaths(newPaths || []);
                }}
                onRemove={(index) => {
                  setOfficeProofDocumentIds(prev => prev.filter((_, i) => i !== index));
                  setExistingOfficeProofPaths(prev => prev.filter((_, i) => i !== index));
                }}
                maxFiles={5}
                error={submitted && pendingUploads === 0 ? errors.uaeOfficeProofDocumentsIds : undefined}
              />
            </div>
          )}
        </div>

        {/* Licensed Bullion */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            a) Operates in licensed bullion trading or refining in UAE for at least 3 years OR 36 months{' '}
            <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={licensedBullion}
              onChange={(val) => setLicensedBullion(val)}
            />
          </div>
          {submitted && errors.operatesInBullionOrRefining3Years && (
            <p className="text-red-500 text-sm mt-1">{errors.operatesInBullionOrRefining3Years}</p>
          )}
        </div>

        {/* International Org */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            b) International organization with over 10 years of experience and have a UAE branch.{' '}
            <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={internationalOrg}
              onChange={(val) => setInternationalOrg(val)}
            />
          </div>
          {submitted && errors.isInternationalOrgWithUAEBranch && (
            <p className="text-red-500 text-sm mt-1">{errors.isInternationalOrgWithUAEBranch}</p>
          )}
        </div>

        {/* Trade License Upload */}
        <div className="mt-10">
          <p className="text-[20px] text-white w-full mb-3">
            Trade license, proof of years in operation, and/or global trade association membership certificate{' '}
            <span className="text-red-500">*</span>
          </p>
          <MultiUploadBox
            title=""
            documentIds={tradeLicenseDocumentIds}
            prefilledPaths={existingTradeLicensePaths}
            onUploadComplete={(newIds, newPaths) => {
              setTradeLicenseDocumentIds(newIds);
              setExistingTradeLicensePaths(newPaths || []);
            }}
            onRemove={(index) => {
              setTradeLicenseDocumentIds(prev => prev.filter((_, i) => i !== index));
              setExistingTradeLicensePaths(prev => prev.filter((_, i) => i !== index));
            }}
            maxFiles={5}
            error={submitted && pendingUploads === 0 ? errors.eligibilitySupportingDocumentsIds : undefined}
          />
        </div>

        {/* Signed AML */}
        <div className="mt-8 max-w-[420px]">
          <p className="text-[20px] text-white mb-3">
            Signed AML declaration <span className="text-red-500">*</span>
          </p>
          <input
            ref={signedRef}
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleAMLFileUpload(file);
            }}
          />
          <UploadBox
            title=""
            file={signedAMLFile}
            prefilledUrl={existingSignedAMLPath}
            onClick={() => signedRef.current?.click()}
            onDrop={(e) => {
              const file = e.dataTransfer?.files?.[0] || null;
              handleAMLFileUpload(file);
            }}
            onRemove={() => {
              setSignedAMLFile(null);
              setSignedAMLDocumentId(null);
              setExistingSignedAMLPath(null);
            }}
          />
          {submitted && errors.signedAMLDeclarationId && pendingUploads === 0 && (
            <p className="text-red-500 text-sm mt-1">{errors.signedAMLDeclarationId}</p>
          )}
          {existingSignedAMLPath && !signedAMLFile && (
            <button
              type="button"
              onClick={() =>
                downloadDocument(
                  extractIdFromPathLocal(existingSignedAMLPath),
                  "Signed AML Declaration"
                )
              }
              disabled={downloadingId === extractIdFromPathLocal(existingSignedAMLPath)}
              className="mt-2 inline-block text-[#C6A95F] underline cursor-pointer disabled:opacity-50"
            >
              {downloadingId === extractIdFromPathLocal(existingSignedAMLPath)
                ? 'Downloading...'
                : 'Download Previous Document'}
            </button>
          )}
        </div>

        {/* AML Notices */}
        <div className="mt-10">
          <p className="text-[18px] text-white">
            Any unresolved UAE AML notices? <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={hasAMLNotices}
              onChange={(val) => setHasAMLNotices(val)}
            />
          </div>
          {submitted && errors.hasUnresolvedAMLNotices && (
            <p className="text-red-500 text-sm mt-1">{errors.hasUnresolvedAMLNotices}</p>
          )}
        </div>

        {/* Save / Next Button */}
        <div className="mt-6 flex justify-start">
          <Button
            type="button"
            onClick={handleSaveNext}
            disabled={isButtonDisabled}
            variant="site_btn"
            className={`h-[42px] px-4 py-2 rounded-[10px] text-[18px] sm:text-[16px] font-gilroySemiBold font-normal leading-[100%] transition ${
              formData?.specialConsideration && !isSpecialConsiderationApproved
                ? "bg-gray-400 w-[192px] sm:w-full md:w-[192px] cursor-not-allowed text-black/60"
                : "text-white w-[132px] sm:w-full md:w-[132px]"
            }`}
          >
            {formData?.specialConsideration && !isSpecialConsiderationApproved
              ? isSpecialConsiderationRejected
                ? "Rejected"
                : "Waiting for Approval"
              : pendingUploads > 0
              ? "Uploading..."
              : isSaving
              ? "Saving..."
              : "Save / Next"}
          </Button>
        </div>

        {formData.specialConsideration && !isSpecialConsiderationApproved && (
          <p className={`mt-3 text-sm ${isSpecialConsiderationRejected ? 'text-red-400' : 'text-[#C6A95F]'}`}>
            {getSpecialConsiderationStatusMessage()}
          </p>
        )}

        {/* Special Consideration Dialog */}
        <SpecialConsiderationDialog
          open={specialConsiderationOpen}
          onOpenChange={setSpecialConsiderationOpen}
          onSubmit={async (message: string) => {
            try {
              const amlId = signedAMLDocumentId || extractIdFromPathLocal(existingSignedAMLPath);
              const applicabilityData = {
                affiliateMember: {
                  hasUAEOffice: hasUAEOffice || false,
                  operatesInBullionOrRefining3Years: licensedBullion || false,
                  isInternationalOrgWithUAEBranch: internationalOrg || false,
                  hasUnresolvedAMLNotices: hasAMLNotices || false,
                  uaeOfficeProofDocuments: [],
                  eligibilitySupportingDocuments: [],
                  signedAMLDeclaration: amlId,
                },
                specialConsideration: { message },
              };

              const payload = {
                membershipType: MembershipType.AffiliateMember,
                applicability: applicabilityData,
              };

              updateFormData(payload);
              await saveUploadDetails(payload, MemberApplicationSection.Applicability);

              const updatedData = await getUploadDetails(user?.userId || '');
              updateFormData(updatedData);

              if (updatedData.applicability?.specialConsideration) {
                toast.success("Special consideration submitted. You can continue after admin approval.");
              }

              setSpecialConsiderationOpen(false);
            } catch (error: any) {
              toast.error(parseApiError(error, "Failed to submit special consideration. Please try again."));
            }
          }}
          onCloseWithoutSubmit={() => setSpecialConsiderationOpen(false)}
        />

      </div>
    </div>
  );
}