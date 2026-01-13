"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  title: string;
  type: string;
  date: string;
  img: string;
}

export default function ResourceCard({ title, type, date, img }: ResourceCardProps) {
  return (
    <div className="resource-card flex-none min-w-[340px] max-w-[360px]">
      <Card className="bg-[#FFFFFF26] rounded-2xl overflow-hidden shadow-lg shadow-black/40 hover:scale-[1.02] transition-all duration-300">
        <CardContent className="p-4 flex flex-col gap-4">

          {/* Image */}
          <div className="w-full h-[150px] md:h-[170px] bg-[#FFFFFF22] rounded-xl overflow-hidden">
            <img src={img} alt={title} className="w-full h-full object-cover" />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1">
            <p className="text-[15px] md:text-[16px] font-semibold text-white line-clamp-1">
              {title}
            </p>

            <p className="text-xs text-gray-400">{type}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between mt-2">
            <Button className="cursor-pointer bg-[#C6A95F] text-black font-medium text-xs px-4 py-2 rounded-lg">
              Download
            </Button>

            <Button className="cursor-pointer bg-white text-black font-medium text-xs px-4 py-2 rounded-lg">
              View
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
