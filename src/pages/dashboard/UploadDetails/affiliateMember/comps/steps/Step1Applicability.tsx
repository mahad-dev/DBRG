"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import SpecialConsiderationDialog from "../SpecialConsiderationDialog";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import {
  MemberApplicationSection,
  MembershipType,
} from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';
import { useAuth } from '@/context/AuthContext';
import { Formik, Form } from 'formik';
import { affiliateMemberStep1Schema } from '@/validation';

export default function Step1Applicability() {
  const { state, dispatch, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, getUploadDetails } = useUploadDetails();
  const { user } = useAuth();
  const navigate = useNavigate();
  const formData = state.data;
  const isSaving = state.isSaving;
  const [specialConsiderationOpen, setSpecialConsiderationOpen] = useState(false);

  // Track pending file uploads
  const [pendingUploads, setPendingUploads] = useState<number>(0);

  // ---- Special Consideration rules from GET ----
  const isSpecialConsiderationPresent =
    !!formData?.specialConsideration;

  const isSpecialConsiderationApproved =
    formData?.isSpecialConsiderationApproved === true;

  // Disable Next when special consideration exists BUT not approved
  const disableNextDueToSpecialConsideration =
    isSpecialConsiderationPresent && !isSpecialConsiderationApproved;

  const hasAnyNoAnswer = () => {
    return hasUAEOffice === false || hasAMLNotices === false || licensedBullion === false || internationalOrg === false;
  };

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
  } = useStep1Applicability(formData.applicability, formData.application);

  // Document ID states for immediate uploads
  const [officeProofDocumentId, setOfficeProofDocumentId] = useState<number | null>(null);
  const [tradeLicenseDocumentId, setTradeLicenseDocumentId] = useState<number | null>(null);
  const [signedAMLDocumentId, setSignedAMLDocumentId] = useState<number | null>(null);

  // Helper to extract document ID from S3 path
  const extractIdFromPath = (path: string | null): number | null => {
    if (!path) return null;
    // Try to match pattern: /12345_filename or 12345_filename
    const match = path.match(/\/(\d+)_/);
    if (match) return parseInt(match[1], 10);

    // Fallback: try to match at start of filename
    const pathWithoutQuery = path.split('?')[0];
    const filename = pathWithoutQuery.split('/').pop();
    if (!filename) return null;
    const filenameMatch = filename.match(/^(\d+)_/);
    return filenameMatch ? parseInt(filenameMatch[1], 10) : null;
  };

  // CRITICAL FIX: Extract document IDs synchronously using useMemo BEFORE Formik initializes
  const extractedDocumentIds = useMemo(() => {
    if (!formData.applicability) {
      return { officeProof: null, tradeLicense: null, signedAML: null };
    }

    const affiliateData = (formData.applicability.affiliateMember || formData.applicability) as any;
    console.log('🔍 useMemo: Extracting document IDs from formData.applicability:', affiliateData);

    // Extract Office Proof Document ID
    let officeProofId: number | null = null;
    if (affiliateData.uaeOfficeProofDocumentPaths && affiliateData.uaeOfficeProofDocumentPaths.length > 0) {
      const path = affiliateData.uaeOfficeProofDocumentPaths[0];

      // Backend sends string (e.g., "1041"), handle all cases
      let backendId = null;
      if (typeof affiliateData.uaeOfficeProofDocuments === 'string') {
        backendId = parseInt(affiliateData.uaeOfficeProofDocuments, 10);
      } else if (typeof affiliateData.uaeOfficeProofDocuments === 'number') {
        backendId = affiliateData.uaeOfficeProofDocuments;
      } else if (Array.isArray(affiliateData.uaeOfficeProofDocuments) && affiliateData.uaeOfficeProofDocuments.length > 0) {
        const firstItem = affiliateData.uaeOfficeProofDocuments[0];
        backendId = typeof firstItem === 'number' ? firstItem : parseInt(firstItem, 10);
      }

      // Try backend ID first, fallback to path extraction
      officeProofId = backendId ?? extractIdFromPath(path);
      console.log('✅ useMemo: Office proof - Path:', path, 'Backend ID:', backendId, 'Extracted ID:', officeProofId);
    }

    // Extract Trade License Document ID
    let tradeLicenseId: number | null = null;
    if (affiliateData.eligibilitySupportingDocumentPath && affiliateData.eligibilitySupportingDocumentPath.length > 0) {
      const path = affiliateData.eligibilitySupportingDocumentPath[0];

      // Backend sends string (e.g., "1042"), handle all cases
      let backendId = null;
      if (typeof affiliateData.eligibilitySupportingDocuments === 'string') {
        backendId = parseInt(affiliateData.eligibilitySupportingDocuments, 10);
      } else if (typeof affiliateData.eligibilitySupportingDocuments === 'number') {
        backendId = affiliateData.eligibilitySupportingDocuments;
      } else if (Array.isArray(affiliateData.eligibilitySupportingDocuments) && affiliateData.eligibilitySupportingDocuments.length > 0) {
        const firstItem = affiliateData.eligibilitySupportingDocuments[0];
        backendId = typeof firstItem === 'number' ? firstItem : parseInt(firstItem, 10);
      }

      // Try backend ID first, fallback to path extraction
      tradeLicenseId = backendId ?? extractIdFromPath(path);
      console.log('✅ useMemo: Trade license - Path:', path, 'Backend ID:', backendId, 'Extracted ID:', tradeLicenseId);
    }

    // Extract Signed AML Document ID
    let signedAMLId: number | null = null;
    if (affiliateData.signedAMLDeclarationPath) {
      // Backend sends number (e.g., 1043)
      let backendId = null;
      if (typeof affiliateData.signedAMLDeclaration === 'number') {
        backendId = affiliateData.signedAMLDeclaration;
      } else if (typeof affiliateData.signedAMLDeclaration === 'string') {
        backendId = parseInt(affiliateData.signedAMLDeclaration, 10);
      }

      signedAMLId = backendId ?? extractIdFromPath(affiliateData.signedAMLDeclarationPath);
      console.log('✅ useMemo: Signed AML - Path:', affiliateData.signedAMLDeclarationPath, 'Backend ID:', backendId, 'Extracted ID:', signedAMLId);
    }

    return {
      officeProof: officeProofId && !isNaN(officeProofId) ? officeProofId : null,
      tradeLicense: tradeLicenseId && !isNaN(tradeLicenseId) ? tradeLicenseId : null,
      signedAML: signedAMLId && !isNaN(signedAMLId) ? signedAMLId : null,
    };
  }, [formData.applicability]);

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

  // Sync extracted document IDs from useMemo to component state
  useEffect(() => {
    console.log('🔄 Syncing extracted IDs to component state:', extractedDocumentIds);
    setOfficeProofDocumentId(extractedDocumentIds.officeProof);
    setTradeLicenseDocumentId(extractedDocumentIds.tradeLicense);
    setSignedAMLDocumentId(extractedDocumentIds.signedAML);
  }, [extractedDocumentIds]);

  // Prefill local states from formData
  useEffect(() => {
    if (formData.applicability) {
      const affiliateData = (formData.applicability.affiliateMember || formData.applicability) as any;

      console.log('🔍 Prefilling from formData.applicability:', affiliateData);

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

  // Upload file immediately when selected - with immediate UI update
  const handleFileUpload = async (
    file: File | null,
    setFile: (f: File | null) => void,
    setDocumentId: (id: number | null) => void,
    setFieldValue: any,
    setFieldTouched: any,
    fieldName: string
  ) => {
    // Immediately update UI with the file (don't wait for API)
    setFile(file);
    setFieldValue(fieldName, file);

    if (file) {
      // Background upload - UI already shows the file
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setDocumentId(documentId);
        setFieldValue(`${fieldName}Id`, documentId);
        setFieldTouched(fieldName, true); // Only touch after successful upload
        toast.success('File uploaded successfully!');
      } catch (error: any) {
        toast.error(error?.message || 'File upload failed. Please try again.');
        // Remove file from UI on error
        setFile(null);
        setFieldValue(fieldName, null);
        setFieldValue(`${fieldName}Id`, null);
        setFieldTouched(fieldName, true); // Touch on error too
      } finally {
        setPendingUploads(prev => prev - 1);
      }
    } else {
      // File removed
      setFieldValue(`${fieldName}Id`, null);
      setFieldTouched(fieldName, true);
    }
  };

  const handleSave = async (formikValues?: any) => {
    // 🚫 Block if special consideration exists but not approved
    if (disableNextDueToSpecialConsideration) {
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
      // CRITICAL: Use IDs from Formik state first (these are validated), fallback to component state
      const formikOfficeProofId = formikValues?.uaeOfficeProofDocumentsId;
      const formikTradeLicenseId = formikValues?.eligibilitySupportingDocumentsId;
      const formikSignedAMLId = formikValues?.signedAMLDeclarationId;

      console.log('🎯 Formik Document IDs:', {
        officeProof: formikOfficeProofId,
        tradeLicense: formikTradeLicenseId,
        signedAML: formikSignedAMLId,
      });

      // Use document IDs from Formik first, then component state, then extract from paths
      let finalOfficeProofId = formikOfficeProofId || officeProofDocumentId;
      let finalTradeLicenseId = formikTradeLicenseId || tradeLicenseDocumentId;
      let finalSignedAMLId = formikSignedAMLId || signedAMLDocumentId;

      // Debug: Log document IDs to verify they're set
      console.log('📄 Component State Document IDs:', {
        officeProof: officeProofDocumentId,
        tradeLicense: tradeLicenseDocumentId,
        signedAML: signedAMLDocumentId,
        hasUAEOffice,
        existingPaths: {
          officeProof: existingOfficeProofPath,
          tradeLicense: existingTradeLicensePath,
          signedAML: existingSignedAMLPath,
        }
      });

      // CRITICAL FIX: If validation passed but IDs are still null, extract from existing paths
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      if (!finalOfficeProofId && existingOfficeProofPath) {
        finalOfficeProofId = extractIdFromPath(existingOfficeProofPath);
        console.warn('⚠️ Office proof ID was null, extracted from path:', finalOfficeProofId);
      }
      if (!finalTradeLicenseId && existingTradeLicensePath) {
        finalTradeLicenseId = extractIdFromPath(existingTradeLicensePath);
        console.warn('⚠️ Trade license ID was null, extracted from path:', finalTradeLicenseId);
      }
      if (!finalSignedAMLId && existingSignedAMLPath) {
        finalSignedAMLId = extractIdFromPath(existingSignedAMLPath);
        console.warn('⚠️ Signed AML ID was null, extracted from path:', finalSignedAMLId);
      }

      console.log('✅ Final IDs after extraction:', {
        officeProof: finalOfficeProofId,
        tradeLicense: finalTradeLicenseId,
        signedAML: finalSignedAMLId,
      });

      // CRITICAL: Backend requires non-null values for these fields
      if (!finalTradeLicenseId) {
        toast.error('Trade license document is missing. Please upload it.');
        dispatch({ type: 'SET_SAVING', payload: false });
        return;
      }
      if (!finalSignedAMLId) {
        toast.error('Signed AML declaration is missing. Please upload it.');
        dispatch({ type: 'SET_SAVING', payload: false });
        return;
      }
      if (hasUAEOffice && !finalOfficeProofId) {
        toast.error('UAE office proof document is missing. Please upload it.');
        dispatch({ type: 'SET_SAVING', payload: false });
        return;
      }

      // Prepare applicability data based on membership type
      let applicabilityData: any = {};

      applicabilityData.affiliateMember = {
        hasUAEOffice: hasUAEOffice || false,
        operatesInBullionOrRefining3Years: licensedBullion || false,
        isInternationalOrgWithUAEBranch: internationalOrg || false,
        hasUnresolvedAMLNotices: hasAMLNotices || false,
        uaeOfficeProofDocuments: finalOfficeProofId ? [finalOfficeProofId] : null,
        eligibilitySupportingDocuments: finalTradeLicenseId ? [finalTradeLicenseId] : null,
        signedAMLDeclaration: finalSignedAMLId,
      };

      console.log('📦 Final Payload:', JSON.stringify(applicabilityData, null, 2));

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
    } catch (error: any) {
      toast.error(error?.message || "Failed to save applicability. Please try again.");
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Create initial values - use extracted IDs from useMemo for immediate availability
  const initialValues = {
    membership: membership,
    hasUAEOffice: hasUAEOffice,
    operatesInBullionOrRefining3Years: licensedBullion,
    isInternationalOrgWithUAEBranch: internationalOrg,
    hasUnresolvedAMLNotices: hasAMLNotices,
    uaeOfficeProofDocuments: officeProofFile || null,
    uaeOfficeProofDocumentsId: extractedDocumentIds.officeProof || null,
    eligibilitySupportingDocuments: tradeLicenseFile || null,
    eligibilitySupportingDocumentsId: extractedDocumentIds.tradeLicense || null,
    signedAMLDeclaration: signedAMLFile || null,
    signedAMLDeclarationId: extractedDocumentIds.signedAML || null,
  };

  console.log('📋 Formik initialValues:', {
    hasFiles: {
      officeProof: !!officeProofFile,
      tradeLicense: !!tradeLicenseFile,
      signedAML: !!signedAMLFile,
    },
    hasIds: {
      officeProof: extractedDocumentIds.officeProof,
      tradeLicense: extractedDocumentIds.tradeLicense,
      signedAML: extractedDocumentIds.signedAML,
    },
    hasPaths: {
      officeProof: !!existingOfficeProofPath,
      tradeLicense: !!existingTradeLicensePath,
      signedAML: !!existingSignedAMLPath,
    }
  });

  const handleSubmit = async (values: any) => {
    console.log('🔥 handleSubmit called with values:', values);
    console.log('🔍 Formik values at submit:', {
      uaeOfficeProofDocumentsId: values.uaeOfficeProofDocumentsId,
      eligibilitySupportingDocumentsId: values.eligibilitySupportingDocumentsId,
      signedAMLDeclarationId: values.signedAMLDeclarationId,
    });
    await handleSave(values);
  };

  return (
    <Formik
      key={`${extractedDocumentIds.officeProof}-${extractedDocumentIds.tradeLicense}-${extractedDocumentIds.signedAML}`}
      initialValues={initialValues}
      validationSchema={affiliateMemberStep1Schema}
      onSubmit={handleSubmit}
      enableReinitialize
      validateOnChange={false}
      validateOnBlur={true}
      validateOnMount={false}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
        <Form>
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
                disabled={!!formData.application?.membershipType && membership !== item.id}
                onClick={() => {
                  if (!formData.application?.membershipType) {
                    setMembership(item.id);
                    navigate(item.path);
                  }
                }}
                className={`h-[48px] rounded-lg border text-[16px] transition
                  ${
                    membership === item.id
                      ? "bg-[#C6A95F] text-black border-[#C6A95F]"
                      : "border-white/70 text-white"
                  } ${!!formData.application?.membershipType && membership !== item.id ? "opacity-50 cursor-not-allowed" : ""}`}
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
                setFieldValue('hasUAEOffice', val);
                setFieldTouched('hasUAEOffice', true);
              }}
            />
          </div>
          {touched.hasUAEOffice && errors.hasUAEOffice && (
            <p className="text-red-500 text-sm mt-1">{errors.hasUAEOffice as string}</p>
          )}
          {hasUAEOffice === true && (
            <div className="mt-6 ">
              <p className="text-[20px] text-white mb-3">
                Proof of office (lease agreement, utility bill, etc.) <span className="text-red-500">*</span>
              </p>
              <input
                ref={officeProofRef}
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0] || null;
                  handleFileUpload(file, setOfficeProofFile, setOfficeProofDocumentId, setFieldValue, setFieldTouched, 'uaeOfficeProofDocuments');
                }}
              />
              <UploadBox
                title=""
                file={officeProofFile}
                prefilledUrl={existingOfficeProofPath}
                onClick={() => officeProofRef.current?.click()}
                onDrop={(e) => {
                  const file = e.dataTransfer?.files?.[0] || null;
                  handleFileUpload(file, setOfficeProofFile, setOfficeProofDocumentId, setFieldValue, setFieldTouched, 'uaeOfficeProofDocuments');
                }}
                onRemove={() => {
                  setOfficeProofFile(null);
                  setOfficeProofDocumentId(null);
                  setExistingOfficeProofPath(null);
                  setFieldValue('uaeOfficeProofDocuments', null);
                  setFieldValue('uaeOfficeProofDocumentsId', null);
                  setFieldTouched('uaeOfficeProofDocuments', true);
                }}
              />
              {touched.uaeOfficeProofDocuments && errors.uaeOfficeProofDocuments && pendingUploads === 0 && (
                <p className="text-red-500 text-sm mt-1">{errors.uaeOfficeProofDocuments as string}</p>
              )}
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
            a) Operates in licensed bullion trading or refining in UAE for at least 3 years OR 36 months <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={licensedBullion}
              onChange={(val) => {
                setLicensedBullion(val);
                setFieldValue('operatesInBullionOrRefining3Years', val);
                setFieldTouched('operatesInBullionOrRefining3Years', true);
              }}
            />
          </div>
          {touched.operatesInBullionOrRefining3Years && errors.operatesInBullionOrRefining3Years && (
            <p className="text-red-500 text-sm mt-1">{errors.operatesInBullionOrRefining3Years as string}</p>
          )}
        </div>

        {/* International org */}
        <div className="mt-8">
          <p className="text-[18px] text-white">
            b) International organization with over 10 years of experience and have a UAE branch. <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={internationalOrg}
              onChange={(val) => {
                setInternationalOrg(val);
                setFieldValue('isInternationalOrgWithUAEBranch', val);
                setFieldTouched('isInternationalOrgWithUAEBranch', true);
              }}
            />
          </div>
          {touched.isInternationalOrgWithUAEBranch && errors.isInternationalOrgWithUAEBranch && (
            <p className="text-red-500 text-sm mt-1">{errors.isInternationalOrgWithUAEBranch as string}</p>
          )}
        </div>

        {/* Upload: Trade license */}
        <div className="mt-10 ">
          <p className="text-[20px] text-white w-full mb-3">
            Trade license, proof of years in operation, and/or global trade association membership certificate <span className="text-red-500">*</span>
          </p>
          <input
            ref={tradeLicenseRef}
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileUpload(file, setTradeLicenseFile, setTradeLicenseDocumentId, setFieldValue, setFieldTouched, 'eligibilitySupportingDocuments');
            }}
          />
          <UploadBox
            title=""
            file={tradeLicenseFile}
            prefilledUrl={existingTradeLicensePath}
            onClick={() => tradeLicenseRef.current?.click()}
            onDrop={(e) => {
              const file = e.dataTransfer?.files?.[0] || null;
              handleFileUpload(file, setTradeLicenseFile, setTradeLicenseDocumentId, setFieldValue, setFieldTouched, 'eligibilitySupportingDocuments');
            }}
            onRemove={() => {
              setTradeLicenseFile(null);
              setTradeLicenseDocumentId(null);
              setExistingTradeLicensePath(null);
              setFieldValue('eligibilitySupportingDocuments', null);
              setFieldValue('eligibilitySupportingDocumentsId', null);
              setFieldTouched('eligibilitySupportingDocuments', true);
            }}
          />
          {touched.eligibilitySupportingDocuments && errors.eligibilitySupportingDocuments && pendingUploads === 0 && (
            <p className="text-red-500 text-sm mt-1">{errors.eligibilitySupportingDocuments as string}</p>
          )}
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
            Signed AML declaration <span className="text-red-500">*</span>
          </p>
          <input
            ref={signedRef}
            type="file"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              handleFileUpload(file, setSignedAMLFile, setSignedAMLDocumentId, setFieldValue, setFieldTouched, 'signedAMLDeclaration');
            }}
          />
          <UploadBox
            title=""
            file={signedAMLFile}
            prefilledUrl={existingSignedAMLPath}
            onClick={() => signedRef.current?.click()}
            onDrop={(e) => {
              const file = e.dataTransfer?.files?.[0] || null;
              handleFileUpload(file, setSignedAMLFile, setSignedAMLDocumentId, setFieldValue, setFieldTouched, 'signedAMLDeclaration');
            }}
            onRemove={() => {
              setSignedAMLFile(null);
              setSignedAMLDocumentId(null);
              setExistingSignedAMLPath(null);
              setFieldValue('signedAMLDeclaration', null);
              setFieldValue('signedAMLDeclarationId', null);
              setFieldTouched('signedAMLDeclaration', true);
            }}
          />
          {touched.signedAMLDeclaration && errors.signedAMLDeclaration && pendingUploads === 0 && (
            <p className="text-red-500 text-sm mt-1">{errors.signedAMLDeclaration as string}</p>
          )}
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
            Any unresolved UAE AML notices? <span className="text-red-500">*</span>
          </p>
          <div className="mt-3">
            <YesNoGroup
              value={hasAMLNotices}
              onChange={(val) => {
                setHasAMLNotices(val);
                setFieldValue('hasUnresolvedAMLNotices', val);
                setFieldTouched('hasUnresolvedAMLNotices', true);
              }}
            />
          </div>
          {touched.hasUnresolvedAMLNotices && errors.hasUnresolvedAMLNotices && (
            <p className="text-red-500 text-sm mt-1">{errors.hasUnresolvedAMLNotices as string}</p>
          )}
        </div>

        {/* Save */}
      <div className="mt-6 flex justify-start">
        <Button
          type="button"
          onClick={() => submitForm()}
          disabled={isSaving || pendingUploads > 0 || (formData.applicability?.specialConsideration && formData.isSpecialConsiderationApproved === false)}
          variant="site_btn"
          className={` h-[42px] px-4 py-2 rounded-[10px] text-[18px] sm:text-[16px] font-gilroySemiBold font-normal leading-[100%] transition ${
            formData?.specialConsideration && formData.isSpecialConsiderationApproved === false
              ? "bg-gray-400 w-[192px] sm:w-full md:w-[192px] cursor-not-allowed text-black/60"
              : "text-white w-[132px] sm:w-full md:w-[132px]"
          }`}
        >
          {formData?.specialConsideration && formData.isSpecialConsiderationApproved === false
            ? "Waiting for Approval"
            : pendingUploads > 0
            ? "Uploading..."
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

              applicabilityData.affiliateMember = {
                hasUAEOffice: hasUAEOffice || false,
                operatesInBullionOrRefining3Years: licensedBullion || false,
                isInternationalOrgWithUAEBranch: internationalOrg || false,
                hasUnresolvedAMLNotices: hasAMLNotices || false,
                uaeOfficeProofDocuments: [],
                eligibilitySupportingDocuments: [],
                signedAMLDeclaration: signedAMLDocumentId,
              };

              // Add special consideration
              applicabilityData.specialConsideration = { message };

              const payload = {
                membershipType: MembershipType.AffiliateMember,
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
            } catch (error: any) {
              console.log("error", error);
              toast.error(error?.message || "Failed to submit special consideration request. Please try again.");
            }
          }}
          onCloseWithoutSubmit={() => setSpecialConsiderationOpen(false)}
        />

      </div>
    </div>
        </Form>
      )}
    </Formik>
  );
}
