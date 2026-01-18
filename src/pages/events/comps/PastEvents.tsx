import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getPublicPastEvents } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";

export default function PastEvents() {
  const [pastEvents, setPastEvents] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    try {
      setLoading(true);
      const response = await getPublicPastEvents();
      if (response.status && response.data) {
        setPastEvents(response.data.items || []);
      }
    } catch (error) {
      console.error("Failed to fetch past events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  const displayedEvents = pastEvents.slice(0, visibleCount);
  const hasMore = visibleCount < pastEvents.length;

  return (
    <div className="w-full bg-[#d9d9d9] text-white py-20 px-6 md:px-20 font-sans min-h-screen">
      {/* Header */}
      <div className="mx-auto mb-20 text-center md:text-left">
        <h1 className="text-[56px] font-normal font-[DM_Serif_Display] leading-[100%] text-[#C6A95F] mb-4">
          Past Events Archive
        </h1>

        <p className="text-[24px] font-normal font-gilory leading-[100%] max-w-6xl">
          Missed one of our events? No problem! Our Past Events Archive contains
          details of all our previous events, including photos, PDF downloads,
          presentations, and more. This archive is a valuable resource for those
          who want to review past sessions or catch up on the knowledge shared
          at DBRG-hosted events.
        </p>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <Card key={idx} className="border-none shadow-none p-0">
              <CardContent className="p-4 flex flex-col gap-4">
                <Skeleton className="w-full h-96 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
              </CardContent>
            </Card>
          ))
        ) : displayedEvents.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-[22px] font-normal font-[Inter] text-gray-600">
              No past events available
            </p>
          </div>
        ) : (
          displayedEvents.map((event) => (
            <Card key={event.id} className="border-none shadow-none p-0">
              <CardContent className="p-4 flex flex-col gap-4">
                {event.bannerPath ? (
                  <img
                    src={event.bannerPath}
                    alt={event.title}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full bg-[#c0c0c0] rounded-lg shadow-none h-96 mb-4" />
                )}
                <h3 className="text-[26px] font-semibold font-[Inter] leading-[100%]">
                  {event.title}
                </h3>

                <p className="text-[22px] font-normal font-[Inter] leading-[100%]">
                  Date:{" "}
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* View More */}
      {!loading && hasMore && (
        <div className="w-full text-center mt-16">
          <Button
            onClick={handleViewMore}
            className="text-[#c7a14a] cursor-pointer underline text-[20px] font-normal font-[Inter] leading-[100%] transition-colors"
          >
            View More
          </Button>
        </div>
      )}
    </div>
  );
}
