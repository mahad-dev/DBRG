import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { registerEvent } from "@/services/cmsApi";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";
import { useFormik } from "formik";
import * as Yup from "yup";

interface UpcomingEventsProps {
  events?: any[];
  loading?: boolean;
}

const registrationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required("Full name is required")
    .min(2, "Full name must be at least 2 characters"),
  email: Yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
});

export default function UpcomingEvents({ events: apiEvents, loading }: UpcomingEventsProps) {
  const navigate = useNavigate();
  const events = apiEvents || [];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      setIsRegistering(true);
      try {
        const response = await registerEvent({
          fullName: values.fullName,
          email: values.email,
          eventId: selectedEvent.id,
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

  const handleOpenRegisterModal = (event: any) => {
    setSelectedEvent(event);
    formik.resetForm();
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white animate-pulse"
            >
              <div className="w-full overflow-hidden pt-2 px-2">
                <div className="w-full h-48 bg-white/20 rounded-[10px]" />
              </div>
              <div className="px-4 pb-4">
                <div className="h-6 bg-white/20 rounded w-1/2 mb-3" />
                <div className="h-4 bg-white/20 rounded w-1/3 mb-2" />
                <div className="h-4 bg-white/20 rounded w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <p className="text-white">No upcoming events available.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white"
          >
            <div className="w-full overflow-hidden pt-2 px-2">
              <img
                src={event.bannerPath}
                alt={event.title}
                className="w-full h-48 object-cover rounded-[10px]"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-gilory font-semibold text-[26px] leading-[100%] text-[#C6A95F] truncate">
                {event.title}
              </h3>
              <p className="font-medium font-inter mt-3 text-[17px] leading-[100%] text-white">
                {formatDate(event.date)}
              </p>
              <p className="font-normal font-inter text-[17px] leading-[100%] text-white opacity-100 mt-2 line-clamp-2">
                {event.description}
              </p>

              <div className="flex justify-between items-center mt-4">
                <Button
                  variant={"site_btn"}
                  className="cursor-pointer rounded-[10px] px-4 py-2 text-[20px] font-normal"
                  onClick={() => handleOpenRegisterModal(event)}
                >
                  Register
                </Button>
                <p
                  className="font-normal text-[17px] text-white underline cursor-pointer hover:text-[#C6A95F] transition-colors whitespace-nowrap"
                  onClick={() => navigate(`/dashboard/upcoming-events/${event.id}`)}
                >
                  View Details
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Registration Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-[#2F2F2F] border-none text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#C6A95F]">
              Register for Event
            </DialogTitle>
          </DialogHeader>

          {selectedEvent && (
            <form onSubmit={formik.handleSubmit} className="space-y-4 mt-2">
              <p className="text-white/80 text-sm">
                You are registering for: <span className="text-white font-medium">{selectedEvent.title}</span>
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
