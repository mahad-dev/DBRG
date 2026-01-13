import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface ApproveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (comment: string) => void;
}

export default function ApprovedDialog({ open, onOpenChange, onConfirm }: ApproveDialogProps) {
  const [comment, setComment] = useState("");

  const handleConfirm = () => {
    onConfirm(comment);
    setComment("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-[#C6A95F] text-xl font-semibold">
            Confirm Approval
          </DialogTitle>
          <DialogDescription className="text-white/80 -mt-2">
            Are you sure you want to Approve?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Comment (Optional)</label>
            <Textarea
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-transparent mt-2 text-white placeholder:text-white/60 min-h-[80px] resize-none"
            />
          </div>
        </div>
        <DialogFooter className="flex justify-center gap-4 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1 cursor-pointer">
            Cancel
          </Button>
          <Button onClick={handleConfirm} variant={"site_btn"} className="flex-1 cursor-pointer">
            Approve
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
