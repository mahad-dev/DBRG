import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { memberDirectoryApi } from "@/services/memberDirectoryApi";
import { toast } from "react-toastify";

interface ContactMemberModalProps {
  memberId: string;
  memberName: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ContactMemberModal({
  memberId,
  memberName,
  isOpen,
  onOpenChange,
}: ContactMemberModalProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    try {
      setLoading(true);
      await memberDirectoryApi.contactMember({
        receiverMemberId: memberId,
        message: message.trim(),
      });
      toast.success("Message sent successfully!");
      setMessage("");
      onOpenChange(false);
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1a1a1a] border-[#C6A95F] text-white">
        <DialogHeader>
          <DialogTitle className="text-[#C6A95F]">Contact {memberName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Enter your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="bg-[#FFFFFF26] border-none text-white placeholder:text-white/70"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#C6A95F] text-black"
            >
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
