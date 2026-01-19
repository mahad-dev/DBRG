import { useState } from 'react';
import apiClient from '@/services/apiClient';
import { toast } from 'react-toastify';

export function useDocumentDownload() {
  const [downloadingId, setDownloadingId] = useState<number | null>(null);

  const extractIdFromPath = (path: string | null | undefined): number | null => {
    if (!path) return null;
    const match = path.match(/\/(\d+)_/);
    return match ? parseInt(match[1], 10) : null;
  };

  const downloadDocument = async (documentId: number | null, fileName: string) => {
    if (!documentId) {
      toast.error("Document ID not available");
      return;
    }

    try {
      setDownloadingId(documentId);
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
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Document downloaded successfully");
    } catch (error: any) {
      console.error("Error downloading document:", error);
      toast.error(error?.message || "Failed to download document");
    } finally {
      setDownloadingId(null);
    }
  };

  return { downloadDocument, downloadingId, extractIdFromPath };
}
