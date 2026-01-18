"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getCmsById } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { CategoryLabels, CmsCategory } from "@/types/cms";
import { Loader2, X, Download, ExternalLink, Users } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface ViewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId: number | null;
  onEdit?: (item: CmsItem) => void;
}

export default function ViewModal({
  open,
  onOpenChange,
  itemId,
  onEdit,
}: ViewModalProps) {
  const [item, setItem] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (open && itemId) {
      fetchCmsItem();
    }
  }, [open, itemId]);

  const fetchCmsItem = async () => {
    if (!itemId) return;

    try {
      setLoading(true);
      const response = await getCmsById(itemId);

      if (response.status && response.data) {
        setItem(response.data);
      } else {
        toast.error("Failed to load CMS item");
        onOpenChange(false);
      }
    } catch (error: any) {
      console.error("Failed to fetch CMS item:", error);
      toast.error(error.message || "Failed to load CMS item");
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    if (item && onEdit) {
      onEdit(item);
      onOpenChange(false);
    }
  };

  const handleViewRegistrations = () => {
    if (item) {
      onOpenChange(false);
      navigate(`/admin/dashboard/cms/event-registrations/${item.id}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-black text-white border-[#C6A95F] p-0 rounded-lg max-w-3xl font-inter max-h-[90vh] flex flex-col [&>button]:hidden">
        <DialogHeader className="flex flex-row justify-between items-center w-full px-6 pt-6 pb-2 border-b border-white/10 shrink-0">
          <h2 className="text-[#C6A95F] text-2xl font-semibold">View CMS Item</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </Button>
        </DialogHeader>

        <div className="px-6 pb-6 overflow-y-auto flex-1">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
            </div>
          ) : item ? (
            <div className="space-y-6 py-4">
              {/* Status Badge */}
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm font-medium px-3 py-1.5 rounded-full ${
                    item.isPublished
                      ? "bg-green-500/20 text-green-300"
                      : "bg-yellow-500/20 text-yellow-300"
                  }`}
                >
                  {item.isPublished ? "Published" : "Draft"}
                </span>
                <span className="text-[#C6A95F] font-medium">
                  {CategoryLabels[item.category]}
                </span>
              </div>

              {/* Title */}
              <div>
                <label className="text-sm text-white/60 block mb-2">Title</label>
                <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-white/60 block mb-2">Description</label>
                <p className="text-base text-white/90 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>
              </div>

              {/* Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-white/60 block mb-2">Date</label>
                  <p className="text-base text-white">
                    {new Date(item.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-white/60 block mb-2">Time</label>
                  <p className="text-base text-white">
                    {new Date(item.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Link */}
              {item.link && (
                <div>
                  <label className="text-sm text-white/60 block mb-2">Link</label>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C6A95F] hover:underline inline-flex items-center gap-2"
                  >
                    {item.link}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}

              {/* Banner Image */}
              {item.bannerPath && (
                <div>
                  <label className="text-sm text-white/60 block mb-2">Banner Image</label>
                  <div className="w-full h-64 rounded-lg overflow-hidden bg-white/5">
                    <img
                      src={item.bannerPath}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {/* Documents */}
              {item.documentIds && item.documentIds.length > 0 && item.documentIds[0] !== 0 && (
                <div>
                  <label className="text-sm text-white/60 block mb-2">
                    Attached Documents ({item.documentIds.length})
                  </label>
                  <div className="space-y-2">
                    {item.documentPaths && item.documentPaths.length > 0 ? (
                      item.documentPaths.map((path, index) => (
                        <a
                          key={index}
                          href={path}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                        >
                          <Download className="w-4 h-4 text-[#C6A95F]" />
                          <span className="text-white/90">Document {index + 1}</span>
                          <ExternalLink className="w-4 h-4 text-white/60 ml-auto" />
                        </a>
                      ))
                    ) : (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-white/60 text-sm">
                          {item.documentIds.length} document(s) attached
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="pt-4 border-t border-white/10">
                <label className="text-sm text-white/60 block mb-2">Additional Information</label>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-white/60">Item ID:</span>
                    <span className="text-white ml-2">{item.id}</span>
                  </div>
                  <div>
                    <span className="text-white/60">Banner ID:</span>
                    <span className="text-white ml-2">{item.bannerId || "N/A"}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                {item.category === CmsCategory.Event && (
                  <Button
                    onClick={handleViewRegistrations}
                    variant="outline"
                    className="flex-1 border-[#C6A95F] text-[#C6A95F] hover:bg-[#C6A95F]/10"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    View Event Registrations
                  </Button>
                )}
                {onEdit && (
                  <Button
                    onClick={handleEdit}
                    variant="site_btn"
                    className="flex-1"
                  >
                    Edit Item
                  </Button>
                )}
                <Button
                  onClick={() => onOpenChange(false)}
                  variant="outline"
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 text-white/60">
              No data available
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
