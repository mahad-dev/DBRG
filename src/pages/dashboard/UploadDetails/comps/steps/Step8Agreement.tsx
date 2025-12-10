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

interface StepProps {
  onNext?: () => void;
  onBack?: () => void;
}

export default function Step8Agreement({ onNext, onBack }: StepProps) {
  const sigPadRef = useRef<SignaturePad>(null);
  const [signatureURL, setSignatureURL] = useState("");
  const [openSigPad, setOpenSigPad] = useState(false);

  // Checkbox states
  const [consentData, setConsentData] = useState(false);
  const [acknowledgeRetention, setAcknowledgeRetention] = useState(false);
  const [agreeCode, setAgreeCode] = useState(false);

  // Inputs
  const [applicantName, setApplicantName] = useState("");
  const [signatoryName, setSignatoryName] = useState("");
  const [designation, setDesignation] = useState("");
  const [date, setDate] = useState("");

  // Signature functions
  const saveSignature = () => {
    if (sigPadRef.current) {
      const dataURL = sigPadRef.current.getCanvas().toDataURL("image/png");
      setSignatureURL(dataURL);
      setOpenSigPad(false);
    }
  };

  const clearSignature = () => sigPadRef.current?.clear();

  return (
    <>
      <Card className="bg-[#353535] border-none rounded-xl w-full">
        <CardContent className="space-y-6">
          {/* Heading */}
          <h2 className="text-[28px] md:text-[30px] font-gilory font-bold leading-tight text-[#C6A95F]">
            Section 8 – Declaration of Agreement for Consent and Data
            Acknowledgment
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

          {/* Subheading */}
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
              <label className="text-sm font-gilory font-normal">
                Name of the Applicant
              </label>
              <Input
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                placeholder="Name of the Applicant"
                className="bg-white text-black rounded-md"
              />
            </div>

            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">
                Name of Authorised Signatory
              </label>
              <Input
                value={signatoryName}
                onChange={(e) => setSignatoryName(e.target.value)}
                placeholder="Name of Authorised Signatory"
                className="bg-white text-black rounded-md"
              />
            </div>

            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">
                Designation
              </label>
              <Input
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
                placeholder="Designation"
                className="bg-white text-black rounded-md"
              />
            </div>

            {/* Signature */}
            <div className="space-y-1 text-white">
              <label className="text-sm font-gilory font-normal">
                Signature
              </label>
              <div className="relative w-full bg-white rounded-md h-9 flex items-center justify-center">
                {signatureURL ? (
                  <img
                    src={signatureURL}
                    alt="Signature"
                    className="h-full object-contain py-1"
                  />
                ) : (
                  <span className="text-gray-500 text-sm">
                    No signature uploaded
                  </span>
                )}
              </div>
              <Button
                onClick={() => setOpenSigPad(true)}
                className="bg-black text-white text-xs p-3 rounded-md mt-1"
              >
                Upload Digital Signature
              </Button>
            </div>
          </div>

          {/* Date */}
          <div className="w-full md:w-1/4 pt-4">
            <label className="text-sm font-gilory font-normal text-white">
              Date
            </label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="DD/MM/YYYY"
              className="bg-white text-black rounded-md"
            />
          </div>

          {/* Buttons */}
          <div className="mt-10 flex justify-start gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                className="w-[132px] h-[42px] rounded-[10px] border border-white text-white font-gilorySemiBold"
              >
                Back
              </Button>
            )}
            {onNext && (
              <Button
                onClick={onNext}
                variant="site_btn"
                className="w-[132px] h-[42px] rounded-[10px] text-white font-gilorySemiBold"
              >
                Save / Next
              </Button>
            )}
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
