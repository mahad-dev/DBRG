"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {UploadBox} from "@/components/custom/ui/UploadBox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { createCms, updateCms, getCmsById } from "@/services/cmsApi";
import { userApi } from "@/services/userApi";
import type { CmsItem } from "@/types/cms";
import { getCategoryEnum } from "@/types/cms";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface EditAndAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editItemId?: number | null;
  onSuccess?: () => void;
}

// Validation schema
const validationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must not exceed 200 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  category: Yup.string()
    .required("Category is required")
    .oneOf(["News", "Event", "Resource"], "Invalid category"),
  date: Yup.date()
    .required("Date is required")
    .typeError("Invalid date"),
  link: Yup.string()
    .url("Link must be a valid URL (e.g., https://example.com)")
    .nullable(),
  venue: Yup.string()
    .max(200, "Venue must not exceed 200 characters")
    .nullable(),
});

export default function EditAndAddModal({
  open,
  onOpenChange,
  editItemId = null,
  onSuccess,
}: EditAndAddModalProps) {
  const [files, setFiles] = useState<File[]>([]); // New files to upload
  const [existingDocuments, setExistingDocuments] = useState<{ id: number; path: string; name: string }[]>([]); // Existing documents from API
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [editItem, setEditItem] = useState<CmsItem | null>(null);

  // Formik form
  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      category: "News",
      date: new Date(),
      link: "",
      venue: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  // Fetch item data when editing
  useEffect(() => {
    const fetchEditItem = async () => {
      if (editItemId && open) {
        try {
          setFetchingData(true);
          const response = await getCmsById(editItemId);

          if (response.status && response.data) {
            const item = response.data;
            setEditItem(item);

            // Populate formik values
            formik.setValues({
              title: item.title,
              description: item.description,
              category: item.category === 1 ? "News" : item.category === 2 ? "Event" : "Resource",
              date: new Date(item.date),
              link: item.link || "",
              venue: "",
            });

            // Populate existing documents
            if (item.documentIds && item.documentPaths && item.documentIds.length > 0 && item.documentIds[0] !== 0) {
              const docs = item.documentIds.map((id, index) => {
                const path = item.documentPaths?.[index] || "";
                const fileName = path.split('/').pop()?.split('?')[0] || `Document ${index + 1}`;
                // Extract filename after ID prefix (e.g., "245_cvv.pdf" -> "cvv.pdf")
                const cleanName = fileName.includes('_') ? fileName.substring(fileName.indexOf('_') + 1) : fileName;
                return { id, path, name: cleanName };
              });
              setExistingDocuments(docs);
            }
          } else {
            toast.error("Failed to load CMS item");
            onOpenChange(false);
          }
        } catch (error: any) {
          console.error("Failed to fetch CMS item:", error);
          toast.error(error.message || "Failed to load CMS item");
          onOpenChange(false);
        } finally {
          setFetchingData(false);
        }
      } else if (!open) {
        // Reset form when modal closes
        setEditItem(null);
        formik.resetForm();
        setFiles([]);
        setExistingDocuments([]);
        setBannerFile(null);
      }
    };

    fetchEditItem();
  }, [editItemId, open]);

  const handleSubmit = async (values: typeof formik.values) => {
    console.log("handleSubmit called"); // Debug log

    try {
      setLoading(true);
      console.log("Starting upload process..."); // Debug log

      // Combine existing document IDs with newly uploaded ones
      let documentIds: number[] = existingDocuments.map(doc => doc.id); // Start with existing docs that weren't removed

      // Upload new files
      if (files.length > 0) {
        console.log(`Uploading ${files.length} new files...`); // Debug log
        for (const file of files) {
          try {
            const documentId = await userApi.uploadDocument(file);
            console.log("Upload response documentId:", documentId); // Debug log
            if (documentId) {
              documentIds.push(documentId);
            }
          } catch (uploadError) {
            console.error("File upload error:", uploadError);
            toast.error(`Failed to upload ${file.name}`);
          }
        }
      }

      // Upload banner if any
      let bannerId = editItem?.bannerId || 0;
      if (bannerFile) {
        console.log("Uploading banner..."); // Debug log
        try {
          const bannerDocumentId = await userApi.uploadDocument(bannerFile);
          console.log("Banner upload response documentId:", bannerDocumentId); // Debug log
          if (bannerDocumentId) {
            bannerId = bannerDocumentId;
          }
        } catch (bannerError) {
          console.error("Banner upload error:", bannerError);
          toast.error("Failed to upload banner");
        }
      }

      const payload = {
        title: values.title,
        description: values.description,
        date: values.date.toISOString(),
        link: values.link || null,
        documentIds: documentIds.length > 0 ? documentIds : [0], // Default to [0] if no documents
        isPublished: false, // Default to draft
        category: getCategoryEnum(values.category),
        bannerId,
      };

      console.log("Payload:", payload); // Debug log

      if (editItem) {
        // Update existing item
        console.log("Updating CMS item..."); // Debug log
        const response = await updateCms({
          id: editItem.id,
          ...payload,
          isPublished: editItem.isPublished, // Preserve publish status
        });
        console.log("Update response:", response); // Debug log
        toast.success("CMS item updated successfully");
      } else {
        // Create new item
        console.log("Creating CMS item..."); // Debug log
        const response = await createCms(payload);
        console.log("Create response:", response); // Debug log
        toast.success("CMS item created successfully");
      }

      onSuccess?.();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to save CMS item:", error);
      toast.error(error.message || "Failed to save CMS item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-0 rounded-lg max-w-lg font-inter h-[90vh] flex flex-col">
        <DialogHeader className="flex-row justify-between items-center w-full px-6 pt-6 pb-2 text-[#C6A95F] text-xl shrink-0">
          {editItemId ? "Edit CMS Item" : "Add New CMS Item"}
        </DialogHeader>

        {fetchingData ? (
          <div className="flex justify-center items-center flex-1">
            <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="px-6 pb-6 overflow-y-auto flex-1 scrollbar-hide">
            {/* Title */}
            <label className="text-sm mb-2 block">Title *</label>
            <textarea
              name="title"
              placeholder="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={cn(
                "w-full h-9 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-black",
                "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
                formik.touched.title && formik.errors.title ? "border-red-500" : "border-white"
              )}
              disabled={loading}
            />
            {formik.touched.title && formik.errors.title && (
              <p className="text-red-400 text-xs mt-1">{formik.errors.title}</p>
            )}

          {/* Description */}
          <label className="text-sm mb-2 mt-4 block">Description *</label>
          <textarea
            name="description"
            placeholder="Add Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={cn(
              "w-full h-20 rounded-lg border px-3 py-2 text-xs text-black bg-white placeholder:text-black",
              "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed",
              formik.touched.description && formik.errors.description ? "border-red-500" : "border-white"
            )}
            disabled={loading}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-red-400 text-xs mt-1">{formik.errors.description}</p>
          )}

          {/* Category Select */}
          <div className="flex gap-10">
            <div>
                <label className="text-sm mb-2 mt-4 block">Date *</label>
      <Popover >
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className={cn(
              "w-45 h-9 justify-between bg-white text-black",
              formik.touched.date && formik.errors.date ? "border-red-500" : ""
            )}
            disabled={loading}
          >
            {formik.values.date ? format(formik.values.date, "PPP") : "Select a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white">
          <Calendar
            mode="single"
            selected={formik.values.date}
            onSelect={(date) => formik.setFieldValue('date', date || new Date())}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {formik.touched.date && formik.errors.date && (
        <p className="text-red-400 text-xs mt-1">{formik.errors.date}</p>
      )}
            </div>
            <div>
                <label className="text-sm mb-2 mt-4 block">Category *</label>
          <Select
            value={formik.values.category}
            onValueChange={(value) => formik.setFieldValue('category', value)}
            disabled={loading}
          >
            <SelectTrigger className={cn(
              "bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5",
              formik.touched.category && formik.errors.category ? "border-red-500" : ""
            )}>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black z-50">
              <SelectItem value="News">News</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Resource">Resource</SelectItem>
            </SelectContent>
          </Select>
          {formik.touched.category && formik.errors.category && (
            <p className="text-red-400 text-xs mt-1">{formik.errors.category}</p>
          )}
            </div>
          </div>

          {/* Conditional Link Input */}
          {formik.values.category === "News" && (
            <div>
              <label className="text-sm mb-2 mt-4 block">Link</label>
              <Input
                name="link"
                type="url"
                placeholder="https://example.com"
                value={formik.values.link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "w-full h-9 rounded-lg border px-3 py-2 text-xs bg-white text-black placeholder:text-black",
                  formik.touched.link && formik.errors.link ? "border-red-500" : "border-white"
                )}
                disabled={loading}
              />
              {formik.touched.link && formik.errors.link && (
                <p className="text-red-400 text-xs mt-1">{formik.errors.link}</p>
              )}
            </div>
          )}

          {formik.values.category === "Event" && (
            <div>
              <div className="flex gap-10 ">
                <div>
                    <label className="text-sm mb-2 mt-4 block">Venue</label>
              <Input
                name="venue"
                type="text"
                placeholder="Venue"
                value={formik.values.venue}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "w-45 h-9 rounded-lg border px-3 py-2 text-xs bg-white text-black placeholder:text-black",
                  formik.touched.venue && formik.errors.venue ? "border-red-500" : "border-white"
                )}
                disabled={loading}
                />
                {formik.touched.venue && formik.errors.venue && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.venue}</p>
                )}
                </div>
                <div>
                    <label className="text-sm mb-2 mt-4 block">Link</label>
              <Input
                name="link"
                type="url"
                placeholder="https://example.com"
                value={formik.values.link}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={cn(
                  "w-45 h-9 rounded-lg border px-3 py-2 text-xs bg-white text-black placeholder:text-black",
                  formik.touched.link && formik.errors.link ? "border-red-500" : "border-white"
                )}
                disabled={loading}
                />
                {formik.touched.link && formik.errors.link && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.link}</p>
                )}
                </div>

              </div>
              <div className="mt-5">
                <label className="mb-5">Guest/ Speakers</label>
                    <Select defaultValue="Guests" disabled={loading}>
            <SelectTrigger className="bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black z-50">
              <SelectItem value="Guests">Guests</SelectItem>
            </SelectContent>
          </Select>
                </div>

            </div>
          )}

              <label className="text-sm mb-2 mt-4 block">Upload Documents (Multiple)</label>

              {/* Display existing documents (from API) */}
              {existingDocuments.length > 0 && (
                <div className="mb-2 space-y-1">
                  <p className="text-xs text-white/60 mb-1">Existing Documents:</p>
                  {existingDocuments.map((doc, index) => (
                    <div key={`existing-${doc.id}`} className="flex items-center justify-between bg-green-500/10 rounded px-3 py-2 border border-green-500/30">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs text-green-300 truncate">{doc.name}</span>
                        <a
                          href={doc.path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 shrink-0"
                        >
                          View
                        </a>
                      </div>
                      <button
                        onClick={() => {
                          if (!loading) {
                            setExistingDocuments(existingDocuments.filter((_, i) => i !== index));
                          }
                        }}
                        className="text-red-400 hover:text-red-300 ml-2"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Display new files to upload */}
              {files.length > 0 && (
                <div className="mb-2 space-y-1">
                  <p className="text-xs text-white/60 mb-1">New Files to Upload:</p>
                  {files.map((file, index) => (
                    <div key={`new-${index}`} className="flex items-center justify-between bg-blue-500/10 rounded px-3 py-2 border border-blue-500/30">
                      <span className="text-xs text-blue-300 truncate">{file.name}</span>
                      <button
                        onClick={() => {
                          if (!loading) {
                            setFiles(files.filter((_, i) => i !== index));
                          }
                        }}
                        className="text-red-400 hover:text-red-300 ml-2"
                        disabled={loading}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add more files button */}
              <Button
                type="button"
                variant="outline"
                className="w-full mb-2 bg-white text-black hover:bg-gray-100"
                disabled={loading}
                onClick={() => {
                  if (loading) return;
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true; // Allow multiple file selection
                  input.onchange = (e) => {
                    const target = e.target as HTMLInputElement;
                    if (target.files) {
                      const newFiles = Array.from(target.files);
                      setFiles([...files, ...newFiles]);
                    }
                  };
                  input.click();
                }}
              >
                {(files.length > 0 || existingDocuments.length > 0) ? '+ Add More Documents' : '+ Upload Documents'}
              </Button>

              <label className="text-sm mb-2 mt-4 block">Upload Banner Image</label>
                <UploadBox
                  file={bannerFile}
                  onClick={() => {
                    if (loading) return;
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'image/*';
                    input.onchange = (e) => {
                      const target = e.target as HTMLInputElement;
                      if (target.files?.[0]) {
                        setBannerFile(target.files[0]);
                      }
                    };
                    input.click();
                  }}
                  onDrop={(e) => {
                    if (loading) return;
                    e.preventDefault();
                    const droppedFile = e.dataTransfer.files[0];
                    if (droppedFile) {
                      setBannerFile(droppedFile);
                    }
                  }}
                  onRemove={() => !loading && setBannerFile(null)}
                />

          {/* Save Button */}
          <Button
            type="submit"
            className="self-start mt-8"
            onClick={(e) => {
              e.preventDefault();
              formik.handleSubmit();
            }}
            variant="site_btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              editItem ? "Update" : "Create"
            )}
          </Button>
          </form>
        )}

        <DialogFooter className="shrink-0" />
      </DialogContent>
    </Dialog>
  );
}
