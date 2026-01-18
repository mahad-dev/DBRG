import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPublicUpcomingEvents, registerEvent } from "@/services/cmsApi";
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

export default function Events() {
  const [events, setEvents] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await getPublicUpcomingEvents(page, 10);

        if (response.status && response.data) {
          let eventItems: CmsItem[] = [];

          if (Array.isArray(response.data)) {
            eventItems = response.data;
          } else if (response.data.items && Array.isArray(response.data.items)) {
            eventItems = response.data.items;
          }

          setEvents(eventItems);

          const total = response.data.totalCount || eventItems.length;
          setTotalPages(Math.ceil(total / 10));
        }
      } catch (error: any) {
        console.error('Failed to fetch events:', error);
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page]);

  return (
    <div className="w-full relative bg-[#121212] text-white py-16 px-6 md:px-20 font-sans">
      {/* Header */}
      <div className="max-w-5xl mx-auto text-center mb-16 font-gilroy">
        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal">
          At Dubai Business Group for Bullion & Gold Refinery (DBRG), we host a
          wide range of events, seminars, conferences, and webinars aimed at
          providing valuable insights into the bullion and gold refining
          industry. These events bring together industry professionals, thought
          leaders, and businesses to share knowledge, network, and collaborate
          on innovative solutions.
        </p>

        <p className="text-[20px] md:text-[22px] leading-[1.3] tracking-normal font-normal mt-6 md:mt-8">
          Stay updated with our upcoming events and secure your spot at
          exclusive seminars and networking opportunities. Our events focus on
          industry trends, market analysis, regulatory updates, and much more.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-white/60">
          No upcoming events found
        </div>
      ) : (
        <>
          {/* Events Grid */}
          <div className="flex flex-col gap-12">
            {events.map((event, idx) => (
              <Card key={event.id} className="border-none w-full">
                <CardContent
                  className={`p-6 md:p-8 font-gilroy grid gap-6 items-stretch
                    ${
                      idx % 2 === 0
                        ? "md:grid-cols-[40%_60%]"
                        : "md:grid-cols-[60%_40%]"
                    }
                  `}
                >
                  {/* Image Left */}
                  {idx % 2 === 0 && (
                    <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full overflow-hidden">
                      {event.bannerPath ? (
                        <img
                          src={event.bannerPath}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e5]" />
                      )}
                    </div>
                  )}

                  {/* Content */}
                  <div className="w-full flex flex-col justify-between font-gilroy max-w-2xl mx-auto">
                    <div>
                      <h2 className="text-[28px] md:text-[34px] font-medium mb-2 md:mb-3 leading-tight">
                        {event.title}
                      </h2>

                      <p className="text-[18px] md:text-[24px] leading-[1.2] mb-4 md:mb-5">
                        {event.description}
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center mb-4 gap-4 md:gap-36">
                        <p className="text-[18px] md:text-[24px]">
                          Date: {new Date(event.date).toLocaleDateString()}
                        </p>
                        <p className="text-[18px] md:text-[24px]">
                          Time: {new Date(event.date).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant="site_btn"
                      className="text-[16px] md:text-[20px] w-[120px] h-[52px] rounded-[10px] font-normal cursor-pointer"
                      onClick={() => handleOpenRegisterModal(event)}
                    >
                      Register
                    </Button>
                  </div>

                  {/* Image Right */}
                  {idx % 2 !== 0 && (
                    <div className="w-full bg-[#e5e5e5] rounded-lg shadow-inner h-full overflow-hidden">
                      {event.bannerPath ? (
                        <img
                          src={event.bannerPath}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#e5e5e5]" />
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-white text-white hover:bg-white/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Previous
              </Button>
              <span className="text-white">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-white text-white hover:bg-white/10 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                Next
              </Button>
            </div>
          )}
        </>
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

      {/* Bottom Gradient */}
      <div
        className="absolute bottom-0 left-0 w-full h-2 sm:h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
    </div>
  );
}
