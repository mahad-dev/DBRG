import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";
import {FileText} from "lucide-react"

interface ApplicationRemarksDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
  companyName?: string;
  status?: string;
  applicationDate?: string;
  approvalDate?: string;
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <p className="text-white text-xs">
    {label} : <span className="font-medium">{value}</span>
  </p>
);

export default function RemarksDialog({
  open,
  onOpenChange,
  onConfirm,
  userName = "Sanjana Shah",
  companyName = "Company Name",
  status = "Pending",
  applicationDate = "09/11/2024",
  approvalDate = "N/A",
}: ApplicationRemarksDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter">
        {/* Header */}
        <DialogHeader className="flex-row justify-between items-center w-full mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage className={"rounded-full!"} src="/static/UserImg.png" alt="User Avatar" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-white text-lg font-bold">{userName}</p>
              <p className="text-white text-sm">{companyName}</p>
            </div>
          </div>

          {/* Application Info */}
          <div className="text-right space-y-1 text-xs">
            <InfoRow label="Status" value={status} />
            <InfoRow label="Date of Application" value={applicationDate} />
            <InfoRow label="Date of Approval/Rejection" value={approvalDate} />
          </div>
        </DialogHeader>

        <div className="flex gap-1">
          <FileText />
          <DialogDescription className="font-medium">Business Proof</DialogDescription>
        </div>

        <div className="flex gap-1">
          <FileText />
          <DialogDescription className="font-medium">Business Proof</DialogDescription>
        </div>

        <div className="flex gap-1">
          <FileText />
          <DialogDescription className="font-medium">I’D Proof</DialogDescription>
        </div>

        <div className="flex gap-1">
          <FileText />
          <DialogDescription className="font-medium">I’D Proof</DialogDescription>
        </div>

        {/* Remarks */}
        <div className="mb-4">
          <label className="text-sm mb-2 block">Remarks</label>
          <div className="flex gap-3">
            <textarea
              placeholder="Add Remarks"
              className={cn(
                "w-full min-h-[100px] rounded-lg border border-white px-3 py-2 text-xs text-white placeholder:text-white",
                "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <Button
              className="self-start mt-16 cursor-pointer"
              onClick={onConfirm}
              variant="site_btn"
            >
              Submit
            </Button>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
