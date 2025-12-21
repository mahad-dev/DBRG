"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface SpecialConsiderationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: () => void;
}

export default function SpecialConsiderationDialog({
  open,
  onOpenChange,
  onSubmit,
}: SpecialConsiderationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          max-w-xl 
          bg-black 
          text-white 
          border border-white/20 
          rounded-2xl
          p-6
        "
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
        <div className="mt-6">
          <Button
            onClick={onSubmit}
            className="
              bg-[#C6A95F] 
              text-black 
              hover:bg-[#b89a4f]
              px-8
              h-11
              rounded-xl
              font-medium
            "
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
