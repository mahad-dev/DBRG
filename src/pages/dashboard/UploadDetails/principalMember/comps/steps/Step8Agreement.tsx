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
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from "react-toastify";
import { parseApiError } from "@/utils/errorHandler";
import { useStep8DeclarationConsent } from '@/hooks/useStep8DeclarationConsent';
import { Formik, Form } from 'formik';
import { principalMemberStep8Schema } from '@/validation';
import { extractDocumentIdFromPath } from '@/validation/utils/fileValidation';

export default function Step8Agreement() {
  const { state, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, dispatch } = useUploadDetails();
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
        setFieldValue('signatureURL', dataURL);
        setFieldValue('signatureURLTouched', true);
      }
      setOpenSigPad(false);
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  const emptyToNull = (value: any): any => {
    if (value === "" || value === undefined) return null;
    return value;
  };

  const handleSubmit = async (values: any, _helpers: any) => {
    dispatch({ type: 'SET_SAVING', payload: true });

    try {
      // Upload signature if it's a data URL
      let finalSignatureDocumentId: number | null = signatureDocumentId;
      if (values.signatureURL && values.signatureURL.startsWith("data:")) {
        setPendingUploads(prev => prev + 1);
        try {
          const response = await fetch(values.signatureURL);
          const blob = await response.blob();
          const signatureFile = new File([blob], "signature.png", { type: "image/png" });
          finalSignatureDocumentId = await uploadDocument(signatureFile);
          setSignatureDocumentId(finalSignatureDocumentId);
        } finally {
          setPendingUploads(prev => prev - 1);
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
        applicantName: emptyToNull(values.applicantName),
        authorisedSignatoryName: emptyToNull(values.signatoryName),
        designation: emptyToNull(values.designation),
        date: emptyToNull(values.selectedDate.toISOString()),
        digitalSignatureFileId: finalSignatureDocumentId,
      };

      const payload = {
        membershipType: formData.application.membershipType,
        declarationConsent: declarationConsentData,
      };

      updateFormData(payload);
      await saveUploadDetails(payload, MemberApplicationSection.DeclarationConsent);

      toast.success("Declaration & Consent saved successfully! Application completed.");
    } catch (error: any) {
      console.error(error);
      toast.error(parseApiError(error, "Failed to save declaration & consent. Please try again."));
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
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
      validationSchema={principalMemberStep8Schema}
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
              <h2 className="text-[28px] md:text-[30px] font-gilory font-bold leading-tight text-[#C6A95F]">
                Section 8 – Declaration of Agreement for Consent and Data Acknowledgment
              </h2>

              {/* Checkboxes */}
              <div className="space-y-4">
                <ServiceCheckbox
                  label="I consent to the processing, storage, and use of my data by DBRG for compliance and governance purposes in accordance with applicable laws."
                  checked={values.consentData}
                  onChange={() => {
                    setConsentData(!values.consentData);
                    setFieldValue('consentData', !values.consentData);
                    setFieldTouched('consentData', true);
                  }}
                />
                <ServiceCheckbox
                  label="I acknowledge that my data will be retained for at least 5 years or more as per applicable laws (DFSA requires 6 years) after termination of membership."
                  checked={values.acknowledgeRetention}
                  onChange={() => {
                    setAcknowledgeRetention(!values.acknowledgeRetention);
                    setFieldValue('acknowledgeRetention', !values.acknowledgeRetention);
                    setFieldTouched('acknowledgeRetention', true);
                  }}
                />
              </div>

              <h3 className="text-[24px] text-[#C6A95F] font-gilory font-bold mt-6">
                Declaration of Adherence to DBRG Code of Conduct
              </h3>
              <ServiceCheckbox
                label="I hereby confirm that I have read, understood, and agree to adhere to the DBRG Code of Conduct."
                checked={values.agreeCode}
                onChange={() => {
                  setAgreeCode(!values.agreeCode);
                  setFieldValue('agreeCode', !values.agreeCode);
                  setFieldTouched('agreeCode', true);
                }}
              />

              {/* Inputs Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-black">
                <div className="space-y-1 text-white">
                  <label className="text-sm font-gilory font-normal">
                    Name of the Applicant <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.applicantName}
                    onChange={(e) => {
                      setApplicantName(e.target.value);
                      setFieldValue('applicantName', e.target.value);
                    }}
                    onBlur={() => setFieldTouched('applicantName', true)}
                    placeholder="Name of the Applicant"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  />
                  {touched.applicantName && errors.applicantName && (
                    <p className="text-red-500 text-sm mt-1">{errors.applicantName as string}</p>
                  )}
                </div>

                <div className="space-y-1 text-white">
                  <label className="text-sm font-gilory font-normal">
                    Name of Authorised Signatory <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.signatoryName}
                    onChange={(e) => {
                      setSignatoryName(e.target.value);
                      setFieldValue('signatoryName', e.target.value);
                    }}
                    onBlur={() => setFieldTouched('signatoryName', true)}
                    placeholder="Name of Authorised Signatory"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  />
                  {touched.signatoryName && errors.signatoryName && (
                    <p className="text-red-500 text-sm mt-1">{errors.signatoryName as string}</p>
                  )}
                </div>

                <div className="space-y-1 text-white">
                  <label className="text-sm font-gilory font-normal">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={values.designation}
                    onChange={(e) => {
                      setDesignation(e.target.value);
                      setFieldValue('designation', e.target.value);
                    }}
                    onBlur={() => setFieldTouched('designation', true)}
                    placeholder="Designation"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                  />
                  {touched.designation && errors.designation && (
                    <p className="text-red-500 text-sm mt-1">{errors.designation as string}</p>
                  )}
                </div>

                {/* Signature */}
                <div className="space-y-1 text-white">
                  <label className="text-sm font-gilory font-normal">
                    Signature <span className="text-red-500">*</span>
                  </label>
                  <div className="relative w-full mt-2 bg-white rounded-md h-9 flex items-center px-4">
                    {values.signatureURL ? (
                      <img src={values.signatureURL} alt="Signature" className="h-full object-contain py-1" />
                    ) : (
                      <span className="text-gray-500 text-sm">No signature uploaded</span>
                    )}
                  </div>
                  <Button
                    type="button"
                    onClick={() => setOpenSigPad(true)}
                    className="bg-black text-white text-xs p-3 rounded-md mt-1 cursor-pointer"
                  >
                    Upload Digital Signature
                  </Button>
                  {existingSignaturePath && !values.signatureURL && (
                    <a
                      href={existingSignaturePath}
                      target="_blank"
                      className="text-[#C6A95F] underline mt-2 block cursor-pointer"
                    >
                      View previously uploaded signature
                    </a>
                  )}
                  {touched.signatureURL && errors.signatureURL && (
                    <p className="text-red-500 text-sm mt-1">{errors.signatureURL as string}</p>
                  )}
                </div>
              </div>

              {/* Date Picker */}
              <div className="w-full md:w-1/4 pt-4">
                <label className="text-sm font-gilory font-normal text-white">
                  Date <span className="text-red-500">*</span>
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300 cursor-pointer"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values.selectedDate ? format(values.selectedDate, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-white">
                    <Calendar
                      mode="single"
                      selected={values.selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date ?? undefined);
                        setFieldValue('selectedDate', date ?? undefined);
                        setFieldTouched('selectedDate', true);
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {touched.selectedDate && errors.selectedDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.selectedDate as string}</p>
                )}
              </div>

              {/* Buttons */}
              <div className="mt-10 flex justify-start gap-4">
                <Button
                  type="button"
                  onClick={() => setCurrentStep(7)}
                  className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
                >
                  Back
                </Button>

                <Button
                  type="button"
                  onClick={submitForm}
                  disabled={isSaving || pendingUploads > 0}
                  variant="site_btn"
                  className="w-[180px] h-[42px] rounded-[10px] text-white font-gilroySemiBold cursor-pointer disabled:cursor-not-allowed"
                >
                  {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Submit'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Signature Modal */}
          <Dialog open={openSigPad} onOpenChange={setOpenSigPad}>
            <DialogContent className="bg-white text-[#C6A95F] max-w-md">
              <DialogHeader>
                <DialogTitle className="font-bold">Draw Your Signature</DialogTitle>
              </DialogHeader>
              <div className="border rounded-md p-2 bg-white">
                <SignaturePad
                  ref={sigPadRef}
                  canvasProps={{ className: "w-full h-[180px] rounded-md" }}
                />
              </div>
              <DialogFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={clearSignature} className="cursor-pointer">
                  Clear
                </Button>
                <Button type="button" variant="site_btn" onClick={() => saveSignature(setFieldValue)} className="cursor-pointer">
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
