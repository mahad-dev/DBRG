"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import apiClient from "@/services/apiClient";

interface ResourceCardProps {
  title: string;
  type: string;
  date: string;
  img: string;
  documentPaths?: string[];
  documentIds?: number[];
  link?: string;
}

export default function ResourceCard({
  title,
  type,
  date,
  img,
  documentPaths,
  documentIds,
  link,
}: ResourceCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    // Use documentIds for download via API
    if (documentIds?.length) {
      const documentId = documentIds[0];
      const fileName = documentPaths?.[0]
        ? decodeURIComponent(documentPaths[0].split("/").pop()?.split("?")[0] || "").replace(/^\d+_/, "")
        : title;

      try {
        setIsDownloading(true);
        const response = await apiClient.post(
          `/UploadDetails/DownloadDocument`,
          null,
          {
            params: { documentId },
            responseType: "blob",
          }
        );

        // Get filename from Content-Disposition header if available
        const contentDisposition = response.headers["content-disposition"];
        let downloadFileName = fileName || "document";

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (filenameMatch && filenameMatch[1]) {
            downloadFileName = filenameMatch[1].replace(/['"]/g, '');
          }
        } else {
          const contentType = response.headers["content-type"];
          if (contentType) {
            const mimeToExt: Record<string, string> = {
              "application/pdf": ".pdf",
              "image/png": ".png",
              "image/jpeg": ".jpg",
              "image/jpg": ".jpg",
              "image/gif": ".gif",
              "application/msword": ".doc",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
              "application/vnd.ms-excel": ".xls",
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
            };
            const ext = mimeToExt[contentType] || "";
            if (ext && !downloadFileName.toLowerCase().endsWith(ext)) {
              downloadFileName = `${downloadFileName}${ext}`;
            }
          }
        }

        const blob = new Blob([response.data], { type: response.headers["content-type"] });
        const url = window.URL.createObjectURL(blob);
        const linkEl = document.createElement("a");
        linkEl.href = url;
        linkEl.download = downloadFileName;
        document.body.appendChild(linkEl);
        linkEl.click();
        document.body.removeChild(linkEl);
        window.URL.revokeObjectURL(url);

        toast.success("Document downloaded successfully");
      } catch (error: any) {
        console.error("Error downloading document:", error);
        toast.error(error?.message || "Failed to download document");
      } finally {
        setIsDownloading(false);
      }
    } else {
      toast.error("No document available to download");
    }
  };

  const handleView = () => {
    if (link) window.open(link, "_blank");
    else toast.error("No document available to view");
  };

  return (
    <div className="resource-card w-full h-full">
      <Card className="h-[360px] bg-[#FFFFFF26] rounded-2xl overflow-hidden shadow-lg shadow-black/40  transition-all duration-300">
        <CardContent className="p-4 flex flex-col h-full gap-4">

          {/* Image */}
          <div className="w-full h-[150px] bg-[#FFFFFF22] rounded-xl overflow-hidden shrink-0">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-semibold text-white line-clamp-1">
              {title}
            </p>

            <p className="text-xs text-gray-400 line-clamp-1">
              {type}
            </p>

            <p className="text-xs text-gray-400">
              {date}
            </p>
          </div>

          {/* Buttons (Always Bottom) */}
          <div className="flex items-center justify-between mt-auto">
            <Button
              onClick={handleDownload}
              disabled={isDownloading}
              className="bg-[#C6A95F] cursor-pointer text-black text-xs px-4 py-2 rounded-lg hover:bg-[#b8964f] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                  Downloading...
                </>
              ) : (
                "Download"
              )}
            </Button>

            <Button
              onClick={handleView}
              className="bg-white cursor-pointer text-black text-xs px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              View
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

