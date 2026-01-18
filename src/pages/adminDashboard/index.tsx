import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import StatsCard from "./comps/StatsCard";
import UpcomingEvents from "./comps/UpcomingEvents";
import RecentlyUploaded from "./comps/RecentlyUploaded";
import { getAdminTopCards } from "@/services/dashboardApi";

interface TopCardsData {
  newApplicationsCount: number;
  approvedApplicationsCount: number;
  applicationIncreasePercentage: number;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [topCardsData, setTopCardsData] = useState<TopCardsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopCards = async () => {
      try {
        const response = await getAdminTopCards();
        if (response.status) {
          setTopCardsData(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch top cards data");
      } finally {
        setLoading(false);
      }
    };

    fetchTopCards();
  }, []);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#121212] text-white font-sans">
        <Skeleton className="h-9 w-48 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-6">
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
          <div className="flex flex-col gap-6">
            <Skeleton className="h-80 w-full rounded-2xl" />
            <div className="flex flex-col gap-4 mt-2">
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="w-full min-h-screen bg-[#121212] text-white flex items-center justify-center">Error: {error}</div>;
  }

  return (
    <div className="w-full min-h-screen bg-[#121212] text-white font-sans">
      <h1 className="text-3xl font-bold tracking-wide font-inter text-[#C6A95F] mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-[6fr_4fr] gap-6">
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatsCard
              title="New Applications"
              value={topCardsData?.newApplicationsCount.toString() || "0"}
              increasePercentage={topCardsData?.applicationIncreasePercentage || 0}
              onViewAll={() => navigate("/admin/dashboard/applications")}
            />
            <StatsCard
              title="Approved Applications"
              value={topCardsData?.approvedApplicationsCount.toString() || "0"}
              increasePercentage={topCardsData?.applicationIncreasePercentage || 0}
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
              onClick={() => navigate("/admin/dashboard/cms")}
            >
              Add News
            </Button>

            <Button
              variant="outline"
              className="w-full border border-[#caa95a] text-[#caa95a] rounded-md py-5 hover:bg-[#caa95a]/20 transition cursor-pointer"
              onClick={() => navigate("/admin/dashboard/cms")}
            >
              Add Events
            </Button>

            <Button
              variant="outline"
              className="w-full border border-[#caa95a] text-[#caa95a] rounded-md py-5 hover:bg-[#caa95a]/20 transition cursor-pointer"
              onClick={() => navigate("/admin/dashboard/cms")}
            >
              Add Resources
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
