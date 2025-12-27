"use client";
import * as React from "react";
import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import {UploadBox} from "@/components/custom/ui/UploadBox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface EditAndAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  userName?: string;
  companyName?: string;
  status?: string;
  applicationDate?: string;
  approvalDate?: string;
}

export default function EditAndAddModal({
  open,
  onOpenChange,
  onConfirm,
}: EditAndAddModalProps) {
  const [category, setCategory] = useState("News"); 
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-6 rounded-lg max-w-lg font-inter">
        <DialogHeader className="flex-row justify-between items-center w-full mb-1 text-[#C6A95F] text-xl">
          Edit & Add New
        </DialogHeader>

        <div className="mb-4">
          {/* Title */}
          <label className="text-sm mb-2 block">Title</label>
          <textarea
            placeholder="Title"
            className={cn(
              "w-77 h-9 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
              "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />

          {/* Description */}
          <label className="text-sm mb-2 mt-4 block">Description</label>
          <textarea
            placeholder="Add Description"
            className={cn(
              "w-full h-20 rounded-lg border border-white px-3 py-2 text-xs text-black bg-white placeholder:text-black",
              "outline-none transition-all duration-200 focus:border-white focus:ring-1 resize-none disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          />

          {/* Category Select */}
          <div className="flex gap-10">
            <div>
                <label className="text-sm mb-2 mt-4 block">Date</label>
      <Popover >
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-45 h-9 justify-between bg-white text-black">
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
                <label className="text-sm mb-2 mt-4 block">Category</label>
          <Select defaultValue="News" onValueChange={(value) => setCategory(value)}>
            <SelectTrigger className="bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black z-50">
              <SelectItem value="News">News</SelectItem>
              <SelectItem value="Event">Event</SelectItem>
              <SelectItem value="Resource">Resource</SelectItem>
            </SelectContent>
          </Select>
            </div>
          </div>

          {/* Conditional Link Input */}
          {category === "News" && (
            <div>
              <label className="text-sm mb-2 mt-4 block">Link</label>
              <Input
                type="url"
                placeholder="Link"
                className="w-45 h-9 rounded-lg border border-white px-3 py-2 text-xs bg-white text-black placeholder:text-black"
              />
            </div>
          )}

          {category === "Event" && (
            <div>
              <div className="flex gap-10 ">
                <div>
                    <label className="text-sm mb-2 mt-4 block">Venue</label>
              <Input
                type="input"
                placeholder="Venue"
                className="w-45 h-9 rounded-lg border border-white px-3 py-2 text-xs bg-white text-black placeholder:text-black"
                />
                </div>
                <div>
                    <label className="text-sm mb-2 mt-4 block">Link</label>
              <Input
                type="url"
                placeholder="Link"
                className="w-45 h-9 rounded-lg border border-white px-3 py-2 text-xs bg-white text-black placeholder:text-black"
                />
                </div>
                
              </div>
              <div className="mt-5">
                <label className="mb-5">Guest/ Speakers</label>
                    <Select defaultValue="Guests">
            <SelectTrigger className="bg-white text-black rounded-lg w-45 h-9 focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent className="w-full bg-white text-black z-50">
              <SelectItem value="Guests">Guests</SelectItem>
            </SelectContent>
          </Select>
                </div>
               
            </div>
          )}

              <label className="text-sm mb-2 mt-4 block">Upload File</label>
                <UploadBox/>

          {/* Save Button */}
          <div>
            <Button
              className="self-start mt-16"
              onClick={onConfirm}
              variant="site_btn"
            >
              Add or Save
            </Button>
          </div>
        </div>

        <DialogFooter />
      </DialogContent>
    </Dialog>
  );
}
