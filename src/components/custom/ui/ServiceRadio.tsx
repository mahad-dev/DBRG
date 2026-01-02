"use client";

import React from "react";

interface ServiceRadioProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  id?: string;
  name?: string;
}

export const ServiceRadio: React.FC<ServiceRadioProps> = ({
  label,
  checked,
  onChange,
  id,
}) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange();
        }
      }}
    >
      <div
        onClick={onChange}
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0
          ${checked ? "bg-[#C6A95F] border-[#C6A95F]" : "bg-transparent border-white"}`}
        aria-hidden="true"
      >
        {checked && (
          <div className="w-2 h-2 rounded-full bg-black"></div>
        )}
      </div>
      <span className="text-[22px] md:text-[22px] sm:text-[18px] font-gilroySemiBold text-white leading-[100%]">
        {label}
      </span>
    </label>
  );
};

export default ServiceRadio;
