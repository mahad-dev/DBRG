"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { parseApiError } from "@/utils/errorHandler";

import { useState } from "react";

interface SpecialConsiderationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (message: string) => Promise<void>;
  onCloseWithoutSubmit?: () => void;
}

export default function SpecialConsiderationDialog({
  open,
  onOpenChange,
  onSubmit,
  onCloseWithoutSubmit,
}: SpecialConsiderationDialogProps) {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (message.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        if (onSubmit) await onSubmit(message);
        setHasSubmitted(true);
        onOpenChange(false);
      } catch (error: any) {
        toast.error(parseApiError(error, "Failed to submit special consideration request"));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      if (!hasSubmitted && onCloseWithoutSubmit) onCloseWithoutSubmit();
      setHasSubmitted(false);
      setMessage("");
    }
    onOpenChange(open);
  };
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="
          max-w-xl
          bg-black
          text-white
          border border-white/20
          rounded-2xl
          p-6
        "
        showCloseButton={true}
      >
        <DialogHeader className="space-y-3">
          {/* Red Warning Text */}
          <p className="text-red-500 text-sm leading-relaxed">
            Unfortunately, you do not meet the Membership criteria.
            You may consider applying for a Special Consideration.
            Our team will review your request.
          </p>

          {/* Gold Title */}
          <DialogTitle className="text-[#C6A95F] text-xl font-semibold">
            Want to Apply for Special Consideration?
          </DialogTitle>
        </DialogHeader>

        {/* Label */}
        <div className="mt-4">
          <label className="text-sm font-medium mb-2 block">
            write application
          </label>

          {/* Textarea */}
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="
              min-h-[160px]
              bg-white
              text-black
              rounded-xl
              resize-none
              placeholder:text-gray-500
            "
            placeholder="Let us know why you would be a great addition to the DBRG family..."
          />
        </div>

        {/* Footer Button */}
        <div className="mt-6 flex gap-3">
          <DialogClose asChild>
            <Button
              variant="outline"
              className="
                bg-transparent
                text-white
                border-white
                hover:bg-white/10
                px-8
                h-11
                rounded-xl
                font-medium
              "
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="
              bg-[#C6A95F]
              text-black
              hover:bg-[#b89a4f]
              px-8
              h-11
              rounded-xl
              font-medium
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
