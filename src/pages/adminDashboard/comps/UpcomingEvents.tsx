import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getDashboardUpcomingEvents } from "@/services/dashboardApi";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  bannerPath: string;
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await getDashboardUpcomingEvents();
        if (response.status) {
          setEvents(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch upcoming events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const displayedEvents = showAll ? events : events.slice(0, 4);
  const shouldShowViewAll = events.length > 4;

  if (loading) {
    return (
      <Card className="bg-[#1E1E1E] rounded-xl w-full">
        <CardContent>
          <Skeleton className="h-6 w-40 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="bg-[#FFFFFF]/20 rounded-xl p-4">
                <Skeleton className="w-full h-28 rounded-md mb-3" />
                <Skeleton className="h-5 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-1" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#1E1E1E] rounded-xl w-full">
        <CardContent>
          <h2 className="text-xl font-semibold mb-4 text-[#caa95a]">Upcoming Events</h2>
          <div className="text-center text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#1E1E1E] rounded-xl w-full">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4 text-[#caa95a]">Upcoming Events</h2>
        {events.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No upcoming events
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {displayedEvents.map((event) => (
                <div key={event.id} className="bg-[#FFFFFF]/20 rounded-xl p-4">
                  <img
                    src={event.bannerPath}
                    alt={event.title}
                    className="w-full h-28 object-cover rounded-md mb-3"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                    }}
                  />
                  <h3 className="text-lg font-semibold text-[#caa95a]">{event.title}</h3>
                  <p className="text-sm">{new Date(event.date).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-300 mt-1">
                    {event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}
                  </p>
                </div>
              ))}
            </div>
            {shouldShowViewAll && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="cursor-pointer underline text-sm w-full text-center mt-4 hover:text-[#caa95a] transition-colors"
              >
                {showAll ? "Show Less" : "View All"}
              </button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
