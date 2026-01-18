import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getUpcomingEvents, registerEvent } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export default function UpcomingEventsDBRG() {
  const [upcomingEvent, setUpcomingEvent] = useState<CmsItem | null>(null);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      if (!upcomingEvent) return;

      setIsRegistering(true);
      try {
        const response = await registerEvent({
          fullName: values.fullName,
          email: values.email,
          eventId: upcomingEvent.id,
          registeredDate: new Date().toISOString(),
        });

        if (response.status) {
          toast.success(response.message || "Successfully registered for the event!");
          setIsModalOpen(false);
          formik.resetForm();
        } else {
          toast.error(response.message || "Failed to register for the event");
        }
      } catch (error: any) {
        console.error("Error registering for event:", error);
        toast.error(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to register for the event"
        );
      } finally {
        setIsRegistering(false);
      }
    },
  });

  const handleOpenRegisterModal = () => {
    formik.resetForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    const fetchUpcomingEvent = async () => {
      try {
        setLoading(true);
        const response = await getUpcomingEvents(1, 1);

        if (response.status && response.data) {
          let eventItems: CmsItem[] = [];

          if (Array.isArray(response.data)) {
            eventItems = response.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            eventItems = response.data.items;
          }

          setUpcomingEvent(eventItems[0] || null);
        }
      } catch (error: any) {
        console.error('Failed to fetch upcoming event:', error);
        toast.error('Failed to load upcoming event');
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvent();
  }, []);

  return (
    <div className="w-full bg-[#0f0f0f] flex justify-center py-10 px-4 md:px-8 lg:px-16">
      <Card className="w-full max-w-6xl bg-[#D9D9D91A] rounded-xl shadow-xl p-6 md:p-10">
        <CardContent className="p-0">
          {/* Heading */}
          <h2
            className="
              font-['DM_Serif_Display']
              font-normal
              text-[42px] sm:text-[52px] md:text-[62px]
              leading-tight
              text-[#C6A95F]
              mb-2
              text-center md:text-left
            "
          >
            Upcoming Events
          </h2>

          {/* Description */}
          <p
            className="
              font-gilroy-medium
              text-[20px] sm:text-[22px] md:text-[24px]
              leading-[100%]
              text-white
              mb-8
              text-center md:text-left
            "
          >
            At DBRG, we host industry-specific events designed to foster
            collaboration, knowledge-sharing, and growth in the bullion and gold
            refining sector.
          </p>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
            </div>
          ) : !upcomingEvent ? (
            <div className="text-center py-20 text-white/60">
              No upcoming events at this time
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
                {/* Event Image */}
                <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 rounded-xl overflow-hidden bg-gray-800">
                  {upcomingEvent.bannerPath ? (
                    <img
                      src={upcomingEvent.bannerPath}
                      alt={upcomingEvent.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-700 flex items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Event Details */}
                <div className="flex flex-col justify-start">
                  <h3
                    className="
                      font-inter
                      font-bold
                      text-[28px] sm:text-[32px]
                      leading-tight
                      text-white
                      mb-3
                    "
                  >
                    {upcomingEvent.title}
                  </h3>

                  <p
                    className="
                      font-gilroy-medium
                      text-[20px] sm:text-[22px]
                      leading-[100%]
                      text-white
                      mb-6
                    "
                  >
                    {upcomingEvent.description}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mb-6">
                    <div className="flex items-center gap-2 text-white font-gilroy-medium text-[20px] sm:text-[22px]">
                      <span>Date: {new Date(upcomingEvent.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white font-gilroy-medium text-[20px] sm:text-[22px]">
                      <span>Time: {new Date(upcomingEvent.date).toLocaleTimeString()}</span>
                    </div>
                  </div>

                  <Button
                    variant={"site_btn"}
                    className="w-30 px-6 py-2 text-lg cursor-pointer"
                    onClick={handleOpenRegisterModal}
                  >
                    Register
                  </Button>
                </div>
              </div>

              {/* More Events Button */}
              <div className="mt-10 flex justify-center md:justify-start">
                <Button
                  variant={"site_btn"}
                  className="px-6 py-2 text-lg cursor-pointer"
                  onClick={() => (window.location.href = '/events')}
                >
                  More Events
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#2F2F2F] border-none text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#C6A95F]">
              Register for Event
            </DialogTitle>
          </DialogHeader>

          {upcomingEvent && (
            <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
              <p className="text-white/80 text-sm">
                You are registering for: <span className="text-white font-medium">{upcomingEvent.title}</span>
              </p>

              <div className="space-y-2">
                <Label className="text-white">Full Name</Label>
                <Input
                  name="fullName"
                  placeholder="Enter your full name"
                  value={formik.values.fullName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`bg-white text-black rounded-lg ${
                    formik.touched.fullName && formik.errors.fullName ? "border-red-500" : ""
                  }`}
                />
                {formik.touched.fullName && formik.errors.fullName && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-white">Email</Label>
                <Input
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`bg-white text-black rounded-lg ${
                    formik.touched.email && formik.errors.email ? "border-red-500" : ""
                  }`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-transparent border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isRegistering}
                  className="flex-1 bg-[#C6A95F] text-black hover:bg-[#b89a4f]"
                >
                  {isRegistering ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
