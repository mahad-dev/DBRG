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

export default function ResourceCard({ title, type, date, img, documentPaths, link }: ResourceCardProps) {
  const handleDownload = () => {
    if (documentPaths && documentPaths.length > 0) {
      // Download the first document
      const fileUrl = documentPaths[0];
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileUrl.split('/').pop() || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Download started');
    } else {
      toast.error('No document available to download');
    }
  };

  const handleView = () => {
    if (link) {
      window.open(link, '_blank');
    } else if (documentPaths && documentPaths.length > 0) {
      window.open(documentPaths[0], '_blank');
    } else {
      toast.error('No document available to view');
    }
  };
  return (
    <div className="resource-card w-full">
      <Card className="bg-[#FFFFFF26] rounded-2xl overflow-hidden shadow-lg shadow-black/40 hover:scale-[1.02] transition-all duration-300 h-full">
        <CardContent className="p-4 flex flex-col gap-4 h-full">

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
            <Button
              onClick={handleDownload}
              className="cursor-pointer bg-[#C6A95F] text-black font-medium text-xs px-4 py-2 rounded-lg hover:bg-[#b8964f]"
            >
              Download
            </Button>

            <Button
              onClick={handleView}
              className="cursor-pointer bg-white text-black font-medium text-xs px-4 py-2 rounded-lg hover:bg-gray-200"
            >
              View
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
