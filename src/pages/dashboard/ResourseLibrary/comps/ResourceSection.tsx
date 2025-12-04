"use client";

import { useRef, useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import ResourceCard from "./ResourceCard";

interface ResourceSectionProps {
  title: string;
  items: {
    title: string;
    type: string;
    date: string;
    img: string;
  }[];
}

export default function ResourceSection({ title, items }: ResourceSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  // ⭐ FIX — Update arrow state correctly
  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;

    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < max - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateArrows(); // initial update

    el.addEventListener("scroll", updateArrows);

    const observer = new ResizeObserver(() => {
      updateArrows();
    });

    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      observer.disconnect();
    };
  }, []);

  // ⭐ FIX — Scroll by width (not full jump)
  const scrollLeft = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: -el.clientWidth * 0.9,
      behavior: "smooth",
    });

    setTimeout(updateArrows, 400);
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: el.clientWidth * 0.9,
      behavior: "smooth",
    });

    setTimeout(updateArrows, 400);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* HEADER */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-[#C6A95F]">
          {title}
        </h2>

        {/* ARROWS */}
        <div className="flex gap-2">
          <button
            onClick={scrollLeft}
            disabled={!canLeft}
            className={`p-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-white
              ${!canLeft ? "opacity-40 cursor-not-allowed" : "hover:bg-[#2A2A2A]"}`}
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={scrollRight}
            disabled={!canRight}
            className={`p-2 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] text-white
              ${!canRight ? "opacity-40 cursor-not-allowed" : "hover:bg-[#2A2A2A]"}`}
          >
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* SCROLL ROW */}
      <div
        ref={scrollRef}
        className="flex flex-nowrap gap-6 overflow-x-auto no-scrollbar scroll-smooth py-3"
      >
        {items.map((item, i) => (
          <div key={i} className="min-w-[280px] flex-none">
            <ResourceCard {...item} />
          </div>
        ))}
      </div>
    </div>
  );
}
