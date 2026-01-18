"use client";

import { useRef, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { userApi, type User } from "@/services/userApi";
import UploadBox from "@/components/custom/ui/UploadBox";

interface ReplaceDelegateModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

export default function ReplaceDelegateModal({
  open,
  onClose,
  user,
  onSuccess,
}: ReplaceDelegateModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [initialValues, setInitialValues] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && user.userId) {
      const fetchDelegateData = async () => {
        try {
          const response = await userApi.getCompanyDelegate(user.userId);
          if (response.status && response.data) {
            // Assuming response.data is a string that needs to be parsed or directly used
            // Based on the API spec, response.data is a string, but we need to parse it
            // For now, assuming it's a JSON string or directly the data
            let delegateData;
            if (typeof response.data === 'string') {
              try {
                delegateData = JSON.parse(response.data);
              } catch {
                // If not JSON, treat as plain string, but we need structured data
                // For this task, assuming the data is structured
                delegateData = { name: "", phoneNumber: "", email: "" };
              }
            } else {
              delegateData = response.data;
            }
            setInitialValues({
              name: delegateData.name || "",
              phoneNumber: delegateData.phoneNumber || "",
              email: delegateData.email || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch delegate data:", error);
          // Reset to empty if fetch fails
          setInitialValues({ name: "", phoneNumber: "", email: "" });
        }
      };
      fetchDelegateData();
    }
  }, [open, user.userId]);

  const handleSubmit = async (
    values: { name: string; phoneNumber: string; email: string },
    { setSubmitting, resetForm }: any
  ) => {
    setApiError(null);

    if (!file) {
      setApiError("Delegate document is required");
      setSubmitting(false);
      return;
    }

    try {
      const documentId = await userApi.uploadDocument(file);

      await userApi.replaceCompanyDelegate({
        userid: user.userId,
        name: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        delegateDocuments: [documentId],
      });

      resetForm();
      setFile(null);
      onSuccess?.();
      onClose();
    } catch (err) {
      setApiError(
        err instanceof Error ? err.message : "Failed to replace delegate"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[650px] rounded-[20px] border border-[#C6A95F] bg-black p-8 text-white">
        <DialogHeader>
          <DialogTitle className="text-[28px] font-gilory font-semibold text-[#C6A95F]">
            Replace Company Delegate
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm">Name</label>
                <Field
                  as={Input}
                  name="name"
                  placeholder="Naved"
                  className="h-12 rounded-[10px] bg-white text-black"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="mt-1 text-xs text-red-400"
                />
              </div>

              {/* Phone + Email */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm">Phone Number</label>
                  <Field
                    as={Input}
                    name="phoneNumber"
                    placeholder="+91-987-654-3210"
                    className="h-12 rounded-[10px] bg-white text-black"
                  />
                  <ErrorMessage
                    name="phoneNumber"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm">Email</label>
                  <Field
                    as={Input}
                    name="email"
                    placeholder="xyz@gmail.com"
                    className="h-12 rounded-[10px] bg-white text-black"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-xs text-red-400"
                  />
                </div>
              </div>

              {/* Upload */}
              <div>
                <label className="block text-sm">
                  Upload Delegate’s Documents
                </label>

                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setFile(e.target.files[0]);
                      setApiError(null);
                    }
                  }}
                />

                <div className="flex items-center gap-4">
                  <UploadBox
                    file={file}
                    onClick={() => fileInputRef.current?.click()}
                    onRemove={() => setFile(null)} onDrop={function (_e: React.DragEvent): void {
                      throw new Error("Function not implemented.");
                    } }                  />

               
                </div>
              </div>

              {/* API Error */}
              {apiError && (
                <div className="rounded-lg border border-red-500/50 bg-red-500/10 p-3">
                  <p className="text-sm text-red-400">{apiError}</p>
                </div>
              )}

              {/* Save */}
              <div className="flex justify-start pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant={"site_btn"}
                  className="cursor-pointer disabled:cursor-not-allowed h-12 rounded-[10px] px-12"
                >
                  {isSubmitting ? "Saving Changes..." : "Save Changes"}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
