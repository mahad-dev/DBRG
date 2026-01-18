import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createNotification, getNotifications } from "@/services/notificationApi";
import { ChannelType } from "@/types/notification";
import type { Notification } from "@/types/notification";
import { toast } from "react-toastify";
import RichTextEditor from "@/components/RichTextEditor";
import { Search, RefreshCw, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Notifications() {
  const { canCreate } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    channelType: ChannelType.Email,
  });
  const [isLoading, setIsLoading] = useState(false);

  // Notifications list state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 20;

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = async (page = 1, isRefresh = false, append = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingNotifications(true);
    }

    try {
      const response = await getNotifications({
        PageNumber: page,
        PageSize: pageSize,
      });

      if (response.status) {
        // Handle both response formats: data.items (paginated) or data (array directly)
        const newNotifications = Array.isArray(response.data)
          ? response.data
          : response.data?.items || [];

        if (append) {
          setNotifications((prev) => [...prev, ...newNotifications]);
          setFilteredNotifications((prev) => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
          setFilteredNotifications(newNotifications);
        }

        setHasMore(newNotifications.length === pageSize);
        setCurrentPage(page);

        if (isRefresh) {
          toast.success("Notifications refreshed");
        }
      }
    } catch (error: any) {
      console.error("Error fetching notifications:", error);
    } finally {
      setIsLoadingNotifications(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchNotifications(1, false, false);
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotifications(notifications);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = notifications.filter(
        (notification) =>
          notification.title.toLowerCase().includes(query) ||
          notification.message.toLowerCase().includes(query)
      );
      setFilteredNotifications(filtered);
    }
  }, [searchQuery, notifications]);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || isLoadingMore || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;

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

  const handleChannelChange = (value: string) => {
    setFormData({ ...formData, channelType: parseInt(value) as ChannelType });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleMessageChange = (value: string) => {
    setFormData({ ...formData, message: value });
  };

  const handleSend = async () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = formData.message;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    if (!textContent.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    try {
      const response = await createNotification({
        title: formData.title,
        message: formData.message,
        channelType: formData.channelType,
      });

      if (response.status) {
        toast.success(response.message || "Notification sent successfully!");
        setFormData({
          title: "",
          message: "",
          channelType: ChannelType.Email,
        });
        // Refresh notifications list after sending
        fetchNotifications(1, true, false);
      } else {
        toast.error(response.message || "Failed to send notification");
      }
    } catch (error: any) {
      console.error("Error sending notification:", error);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send notification"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchNotifications(1, true, false);
  };

  const getTimeAgo = (dateString: string) => {
    try {
      let dateStr = dateString;
      if (!dateStr.endsWith('Z') && !dateStr.includes('+') && !dateStr.includes('T')) {
        dateStr = dateStr + 'Z';
      } else if (dateStr.includes('T') && !dateStr.endsWith('Z') && !dateStr.includes('+')) {
        dateStr = dateStr + 'Z';
      }

      const utcDate = new Date(dateStr);
      const now = new Date();
      const diffInMs = now.getTime() - utcDate.getTime();
      const diffInMinutes = Math.floor(diffInMs / 60000);

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
    <div className="w-full">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-[#C9A85D] mb-6">
        Send Notifications
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side - Send Notification Form */}
        <div>
          <Card className="bg-[#2F2F2F] border-none rounded-2xl">
            <CardContent className="px-5 py-3 space-y-6">
              {/* Select Channel */}
              <div className="space-y-2">
                <Label className="text-white">Select Channel</Label>
                <Select
                  value={formData.channelType.toString()}
                  onValueChange={handleChannelChange}
                >
                  <SelectTrigger className="bg-white w-full text-black rounded-lg h-[46px] focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-white text-black z-50">
                    <SelectItem value={ChannelType.Email.toString()}>
                      Email
                    </SelectItem>
                    <SelectItem value={ChannelType.InApp.toString()}>
                      In-App
                    </SelectItem>
                    <SelectItem value={ChannelType.EmailAndInApp.toString()}>
                      All Channels (Email + In-App)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <Label className="text-white">Subject</Label>
                <Input
                  placeholder="Subject"
                  className="bg-white text-black rounded-lg"
                  value={formData.title}
                  onChange={handleTitleChange}
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label className="text-white">Message</Label>
                <RichTextEditor
                  value={formData.message}
                  onChange={handleMessageChange}
                  placeholder="Write Message"
                  className="text-black"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                {canCreate("NOTIFICATION_MANAGEMENT") && (
                  <Button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="cursor-pointer bg-[#C9A85D] text-black hover:bg-[#b8964f] rounded-lg px-8"
                  >
                    {isLoading ? "Sending..." : "Send"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Notifications List */}
        <div className="bg-[#FFFFFF26] rounded-xl p-3 sm:p-4 flex flex-col min-h-[500px] max-h-[calc(100vh-200px)]">
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

          {/* Notification List */}
          <div
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto flex flex-col gap-3 sm:gap-4 scrollbar-thin scrollbar-thumb-[#8E92BC]/40 scrollbar-track-transparent"
          >
            {isLoadingNotifications ? (
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
                    <Card
                      className={`bg-[#FAFAFA] p-0 rounded-[10px] shadow-sm w-full cursor-pointer transition-all hover:shadow-md ${
                        selectedNotification?.id === notification.id ? "ring-2 ring-[#C9A85D]" : ""
                      }`}
                      onClick={() => {
                        setSelectedNotification(notification);
                        setIsModalOpen(true);
                      }}
                    >
                      <CardContent className="flex items-start sm:items-center justify-between gap-2 sm:gap-3 p-3 sm:px-4 sm:py-3">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <div className="w-9 h-9 sm:w-[42px] sm:h-[42px] rounded-full shrink-0 bg-[#C9A85D] flex items-center justify-center text-black font-semibold text-sm">
                            SY
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <p className="font-semibold text-[12px] sm:text-[14px] leading-[150%] text-[#141522] truncate">
                              {notification.title}
                            </p>
                            <p className="text-[11px] sm:text-[12px] leading-tight text-[#141522] opacity-80 font-normal truncate mt-0.5">
                              {notification.message.replace(/<[^>]*>/g, '').substring(0, 50)}...
                            </p>
                          </div>
                        </div>

                        <p className="text-[10px] sm:text-[12px] font-normal text-[#8E92BC] leading-none whitespace-nowrap shrink-0">
                          {getTimeAgo(
                            notification.createdAt ||
                              (notification as any).createdDate
                          )}
                        </p>
                      </CardContent>
                    </Card>

                    {index < filteredNotifications.length - 1 && (
                      <div className="w-full h-px bg-[#787878] mt-3 sm:mt-4"></div>
                    )}
                  </div>
                ))}

                {isLoadingMore && (
                  <div className="flex items-center justify-center py-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 text-[#C9A85D] animate-spin" />
                      <p className="text-white text-sm">Loading more...</p>
                    </div>
                  </div>
                )}

                {!hasMore && filteredNotifications.length > 0 && currentPage > 1 && (
                  <div className="flex items-center justify-center py-4">
                    <p className="text-white/50 text-xs">No more notifications</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Notification Detail Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#2F2F2F] border-none text-white max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader className="border-b border-white/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#C9A85D] flex items-center justify-center text-black font-semibold text-sm shrink-0">
                SY
              </div>
              <div className="flex-1 min-w-0">
                <DialogTitle className="text-lg font-semibold text-white truncate">
                  {selectedNotification?.title}
                </DialogTitle>
                <p className="text-xs text-white/60 mt-1">
                  {selectedNotification && getTimeAgo(
                    selectedNotification.createdAt ||
                      (selectedNotification as any).createdDate
                  )}
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] py-4">
            <div
              className="text-white/90 text-sm leading-relaxed prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedNotification?.message || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
