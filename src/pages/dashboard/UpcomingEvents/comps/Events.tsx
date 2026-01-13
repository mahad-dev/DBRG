import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getUpcomingEvents } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchEvents();
  }, [pageNumber]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUpcomingEvents(pageNumber, pageSize);

      if (response.status && response.data) {
        setEvents(response.data.items);
        const total = Math.ceil(response.data.totalCount / pageSize);
        setTotalPages(total);
      } else {
        setError(response.message || "Failed to fetch events");
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getImageUrl = (event: CmsItem) => {
    // Use bannerPath directly if available, otherwise construct URL from bannerId
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
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-red-400 text-xl">{error}</p>
          <Button onClick={fetchEvents} variant="site_btn" className="cursor-pointer">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="flex justify-center items-center h-64">
          <p className="text-white text-xl">No upcoming events found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white"
          >
            <div className="w-full overflow-hidden pt-2 px-2">
              <img
                src={getImageUrl(event)}
                alt={event.title}
                className="w-full h-48 object-cover rounded-[10px]"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-gilory font-semibold text-[26px] leading-[100%] text-[#C6A95F]">
                {event.title}
              </h3>
              <p className="font-medium font-inter mt-3 text-[17px] leading-[100%] text-white">
                {formatDate(event.date)}
              </p>
              <p className="font-normal font-inter text-[17px] leading-[100%] text-white opacity-100 mt-2 line-clamp-3">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
                <Button
                  variant={"site_btn"}
                  className="rounded-[10px] px-4 py-2 text-[20px] font-normal cursor-pointer"
                  onClick={() => event.link && window.open(event.link, "_blank")}
                >
                  Register
                </Button>
                <p
                  className="font-normal text-[17px] text-white underline cursor-pointer hover:text-[#C6A95F] transition-colors"
                  onClick={() => navigate(`/dashboard/upcoming-events/${event.id}`)}
                >
                  View Details
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="site_btn"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-white">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="site_btn"
            disabled={pageNumber >= totalPages}
            onClick={() =>
              setPageNumber((prev) => Math.min(totalPages, prev + 1))
            }
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
