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
            onClick={() => {
              if (isYes) {
                onChange(true);
              } else if (onNoClick) {
                onNoClick();
              } else {
                onChange(false);
              }
            }}
            className={`cursor-pointer w-[269px] md:w-[269px] sm:w-full h-[47px] px-4 py-2 rounded-[10px] text-[22px] sm:text-[18px] font-gilroySemiBold leading-[100%] transition border
              ${isActive ? "bg-[#C6A95F] text-black border-none" : "bg-transparent border-white text-white"}`}
          >
            {txt}
          </Button>
        );
      })}
    </div>
  );
};

export default YesNoGroup;
