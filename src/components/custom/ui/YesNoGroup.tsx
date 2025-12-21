"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface YesNoGroupProps {
  value: boolean | null;
  onChange: (v: boolean) => void;
  className?: string;
  onNoClick?: () => void;
}

export const YesNoGroup: React.FC<YesNoGroupProps> = ({ value, onChange, className, onNoClick }) => {
  return (
    <div className={`flex gap-4 ${className ?? ""} flex-wrap`}>
      {["Yes", "No"].map((txt) => {
        const isYes = txt === "Yes";
        const isActive = value === isYes;
        return (
          <Button
            key={txt}
            variant="site_btn"
            onClick={() => {
              onChange(isYes);
              if (!isYes && onNoClick) {
                onNoClick();
              }
            }}
            className={`w-[269px] md:w-[269px] sm:w-full h-[47px] px-4 py-2 rounded-[10px] text-[22px] sm:text-[18px] font-gilroySemiBold leading-[100%] transition
              ${isActive ? "bg-[#C6A95F] text-black border-none" : "bg-transparent border border-white text-white"}`}
          >
            {txt}
          </Button>
        );
      })}
    </div>
  );
};

export default YesNoGroup;
