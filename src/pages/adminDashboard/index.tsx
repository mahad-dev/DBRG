import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import StatsCard from "./comps/StatsCard";
import UpcomingEvents from "./comps/UpcomingEvents";
import RecentlyUploaded from "./comps/RecentlyUploaded";

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white font-sans">
      <h1 className="text-3xl font-bold tracking-wide font-inter text-[#C6A95F] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="New Applications"
              value="2,000"
              onViewAll={() => navigate("/admin/dashboard/applications")}
            />
            <StatsCard
              title="Approved Applications"
              value="1,284"
              onViewAll={() => navigate("/admin/dashboard/approved-applications")}
            />
          </div>

          <UpcomingEvents />
        </div>

        <div className="flex flex-col gap-6">
          <RecentlyUploaded />

          {/* Buttons Section */}
          <div className="flex flex-col gap-4 mt-2">
            <Button
              variant="outline"
              className="w-full border border-[#caa95a] text-[#caa95a] rounded-md py-5 hover:bg-[#caa95a]/20 transition cursor-pointer"
            >
              Add News
            </Button>

            <Button
              variant="outline"
              className="w-full border border-[#caa95a] text-[#caa95a] rounded-md py-5 hover:bg-[#caa95a]/20 transition cursor-pointer"
            >
              Add Events
            </Button>

            <Button
              variant="outline"
              className="w-full border border-[#caa95a] text-[#caa95a] rounded-md py-5 hover:bg-[#caa95a]/20 transition cursor-pointer"
            >
              Add Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
