import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userApi, type User } from "@/services/userApi";
import UploadBox from "@/components/custom/ui/UploadBox";

interface ReplaceDelegateModalProps {
  open: boolean;
  onClose: () => void;
  user: User;
  onSuccess?: () => void;
}

export default function ReplaceDelegateModal({
  open,
  onClose,
  user,
  onSuccess,
}: ReplaceDelegateModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleFileRemove = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!formData.phoneNumber.trim()) {
      setError("Phone number is required");
      return;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }
    if (!file) {
      setError("Delegate document is required");
      return;
    }

    try {
      setLoading(true);

      // Step 1: Upload document first
      const documentId = await userApi.uploadDocument(file);

      // Step 2: Replace company delegate
      await userApi.replaceCompanyDelegate({
        userid: user.userId,
        name: formData.name,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        delegateDocuments: [documentId],
      });

      // Reset form
      setFormData({ name: "", phoneNumber: "", email: "" });
      setFile(null);

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }

      // Close modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to replace delegate");
      console.error("Error replacing delegate:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({ name: "", phoneNumber: "", email: "" });
      setFile(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-black border border-[#C6A95F] text-white max-w-[600px] rounded-[20px] p-8">
        <DialogHeader>
          <DialogTitle className="text-[28px] font-semibold text-[#C6A95F] text-center mb-4">
            Replace Company Delegate
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-[16px] font-medium text-white mb-2">
              Name
            </label>
            <Input
              type="text"
              placeholder="Naved"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="h-[48px] bg-transparent border border-white rounded-[10px] text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-[#C6A95F] text-[16px]"
              disabled={loading}
            />
          </div>

          {/* Phone Number and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[16px] font-medium text-white mb-2">
                Phone Number
              </label>
              <Input
                type="tel"
                placeholder="+91-987-654-3210"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="h-[48px] bg-transparent border border-white rounded-[10px] text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-[#C6A95F] text-[16px]"
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-[16px] font-medium text-white mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="xyz@gmail.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="h-[48px] bg-transparent border border-white rounded-[10px] text-white placeholder:text-white/50 focus-visible:ring-1 focus-visible:ring-[#C6A95F] text-[16px]"
                disabled={loading}
              />
            </div>
          </div>

          {/* Upload Delegate's Documents */}
          <div>
            <label className="block text-[16px] font-medium text-white mb-3">
              Upload Delegate's Documents
            </label>

            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />

            <UploadBox
              file={file}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleFileDrop}
              onRemove={handleFileRemove}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Action Button */}
          <div className="flex justify-center pt-2">
            <Button
              type="submit"
              className="bg-[#C6A95F] text-black hover:bg-[#D5B15F] h-[48px] px-12 rounded-[10px] text-[16px] font-medium"
              disabled={loading}
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
