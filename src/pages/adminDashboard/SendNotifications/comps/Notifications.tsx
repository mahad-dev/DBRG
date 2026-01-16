import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { createNotification } from "@/services/notificationApi";
import { ChannelType } from "@/types/notification";
import { toast } from "react-toastify";

export default function Notifications() {
  const { canCreate } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    message: "",
    channelType: ChannelType.Email,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChannelChange = (value: string) => {
    setFormData({ ...formData, channelType: parseInt(value) as ChannelType });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, message: e.target.value });
  };

  const handleSend = async () => {
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    if (!formData.message.trim()) {
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
        // Reset form
        setFormData({
          title: "",
          message: "",
          channelType: ChannelType.Email,
        });
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

  return (
    <div className="max-w-[640px]">
      {/* Page Title */}
      <h1 className="text-3xl font-semibold text-[#C9A85D] mb-6">
        Send Notifications
      </h1>

      {/* Card */}
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
            <Textarea
              placeholder="Write Message"
              className="bg-white text-black rounded-lg min-h-[140px]"
              value={formData.message}
              onChange={handleMessageChange}
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
  );
}
