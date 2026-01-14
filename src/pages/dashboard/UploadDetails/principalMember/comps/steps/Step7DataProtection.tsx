"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';

export default function Step7DataProtection() {
  const { state, saveUploadDetails, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;

  const handleSave = async () => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Save form data
      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        dataProtectionPrivacy: {
          acknowledge: true
        }
      }, MemberApplicationSection.DataProtectionPrivacy);

      toast.success('Data protection consent saved successfully!');
      setCurrentStep(8);
      dispatch({ type: 'SET_SAVING', payload: false });
    } catch (error: any) {
      toast.error(error?.message || 'Failed to save data protection consent. Please try again.');
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  return (
    <Card className="bg-[#353535] border-none rounded-xl w-full">
      <CardContent className="space-y-8 sm:space-y-6">
        {/* Heading */}
        <h2
          className="
    text-[#C6A95F]
    font-gilroy font-bold
    text-[30px] md:text-[26px] sm:text-[22px]
    leading-[100%]
    tracking-normal
  "
        >
          Section 7 – Data Protection & Privacy
        </h2>

        {/* Subheading */}
        <p
          className="
    font-gilroy font-bold
    text-[22px] md:text-[20px] sm:text-[18px]
    leading-[1.2]
    tracking-normal
    max-w-3xl
  "
        >
          DBRG complies with UAE Federal Decree Law No. 45 of 2021 (PDPL) and,
          where applicable, the EU GDPR.
        </p>

        {/* Description */}
        <p
          className="
    font-gilroy font-normal
    text-[22px] md:text-[20px] sm:text-[18px]
    leading-[100%]
    tracking-normal
  "
        >
          By completing this form, the Applicant consents to the collection,
          storage, processing, transfer, and retention of personal data for
          compliance and governance purposes.
        </p>

        {/* Bullet List */}
        <ul
          className="
    font-gilroy font-normal
    text-[20px] md:text-[18px] sm:text-[16px]
    leading-[100%]
    tracking-normal
    space-y-4
  "
        >
          <li className="flex items-start">
            <span className="mr-2">•</span>
            Data will be kept for at least 5 years (or 6 years under DFSA rules)
            and then securely deleted.
          </li>

          <li className="flex items-start">
            <span className="mr-2">•</span>
            Data may be shared with regulators, auditors, or accreditation
            bodies including outside the UAE.
          </li>

          <li className="flex items-start">
            <span className="mr-2">•</span>
            Individuals may request access, correction, or deletion of their
            personal data.
          </li>

          <li className="flex items-start">
            <span className="mr-2">•</span>A Data Protection Officer (DPO) is
            appointed to monitor compliance & handle requests.
          </li>
        </ul>

        {/* Buttons */}
        <div className="mt-10 flex justify-start gap-4">
                  <Button
                    onClick={() => setCurrentStep(6)}
                    className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
                  >
                    Back
                  </Button>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            variant="site_btn"
            className="w-[132px] h-[42px] rounded-[10px] text-white font-gilroySemiBold cursor-pointer disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save / Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
