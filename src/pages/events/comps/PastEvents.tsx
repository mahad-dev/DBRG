import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PastEvents() {
  const pastEvents = [
    { name: "Event", date: "Date : " },
    { name: "Event", date: "Date : " },
    { name: "Event", date: "Date : " },
  ];

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
        {pastEvents.map((event, idx) => (
          <Card key={idx} className=" border-none shadow-none p-0">
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="w-full bg-[#D9D9D9] rounded-lg shadow-none h-96 mb-4" />
              <h3 className="text-[26px] font-semibold font-[Inter] leading-[100%]">
                {event.name}
              </h3>

              <p className="text-[22px] font-normal font-[Inter] leading-[100%]">
                {event.date}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View More */}
      <div className="w-full text-center mt-16">
        <Button className="text-[#c7a14a] cursor-pointer underline text-[20px] font-normal font-[Inter] leading-[100%] transition-colors">
          View More
        </Button>
      </div>
    </div>
  );
}
