"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadDetailsApi } from "@/services/uploadDetailsApi";

interface Step {
  title: string;
  status: string;
  date: string;
}

export default function Tracking() {
  const { user } = useAuth();
  const apiCalledRef = useRef(false);

  const [steps, setSteps] = useState<Step[]>([]);
  const [loading, setLoading] = useState(true);
  const [specialMessage, setSpecialMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!user || apiCalledRef.current) return;

    apiCalledRef.current = true; 

    const fetchTrackingStatus = async () => {
      try {
        const response = await uploadDetailsApi.trackStatus();
        if (response) {
          const { application, specialConsideration } = response;

          setSteps(generateSteps(application, specialConsideration));

          if (specialConsideration?.message) {
            setSpecialMessage(specialConsideration.message);
          }
        }
      } catch (err) {
        console.error("Tracking API failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingStatus();
  }, [user]);

  const formatDate = (dateString?: string) => {
    if (!dateString || dateString.startsWith("0001-01-01")) return "N/A";
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  const generateSteps = (application: any, special: any): Step[] => [
    {
      title: "Applied",
      status: application ? "Completed" : "Pending",
      date: formatDate(application?.createdDate),
    },
    {
      title: "Under\nReview",
      status:
        application?.lastCompletedSection > 0
          ? "Completed"
          : "Under Review",
      date: formatDate(application?.createdDate),
    },
    {
      title: "Approved",
      status:
        special?.status === 1
          ? "Completed"
          : special?.status === 2
          ? "Under Review"
          : "Pending",
      date: formatDate(special?.createdDate),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center">
        Loading tracking status...
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#111] text-white px-4 sm:px-6 md:px-10 py-12 font-inter">
      {/* Header */}
      <h1 className="text-[#C6A95F] text-3xl md:text-4xl font-semibold">
        Track Status
      </h1>

      <p className="text-white text-xl md:text-2xl font-medium mt-8 mb-10">
        Timeline
      </p>

      {/* Timeline */}
      <div className="flex flex-wrap items-center gap-6 md:gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center gap-4 md:gap-6">
            <div className="flex flex-col items-center gap-2">
              <Card className="px-6 md:px-12 py-8 rounded-[30px] bg-white/15 border-none flex flex-col items-center">
                <div className="aspect-square w-[90px] rounded-full bg-[#C6A95F] flex items-center justify-center">
                  <p className="text-sm font-medium text-center whitespace-pre-line">
                    {step.title}
                  </p>
                </div>
                <p className="text-sm font-medium text-white text-center mt-3">
                  {step.status}
                </p>
              </Card>

              <p className="text-xs text-white mt-2 text-center">
                {step.date}
              </p>
            </div>

            {/* Arrow */}
            {index !== steps.length - 1 && (
              <div className="hidden md:flex items-center shrink-0">
                <div className="w-[145px] h-[3px] bg-[#C6A95F] -mr-3" />
                <ArrowRight
                  className="text-[#C6A95F]"
                  size={30}
                  strokeWidth={2.5}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Special Consideration Message */}
      {specialMessage && (
        <div className="w-full md:w-[870px] bg-white/10 p-6 mt-12 rounded-lg">
          <p className="text-[#C6A95F] text-sm font-semibold mb-2">
            Special Consideration Message
          </p>
          <p className="text-base md:text-lg leading-tight text-white">
            {specialMessage}
          </p>
        </div>
      )}
    </div>
  );
}
