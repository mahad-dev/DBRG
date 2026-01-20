import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";
import { parseApiError } from "@/utils/errorHandler";
import { useAuth } from "@/context/AuthContext";

interface SubmitMoreDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  askMoreDetailsRequest: string;
  onSuccess: () => void;
  onCancel?: () => void;
  allowCancel?: boolean;
}

export default function SubmitMoreDetailsModal({
  open,
  onOpenChange,
  askMoreDetailsRequest,
  onSuccess,
  onCancel,
  allowCancel = false,
}: SubmitMoreDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [details, setDetails] = useState("");
  const { application, updateApplication } = useAuth();

  console.log('🔍 SubmitMoreDetailsModal rendered with allowCancel:', allowCancel);

  const handleSubmit = async () => {
    if (!details.trim()) return;

    setIsLoading(true);
    try {
      await apiClient.post("/UploadDetails/SubmitMoreDetails", {
        moreDetails: details,
      });

      // Update the application object with the response
      if (application) {
        const updatedApplication = {
          ...application,
          askMoreDetailsResponse: details,
        };
        updateApplication(updatedApplication);
      }

      toast.success("Details submitted successfully");
      onSuccess();
      setDetails("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Submit More Details Error:", error);
      toast.error(parseApiError(error, "Failed to submit details"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setDetails("");
    if (onCancel) {
      onCancel();
    } else {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      // If cancel is allowed, let modal close
      if (allowCancel) {
        if (!open) {
          handleCancel();
        }
        return;
      }
      // Otherwise prevent closing - user must submit
      if (!open) return;
      onOpenChange(open);
    }}>
      <DialogContent
        className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter"
        onPointerDownOutside={(e) => {
          if (!allowCancel) e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          if (!allowCancel) e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#C6A95F] mb-4">
            Additional Information Required
          </DialogTitle>
        </DialogHeader>

        {/* Admin's Request */}
        <div className="mb-4">
          <label className="text-sm mb-2 block font-semibold">Admin's Request:</label>
          <div
            className={cn(
              "w-full min-h-[80px] rounded-lg px-3 py-2 text-sm flex items-start",
              "bg-[#787878] border overflow-auto"
            )}
          >
            {askMoreDetailsRequest}
          </div>
        </div>

        {/* Response Input */}
        <div className="mb-4">
          <label className="text-sm mb-2 block font-semibold">Your Response:</label>
          <textarea
            placeholder="Please provide the requested information..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            disabled={isLoading}
            className={cn(
              "w-full min-h-[120px] rounded-lg border border-white px-3 py-2 text-sm text-white placeholder:text-white/60 bg-transparent",
              "outline-none transition-all duration-200 focus:border-[#C6A95F] focus:ring-1 focus:ring-[#C6A95F] resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />
        </div>

        <DialogFooter className="flex flex-row gap-3 justify-end items-center">
          {allowCancel && (
            <Button
              type="button"
              variant="site_btn_transparent"
              onClick={handleCancel}
              disabled={isLoading}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          )}
          <Button
            type="button"
            variant="site_btn"
            onClick={handleSubmit}
            disabled={isLoading || !details.trim()}
            className="cursor-pointer"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
