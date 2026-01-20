"use client";

import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useUploadDetails } from "@/context/UploadDetailsContext";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { Loader2, X, Download, FileText } from "lucide-react";
import { toast } from "react-toastify";

interface MultiUploadBoxProps {
  title?: string;
  label?: string;
  documentIds: number[];
  prefilledPaths?: string[];
  onUploadComplete: (documentIds: number[], paths: string[]) => void;
  onRemove: (index: number) => void;
  maxFiles?: number;
  disabled?: boolean;
  error?: string;
  id?: string;
}

// Helper function to extract filename from S3 URL
const getFilenameFromUrl = (url: string): string => {
  try {
    const urlWithoutQuery = url.split('?')[0];
    const parts = urlWithoutQuery.split('/');
    let filename = parts[parts.length - 1];
    filename = decodeURIComponent(filename);
    filename = filename.replace(/^\d+_/, '');
    return filename || 'Document';
  } catch {
    return 'Document';
  }
};

// Helper function to check if URL is an image
const isImageUrl = (url: string): boolean => {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
  return imageExtensions.some(ext => url.toLowerCase().includes(ext));
};

// DocumentCard Sub-component
interface DocumentCardProps {
  documentId: number;
  path?: string;
  onRemove: () => void;
  index: number;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ documentId, path, onRemove, index }) => {
  const { downloadDocument, downloadingId, extractIdFromPath } = useDocumentDownload();
  const fileName = path ? getFilenameFromUrl(path) : `Document ${index + 1}`;
  const extractedId = path ? extractIdFromPath(path) : documentId;
  const isImage = path ? isImageUrl(path) : false;
  const isDownloading = downloadingId === extractedId;

  const handleDownload = () => {
    if (extractedId) {
      downloadDocument(extractedId, fileName);
    }
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
      {/* File Icon or Image Preview */}
      <div className="flex-shrink-0">
        {isImage && path ? (
          <img
            src={path}
            alt={fileName}
            className="w-12 h-12 object-cover rounded"
          />
        ) : (
          <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
            <FileText className="w-6 h-6 text-[#C6A95F]" />
          </div>
        )}
      </div>

      {/* File Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{fileName}</p>
        <p className="text-white/50 text-xs">
          {path ? 'Previously uploaded' : 'Just uploaded'}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {path && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onClick={handleDownload}
            disabled={isDownloading}
            className="h-8 w-8 p-0 hover:bg-white/10 text-white"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onRemove}
          className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-400"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export const MultiUploadBox: React.FC<MultiUploadBoxProps> = ({
  title,
  label,
  documentIds,
  prefilledPaths = [],
  onUploadComplete,
  onRemove,
  maxFiles = 5,
  disabled = false,
  error,
  id,
}) => {
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadDocument } = useUploadDetails();

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = maxFiles - documentIds.length;
    if (remainingSlots <= 0) {
      toast.error(`Maximum ${maxFiles} documents allowed`);
      return;
    }

    const filesToUpload = Array.from(files).slice(0, remainingSlots);

    setUploading(true);
    const uploadedIds: number[] = [];
    let failedCount = 0;

    for (const file of filesToUpload) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`File ${file.name} has invalid type. Only PDF and images are allowed.`);
        failedCount++;
        continue;
      }

      // Validate file size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        failedCount++;
        continue;
      }

      try {
        const docId = await uploadDocument(file);
        uploadedIds.push(docId);
      } catch (error) {
        console.error('Upload failed:', error);
        toast.error(`Failed to upload ${file.name}`);
        failedCount++;
      }
    }

    setUploading(false);

    if (uploadedIds.length > 0) {
      onUploadComplete([...documentIds, ...uploadedIds], [...prefilledPaths]);
      toast.success(`Successfully uploaded ${uploadedIds.length} document(s)`);
    }

    if (failedCount > 0) {
      toast.warning(`${failedCount} file(s) failed to upload`);
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleUploadClick = () => {
    if (!disabled && !uploading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {title && (
        <div className="text-[20px] sm:text-[22px] font-gilroySemiBold text-white mb-2">
          {title}
        </div>
      )}

      {label && (
        <label className="text-white text-base font-medium mb-2 block">
          {label}
        </label>
      )}

      {/* Documents List */}
      {documentIds.length > 0 && (
        <div className="space-y-2 mb-4">
          {documentIds.map((docId, index) => (
            <DocumentCard
              key={`${docId}-${index}`}
              documentId={docId}
              path={prefilledPaths[index]}
              onRemove={() => onRemove(index)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Upload Area - Show if slots available */}
      {documentIds.length < maxFiles && (
        <div className="mt-4">
          {/* Drag & Drop Area */}
          <div
            id={id}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleUploadClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") handleUploadClick();
            }}
            className={`
              w-full
              max-w-[280px] sm:max-w-[230px] md:max-w-[180px]
              bg-white
              p-4 rounded-[10px]
              flex flex-col items-center justify-center
              cursor-pointer select-none
              border-2 border-dashed text-black
              transition-all
              ${isDragging ? "border-[#C6A95F] bg-white/95" : "border-black hover:bg-gray-100"}
              ${disabled || uploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#C6A95F]" />
                <p className="text-sm text-center">Uploading...</p>
              </div>
            ) : (
              <>
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  stroke="black"
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6" />
                  <path d="M12 11v6" />
                  <path d="M9 14h6" />
                </svg>

                <p className="text-[18px] sm:text-[20px] text-center mt-1 leading-tight">
                  Drag & Drop
                  <br /> or Select Files
                </p>
              </>
            )}
          </div>

          {/* Upload Button */}
          <div className="mt-3">
            <Button
              type="button"
              onClick={handleUploadClick}
              disabled={disabled || uploading}
              className="cursor-pointer w-full sm:w-[163px] h-11 bg-black text-white rounded-[10px] text-[18px] border border-white/20 hover:bg-[#111]"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </span>
              ) : (
                `Add Document${documentIds.length > 0 ? 's' : ''}`
              )}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif,.webp"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || uploading}
          />
        </div>
      )}

      {/* File Count Indicator */}
      <p className="text-sm text-white/50 mt-2">
        {documentIds.length} of {maxFiles} document(s) uploaded
        {documentIds.length >= maxFiles && " (Maximum reached)"}
      </p>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-sm mt-2">{error}</p>
      )}
    </div>
  );
};

export default MultiUploadBox;
