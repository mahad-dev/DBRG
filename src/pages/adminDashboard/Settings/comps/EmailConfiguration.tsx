import { useEffect, useState } from "react";
import apiClient from "@/services/apiClient";
import { toast } from "react-toastify";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";

// Mapping for action dropdowns
const actionMap: Record<number, string> = {
  1: "New Member application",
  2: "New Member Approved",
  3: "New Resource",
};

const EmailConfiguration = () => {
  const [emailConfigList, setEmailConfigList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // GET API
  useEffect(() => {
    const fetchEmailConfig = async () => {
      try {
        const response = await apiClient.get("/EmailConfig/GetEmailConfig");
        if (response.data?.status && response.data?.data) {
          setEmailConfigList(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching email configuration:", error);
        toast.error("Failed to load email configuration");
      }
    };

    fetchEmailConfig();
  }, []);

  // POST API
  const handleUpdate = async () => {
    setLoading(true);

    try {
      const body = emailConfigList.map((config) => {
        const payload: any = { action: config.action };

        if (config.action === 1) {
          // Action 1: Only notify
          payload.notify = config.notify || "";
        } else if (config.action === 2) {
          // Action 2: Only approval and finalApproval
          payload.approval = config.approval || "";
          payload.finalApproval = config.finalApproval || "";
        } else if (config.action === 3) {
          // Action 3: Only approval and notify
          payload.approval = config.approval || "";
          payload.notify = config.notify || "";
        }

        return payload;
      });

      await apiClient.post("/EmailConfig/SetEmailConfig", body);

      toast.success("Email configuration updated successfully");
    } catch (error) {
      console.error("Error updating email configuration:", error);
      toast.error("Failed to update email configuration");
    } finally {
      setLoading(false);
    }
  };

  const memberApplication = emailConfigList.find((c) => c.action === 1);
  const memberApproved = emailConfigList.find((c) => c.action === 2);
  const newResource = emailConfigList.find((c) => c.action === 3);

  // Update email configuration
  const updateEmailConfig = (action: number, field: string, value: string) => {
    setEmailConfigList((prev) =>
      prev.map((config) =>
        config.action === action ? { ...config, [field]: value } : config
      )
    );
  };

  return (
    <div className="font-inter mt-5 overflow-visible">
      <Card className="bg-[#3e3e3e] border-[#3e3e3e] max-w-[900px] overflow-visible">
        <CardHeader>
          <CardTitle className="text-[#C6A95F] text-3xl font-semibold">
            Email Configuration
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 overflow-visible">
          {/* New Member Application */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Action</Label>
              <Select value={String(memberApplication?.action || "")} disabled>
                <SelectTrigger className="max-w-md bg-white! text-black border-none">
                  <SelectValue className="bg-white">
                    {actionMap[memberApplication?.action]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">
                    {actionMap[memberApplication?.action]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white">Notify</Label>
              <Input
                type="text"
                value={memberApplication?.notify || ""}
                onChange={(e) => updateEmailConfig(1, "notify", e.target.value)}
                className="w-full max-w-lg bg-white text-black border-none"
              />
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* New Member Approved */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Action</Label>
              <Select value={String(memberApproved?.action || "")} disabled>
                <SelectTrigger className="max-w-md bg-white text-black border-none">
                  <SelectValue>
                    {actionMap[memberApproved?.action]}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2">
                    {actionMap[memberApproved?.action]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            
              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">First Approval</Label>
                <Input
                  type="email"
                  value={memberApproved?.approval || ""}
                  onChange={(e) =>
                    updateEmailConfig(2, "approval", e.target.value)
                  }
                  className="w-full bg-white text-black border-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Final Approval</Label>
                <Input
                  type="email"
                  value={memberApproved?.finalApproval || ""}
                  onChange={(e) =>
                    updateEmailConfig(2, "finalApproval", e.target.value)
                  }
                  className="w-full bg-white text-black border-none"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-gray-600" />

          {/* New Resource */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-white">Action</Label>
              <Select value={String(newResource?.action || "")} disabled>
                <SelectTrigger className="max-w-md bg-white text-black border-none">
                  <SelectValue>{actionMap[newResource?.action]}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">
                    {actionMap[newResource?.action]}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white">Approval</Label>
                <Input
                  type="email"
                  value={newResource?.approval || ""}
                  onChange={(e) =>
                    updateEmailConfig(3, "approval", e.target.value)
                  }
                  className="w-full bg-white text-black border-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Notify</Label>
                <Input
                  type="email"
                  value={newResource?.notify || ""}
                  onChange={(e) => updateEmailConfig(3, "notify", e.target.value)}
                  className="w-full bg-white text-black border-none"
                />
              </div>
            </div>
          </div>

          {/* Button */}
          <div className="flex justify-end pt-4">
            <Button
              variant="site_btn"
              onClick={handleUpdate}
              disabled={loading}
              className="px-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfiguration;
