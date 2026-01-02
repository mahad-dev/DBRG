"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { QrCode } from "lucide-react";

/* ================= PROPS ================= */

interface GenerateInvoiceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
  companyName?: string;
  status?: string;
  applicationDate?: string;
  approvalDate?: string;
}

/* ================= COMPONENT ================= */

export default function GenerateInvoiceModal({
  open,
  onOpenChange,
  onConfirm,
}: GenerateInvoiceProps) {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter">
        {/* ===== HEADER ===== */}
        <DialogHeader className="flex-row justify-between items-center w-full mb-1 text-[#C6A95F] text-2xl">
          Generate Invoice
        </DialogHeader>

        <div className="mb-4">
          {/* ===== COMPANY & INVOICE ===== */}
          <div className="flex gap-5">
            <div>
              <label className="text-sm mb-2 block">
                Company/ Memebers Name
              </label>
              <textarea
                placeholder="Company/ Memebers Name"
                className={cn(
                  "w-60 h-9 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
                  "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            <div>
              <label className="text-sm mb-2 block">Invoice No.</label>
              <textarea
                placeholder="#01233"
                className={cn(
                  "w-40 h-9 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
                  "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>
          </div>

          {/* ===== VAT ===== */}
          <div className="mt-2">
            <label className="text-sm mb-2 block">VAT Number</label>
            <textarea
              placeholder="Enter VAT"
              className={cn(
                "w-40 h-9 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
                "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              )}
            />
          </div>

          {/* ===== DATES ===== */}
          <div className="flex gap-10">
            <div>
              <label className="text-sm mb-2 mt-4 block">Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-45 h-9 justify-between bg-white text-black"
                  >
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm mb-2 mt-4 block">Due Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-45 h-9 justify-between bg-white text-black"
                  >
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-white">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* ===== PAYMENT DETAILS ===== */}
          <div className="flex gap-10">
            <div>
              <label className="text-sm mb-2 mt-4 block">Amount</label>
              <textarea
                placeholder="Amount"
                className={cn(
                  "w-46 h-9 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
                  "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              />
            </div>

            <div>
              <label className="text-sm mb-2 mt-4 block">
                Payment Status
              </label>
              <Select defaultValue="Pending">
                <SelectTrigger className="bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
                  <SelectValue placeholder="Payment Status" />
                </SelectTrigger>
                <SelectContent className="w-full bg-white text-black z-50">
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* ===== PAYMENT INSTRUCTIONS ===== */}
          <div>
            <label className="text-sm mb-2 mt-4 block">
              Payment Instructions / QR Code
            </label>
            <QrCode className="w-10 h-10 text-white" />
          </div>

          {/* ===== ACTION ===== */}
          <div>
            <Button
              className="self-start mt-10"
              onClick={onConfirm}
              variant="site_btn"
            >
              Send Invoice
            </Button>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}

