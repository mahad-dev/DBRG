"use client";

import React from "react";

interface ServiceCheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  id?: string;
  transparent?: boolean;
}

export const ServiceCheckbox: React.FC<ServiceCheckboxProps> = ({
  label,
  checked,
  onChange,
  id,
  transparent = false,
}) => {
  return (
    <label
      htmlFor={id}
      className="flex items-center gap-3 cursor-pointer select-none"
      aria-checked={checked}
      role="checkbox"
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
        className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-all shrink-0
          ${checked ? "bg-[#C6A95F] border-none" : transparent ? "bg-transparent border-white" : "bg-white border-none"}`}
        aria-hidden="true"
      >
        {checked && (
          <svg
            className="w-4 h-4 text-black"
            fill="none"
            stroke="currentColor"
            strokeWidth={3}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-[22px] md:text-[22px] sm:text-[18px] font-gilroySemiBold text-white leading-[100%]">
        {label}
      </span>
    </label>
  );
};

export default ServiceCheckbox;
