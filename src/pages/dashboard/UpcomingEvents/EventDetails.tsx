import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getCmsById } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { Loader2, Calendar, Clock, ExternalLink, Download, ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  const fetchEventDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await getCmsById(parseInt(id));

      if (response.status && response.data) {
        setEvent(response.data);
      } else {
        toast.error(response.message || "Failed to fetch event details");
      }
    } catch (error) {
      console.error("Error fetching event details:", error);
      toast.error("Failed to load event details");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getImageUrl = (event: CmsItem) => {
    if (event.bannerPath) {
      return event.bannerPath;
    }
    if (event.bannerId) {
      return `${import.meta.env.VITE_API_BASE_URL}/api/File/GetFile?id=${event.bannerId}`;
    }
    return "/static/event-placeholder.jpg";
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex flex-col justify-center items-center gap-4">
        <p className="text-white text-xl">Event not found</p>
        <Button
          variant="site_btn"
          onClick={() => navigate("/dashboard/upcoming-events")}
          className="cursor-pointer"
        >
          Back to Events
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-white">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Back Button */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#C6A95F] hover:text-[#C6A95F]/80 transition-colors cursor-pointer group"
          >
            <ArrowLeft  />
            <span className="text-base font-medium">Back</span>
          </Button>
        </div>
        {/* Event Banner */}
        <div className="w-full h-64 md:h-96 lg:h-[500px] rounded-2xl overflow-hidden bg-gray-800 shadow-2xl">
          <img
            src={getImageUrl(event)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Title */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold text-[#C6A95F] mb-4 font-['DM_Serif_Display']">
            {event.title}
          </h1>
        </div>

        {/* Date, Time, and Registration Section */}
        <div className="bg-[#FFFFFF1A] rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="flex items-start gap-3">
              <div className="bg-[#C6A95F] p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Date</p>
                <p className="text-lg font-medium">{formatDate(event.date)}</p>
              </div>
            </div>

            {/* Time */}
            <div className="flex items-start gap-3">
              <div className="bg-[#C6A95F] p-3 rounded-lg">
                <Clock className="w-6 h-6 text-black" />
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Time</p>
                <p className="text-lg font-medium">{formatTime(event.date)}</p>
              </div>
            </div>
          </div>

          {/* Registration Button */}
          {event.link && (
            <div className="pt-4 border-t border-[#FFFFFF1A]">
              <Button
                variant="site_btn"
                size="lg"
                className="w-full md:w-auto flex items-center gap-2 text-lg cursor-pointer"
                onClick={() => window.open(event.link, "_blank")}
              >
                <ExternalLink className="w-5 h-5" />
                Register for This Event
              </Button>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-[#FFFFFF0D] rounded-xl p-6 md:p-8">
          <h2 className="text-2xl font-semibold text-[#C6A95F] mb-4 font-gilroy">
            About This Event
          </h2>
          <p className="text-white text-lg leading-relaxed whitespace-pre-wrap font-gilroy">
            {event.description}
          </p>
        </div>

        {/* Documents Section */}
        {event.documentPaths && event.documentPaths.length > 0 && (
          <div className="bg-[#FFFFFF0D] rounded-xl p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-[#C6A95F] mb-4 font-gilroy">
              Event Documents & Resources
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {event.documentPaths.map((docPath, index) => {
                // Extract filename from URL
                const urlParts = docPath.split("/");
                const fileNameWithParams = urlParts[urlParts.length - 1];
                const fileName = fileNameWithParams.split("?")[0];
                const decodedFileName = decodeURIComponent(fileName);

                // Remove the ID prefix (e.g., "1450_")
                const displayName = decodedFileName.replace(/^\d+_/, "");

                // Check if file is an image
                const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
                const isImage = imageExtensions.some(ext =>
                  decodedFileName.toLowerCase().endsWith(ext)
                );

                return (
                  <div
                    key={index}
                    className="bg-[#FFFFFF1A] rounded-xl overflow-hidden hover:bg-[#FFFFFF26] transition-all hover:scale-105 shadow-lg"
                  >
                    {/* Image/Document Preview */}
                    <div className="relative w-full h-48 bg-[#2a2a2a] flex items-center justify-center overflow-hidden group">
                      {isImage ? (
                        <>
                          <img
                            src={docPath}
                            alt={displayName}
                            className="w-full h-full object-cover"
                          />
                          {/* Overlay on hover */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="lg"
                              className="text-white hover:text-[#C6A95F] cursor-pointer"
                              onClick={() => window.open(docPath, "_blank")}
                            >
                              <Download className="w-6 h-6" />
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="bg-[#C6A95F] p-4 rounded-lg">
                            <Download className="w-8 h-8 text-black" />
                          </div>
                          <p className="text-gray-400 text-sm">Document</p>
                        </div>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="p-4 space-y-3">
                      <p className="text-white text-sm font-medium font-gilroy line-clamp-2" title={displayName}>
                        {displayName}
                      </p>
                      <Button
                        variant="site_btn"
                        size="sm"
                        className="w-full flex items-center justify-center gap-2 cursor-pointer"
                        onClick={() => window.open(docPath, "_blank")}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Additional Info */}
        {event.createdAt && (
          <div className="text-center text-gray-500 text-sm">
            <p>
              Posted on {new Date(event.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
