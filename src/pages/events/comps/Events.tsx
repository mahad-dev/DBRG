import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getUpcomingEvents } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function Events() {
  const [events, setEvents] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getUpcomingEvents(page, 10); // 10 events per page

        if (response.status && response.data) {
          let eventItems: CmsItem[] = [];

          // Handle different response structures
          if (Array.isArray(response.data)) {
            eventItems = response.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            eventItems = response.data.items;
          }

          setEvents(eventItems);

          const total = response.data.totalCount || eventItems.length;
          setTotalPages(Math.ceil(total / 10));
        }
      } catch (error: any) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <div className="w-full relative bg-[#121212] text-white py-16 px-6 md:px-20 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16 font-gilroy">
        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal">
          At Dubai Business Group for Bullion & Gold Refinery (DBRG), we host a
          wide range of events, seminars, conferences, and webinars aimed at
          providing valuable insights into the bullion and gold refining
          industry. These events bring together industry professionals, thought
          leaders, and businesses to share knowledge, network, and collaborate
          on innovative solutions.
        </p>

        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal mt-6 md:mt-8">
          Stay updated with our upcoming events and secure your spot at
          exclusive seminars and networking opportunities. Our events focus on
          industry trends, market analysis, regulatory updates, and much more.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-white/60">
          No upcoming events found
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="flex flex-col gap-12">
            {events.map((event, idx) => (
              <Card key={event.id} className="border-none w-full">
                <CardContent
                  className={`p-6 md:p-8 font-gilroy grid gap-6 items-stretch
                    ${
                      idx % 2 === 0
                        ? "md:grid-cols-[40%_60%]"
                        : "md:grid-cols-[60%_40%]"
                    }
                  `}
                >
                  {/* Image Left */}
                  {idx % 2 === 0 && (
                    <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full overflow-hidden">
                      {event.bannerPath ? (
                        <img
                          src={event.bannerPath}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e5]" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="w-full flex flex-col justify-between font-gilroy max-w-2xl mx-auto">
                    <div>
                      <h2 className="text-[28px] md:text-[34px] font-medium mb-2 md:mb-3 leading-tight">
                        {event.title}
                      </h2>

                      <p className="text-[18px] md:text-[24px] leading-[1.2] mb-4 md:mb-5">
                        {event.description}
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4 md:gap-36">
                        <p className="text-[18px] md:text-[24px]">
                          Date: {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-[18px] md:text-[24px]">
                          Time: {new Date(event.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {event.link && (
                      <Button
                        variant="site_btn"
                        className="text-[16px] md:text-[20px] w-[120px] h-[52px] rounded-[10px] font-normal cursor-pointer"
                        onClick={() => (window.location.href = event.link || '#')}
                      >
                        Register
                      </Button>
                    )}
                  </div>

                  {/* Image Right */}
                  {idx % 2 !== 0 && (
                    <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full overflow-hidden">
                      {event.bannerPath ? (
                        <img
                          src={event.bannerPath}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e5]" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white text-white hover:bg-white/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="text-white">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-white text-white hover:bg-white/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 sm:h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
    </div>
  );
}
