"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUploadDetails } from "@/context/UploadDetailsContext";
import { useStep2CompanyDetails } from "@/hooks/useStep2CompanyDetails";
import { MemberApplicationSection } from "@/types/uploadDetails";
import { toast } from "react-toastify";

interface StepProps {
  onNext?: () => void;
}

export default function Step2CompanyDetails({
  onNext,
}: StepProps): React.JSX.Element {
  const { state, dispatch, saveUploadDetails, setCurrentStep } =
    useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  // Use the hook with prefill data
  const { form, setField } = useStep2CompanyDetails(formData, 2);

  const handleSave = async () => {
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      await saveUploadDetails(
        {
          membershipType: formData.membershipType,
          companyDetails: {
            legalEntityName: form.legalEntityName,
            registeredOfficeAddress: form.registeredOfficeAddress,
            primaryContactName: form.primaryContactName,
            website: form.website,
            officialEmail: form.officialEmail,
            phoneNumber: form.phoneNumber,
          },
        },
        MemberApplicationSection.CompanyDetails
      );

      toast.success("Company details saved successfully!");
      setCurrentStep(3);
      onNext?.();
      dispatch({ type: "SET_SAVING", payload: false });
    } catch (error) {
      toast.error("Failed to save company details. Please try again.");
      dispatch({ type: "SET_SAVING", payload: false });
    }
  };

  return (
    <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg text-white">
      <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
        Section 2 - Company Details
      </h2>

      {/* -------------------------------------- */}
      {/* Row: Legal Entity Name + Entity Type */}
      {/* -------------------------------------- */}
      <div className="mt-3">
        <Label>Legal Entity Name</Label>
        <Input
          type="text"
          value={form.legalEntityName}
          onChange={(e) => setField("legalEntityName", e.target.value)}
          className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
          placeholder="Legal Entity Name"
        />
      </div>

      {/* -------------------------------------- */}
      {/* Row: Trade License No + Licensing Authority */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div>
          <Label>Registered Office Address in UAE</Label>
          <Input
            type="text"
            value={form.registeredOfficeAddress}
            onChange={(e) =>
              setField("registeredOfficeAddress", e.target.value)
            }
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Registered Office Address in UAE"
          />
        </div>

        <div>
          <Label>Primary Contact – Name</Label>
          <Input
            type="text"
            value={form.primaryContactName}
            onChange={(e) => setField("primaryContactName", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Primary Contact – Name"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Website + Email + Phone */}
      {/* -------------------------------------- */}
      <div className="grid md:grid-cols-3 gap-6 mt-6">
        <div>
          <Label>Website</Label>
          <Input
            type="text"
            value={form.website}
            onChange={(e) => setField("website", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Website"
          />
        </div>

        <div>
          <Label>Email (Official)</Label>
          <Input
            type="text"
            value={form.officialEmail}
            onChange={(e) => setField("officialEmail", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Email"
          />
        </div>

        <div>
          <Label>Phone Number</Label>
          <Input
            type="text"
            value={form.phoneNumber}
            onChange={(e) => setField("phoneNumber", e.target.value)}
            className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
            placeholder="Phone Number"
          />
        </div>
      </div>

      {/* -------------------------------------- */}
      {/* Navigation Buttons */}
      {/* -------------------------------------- */}
      <div className="mt-10 flex justify-start gap-4">
        <Button
          onClick={() => setCurrentStep(1)}
          className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
        >
          Back
        </Button>

        <Button
          onClick={handleSave}
          disabled={isSaving}
          variant="site_btn"
          className="w-[132px] h-[42px] rounded-[10px] text-white"
        >
          {isSaving ? "Saving..." : "Save / Next"}
        </Button>
      </div>
    </div>
  );
}
