import MemberCard from "./comps/MemberCard";
import NotificationList from "./comps/NotificationList";
import { StatusBar } from "./comps/StatusBar";
import UpcomingEvents from "./comps/UpcomingEvents";

export default function Dashboard() {
  return (
    <div className="w-full min-h-screen flex justify-center p-4 md:p-6 lg:p-10">

      {/* FIXED CENTERED CONTAINER */}
      <div className="w-full max-w-[1500px]">

        {/* MOBILE VIEW */}
        <div className="flex flex-col gap-6 lg:hidden">
          <StatusBar />
          <MemberCard />
          <NotificationList />
          <UpcomingEvents />
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr] gap-8">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8">
            <StatusBar />
            <UpcomingEvents />
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-8">
            <MemberCard />
            <NotificationList />
          </div>

        </div>

      </div>
    </div>
  );
}
