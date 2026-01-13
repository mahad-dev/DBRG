import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
interface Event {
  id: number;
  title: string;
  date: string;
  description: string;
  image: string;
}

export default function UpcomingEvents() {
  // Replace with your actual event data
  const events: Event[] = [
    {
      id: 1,
      title: "Expo 2025",
      date: "09/07/2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
      image: "/static/event1.jpg",
    },
    {
      id: 2,
      title: "Tech Conference",
      date: "15/08/2025",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ",
      image: "/static/event2.jpg",
    },
  ];

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
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-[10px]"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-gilory font-semibold text-[26px] leading-[100%] text-[#C6A95F]">
                {event.title}
              </h3>
              <p className="font-medium font-inter mt-3 text-[17px] leading-[100%] text-white">
                {event.date}
              </p>
              <p className="font-normal font-inter text-[17px] leading-[100%] text-white opacity-100 mt-2">
                {event.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <Button
                  variant={"site_btn"}
                  className="cursor-pointer rounded-[10px] px-4 py-2 text-[20px] font-normal"
                >
                  Register
                </Button>
                <p className="font-normal text-[17px] text-white underline cursor-pointer">
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
