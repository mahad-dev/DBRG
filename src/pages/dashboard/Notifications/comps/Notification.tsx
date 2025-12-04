import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Notification() {
  return (
    <div className="border border-white rounded-[15px] p-4 max-w-full">
      {/* Header Card */}
      <Card className="w-full p-4 bg-[#FFFFFF] text-black rounded-[15px]">
        <CardContent className="flex items-center gap-3">
          <img
            src="/static/notificationDP.jpg"
            className="h-12 w-12 rounded-full object-cover shrink-0"
            alt="avatar"
          />

          <p className="font-semibold font-inter text-[16px] leading-[150%] tracking-[-0.02em] text-[#141522]">
            Company Name
          </p>
        </CardContent>
      </Card>

      {/* Notification Text */}
      <div className="bg-white/15 text-white mt-4 p-4 font-normal text-[16px] leading-[1.2] tracking-normal">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-6 w-full">
        <Button
          variant={"site_btn"}
          className="w-full sm:w-[110px] h-[37px] rounded-[10px] px-4 py-2.5 font-inter font-normal text-sm leading-none text-center"
        >
          Mark as Read
        </Button>

        <Button className="w-full sm:w-[110px] h-[37px] bg-white text-black rounded-[10px] px-4 py-2.5 font-inter font-normal text-sm leading-none text-center">
          Delete
        </Button>
      </div>
    </div>
  );
}
