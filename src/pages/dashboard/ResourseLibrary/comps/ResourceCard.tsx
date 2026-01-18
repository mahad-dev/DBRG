"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";

interface ResourceCardProps {
  title: string;
  type: string;
  date: string;
  img: string;
  documentPaths?: string[];
  link?: string;
}

export default function ResourceCard({
  title,
  type,
  date,
  img,
  documentPaths,
  link,
}: ResourceCardProps) {

  const handleDownload = () => {
    if (documentPaths?.length) {
      const fileUrl = documentPaths[0];
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileUrl.split("/").pop() || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Download started");
    } else {
      toast.error("No document available to download");
    }
  };

  const handleView = () => {
    if (link) window.open(link, "_blank");
    else if (documentPaths?.length) window.open(documentPaths[0], "_blank");
    else toast.error("No document available to view");
  };

  return (
    <div className="resource-card w-full h-full">
      <Card className="h-[360px] bg-[#FFFFFF26] rounded-2xl overflow-hidden shadow-lg shadow-black/40  transition-all duration-300">
        <CardContent className="p-4 flex flex-col h-full gap-4">

          {/* Image */}
          <div className="w-full h-[150px] bg-[#FFFFFF22] rounded-xl overflow-hidden shrink-0">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-1">
            <p className="text-[15px] font-semibold text-white line-clamp-1">
              {title}
            </p>

            <p className="text-xs text-gray-400 line-clamp-1">
              {type}
            </p>

            <p className="text-xs text-gray-400">
              {date}
            </p>
          </div>

          {/* Buttons (Always Bottom) */}
          <div className="flex items-center justify-between mt-auto">
            <Button
              onClick={handleDownload}
              className="bg-[#C6A95F] cursor-pointer text-black text-xs px-4 py-2 rounded-lg hover:bg-[#b8964f]"
            >
              Download
            </Button>

            <Button
              onClick={handleView}
              className="bg-white cursor-pointer text-black text-xs px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              View
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

