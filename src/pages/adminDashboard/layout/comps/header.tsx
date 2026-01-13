"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Menu } from "lucide-react";

interface HeaderProps {
  setMobileOpen: (open: boolean) => void;
}

export default function Header({ setMobileOpen }: HeaderProps) {
  const name = localStorage.getItem("name");
  return (
    <header className="w-full lg:border md:border-white rounded-xl lg:px-4 lg:py-1.5 flex items-center justify-between">
      {/* LEFT: HAMBURGER (MOBILE ONLY) */}
      <button
        onClick={() => setMobileOpen(true)}
        className="lg:hidden text-white cursor-pointer"
        aria-label="Open sidebar"
      >
        <Menu size={32} color="#C6A95F" />
      </button>

      {/* SEARCH BAR — only on desktop */}
      <div className="hidden lg:flex items-center bg-[#FFFFFF26] px-3 py-1 rounded-lg w-[300px]">
        <Input
          placeholder="Search"
          className="bg-transparent border-0 focus-visible:ring-0 text-white placeholder-white text-[14px]"
        />
        <Search size={16} className="text-white -ml-6" />
      </div>
      <div className="flex items-center gap-2 lg:hidden">
        <img src="/DBRG-logo.svg" alt="DBRG" className="w-[42px] h-[47px]" />

        <span className="font-gilroy font-bold text-[23px] leading-[150%] tracking-[-0.03em] align-middle text-[#C6A95F]">
          DBRG
        </span>
      </div>
      {/* PROFILE SECTION */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-white">
          <AvatarImage src="/static/UserImg.png" alt="User Avatar" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>

        <div className="hidden lg:block text-left">
          <p className="text-[#757575] text-[18px] font-semibold">
            {name}
          </p>
          <p className="text-[#B3B3B3] text-[16px]">Director</p>
        </div>
      </div>
    </header>
  );
}
