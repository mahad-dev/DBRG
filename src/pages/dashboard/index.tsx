import { useEffect, useState } from "react";
import NotificationList from "./comps/NotificationList";
import UpcomingEvents from "./comps/UpcomingEvents";
import { getDashboardUpcomingEvents } from "@/services/dashboardApi";

export default function Dashboard() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const eventsResponse = await getDashboardUpcomingEvents();
        if (eventsResponse.status && eventsResponse.data) {
          setUpcomingEvents(eventsResponse.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="w-full min-h-screen flex justify-center p-4 md:p-6 lg:p-10">

      {/* FIXED CENTERED CONTAINER */}
      <div className="w-full max-w-[1500px]">

        {/* MOBILE VIEW */}
        <div className="flex flex-col gap-6 lg:hidden">
          <NotificationList />
          <UpcomingEvents events={upcomingEvents} loading={loading} />
        </div>

        {/* DESKTOP VIEW */}
        <div className="hidden lg:grid grid-cols-[2fr_1fr] gap-8">

          {/* LEFT COLUMN */}
          <div className="flex flex-col gap-8">
            <UpcomingEvents events={upcomingEvents} loading={loading} />
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <NotificationList />
          </div>

        </div>

      </div>
    </div>
  );
}
