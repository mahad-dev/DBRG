"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import YesNoGroup from "@/components/custom/ui/YesNoGroup";
import UploadBox from "@/components/custom/ui/UploadBox";
import { useStep4FinancialThresholds } from "@/hooks/useStep4FinancialThresholds";
import { useUploadDetails } from '@/context/UploadDetailsContext';
import { MemberApplicationSection } from '@/types/uploadDetails';
import { toast } from 'react-toastify';
import { Formik, Form } from 'formik';
import { principalMemberStep4Schema } from '@/validation';
import { extractDocumentIdFromPath } from '@/validation/utils/fileValidation';

export default function Step4FinancialThresholds() {
  const { state, uploadDocument, saveUploadDetails, setCurrentStep, dispatch } = useUploadDetails();
  const formData = state.data;
  const isSaving = state.isSaving;
  const [pendingUploads, setPendingUploads] = useState<number>(0);


  const {
    paidUpCapital,
    annualTurnover,
    bullionTurnover,
    bullionTurnoverProofFileIdPath,
    netWorth,
    netWorthProofPath,
    bullionFile,
    netWorthFile,
    bullionRef,
    netWorthRef,
    setPaidUpCapital,
    setAnnualTurnover,
    setBullionTurnover,
    setNetWorth,
    setBullionFile,
    setNetWorthFile,
    removeBullionFile,
    removeNetWorthFile,
    bullionTurnoverDocumentId,
    netWorthDocumentId,
    setBullionTurnoverDocumentId,
    setNetWorthDocumentId,
  } = useStep4FinancialThresholds();

  // Upload file immediately when selected
  const handleFileUpload = async (
    file: File | null,
    setFile: (f: File | null) => void,
    setDocumentId: (id: number | null) => void,
    setFieldValue: any,
    fieldName: string
  ) => {
    setFile(file);
    setFieldValue(fieldName, file);
    setFieldValue(`${fieldName}Touched`, true);

    if (file) {
      setPendingUploads(prev => prev + 1);
      try {
        const documentId = await uploadDocument(file);
        setDocumentId(documentId);
        setFieldValue(`${fieldName}Id`, documentId);
        toast.success('File uploaded successfully!');
      } catch (error) {
        toast.error('File upload failed');
        setFile(null);
        setFieldValue(fieldName, null);
      } finally {
        setPendingUploads(prev => prev - 1);
      }
    }
  };

  const handleSubmit = async (_values: any, _helpers: any) => {
    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Use stored document IDs or extract from existing paths
      const bullionFileId =
        bullionTurnoverDocumentId ??
        extractDocumentIdFromPath(bullionTurnoverProofFileIdPath);

      const netWorthFileId =
        netWorthDocumentId ??
        extractDocumentIdFromPath(netWorthProofPath);

      // Save form data
      const parsedPaidUpCapital = paidUpCapital ? parseFloat(paidUpCapital) : null;
      const parsedAnnualTurnover = annualTurnover ? parseFloat(annualTurnover) : null;

      const financialThresholds: any = {
        hasRequiredBullionTurnover: bullionTurnover || false,
        bullionTurnoverProofFileId: bullionFileId,
        hasRequiredNetWorth: netWorth || false,
        netWorthProofFileId: netWorthFileId,
      };

      if (parsedPaidUpCapital !== null) {
        financialThresholds.paidUpCapital = parsedPaidUpCapital;
      }

      if (parsedAnnualTurnover !== null) {
        financialThresholds.annualTurnoverValue = parsedAnnualTurnover;
      }

      await saveUploadDetails({
        membershipType: formData.application.membershipType,
        financialThreshold: financialThresholds,
      }, MemberApplicationSection.FinancialThreshold);

      toast.success('Financial thresholds saved successfully!');
      setCurrentStep(5);
    } catch (error) {
      toast.error('Failed to save financial thresholds. Please try again.');
    } finally {
      dispatch({ type: 'SET_SAVING', payload: false });
    }
  };

  // Formik initial values
  const initialValues = {
    paidUpCapital: paidUpCapital,
    annualTurnover: annualTurnover,
    bullionTurnover: bullionTurnover,
    bullionTurnoverFile: bullionFile,
    bullionTurnoverFilePath: bullionTurnoverProofFileIdPath,
    bullionTurnoverFileId: bullionTurnoverDocumentId,
    netWorth: netWorth,
    netWorthFile: netWorthFile,
    netWorthFilePath: netWorthProofPath,
    netWorthFileId: netWorthDocumentId,
  };

  // Debug: Log initial values
  console.log('🚀 Step4FinancialThresholds rendering with initialValues:', {
    paidUpCapital,
    annualTurnover,
    bullionTurnover,
    bullionFile,
    bullionTurnoverFilePath: bullionTurnoverProofFileIdPath,
    bullionTurnoverFileId: bullionTurnoverDocumentId,
    netWorth,
    netWorthFile,
    netWorthFilePath: netWorthProofPath,
    netWorthFileId: netWorthDocumentId,
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={principalMemberStep4Schema}
      onSubmit={handleSubmit}
      validateOnChange={false}
      validateOnBlur={true}
      validateOnMount={false}
      enableReinitialize={true}
    >
      {({ errors, touched, setFieldValue, setFieldTouched, submitForm, values }) => {
        console.log('🎯 Formik render props:', {
          'values.bullionTurnover': values.bullionTurnover,
          'values.bullionTurnoverFile': values.bullionTurnoverFile,
          'values.bullionTurnoverFilePath': values.bullionTurnoverFilePath,
          'values.netWorth': values.netWorth,
          'values.netWorthFile': values.netWorthFile,
          'values.netWorthFilePath': values.netWorthFilePath,
          'errors': errors,
          'touched': touched,
        });

        return (
        <Form>
          <div className="w-full min-h-screen bg-[#353535] rounded-lg p-6 md:p-8 shadow-lg">
            {/* Heading */}
            <h2 className="text-[30px] sm:text-[26px] font-bold text-[#C6A95F] font-gilroy">
              Section 4 - Financial Thresholds
            </h2>

            {/* 1 & 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full">
              {/* Paid Up Capital */}
              <div className="flex flex-col w-full">
                <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
                  1. Paid Up Capital: <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={paidUpCapital}
                  onChange={(e) => {
                    setPaidUpCapital(e.target.value);
                    setFieldValue('paidUpCapital', parseFloat(e.target.value) || '');
                    setFieldTouched('paidUpCapital', true);
                  }}
                  onBlur={() => setFieldTouched('paidUpCapital', true)}
                  placeholder="Enter paid up capital"
                  className="mt-3 bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 border-white w-full h-[47px] rounded-[10px]"
                />
                {touched.paidUpCapital && errors.paidUpCapital && (
                  <p className="text-red-500 text-sm mt-2">{errors.paidUpCapital as string}</p>
                )}
              </div>

              {/* Annual Turnover */}
              <div className="flex flex-col w-full">
                <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
                  2. Annual Turnover (In Values): <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={annualTurnover}
                  onChange={(e) => {
                    setAnnualTurnover(e.target.value);
                    setFieldValue('annualTurnover', parseFloat(e.target.value) || '');
                    setFieldTouched('annualTurnover', true);
                  }}
                  onBlur={() => setFieldTouched('annualTurnover', true)}
                  placeholder="Enter annual turnover"
                  className="mt-3 border-white bg-white text-black font-inter font-medium text-[18px] placeholder:text-black/50 w-full h-[47px] rounded-[10px]"
                />
                {touched.annualTurnover && errors.annualTurnover && (
                  <p className="text-red-500 text-sm mt-2">{errors.annualTurnover as string}</p>
                )}
              </div>
            </div>

            {/* 3 - Bullion Turnover */}
            <div className="mt-10">
              <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
                3. Annual bullion turnover (In Tonnes) ≥ 50 tons (or ≥ 100 tons
                silver) <span className="text-red-500">*</span>
              </Label>

              <div className="mt-4">
                <YesNoGroup
                  value={bullionTurnover}
                  onChange={(v) => {
                    setBullionTurnover(v);
                    setFieldValue('bullionTurnover', v);
                    setFieldTouched('bullionTurnover', true);
                  }}
                />
              </div>
              {touched.bullionTurnover && errors.bullionTurnover && (
                <p className="text-red-500 text-sm mt-2">{errors.bullionTurnover as string}</p>
              )}

              {/* Upload */}
              <div className="mt-6 w-full">
                <div className="text-white font-gilroy mb-2">
                  Upload: Statement of confirmation for Annual Bullion Turnover {bullionTurnover === true && <span className="text-red-500">*</span>}
                </div>

                <input
                  ref={bullionRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] ?? null;
                    await handleFileUpload(
                      file,
                      setBullionFile,
                      setBullionTurnoverDocumentId,
                      setFieldValue,
                      'bullionTurnoverFile'
                    );
                  }}
                />

                <UploadBox
                  title="Statement of confirmation for Annual Bullion Turnover"
                  file={bullionFile}
                  prefilledUrl={bullionTurnoverProofFileIdPath}
                  onClick={() => bullionRef.current?.click()}
                  onDrop={async (e) => {
                    const file = e.dataTransfer?.files?.[0] ?? null;
                    await handleFileUpload(
                      file,
                      setBullionFile,
                      setBullionTurnoverDocumentId,
                      setFieldValue,
                      'bullionTurnoverFile'
                    );
                  }}
                  id="bullion-upload"
                  onRemove={() => {
                    removeBullionFile();
                    setBullionTurnoverDocumentId(null);
                    setFieldValue('bullionTurnoverFile', null);
                    setFieldValue('bullionTurnoverFileId', null);
                  }}
                />
                {bullionTurnoverProofFileIdPath && !bullionFile && (
                  <a
                    href={bullionTurnoverProofFileIdPath}
                    target="_blank"
                    className="mt-2 inline-block text-[#C6A95F] underline"
                  >
                    View Previous Document
                  </a>
                )}
                {touched.bullionTurnoverFile && errors.bullionTurnoverFile && (
                  <p className="text-red-500 text-sm mt-2">{errors.bullionTurnoverFile as string}</p>
                )}
              </div>
            </div>

            {/* 4 - Net Worth */}
            <div className="mt-10">
              <Label className="text-white font-gilroy text-[18px] sm:text-[20px]">
                4. Net worth ≥ USD 15 million <span className="text-red-500">*</span>
              </Label>

              <div className="mt-4">
                <YesNoGroup
                  value={netWorth}
                  onChange={(v) => {
                    setNetWorth(v);
                    setFieldValue('netWorth', v);
                    setFieldTouched('netWorth', true);
                  }}
                />
              </div>
              {touched.netWorth && errors.netWorth && (
                <p className="text-red-500 text-sm mt-2">{errors.netWorth as string}</p>
              )}

              {/* Upload Proof */}
              <div className="mt-6 flex flex-col md:flex-row gap-4 w-full">
                <input
                  ref={netWorthRef}
                  type="file"
                  className="hidden"
                  accept="application/pdf,image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0] ?? null;
                    await handleFileUpload(
                      file,
                      setNetWorthFile,
                      setNetWorthDocumentId,
                      setFieldValue,
                      'netWorthFile'
                    );
                  }}
                />

                {/* Upload Box */}
                <div className="flex-1">
                  <Label className="text-white font-gilroy text-[16px] mb-2 block">
                    If yes, Upload Proof {netWorth === true && <span className="text-red-500">*</span>}
                  </Label>
                  <UploadBox
                    title="Net Worth Proof"
                    file={netWorthFile}
                    prefilledUrl={netWorthProofPath}
                    onClick={() => netWorthRef.current?.click()}
                    onDrop={async (e) => {
                      const file = e.dataTransfer?.files?.[0] ?? null;
                      await handleFileUpload(
                        file,
                        setNetWorthFile,
                        setNetWorthDocumentId,
                        setFieldValue,
                        'netWorthFile'
                      );
                    }}
                    id="networth-upload"
                    onRemove={() => {
                      removeNetWorthFile();
                      setNetWorthDocumentId(null);
                      setFieldValue('netWorthFile', null);
                      setFieldValue('netWorthFileId', null);
                    }}
                  />
                  {netWorthProofPath && !netWorthFile && (
                    <a
                      href={netWorthProofPath}
                      target="_blank"
                      className="mt-2 inline-block text-[#C6A95F] underline"
                    >
                      View Previous Document
                    </a>
                  )}
                  {touched.netWorthFile && errors.netWorthFile && (
                    <p className="text-red-500 text-sm mt-2">{errors.netWorthFile as string}</p>
                  )}
                </div>

                {/* Download Template */}
                <Button
                  type="button"
                  variant="site_btn"
                  className="w-full md:w-[220px] h-[42px] rounded-[10px] text-[18px] bg-[#C6A95F] text-black font-gilroySemiBold"
                >
                  Download Template
                </Button>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="w-[132px] cursor-pointer h-[42px] rounded-[10px] border border-white text-white"
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={submitForm}
                disabled={isSaving || pendingUploads > 0}
                variant="site_btn"
                className="w-full sm:w-[132px] h-[42px] rounded-[10px] font-gilroySemiBold"
              >
                {pendingUploads > 0 ? 'Uploading...' : isSaving ? 'Saving...' : 'Save / Next'}
              </Button>
            </div>

          </div>
        </Form>
        );
      }}
    </Formik>
  );
}
