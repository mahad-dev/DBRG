import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";


interface UpcomingEventsProps {
  events?: any[];
  loading?: boolean;
}

export default function UpcomingEvents({ events: apiEvents, loading }: UpcomingEventsProps) {
  const navigate = useNavigate();
  const events = apiEvents || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white animate-pulse"
            >
              <div className="w-full overflow-hidden pt-2 px-2">
                <div className="w-full h-48 bg-white/20 rounded-[10px]" />
              </div>
              <div className="px-4 pb-4">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/20 rounded w-1/3 mb-2" />
                <div className="h-4 bg-white/20 rounded w-full" />
              </div>
            </Card>
          ))}
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
        <p className="text-white">No upcoming events available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white"
          >
            <div className="w-full overflow-hidden pt-2 px-2">
              <img
                src={event.bannerPath}
                alt={event.title}
                className="w-full h-48 object-cover rounded-[10px]"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-gilory font-semibold text-[26px] leading-[100%] text-[#C6A95F] truncate">
                {event.title}
              </h3>
              <p className="font-medium font-inter mt-3 text-[17px] leading-[100%] text-white">
                {formatDate(event.date)}
              </p>
              <p className="font-normal font-inter text-[17px] leading-[100%] text-white opacity-100 mt-2 line-clamp-2">
                {event.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <Button
                  variant={"site_btn"}
                  className="cursor-pointer rounded-[10px] px-4 py-2 text-[20px] font-normal"
                  onClick={() => event.link && window.open(event.link, "_blank")}
                >
                  Register
                </Button>
                <p
                  className="font-normal text-[17px] text-white underline cursor-pointer hover:text-[#C6A95F] transition-colors whitespace-nowrap"
                  onClick={() => navigate(`/dashboard/upcoming-events/${event.id}`)}
                >
                  View Details
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
