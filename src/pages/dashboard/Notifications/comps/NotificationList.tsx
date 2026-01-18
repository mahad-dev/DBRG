import { useState, useEffect, useRef, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import { getUserNotifications } from "@/services/notificationApi";
import type { Notification } from "@/types/notification";
import { toast } from "react-toastify";

interface NotificationListProps {
  onSelectNotification: (notification: Notification) => void;
  refreshKey?: number;
}

export default function NotificationList({
  onSelectNotification,
  refreshKey,
}: NotificationListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (page = 1, isRefresh = false, append = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await getUserNotifications({
        PageNumber: page,
        PageSize: pageSize,
      });

      if (response.status && response.data) {
        // Response data is array directly
        const newNotifications = response.data;
        setTotalCount(newNotifications.length);

        if (append) {
          // Append for infinite scroll
          setNotifications((prev) => [...prev, ...newNotifications]);
          setFilteredNotifications((prev) => [...prev, ...newNotifications]);
        } else {
          // Replace for initial load or refresh
          setNotifications(newNotifications);
          setFilteredNotifications(newNotifications);
        }

        setHasMore(newNotifications.length === pageSize);
        setCurrentPage(page);

        if (isRefresh) {
          toast.success("Notifications refreshed");
        }
      } else {
        toast.error(response.message || "Failed to load notifications");
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to load notifications"
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false, false);
  }, [refreshKey]);

  useEffect(() => {
    // Filter notifications based on search query
    if (!searchQuery.trim()) {
      setFilteredNotifications(notifications);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = notifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query) ||
          notification.senderName?.toLowerCase().includes(query)
      );
      setFilteredNotifications(filtered);
    }
  }, [searchQuery, notifications]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

    // Load more when user scrolls to bottom (with 100px threshold)
    if (scrollTop + clientHeight >= scrollHeight - 100) {
      const nextPage = currentPage + 1;
      fetchNotifications(nextPage, false, true);
    }
  }, [currentPage, isLoadingMore, hasMore]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  const handleSelectNotification = (notification: Notification) => {
    setSelectedId(notification.id);
    onSelectNotification(notification);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchNotifications(1, true, false);
  };

  const getTimeAgo = (dateString: string) => {
    try {
      // Parse the UTC date from API - add 'Z' if not present to treat as UTC
      let dateStr = dateString;
      if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('T')) {
        dateStr = dateStr + 'Z';
      } else if (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
        dateStr = dateStr + 'Z';
      }

      const utcDate = new Date(dateStr);

      // Get current local time
      const now = new Date();

      // Calculate difference in milliseconds
      const diffInMs = now.getTime() - utcDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);

      // Handle negative time differences (future dates)
      if (diffInMinutes < 0) return "Just now";
      if (diffInMinutes < 1) return "Just now";
      if (diffInMinutes < 60) return `${diffInMinutes}m Ago`;

      const diffInHours = Math.floor(diffInMinutes / 60);
      if (diffInHours < 24) return `${diffInHours}h Ago`;

      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 30) return `${diffInDays}d Ago`;

      const diffInMonths = Math.floor(diffInDays / 30);
      return `${diffInMonths}mo Ago`;
    } catch (error) {
      return "NaN Ago";
    }
  };

  return (
    <div className="bg-[#FFFFFF26] rounded-xl p-3 sm:p-4 w-full h-full flex flex-col min-h-[400px] max-h-[calc(100vh-200px)]">
      {/* Header: Search Input with Refresh Button */}
      <div className="flex gap-2 mb-3 sm:mb-4">
        <div className="relative flex-1">
          <Input
            placeholder="Search notifications"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#FFFFFF26] text-white placeholder:text-white/70 border-none
                     rounded-[10px] py-2 sm:py-3.5 pl-4 pr-10 sm:px-7 font-gilroy font-semibold text-[14px] sm:text-[16px]
                     leading-[100%] tracking-[-0.01em]"
          />
          <Search className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white" />
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="bg-[#C9A85D] hover:bg-[#b8964f] text-black rounded-[10px] px-2.5 sm:px-3 h-auto py-2 sm:py-3"
        >
          <RefreshCw
            className={`h-4 w-4 sm:h-5 sm:w-5 ${
              isRefreshing ? "animate-spin" : ""
            }`}
          />
        </Button>
      </div>

      {/* Notification Count - Only show if there are more pages to load */}
      {!isLoading && totalCount > pageSize && (
        <div className="mb-2 text-white/70 text-xs sm:text-sm">
          Showing {filteredNotifications.length} of {totalCount} notifications
        </div>
      )}

      {/* Notification List */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto flex flex-col gap-3 sm:gap-4 scrollbar-thin scrollbar-thumb-[#8E92BC]/40 scrollbar-track-transparent"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 text-[#C9A85D] animate-spin" />
              <p className="text-white text-sm">Loading notifications...</p>
            </div>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex items-center justify-center h-full min-h-[200px]">
            <p className="text-white text-center text-sm sm:text-base px-4">
              {searchQuery
                ? "No notifications found"
                : "No notifications yet"}
            </p>
          </div>
        ) : (
          <>
            {filteredNotifications.map((notification, index) => (
              <div key={notification.id} className="w-full">
                {/* Notification Box */}
                <Card
                  className={`bg-[#FAFAFA] p-0 rounded-[10px] shadow-sm w-full cursor-pointer transition-all hover:shadow-md ${
                    selectedId === notification.id ? "ring-2 ring-[#C9A85D]" : ""
                  }`}
                  onClick={() => handleSelectNotification(notification)}
                >
                  <CardContent className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:px-4 sm:py-3">
                    {/* Left: Profile + Text */}
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                      <img
                        src={
                          notification.senderImage ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            notification.senderName || "System"
                          )}&background=C9A85D&color=000`
                        }
                        width={36}
                        height={36}
                        className="rounded-full shrink-0 w-9 h-9 sm:w-[42px] sm:h-[42px]"
                        alt="profile"
                      />
                      <div className="flex flex-col min-w-0 flex-1">
                        <p className="font-semibold text-[12px] sm:text-[14px] leading-[150%] text-[#141522] truncate">
                          {notification.title}
                        </p>
                        <p className="text-[11px] sm:text-[12px] leading-tight text-[#141522] opacity-80 font-normal truncate mt-0.5">
                          {notification.message.replace(/<[^>]*>/g, '').substring(0, 50)}...
                        </p>
                      </div>
                    </div>

                    {/* Right: Time + Status Dot */}
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <p className="text-[10px] sm:text-[12px] font-normal text-[#8E92BC] leading-none whitespace-nowrap">
                        {getTimeAgo(
                          notification.createdAt ||
                            (notification as any).createdDate
                        )}
                      </p>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#DB5962]" />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Divider */}
                {index < filteredNotifications.length - 1 && (
                  <div className="w-full h-px bg-[#787878] mt-3 sm:mt-4"></div>
                )}
              </div>
            ))}

            {/* Load More Indicator */}
            {isLoadingMore && (
              <div className="flex items-center justify-center py-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 text-[#C9A85D] animate-spin" />
                  <p className="text-white text-sm">Loading more...</p>
                </div>
              </div>
            )}

            {/* End of List Indicator - Only show if we loaded multiple pages */}
            {!hasMore && filteredNotifications.length > 0 && currentPage > 1 && (
              <div className="flex items-center justify-center py-4">
                <p className="text-white/50 text-xs">No more notifications</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
