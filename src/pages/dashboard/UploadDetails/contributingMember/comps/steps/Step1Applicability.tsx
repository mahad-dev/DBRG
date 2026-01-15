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
import { parseApiError } from "@/utils/errorHandler";
import { useStep1Applicability } from '@/hooks/useStep1Applicability';
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { Formik } from "formik";
import { contributingMemberStep1Schema } from "@/validation";

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

  // Track pending uploads
  const [pendingUploads, setPendingUploads] = useState(0);
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

  // Handle file upload with immediate UI update and background API call
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
      setPendingUploads((prev) => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setDocumentId(documentId);
        setFieldValue(`${fieldName}Id`, documentId);
        setFieldTouched(fieldName, true); // Only touch after successful upload
        toast.success("File uploaded successfully!");
      } catch (error: any) {
        toast.error(parseApiError(error, "File upload failed. Please try again."));
        // Remove file from UI on error
        setFile(null);
        setFieldValue(fieldName, null);
        setFieldValue(`${fieldName}Id`, null);
        setFieldTouched(fieldName, true); // Touch on error too
      } finally {
        setPendingUploads((prev) => prev - 1);
      }
    } else {
      // File removed
      setDocumentId(null);
      setFieldValue(`${fieldName}Id`, null);
      setFieldTouched(fieldName, true);
    }
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

      // Extract document ID from existing signed AML path
      if (existingSignedAMLPath) {
        const extractedId = extractIdFromPath(existingSignedAMLPath);
        if (extractedId) {
          console.log('✅ Extracted signedAMLDocumentId from path:', extractedId);
          setSignedAMLDocumentId(extractedId);
        }
      }
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
  }, [formData.applicability, formData.application, setMembership, existingSignedAMLPath]);

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
    const emptyToNull = (value: any): any => {
      if (value === "" || value === undefined) return null;
      return value;
    };

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
      // Extract ID from S3 path
      const extractIdFromPath = (path: string | null): number | null => {
        if (!path) return null;
        const match = path.match(/\/(\d+)_/);
        return match ? parseInt(match[1], 10) : null;
      };

      // Use document ID from immediate upload or existing path
      const signedAMLDocId = signedAMLDocumentId || extractIdFromPath(existingSignedAMLPath);

      // Prepare applicability data based on membership type
      let applicabilityData: any = {};

      applicabilityData.contributingMember = {
        isUAEBasedEntity: isUAEBasedEntity || false,
        yearsOfOperation: yearsOfOperation || 0,
        servicesProvided: servicesProvided.filter(id => id !== 8),
        otherServiceDetail: emptyToNull(servicesProvided.includes(8) ? otherServiceDetail : ""),
        hasUnresolvedAMLNotices: hasUnresolvedAMLNotices || false,
        signedAMLDeclaration: signedAMLDocId,
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
    } catch (error: any) {
      toast.error(parseApiError(error, "Failed to save applicability. Please try again."));
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    membership: membership || "",
    isUAEBasedEntity: isUAEBasedEntity,
    yearsOfOperation: yearsOfOperation,
    servicesProvided: servicesProvided,
    otherServiceDetail: otherServiceDetail,
    hasUnresolvedAMLNotices: hasUnresolvedAMLNotices,
    signedAMLFile: signedAMLFile,
    signedAMLFileId: signedAMLDocumentId, // Include document ID for validation
  };

  console.log('📋 Contributing Member Step 1 initialValues:', {
    signedAMLFile: !!signedAMLFile,
    signedAMLFileId: signedAMLDocumentId,
    existingPath: !!existingSignedAMLPath
  });

return (
  <Formik
    initialValues={initialValues}
    validationSchema={contributingMemberStep1Schema}
    onSubmit={handleSave}
    enableReinitialize
    validateOnMount={false}
    validateOnChange={false}
    validateOnBlur={true}
  >
    {({ errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
      <div className="w-full min-h-screen bg-[#353535] rounded-xl p-6 md:p-10 shadow-lg">
        {/* Heading */}
        <h2 className="text-[28px] sm:text-[22px] font-gilroy font-bold text-[#C6A95F] leading-[100%]">
          Section 1 - Applicability
        </h2>

        {/* a) Membership */}
        <div className="mt-8">
          <Label className="block text-[22px] sm:text-[18px] font-gilroy text-white">
            a) Which DBRG Membership Category are you applying for? <span className="text-red-500">*</span>
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
                    setFieldValue('membership', opt.id);
                    setFieldTouched('membership', true);
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
          {touched.membership && errors.membership && (
            <p className="text-red-500 text-sm mt-2">{errors.membership as string}</p>
          )}
        </div>

        {/* b) UAE Based */}
        <div className="mt-8">
          <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
            b) Are you a UAE-based entity? <span className="text-red-500">*</span>
          </p>

          <div className="mt-3">
            <YesNoGroup
              value={isUAEBasedEntity}
              onChange={(val) => {
                setIsUAEBasedEntity(val);
                setFieldValue('isUAEBasedEntity', val);
                setFieldTouched('isUAEBasedEntity', true);
              }}
            />
          </div>
          {touched.isUAEBasedEntity && errors.isUAEBasedEntity && (
            <p className="text-red-500 text-sm mt-2">{errors.isUAEBasedEntity as string}</p>
          )}
        </div>

        {/* Years of operation */}
        <div className="mt-8">
          <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
            If yes, Years of operation in the UAE <span className="text-red-500">*</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            {[0, 1, 3, 5].map((val) => (
              <Button
                key={val}
                variant="outline"
                onClick={() => {
                  setYearsOfOperation(val);
                  setFieldValue('yearsOfOperation', val);
                  setFieldTouched('yearsOfOperation', true);
                }}
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
          {touched.yearsOfOperation && errors.yearsOfOperation && (
            <p className="text-red-500 text-sm mt-2">{errors.yearsOfOperation as string}</p>
          )}
        </div>

        {/* d) Services */}
        <div className="mt-10">
          <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
            d) Do you provide any of the services below, for the bullion and / or refinery industry? <span className="text-red-500">*</span>
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-6">
            {serviceOptions.map((opt) => (
              <ServiceCheckbox
                key={opt.id}
                label={opt.label}
                checked={servicesProvided.includes(opt.id)}
                onChange={() => {
                  const newServices = servicesProvided.includes(opt.id)
                    ? servicesProvided.filter((id) => id !== opt.id)
                    : [...servicesProvided, opt.id];
                  setServicesProvided(newServices);
                  setFieldValue('servicesProvided', newServices);
                  setFieldTouched('servicesProvided', true);
                }}
              />
            ))}
          </div>
          {touched.servicesProvided && errors.servicesProvided && (
            <p className="text-red-500 text-sm mt-2">{errors.servicesProvided as string}</p>
          )}

          {servicesProvided.includes(8) && (
            <>
              <textarea
                value={otherServiceDetail}
                onChange={(e) => {
                  setOtherServiceDetail(e.target.value);
                  setFieldValue('otherServiceDetail', e.target.value);
                }}
                onBlur={() => setFieldTouched('otherServiceDetail', true)}
                className="mt-4 w-full bg-[#2C2C2C] border border-white/30 rounded-md p-3 text-white"
                placeholder="Please specify other service"
              />
              {touched.otherServiceDetail && errors.otherServiceDetail && (
                <p className="text-red-500 text-sm mt-2">{errors.otherServiceDetail as string}</p>
              )}
            </>
          )}
        </div>

        {/* e) AML */}
        <div className="mt-10">
          <p className="text-[22px] sm:text-[18px] text-white font-gilroy">
            e) Any unresolved UAE AML notices? <span className="text-red-500">*</span>
          </p>

          <div className="mt-3">
            <YesNoGroup
              value={hasUnresolvedAMLNotices}
              onChange={(val) => {
                setHasUnresolvedAMLNotices(val);
                setFieldValue('hasUnresolvedAMLNotices', val);
                setFieldTouched('hasUnresolvedAMLNotices', true);
              }}
            />
          </div>
          {touched.hasUnresolvedAMLNotices && errors.hasUnresolvedAMLNotices && (
            <p className="text-red-500 text-sm mt-2">{errors.hasUnresolvedAMLNotices as string}</p>
          )}

          <div className="mt-6 max-w-[420px]">
            <Label className="text-white text-[18px] mb-2 block">
              Signed AML Declaration <span className="text-red-500">*</span>
            </Label>
            <input
              ref={signedRef}
              type="file"
              hidden
              accept="application/pdf,image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={async (e) => {
                const file = e.target.files?.[0] ?? null;
                await handleFileUpload(
                  file,
                  setSignedAMLFile,
                  setSignedAMLDocumentId,
                  setFieldValue,
                  setFieldTouched,
                  'signedAMLFile'
                );
              }}
            />

            <UploadBox
              title="Signed AML Declaration"
              file={signedAMLFile}
              prefilledUrl={existingSignedAMLPath}
              onClick={() => signedRef.current?.click()}
              onDrop={async (e) => {
                e.preventDefault();
                const file = e.dataTransfer?.files?.[0] ?? null;
                await handleFileUpload(
                  file,
                  setSignedAMLFile,
                  setSignedAMLDocumentId,
                  setFieldValue,
                  setFieldTouched,
                  'signedAMLFile'
                );
              }}
              onRemove={() => {
                removeSignedAMLFile();
                setSignedAMLDocumentId(null);
                setFieldValue('signedAMLFile', null);
                setFieldValue('signedAMLFileId', null);
                setFieldTouched('signedAMLFile', true);
              }}
            />
            {touched.signedAMLFile && errors.signedAMLFile && pendingUploads === 0 && (
              <p className="text-red-500 text-sm mt-2">{errors.signedAMLFile as string}</p>
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
            const emptyToNull = (value: any): any => {
              if (value === "" || value === undefined) return null;
              return value;
            };

            try {
              // Extract ID from S3 path
              const extractIdFromPath = (path: string | null): number | null => {
                if (!path) return null;
                const match = path.match(/\/(\d+)_/);
                return match ? parseInt(match[1], 10) : null;
              };

              let signedAMLDocId = extractIdFromPath(existingSignedAMLPath);

              // Prepare applicability data based on membership type
              let applicabilityData: any = {};

              applicabilityData.contributingMember = {
                isUAEBasedEntity: isUAEBasedEntity || false,
                yearsOfOperation: yearsOfOperation || 0,
                servicesProvided: servicesProvided.filter(id => id !== 8),
                otherServiceDetail: emptyToNull(servicesProvided.includes(8) ? otherServiceDetail : ""),
                hasUnresolvedAMLNotices: hasUnresolvedAMLNotices || false,
                signedAMLDeclaration: signedAMLDocId,
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
            } catch (error: any) {
              console.log("error", error);
              toast.error(parseApiError(error, "Failed to submit special consideration request. Please try again."));
            }
          }}
          onCloseWithoutSubmit={() => setSpecialConsiderationOpen(false)}
        />
      </div>
    )}
  </Formik>
);

}

