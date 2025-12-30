"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SignaturePad from "react-signature-canvas";
import ServiceCheckbox from "@/components/custom/ui/ServiceCheckbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useUploadDetails } from "@/context/UploadDetailsContext";
import { MemberApplicationSection } from "@/types/uploadDetails";
import { toast } from "react-toastify";
import { useStep8DeclarationConsent } from "@/hooks/useStep8DeclarationConsent";
import { Formik, Form } from "formik";
import { memberBankStep4Schema } from "@/validation";
import { extractDocumentIdFromPath } from "@/validation/utils/fileValidation";

export default function Step4Agreement() {
  const {
    state,
    uploadDocument,
    saveUploadDetails,
    updateFormData,
    setCurrentStep,
    dispatch,
  } = useUploadDetails();

  const formData = state.data;
  const isSaving = state.isSaving;
  const [pendingUploads, setPendingUploads] = useState<number>(0);

  const sigPadRef = useRef<SignaturePad>(null);
  const [openSigPad, setOpenSigPad] = useState(false);

  // Use the hook for prefilling
  const {
    consentData,
    acknowledgeRetention,
    agreeCode,
    applicantName,
    signatoryName,
    designation,
    selectedDate,
    signatureURL,
    existingSignaturePath,
    signatureDocumentId,
    setConsentData,
    setAcknowledgeRetention,
    setAgreeCode,
    setApplicantName,
    setSignatoryName,
    setDesignation,
    setSelectedDate,
    setSignatureURL,
    setSignatureDocumentId,
  } = useStep8DeclarationConsent(formData.declarationConsent);

  // Signature functions - now accepts setFieldValue from Formik
  const saveSignature = (setFieldValue?: any) => {
    if (sigPadRef.current) {
      const dataURL = sigPadRef.current.getCanvas().toDataURL("image/png");
      setSignatureURL(dataURL);
      if (setFieldValue) {
        setFieldValue("signatureURL", dataURL);
        setFieldValue("signatureURLTouched", true);
      }
      setOpenSigPad(false);
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  const handleSubmit = async (values: any, _helpers: any) => {
    dispatch({ type: "SET_SAVING", payload: true });

    try {
      // Upload signature if it's a data URL
      let finalSignatureDocumentId: number | null = signatureDocumentId;
      if (values.signatureURL && values.signatureURL.startsWith("data:")) {
        setPendingUploads((prev) => prev + 1);
        try {
          const response = await fetch(values.signatureURL);
          const blob = await response.blob();
          const signatureFile = new File([blob], "signature.png", {
            type: "image/png",
          });
          finalSignatureDocumentId = await uploadDocument(signatureFile);
          setSignatureDocumentId(finalSignatureDocumentId);
        } finally {
          setPendingUploads((prev) => prev - 1);
        }
      }

      // Use stored document ID or extract from existing path
      if (!finalSignatureDocumentId && existingSignaturePath) {
        finalSignatureDocumentId = extractDocumentIdFromPath(existingSignaturePath);
      }

      const declarationConsentData = {
        consentsToDataProcessing: values.consentData,
        acknowledgesDataRetention: values.acknowledgeRetention,
        adheresToCodeOfConduct: values.agreeCode,
        applicantName: values.applicantName,
        authorisedSignatoryName: values.signatoryName,
        designation: values.designation,
        date: values.selectedDate.toISOString(),
        digitalSignatureFileId: finalSignatureDocumentId,
      };

      const payload = {
        membershipType: formData.application.membershipType,
        declarationConsent: declarationConsentData,
      };

      updateFormData(payload);
      await saveUploadDetails(
        payload,
        MemberApplicationSection.DeclarationConsent
      );

      toast.success(
        "Declaration & Consent saved successfully! Application completed."
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to save declaration & consent. Please try again.");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    consentData,
    acknowledgeRetention,
    agreeCode,
    applicantName,
    signatoryName,
    designation,
    selectedDate,
    signatureURL,
    existingSignaturePath,
    signatureDocumentId,
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memberBankStep4Schema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={true}
      validateOnMount={false}
      enableReinitialize={true}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm, values }) => (
        <Form>
          <Card className="bg-[#353535] border-none rounded-xl w-full">
            <CardContent className="space-y-6">
              <h2 className="text-[28px] md:text-[30px] font-gilory font-bold text-[#C6A95F]">
                Section 4 – Declaration of Agreement for Consent and Data
                Acknowledgment
              </h2>

              {/* Checkboxes */}
              <div className="space-y-4">
                <div>
                  <ServiceCheckbox
                    label={"I consent to the processing, storage, and use of my data by DBRG for compliance and governance purposes in accordance with applicable laws *"}
                    checked={values.consentData}
                    onChange={() => {
                      setConsentData(!values.consentData);
                      setFieldValue("consentData", !values.consentData);
                      setFieldTouched("consentData", true);
                    }}
                  />
                  {touched.consentData && errors.consentData && (
                    <p className="text-red-500 text-sm mt-1">{errors.consentData as string}</p>
                  )}
                </div>

                <div>
                  <ServiceCheckbox
                    label={"I acknowledge that my data will be retained for at least 5 years or more as per applicable laws (DFSA requires 6 years) after the termination of membership, as per regulatory obligations. *"}
                    checked={values.acknowledgeRetention}
                    onChange={() => {
                      setAcknowledgeRetention(!values.acknowledgeRetention);
                      setFieldValue("acknowledgeRetention", !values.acknowledgeRetention);
                      setFieldTouched("acknowledgeRetention", true);
                    }}
                  />
                  {touched.acknowledgeRetention && errors.acknowledgeRetention && (
                    <p className="text-red-500 text-sm mt-1">{errors.acknowledgeRetention as string}</p>
                  )}
                </div>
              </div>

              <h3 className="text-[24px] text-[#C6A95F] font-gilory font-bold mt-6">
                Declaration of Adherence to DBRG Code of Conduct
              </h3>

              <div>
                <ServiceCheckbox
                  label={"I hereby confirm that we have read, understood, and agree to adhere to the DBRG Code of Conduct. I acknowledge that non-compliance may lead to suspension or termination of membership. *"}
                  checked={values.agreeCode}
                  onChange={() => {
                    setAgreeCode(!values.agreeCode);
                    setFieldValue("agreeCode", !values.agreeCode);
                    setFieldTouched("agreeCode", true);
                  }}
                />
                {touched.agreeCode && errors.agreeCode && (
                  <p className="text-red-500 text-sm mt-1">{errors.agreeCode as string}</p>
                )}
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
                <div className="text-white">
                  <label className="text-sm">
                    Name of the Applicant <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.applicantName}
                    onChange={(e) => {
                      setApplicantName(e.target.value);
                      setFieldValue("applicantName", e.target.value);
                    }}
                    onBlur={() => setFieldTouched("applicantName", true)}
                    placeholder="Name of the Applicant"
                    className="mt-2 h-[42px] bg-white text-black"
                  />
                  {touched.applicantName && errors.applicantName && (
                    <p className="text-red-500 text-sm mt-1">{errors.applicantName as string}</p>
                  )}
                </div>

                <div className="text-white">
                  <label className="text-sm">
                    Name of Authorised Signatory <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.signatoryName}
                    onChange={(e) => {
                      setSignatoryName(e.target.value);
                      setFieldValue("signatoryName", e.target.value);
                    }}
                    onBlur={() => setFieldTouched("signatoryName", true)}
                    placeholder="Name of Authorised Signatory"
                    className="mt-2 h-[42px] bg-white text-black"
                  />
                  {touched.signatoryName && errors.signatoryName && (
                    <p className="text-red-500 text-sm mt-1">{errors.signatoryName as string}</p>
                  )}
                </div>

                <div className="text-white">
                  <label className="text-sm">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                      setFieldValue("designation", e.target.value);
                    }}
                    onBlur={() => setFieldTouched("designation", true)}
                    placeholder="Designation"
                    className="mt-2 h-[42px] bg-white text-black"
                  />
                  {touched.designation && errors.designation && (
                    <p className="text-red-500 text-sm mt-1">{errors.designation as string}</p>
                  )}
                </div>

                {/* Signature */}
                <div className="text-white">
                  <label className="text-sm">
                    Signature <span className="text-red-500">*</span>
                  </label>

                  <div className="mt-2 h-9 bg-white rounded-md flex items-center px-3">
                    {values.signatureURL ? (
                      <img
                        src={values.signatureURL}
                        alt="Signature"
                        className="h-full object-contain"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">
                        No signature uploaded
                      </span>
                    )}
                  </div>

                  <Button
                    type="button"
                    onClick={() => setOpenSigPad(true)}
                    className="bg-black text-white text-xs px-3 py-2 rounded-md mt-1"
                  >
                    Upload Digital Signature
                  </Button>

                  {existingSignaturePath && !values.signatureURL && (
                    <a
                      href={existingSignaturePath}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block mt-2 text-[#C6A95F] underline text-sm"
                    >
                      View previously uploaded signature
                    </a>
                  )}
                  {touched.signatureURL && errors.signatureURL && (
                    <p className="text-red-500 text-sm mt-1">{errors.signatureURL as string}</p>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="w-full md:w-1/4 pt-4">
                <label className="text-sm text-white">
                  Date <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      className="w-full mt-2 h-[42px] bg-white text-black justify-start"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.selectedDate
                        ? format(values.selectedDate, "dd/MM/yyyy")
                        : "DD/MM/YYYY"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={values.selectedDate}
                      onSelect={(d) => {
                        setSelectedDate(d ?? undefined);
                        setFieldValue("selectedDate", d ?? undefined);
                        setFieldTouched("selectedDate", true);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {touched.selectedDate && errors.selectedDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedDate as string}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-10 flex gap-4">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-[132px] h-[42px] border border-white text-white"
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={submitForm}
                  disabled={isSaving || pendingUploads > 0}
                  variant="site_btn"
                  className="w-[180px] h-[42px]"
                >
                  {pendingUploads > 0 ? "Uploading..." : isSaving ? "Saving..." : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Signature Modal */}
          <Dialog open={openSigPad} onOpenChange={setOpenSigPad}>
            <DialogContent className="bg-white max-w-md">
              <DialogHeader>
                <DialogTitle>Draw Your Signature</DialogTitle>
              </DialogHeader>

              <div className="border rounded-md p-2">
                <SignaturePad
                  ref={sigPadRef}
                  canvasProps={{ className: "w-full h-[180px]" }}
                />
              </div>

              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={clearSignature}
                >
                  Clear
                </Button>
                <Button
                  type="button"
                  variant="site_btn"
                  onClick={() => saveSignature(setFieldValue)}
                >
                  Save Signature
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Form>
      )}
    </Formik>
  );
}
