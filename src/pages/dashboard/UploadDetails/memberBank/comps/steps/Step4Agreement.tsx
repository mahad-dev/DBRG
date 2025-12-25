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

  const sigPadRef = useRef<any>(null);
  const [openSigPad, setOpenSigPad] = useState(false);

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

  const saveSignature = () => {
    if (sigPadRef.current) {
      const dataURL = sigPadRef.current
        .getCanvas()
        .toDataURL("image/png");
      setSignatureURL(dataURL);
      setOpenSigPad(false);
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  const extractIdFromPath = (path: string | null | undefined): number | null => {
    if (!path) return null;
    const match = path.match(/\/(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  };

  const handleSave = async () => {
    dispatch({ type: "SET_SAVING", payload: true });

    if (!consentData || !acknowledgeRetention || !agreeCode) {
      toast.error("Please check all required consent checkboxes.");
      dispatch({ type: "SET_SAVING", payload: false });
      return;
    }

    if (!applicantName || !signatoryName || !designation || !selectedDate) {
      toast.error("Please fill in all required fields.");
      dispatch({ type: "SET_SAVING", payload: false });
      return;
    }

    try {
      let signatureDocumentId = null;

      if (signatureURL?.startsWith("data:")) {
        const response = await fetch(signatureURL);
        const blob = await response.blob();
        const file = new File([blob], "signature.png", {
          type: "image/png",
        });
        signatureDocumentId = await uploadDocument(file);
      }

      const declarationConsentData = {
        consentsToDataProcessing: consentData,
        acknowledgesDataRetention: acknowledgeRetention,
        adheresToCodeOfConduct: agreeCode,
        applicantName,
        authorisedSignatoryName: signatoryName,
        designation,
        date: selectedDate.toISOString(),
        digitalSignatureFileId:
          signatureDocumentId ||
          extractIdFromPath(existingSignaturePath),
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
    } catch (err) {
      toast.error("Failed to save declaration & consent. Please try again.");
    } finally {
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  return (
    <>
      <Card className="bg-[#353535] border-none rounded-xl w-full">
        <CardContent className="space-y-6">
          <h2 className="text-[28px] md:text-[30px] font-gilory font-bold text-[#C6A95F]">
            Section 4 – Declaration of Agreement for Consent and Data
            Acknowledgment
          </h2>

          {/* Checkboxes */}
          <div className="space-y-4">
            <ServiceCheckbox
              label="I consent to the processing, storage, and use of my data by DBRG for compliance and governance purposes in accordance with applicable laws"
              checked={consentData}
              onChange={() => setConsentData(!consentData)}
            />

            <ServiceCheckbox
              label="I acknowledge that my data will be retained for at least 5 years or more as per applicable laws (DFSA requires 6 years) after the termination of membership, as per regulatory obligations."
              checked={acknowledgeRetention}
              onChange={() =>
                setAcknowledgeRetention(!acknowledgeRetention)
              }
            />
          </div>

          <h3 className="text-[24px] text-[#C6A95F] font-gilory font-bold mt-6">
            Declaration of Adherence to DBRG Code of Conduct
          </h3>

          <ServiceCheckbox
            label="I hereby confirm that we have read, understood, and agree to adhere to the DBRG Code of Conduct. I acknowledge that non-compliance may lead to suspension or termination of membership."
            checked={agreeCode}
            onChange={() => setAgreeCode(!agreeCode)}
          />

          {/* Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
            <div className="text-white">
              <label className="text-sm">Name of the Applicant</label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="mt-2 h-[42px] bg-white text-black"
              />
            </div>

            <div className="text-white">
              <label className="text-sm">
                Name of Authorised Signatory
              </label>
              <Input
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                className="mt-2 h-[42px] bg-white text-black"
              />
            </div>

            <div className="text-white">
              <label className="text-sm">Designation</label>
              <Input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                className="mt-2 h-[42px] bg-white text-black"
              />
            </div>

            {/* Signature */}
            <div className="text-white">
              <label className="text-sm">Signature</label>

              <div className="mt-2 h-9 bg-white rounded-md flex items-center px-3">
                {signatureURL ? (
                  <img
                    src={signatureURL}
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
                onClick={() => setOpenSigPad(true)}
                className="bg-black text-white text-xs px-3 py-2 rounded-md mt-1"
              >
                Upload Digital Signature
              </Button>

              {/* ✅ ANCHOR TAG ADDED */}
              {existingSignaturePath && !signatureURL && (
                <a
                  href={existingSignaturePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mt-2 text-[#C6A95F] underline text-sm"
                >
                  View previously uploaded signature
                </a>
              )}
            </div>
          </div>

          {/* Date */}
          <div className="w-full md:w-1/4 pt-4">
            <label className="text-sm text-white">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button className="w-full mt-2 h-[42px] bg-white text-black justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate
                    ? format(selectedDate, "dd/MM/yyyy")
                    : "DD/MM/YYYY"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0 bg-white">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(d) =>
                    setSelectedDate(d ?? undefined)
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex gap-4">
            <Button
              onClick={() => setCurrentStep(3)}
              className="w-[132px] h-[42px] border border-white text-white"
            >
              Back
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="site_btn"
              className="w-[180px] h-[42px]"
            >
              {isSaving ? "Saving..." : "Submit Application"}
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
