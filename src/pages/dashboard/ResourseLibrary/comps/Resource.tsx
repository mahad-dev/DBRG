"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import ResourceSection from "./ResourceSection";

export default function ResourceLibrary() {
  const [search, setSearch] = useState("");

  const resources = Array.from({ length: 3}).map(() => ({
    title: "Title ( Company Upcoming PDF )",
    type: "PDF",
    date: "09/07/2025",
    img: "/static/resourseImg.jpg",
  }));

  const filtered = resources.filter((r) =>
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 px-4 sm:px-6 lg:px-12 py-6">

      {/* Header */}
      <h1 className="text-[28px] md:text-[36px] font-semibold text-[#C6A95F]">
        Resource Library
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-full sm:w-[340px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search"
            className="h-14 bg-[#1A1A1A] border border-[#2A2A2A] text-white pl-12 rounded-xl"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white" />
        </div>

        <Button className="h-14 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl flex items-center gap-2 px-6">
          <SlidersHorizontal /> Filter
        </Button>
      </div>

      {/* Sections */}
      <ResourceSection title="Resources" items={filtered} />
      <ResourceSection title="New Members" items={filtered} />
    </div>
  );
}
