import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DownloadReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ReportField = {
  id: string;
  label: string;
  checked: boolean;
};

export default function DownloadReportModal({
  open,
  onOpenChange,
}: DownloadReportModalProps) {
  const [format, setFormat] = useState<string>("xlsx");
  const [fields, setFields] = useState<ReportField[]>([
    { id: "name", label: "Name", checked: true },
    { id: "forms", label: "Forms", checked: true },
    { id: "email", label: "Email", checked: true },
    { id: "dateOfApplication", label: "Date of application", checked: true },
    { id: "companyName", label: "Company Name", checked: true },
    { id: "dateOfApproval", label: "Date of approval/ Rejection", checked: true },
    { id: "country", label: "Country", checked: true },
    { id: "membershipCategory", label: "Membership Category", checked: true },
    { id: "transactions", label: "Transactions", checked: true },
    { id: "delegateName", label: "Delegate Name", checked: true },
  ]);

  const toggleField = (id: string) => {
    setFields((prev) =>
      prev.map((field) =>
        field.id === id ? { ...field, checked: !field.checked } : field
      )
    );
  };

  const handleDownload = () => {
    const selectedFields = fields.filter((f) => f.checked).map((f) => f.label);
    console.log("Downloading report:", { format, fields: selectedFields });
    // TODO: Implement actual download logic
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 max-w-md w-full">
        <DialogHeader>
          <DialogTitle className="text-[#C6A95F] text-xl font-semibold">
            Download Report
          </DialogTitle>
          <DialogDescription className="text-white/80 -mt-2">
            Select the fields you want to include in the report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Format Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Format</label>
            <Select value={format} onValueChange={setFormat}>
              <SelectTrigger className="bg-transparent border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-white/20">
                <SelectItem value="xlsx" className="text-white hover:bg-white/10">
                  .xlsx
                </SelectItem>
                <SelectItem value="csv" className="text-white hover:bg-white/10">
                  .csv
                </SelectItem>
                <SelectItem value="pdf" className="text-white hover:bg-white/10">
                  PDF
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Fields Checkboxes */}
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {fields.map((field) => (
              <div key={field.id} className="flex items-center space-x-3">
                <Checkbox
                  id={field.id}
                  checked={field.checked}
                  onCheckedChange={() => toggleField(field.id)}
                  className="border-[#C6A95F] data-[state=checked]:bg-[#C6A95F] data-[state=checked]:text-black"
                />
                <label
                  htmlFor={field.id}
                  className="text-sm text-white cursor-pointer"
                >
                  {field.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        <DialogFooter className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDownload}
            variant="site_btn"
            className="flex-1"
          >
            Download Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
