import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { getUpcomingEvents, registerEvent } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
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

export default function Events() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CmsItem | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
    },
    validationSchema: registrationSchema,
    onSubmit: async (values) => {
      if (!selectedEvent) return;

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

  const handleOpenRegisterModal = (event: CmsItem) => {
    setSelectedEvent(event);
    formik.resetForm();
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchEvents();
  }, [pageNumber]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUpcomingEvents(pageNumber, pageSize);

      if (response.status && response.data) {
        setEvents(response.data.items);
        const total = Math.ceil(response.data.totalCount / pageSize);
        setTotalPages(total);
      } else {
        setError(response.message || "Failed to fetch events");
      }
    } catch (err) {
      setError("An error occurred while fetching events");
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getImageUrl = (event: CmsItem) => {
    if (event.bannerPath) {
      return event.bannerPath;
    }
    if (event.bannerId) {
      return `${import.meta.env.VITE_API_BASE_URL}/api/File/GetFile?id=${event.bannerId}`;
    }
    return "/static/event-placeholder.jpg";
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
          <p className="text-white text-lg">Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
          Upcoming Events
        </h2>
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-red-400 text-xl">{error}</p>
          <Button onClick={fetchEvents} variant="site_btn" className="cursor-pointer">
            Retry
          </Button>
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
        <div className="flex justify-center items-center h-64">
          <p className="text-white text-xl">No upcoming events found</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-[#C6A95F] font-medium text-[25px] leading-[100%] -tracking-[1%] mb-6">
        Upcoming Events
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {events.map((event) => (
          <Card
            key={event.id}
            className="bg-[#FFFFFF26] p-0 m-0 border-none rounded-2xl overflow-hidden text-white"
          >
            <div className="w-full overflow-hidden pt-2 px-2">
              <img
                src={getImageUrl(event)}
                alt={event.title}
                className="w-full h-48 object-cover rounded-[10px]"
              />
            </div>

            <div className="px-4 pb-4">
              <h3 className="font-gilory font-semibold text-[26px] leading-[100%] text-[#C6A95F]">
                {event.title}
              </h3>
              <p className="font-medium font-inter mt-3 text-[17px] leading-[100%] text-white">
                {formatDate(event.date)}
              </p>
              <p className="font-normal font-inter text-[17px] leading-[100%] text-white opacity-100 mt-2 line-clamp-3">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2 justify-between items-center mt-4">
                <Button
                  variant={"site_btn"}
                  className="rounded-[10px] px-4 py-2 text-[20px] font-normal cursor-pointer"
                  onClick={() => handleOpenRegisterModal(event)}
                >
                  Register
                </Button>
                <p
                  className="font-normal text-[17px] text-white underline cursor-pointer hover:text-[#C6A95F] transition-colors"
                  onClick={() => navigate(`/dashboard/upcoming-events/${event.id}`)}
                >
                  View Details
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <Button
            variant="site_btn"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Previous
          </Button>
          <span className="text-white">
            Page {pageNumber} of {totalPages}
          </span>
          <Button
            variant="site_btn"
            disabled={pageNumber >= totalPages}
            onClick={() =>
              setPageNumber((prev) => Math.min(totalPages, prev + 1))
            }
            className="disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            Next
          </Button>
        </div>
      )}

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
