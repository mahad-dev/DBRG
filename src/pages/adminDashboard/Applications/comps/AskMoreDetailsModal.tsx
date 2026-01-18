import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { cn } from "@/lib/utils";

interface AskMoreDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (details: string) => void;
  userName?: string;
  companyName?: string;
  status?: string;
  applicationDate?: string;
  country?: string;
}

const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
  <p className="text-white text-xs">
    {label} : <span className="font-medium">{value || "—"}</span>
  </p>
);

export default function AskMoreDetailsModal({
  open,
  onOpenChange,
  onConfirm,
  userName,
  companyName,
  status,
  applicationDate,
  country,
}: AskMoreDetailsModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    const textarea = document.querySelector('textarea[placeholder="Please provide additional information..."]') as HTMLTextAreaElement;
    const details = textarea?.value || '';
    if (details.trim()) {
      setIsLoading(true);
      try {
        await onConfirm(details);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter">
        {/* Header */}
        <DialogHeader className="flex-row justify-between items-center w-full mb-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10 rounded-full!">
              <AvatarImage className="rounded-full" src="/static/UserImg.png" alt="User Avatar" />
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
          </div>
        </DialogHeader>

        {/* Country */}
        <div className="mb-4 border-none">
          <p className="text-sm mb-1">Country</p>
          <div
            className={cn(
              "w-40 h-8 rounded-lg px-2 py-1 text-sm flex items-center",
              "bg-[#787878] border"
            )}
          >
            {country}
          </div>
        </div>

        {/* Ask More Details */}
        <div className="mb-4">
          <label className="text-sm mb-2 block">Ask for More Details</label>
          <div className="flex gap-3">
            <textarea
              placeholder="Please provide additional information..."
              disabled={isLoading}
              className={cn(
                "w-full min-h-[100px] rounded-lg border border-white px-3 py-2 text-xs text-white placeholder:text-white/60",
                "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
            <Button
              className="self-start mt-16 cursor-pointer"
              onClick={handleSubmit}
              variant="site_btn"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
