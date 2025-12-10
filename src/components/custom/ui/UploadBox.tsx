"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface UploadBoxProps {
  title?: string;
  file: File | null;
  onClick: () => void;
  onDrop: (e: React.DragEvent) => void;
  id?: string;
  onRemove?: () => void;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  title,
  file,
  onClick,
  onDrop,
  id,
  onRemove,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // preview for images
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => URL.revokeObjectURL(url);
    }
    setPreviewUrl(null);
  }, [file]);

  return (
    <div className="w-full">
      {title && (
        <div className="text-[20px] sm:text-[22px] font-gilroySemiBold text-white mb-2">
          {title}
        </div>
      )}

      {/* WRAPPER – responsive flex/grid */}
      <div className="flex flex-col sm:flex-row sm:items-start md:items-center gap-4 mt-4 w-full">

        {/* Upload Area */}
        <div
          id={id}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            setIsDragging(false);
            onDrop(e);
          }}
          onClick={onClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onClick();
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
          `}
        >
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-[140px] object-cover rounded-[18px]"
            />
          ) : file && !file.type.startsWith("image/") ? (
            <div className="text-[18px] text-center break-words px-1">
              <div>{file.name}</div>
              <div className="text-[13px] text-gray-600">{file.type}</div>
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
                <br /> or Select File
              </p>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col w-full sm:w-auto gap-2">
          <Button
            onClick={onClick}
            className="w-full sm:w-[163px] h-11 bg-black text-white rounded-[10px] text-[18px] border border-white/20 hover:bg-[#111]"
          >
            {file ? "Replace File" : "Upload File"}
          </Button>

          {file && onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="w-full sm:w-[163px] h-9 px-3 rounded-lg border border-white/20 bg-transparent text-white text-[14px] hover:bg-white/5 transition"
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadBox;
