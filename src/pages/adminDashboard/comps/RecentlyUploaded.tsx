import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { getRecentlyUploadedEvents } from "@/services/dashboardApi";

interface UploadedItem {
  id: number;
  title: string;
  description: string;
  date: string;
  bannerPath: string;
}

export default function RecentlyUploaded() {
  const [items, setItems] = useState<UploadedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await getRecentlyUploadedEvents();
        if (response.status) {
          setItems(response.data);
        } else {
          setError(response.message);
        }
      } catch (err) {
        setError("Failed to fetch recently uploaded items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const displayedItems = showAll ? items : items.slice(0, 4);
  const shouldShowViewAll = items.length > 4;

  if (loading) {
    return (
      <Card className="bg-[#3A3A3A] border-none rounded-2xl shadow-lg p-6 w-full text-white font-inter">
        <CardContent className="p-0">
          <Skeleton className="h-6 w-48 mb-4" />
          <div className="space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="space-y-3">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-36 h-[72px] rounded-sm" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
                <Skeleton className="w-[80%] h-px mx-6" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-[#3A3A3A] border-none rounded-2xl shadow-lg p-6 w-full text-white font-inter">
        <CardContent className="p-0">
          <h2 className="text-[24px] font-semibold text-[#C6A95F] mb-4">
            Recently Uploaded
          </h2>
          <div className="text-center text-red-500">Error: {error}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[#3A3A3A] border-none rounded-2xl shadow-lg p-6 w-full text-white font-inter">
      <CardContent className="p-0">
        {/* Heading */}
        <h2 className="text-[24px] font-semibold text-[#C6A95F] mb-4">
          Recently Uploaded
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No recently uploaded items
          </div>
        ) : (
          <>
            {/* List */}
            <div className="space-y-6">
              {displayedItems.map((item, idx) => (
                <div key={item.id} className="space-y-3">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    <img
                      src={item.bannerPath}
                      alt={item.title}
                      className="w-36 h-[72px] object-cover rounded-sm border border-black/20"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder-image.png"; // Fallback image
                      }}
                    />

                    {/* Text */}
                    <div>
                      <p className="text-[20px] font-semibold leading-tight">
                        {item.title}
                      </p>
                      <p className="text-[15px] leading-tight text-[#E5E5E5]">
                        {item.description.length > 50 ? `${item.description.substring(0, 50)}...` : item.description}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  {idx !== displayedItems.length - 1 && (
                    <div className="w-[80%] h-px mx-6 bg-white/40 mt-4"></div>
                  )}
                </div>
              ))}
            </div>

            {/* View All */}
            {shouldShowViewAll && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAll(!showAll)}
                  className="cursor-pointer underline text-[15px] tracking-wide hover:text-[#C6A95F] transition-colors"
                >
                  {showAll ? "Show Less" : "View All"}
                </button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
