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

export default function Step8Agreement() {
  const { state, uploadDocument, saveUploadDetails, updateFormData, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

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
    setConsentData,
    setAcknowledgeRetention,
    setAgreeCode,
    setApplicantName,
    setSignatoryName,
    setDesignation,
    setSelectedDate,
    setSignatureURL,
  } = useStep8DeclarationConsent(formData.declarationConsent);

  // Signature functions
  const saveSignature = () => {
    if (sigPadRef.current) {
      const dataURL = sigPadRef.current.getCanvas().toDataURL("image/png");
      setSignatureURL(dataURL);
      setOpenSigPad(false);
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  // Extract ID from S3 path
  const extractIdFromPath = (path: string | null): number | null => {
    if (!path) return null;
    const match = path.match(/\/(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  };

  const emptyToNull = (value: any): any => {
    if (value === "" || value === undefined) return null;
    return value;
  };

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    // Validate required fields
    if (!consentData || !acknowledgeRetention || !agreeCode) {
      toast.error("Please check all required consent checkboxes.");
      dispatch({ type: 'SET_SAVING', payload: false });

      return;
    }

    if (!applicantName || !signatoryName || !designation || !selectedDate) {
      toast.error("Please fill in all required fields.");
      dispatch({ type: 'SET_SAVING', payload: false });

      return;
    }



    try {
      // Upload signature if it's a data URL
      let signatureDocumentId: number | null = null;
      if (signatureURL.startsWith("data:")) {
        const response = await fetch(signatureURL);
        const blob = await response.blob();
        const signatureFile = new File([blob], "signature.png", { type: "image/png" });
        signatureDocumentId = await uploadDocument(signatureFile);
      }

      const declarationConsentData = {
        consentsToDataProcessing: consentData,
        acknowledgesDataRetention: acknowledgeRetention,
        adheresToCodeOfConduct: agreeCode,
        applicantName: emptyToNull(applicantName),
        authorisedSignatoryName: emptyToNull(signatoryName),
        designation: emptyToNull(designation),
        date: emptyToNull(selectedDate.toISOString()),
        digitalSignatureFileId: signatureDocumentId || extractIdFromPath(existingSignaturePath),
      };

      const payload = {
        membershipType: formData.application.membershipType,
        declarationConsent: declarationConsentData,
      };

      updateFormData(payload);
      await saveUploadDetails(payload, MemberApplicationSection.DeclarationConsent);

      toast.success("Declaration & Consent saved successfully! Application completed.");
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error: any) {
      console.error(error);
      toast.error(parseApiError(error, "Failed to save declaration & consent. Please try again."));
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <>
      <Card className="bg-[#353535] border-none rounded-xl w-full">
        <CardContent className="space-y-6">
          <h2 className="text-[28px] md:text-[30px] font-gilory font-bold leading-tight text-[#C6A95F]">
            Section 8 – Declaration of Agreement for Consent and Data Acknowledgment
          </h2>

          {/* Checkboxes */}
          <div className="space-y-4">
            <ServiceCheckbox
              label="I consent to the processing, storage, and use of my data by DBRG for compliance and governance purposes in accordance with applicable laws."
              checked={consentData}
              onChange={() => setConsentData(!consentData)}
            />
            <ServiceCheckbox
              label="I acknowledge that my data will be retained for at least 5 years or more as per applicable laws (DFSA requires 6 years) after termination of membership."
              checked={acknowledgeRetention}
              onChange={() => setAcknowledgeRetention(!acknowledgeRetention)}
            />
          </div>

          <h3 className="text-[24px] text-[#C6A95F] font-gilory font-bold mt-6">
            Declaration of Adherence to DBRG Code of Conduct
          </h3>
          <ServiceCheckbox
            label="I hereby confirm that I have read, understood, and agree to adhere to the DBRG Code of Conduct."
            checked={agreeCode}
            onChange={() => setAgreeCode(!agreeCode)}
          />

          {/* Inputs Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 text-black">
            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">Name of the Applicant</label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Name of the Applicant"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              />
            </div>

            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">Name of Authorised Signatory</label>
              <Input
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="Name of Authorised Signatory"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              />
            </div>

            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">Designation</label>
              <Input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Designation"
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              />
            </div>

            {/* Signature */}
            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">Signature</label>
              <div className="relative w-full mt-2 bg-white rounded-md h-9 flex items-center px-4">
                {signatureURL ? (
                  <img src={signatureURL} alt="Signature" className="h-full object-contain py-1" />
                ) : (
                  <span className="text-gray-500 text-sm">No signature uploaded</span>
                )}
              </div>
              <Button
                onClick={() => setOpenSigPad(true)}
                className="bg-black text-white text-xs p-3 rounded-md mt-1"
              >
                Upload Digital Signature
              </Button>
              {existingSignaturePath && !signatureURL && (
                <a
                  href={existingSignaturePath}
                  target="_blank"
                  className="text-[#C6A95F] underline mt-2 block"
                >
                  View previously uploaded signature
                </a>
              )}
            </div>
          </div>

          {/* Date Picker */}
          <div className="w-full md:w-1/4 pt-4">
            <label className="text-sm font-gilory font-normal text-white">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => setSelectedDate(date ?? undefined)}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-start gap-4">
                    <Button
                      onClick={() => setCurrentStep(7)}
                      className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
                    >
                      Back
                    </Button>
            
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="site_btn"
              className="w-[180px] h-[42px] rounded-[10px] text-white font-gilroySemiBold"
            >
              {isSaving ? "Saving..." : "Submit Application"}
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
            <Button variant="outline" onClick={clearSignature}>
              Clear
            </Button>
            <Button variant="site_btn" onClick={saveSignature}>
              Save Signature
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
