import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function Notifications() {
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
            <Select defaultValue="email">
              <SelectTrigger className="bg-white w-full text-black rounded-lg h-[46px] focus:ring-2 focus:ring-[#C6A95F] [&_svg]:text-black [&_svg]:opacity-100 [&_svg]:size-5">
                <SelectValue placeholder="Select channel" />
              </SelectTrigger>
              <SelectContent className="w-full bg-white text-black z-50">
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label className="text-white">Subject</Label>
            <Input
              placeholder="Subject"
              className="bg-white text-black rounded-lg"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label className="text-white">Message</Label>
            <Textarea
              placeholder="Write Message"
              className="bg-white text-black rounded-lg min-h-[140px]"
            />
          </div>

          {/* Channel Checkboxes */}
          <div className="space-y-3">
            <Label className="text-white">Select Channel</Label>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Checkbox className="data-[state=checked]:bg-[#C9A85D] data-[state=checked]:border-[#C9A85D] [&_svg]:data-[state=checked]:text-white" />
                <span className="text-white">All</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox className="data-[state=checked]:bg-[#C9A85D] data-[state=checked]:border-[#C9A85D] data-[state=checked]:[&_svg]:text-white" />
                <span className="text-white">Email</span>
              </div>

              <div className="flex items-center gap-2">
                <Checkbox className="data-[state=checked]:bg-[#C9A85D] data-[state=checked]:border-[#C9A85D] data-[state=checked]:[&_svg]:text-white" />
                <span className="text-white">WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <Button className="bg-[#C9A85D] text-black hover:bg-[#b8964f] rounded-lg px-8">
              Send
            </Button>

            <Button
              variant="outline"
              className="bg-white text-black border-none rounded-lg px-8"
            >
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
