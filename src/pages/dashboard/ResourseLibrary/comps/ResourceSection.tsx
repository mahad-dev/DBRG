"use client";

import ResourceCard from "./ResourceCard";

interface ResourceSectionProps {
  title: string;
  items: {
    id: number;
    title: string;
    type: string;
    date: string;
    img: string;
    documentPaths?: string[];
    link?: string;
  }[];
  enableScroll?: boolean;
}

export default function ResourceSection({ title, items, enableScroll = false }: ResourceSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-[#C6A95F]">
          {title}
        </h2>
      </div>

      {/* GRID WITH VERTICAL SCROLL */}
      <div
        className={enableScroll ? "overflow-y-auto overflow-x-hidden pr-2 pb-4" : "overflow-y-visible overflow-x-hidden pr-2 pb-4"}
        style={enableScroll ? {
          scrollbarWidth: 'thin',
          scrollbarColor: '#C6A95F #1A1A1A',
          maxHeight: 'calc(50vh - 80px)'
        } : {}}
      >
        {items.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-white/70">No items available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr">
            {items.map((item) => (
              <div key={item.id} className="min-h-80">
                <ResourceCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
