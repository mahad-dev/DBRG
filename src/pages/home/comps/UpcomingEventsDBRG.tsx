import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UpcomingEventsDBRG() {
  return (
    <div className="w-full bg-[#0f0f0f] flex justify-center py-10 px-4 md:px-8 lg:px-16">
      <Card className="w-full max-w-6xl bg-[#D9D9D91A] rounded-xl shadow-xl p-6 md:p-10">
        <CardContent className="p-0">
          {/* Heading */}
          <h2
            className="
              font-['DM_Serif_Display']
              font-normal
              text-[42px] sm:text-[52px] md:text-[62px]
              leading-tight
              text-[#C6A95F]
              mb-2
              text-center md:text-left
            "
          >
            Upcoming Events
          </h2>

          {/* Description */}
          <p
            className="
              font-gilroy-medium
              text-[20px] sm:text-[22px] md:text-[26px]
              leading-relaxed
              text-white
              mb-8
              text-center md:text-left
            "
          >
            At DBRG, we host industry-specific events designed to foster
            collaboration, knowledge-sharing, and growth in the bullion and gold
            refining sector.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            {/* Event Image */}
            <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden">
              <img
                src="/static/upcoming-events.jpg"
                alt="Upcoming Event"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Event Details */}
            <div className="flex flex-col justify-start">
              <h3
                className="
                  font-inter
                  font-bold
                  text-[28px] sm:text-[32px] md:text-[34px]
                  leading-tight
                  text-white
                  mb-3
                "
              >
                [Event Name]
              </h3>

              <p
                className="
                  font-gilroy-medium
                  text-[20px] sm:text-[22px] md:text-[24px]
                  leading-relaxed
                  text-white
                  mb-6
                "
              >
                Register now for valuable insights on gold refining
                advancements.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-2 text-white font-gilroy-medium text-[20px] sm:text-[22px] md:text-[24px]">
                  <span>Date :</span>
                </div>
                <div className="flex items-center gap-2 text-white font-gilroy-medium text-[20px] sm:text-[22px] md:text-[24px]">
                  <span>Time :</span>
                </div>
              </div>

              <Button
                variant={"site_btn"}
                className="w-30 px-6 py-2 text-lg"
              >
                Register
              </Button>
            </div>
          </div>

          {/* More Events Button */}
          <div className="mt-10 flex justify-center md:justify-start">
            <Button
              variant={"site_btn"}
              className="px-6 py-2 text-lg "
            >
              More Events
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
