import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface RejectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export default function RejectDialog({ open, onOpenChange, onConfirm }: RejectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F]">
        <DialogHeader>
          <DialogTitle className="text-[#C6A95F]">Confirm Reject</DialogTitle>
          <DialogDescription>
            Are you sure you want to Reject?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="cursor-pointer">
            Cancel
          </Button>
          <Button onClick={onConfirm} variant={"site_btn"} className="cursor-pointer">
            Reject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
