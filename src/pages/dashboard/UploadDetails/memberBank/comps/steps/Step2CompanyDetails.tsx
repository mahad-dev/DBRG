"use client";

import { useState, useEffect } from "react";
import { Formik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useUploadDetails } from "@/context/UploadDetailsContext";
import { useStep2CompanyDetails } from "@/hooks/useStep2CompanyDetails";
import { memberBankStep2Schema } from "@/validation";
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

  // State for date of incorporation
  const [dateOfIncorporation, setDateOfIncorporation] = useState<Date | undefined>(undefined);

  // Initialize date from form data
  useEffect(() => {
    if (form.dateOfIncorporation) {
      setDateOfIncorporation(new Date(form.dateOfIncorporation));
    }
  }, [form.dateOfIncorporation]);

  const handleSave = async (values: any) => {
    dispatch({ type: "SET_SAVING", payload: true });
    try {
      await saveUploadDetails(
        {
          membershipType: formData.membershipType,
          companyDetails: {
            legalEntityName: values.companyName,
            tradeLicenseNumber: values.registrationNumber,
            dateOfIncorporation: values.dateOfIncorporation,
            countryOfIncorporation: values.countryOfIncorporation,
            registeredOfficeAddress: values.registeredAddress,
            website: values.website,
            officialEmail: values.emailAddress,
            phoneNumber: values.telephoneNumber,
            vatNumber: values.vatNumber,
            taxRegistrationNumber: values.taxRegistrationNumber,
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

  // Formik initial values
  const initialValues = {
    companyName: form.legalEntityName || "",
    tradingName: form.legalEntityName || "",
    registrationNumber: form.tradeLicenseNumber || "",
    dateOfIncorporation: form.dateOfIncorporation || "",
    countryOfIncorporation: form.countryOfIncorporation || "",
    registeredAddress: form.registeredOfficeAddress || "",
    operationalAddress: form.registeredOfficeAddress || "",
    telephoneNumber: form.phoneNumber || "",
    emailAddress: form.officialEmail || "",
    website: form.website || "",
    vatNumber: form.vatNumber || "",
    taxRegistrationNumber: form.taxRegistrationNumber || "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={memberBankStep2Schema}
      onSubmit={handleSave}
      enableReinitialize
    >
      {({ values, errors, touched, setFieldValue, setFieldTouched, submitForm }) => (
        <div className="w-full bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg text-white">
          <h2 className="text-[30px] sm:text-[22px] font-bold text-[#C6A95F]">
            Section 2 - Company Details
          </h2>

          {/* -------------------------------------- */}
          {/* Row: Company Name + Trading Name */}
          {/* -------------------------------------- */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>
                Company Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.companyName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("companyName", value);
                  setField("legalEntityName", value);
                }}
                onBlur={() => setFieldTouched("companyName", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Company Name"
              />
              {touched.companyName && errors.companyName && (
                <p className="text-red-500 text-sm mt-2">{errors.companyName as string}</p>
              )}
            </div>

            <div>
              <Label>
                Trading Name <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.tradingName}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("tradingName", value);
                }}
                onBlur={() => setFieldTouched("tradingName", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Trading Name"
              />
              {touched.tradingName && errors.tradingName && (
                <p className="text-red-500 text-sm mt-2">{errors.tradingName as string}</p>
              )}
            </div>
          </div>

          {/* -------------------------------------- */}
          {/* Row: Registration Number + Date of Incorporation */}
          {/* -------------------------------------- */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>
                Registration Number <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.registrationNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("registrationNumber", value);
                  setField("tradeLicenseNumber", value);
                }}
                onBlur={() => setFieldTouched("registrationNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Registration Number"
              />
              {touched.registrationNumber && errors.registrationNumber && (
                <p className="text-red-500 text-sm mt-2">{errors.registrationNumber as string}</p>
              )}
            </div>

            <div>
              <Label>
                Date of Incorporation <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black justify-start text-left border-gray-300"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateOfIncorporation ? format(dateOfIncorporation, "dd/MM/yyyy") : <span className="text-black/50">DD/MM/YYYY</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={dateOfIncorporation}
                    onSelect={(date) => {
                      setDateOfIncorporation(date);
                      const isoDate = date ? date.toISOString() : "";
                      setFieldValue("dateOfIncorporation", isoDate);
                      setField("dateOfIncorporation", isoDate);
                      setFieldTouched("dateOfIncorporation", true);
                    }}
                    className="bg-white"
                  />
                </PopoverContent>
              </Popover>
              {touched.dateOfIncorporation && errors.dateOfIncorporation && (
                <p className="text-red-500 text-sm mt-2">{errors.dateOfIncorporation as string}</p>
              )}
            </div>
          </div>

          {/* -------------------------------------- */}
          {/* Row: Country of Incorporation + Registered Address */}
          {/* -------------------------------------- */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>
                Country of Incorporation <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.countryOfIncorporation}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("countryOfIncorporation", value);
                  setField("countryOfIncorporation", value);
                }}
                onBlur={() => setFieldTouched("countryOfIncorporation", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Country of Incorporation"
              />
              {touched.countryOfIncorporation && errors.countryOfIncorporation && (
                <p className="text-red-500 text-sm mt-2">{errors.countryOfIncorporation as string}</p>
              )}
            </div>

            <div>
              <Label>
                Registered Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.registeredAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("registeredAddress", value);
                  setField("registeredOfficeAddress", value);
                }}
                onBlur={() => setFieldTouched("registeredAddress", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Registered Address"
              />
              {touched.registeredAddress && errors.registeredAddress && (
                <p className="text-red-500 text-sm mt-2">{errors.registeredAddress as string}</p>
              )}
            </div>
          </div>

          {/* -------------------------------------- */}
          {/* Row: Operational Address */}
          {/* -------------------------------------- */}
          <div className="mt-6">
            <Label>
              Operational Address <span className="text-red-500">*</span>
            </Label>
            <Input
              type="text"
              value={values.operationalAddress}
              onChange={(e) => {
                const value = e.target.value;
                setFieldValue("operationalAddress", value);
              }}
              onBlur={() => setFieldTouched("operationalAddress", true)}
              className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
              placeholder="Operational Address"
            />
            {touched.operationalAddress && errors.operationalAddress && (
              <p className="text-red-500 text-sm mt-2">{errors.operationalAddress as string}</p>
            )}
          </div>

          {/* -------------------------------------- */}
          {/* Contact Details: Phone + Email + Website */}
          {/* -------------------------------------- */}
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div>
              <Label>
                Telephone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.telephoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("telephoneNumber", value);
                  setField("phoneNumber", value);
                }}
                onBlur={() => setFieldTouched("telephoneNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Telephone Number"
              />
              {touched.telephoneNumber && errors.telephoneNumber && (
                <p className="text-red-500 text-sm mt-2">{errors.telephoneNumber as string}</p>
              )}
            </div>

            <div>
              <Label>
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                type="email"
                value={values.emailAddress}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("emailAddress", value);
                  setField("officialEmail", value);
                }}
                onBlur={() => setFieldTouched("emailAddress", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Email Address"
              />
              {touched.emailAddress && errors.emailAddress && (
                <p className="text-red-500 text-sm mt-2">{errors.emailAddress as string}</p>
              )}
            </div>

            <div>
              <Label>
                Website <span className="text-red-500">*</span>
              </Label>
              <Input
                type="text"
                value={values.website}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("website", value);
                  setField("website", value);
                }}
                onBlur={() => setFieldTouched("website", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Website"
              />
              {touched.website && errors.website && (
                <p className="text-red-500 text-sm mt-2">{errors.website as string}</p>
              )}
            </div>
          </div>

          {/* -------------------------------------- */}
          {/* Optional: VAT + Tax Registration Number */}
          {/* -------------------------------------- */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <Label>VAT Number</Label>
              <Input
                type="text"
                value={values.vatNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("vatNumber", value);
                  setField("vatNumber", value);
                }}
                onBlur={() => setFieldTouched("vatNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="VAT Number (Optional)"
              />
              {touched.vatNumber && errors.vatNumber && (
                <p className="text-red-500 text-sm mt-2">{errors.vatNumber as string}</p>
              )}
            </div>

            <div>
              <Label>Tax Registration Number</Label>
              <Input
                type="text"
                value={values.taxRegistrationNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  setFieldValue("taxRegistrationNumber", value);
                  setField("taxRegistrationNumber", value);
                }}
                onBlur={() => setFieldTouched("taxRegistrationNumber", true)}
                className="w-full mt-2 bg-white font-inter font-medium text-[18px] leading-[100%] tracking-normal align-middle h-[42px] text-black placeholder:text-black/50"
                placeholder="Tax Registration Number (Optional)"
              />
              {touched.taxRegistrationNumber && errors.taxRegistrationNumber && (
                <p className="text-red-500 text-sm mt-2">{errors.taxRegistrationNumber as string}</p>
              )}
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
              type="button"
              onClick={() => submitForm()}
              disabled={isSaving}
              variant="site_btn"
              className="w-[132px] h-[42px] rounded-[10px] text-white"
            >
              {isSaving ? "Saving..." : "Save / Next"}
            </Button>
          </div>
        </div>
      )}
    </Formik>
  );
}
