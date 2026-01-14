"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2, Check, Clock, X } from "lucide-react";
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
  const [adminComments, setAdminComments] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string | null>(null);

  useEffect(() => {
    if (!user || apiCalledRef.current) return;

    apiCalledRef.current = true; 

    const fetchTrackingStatus = async () => {
      try {
        const response = await uploadDetailsApi.trackStatus();
        if (response) {
          const { application, specialConsideration } = response;

          setSteps(generateSteps(application));

          // Set messages from API
          if (specialConsideration?.message) {
            setSpecialMessage(specialConsideration.message);
          }
          if (application?.adminComments) {
            setAdminComments(application.adminComments);
          }
          if (specialConsideration?.remarks) {
            setRemarks(specialConsideration.remarks);
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

  const generateSteps = (application: any): Step[] => {
    // Application Status: 0 = Pending, 1 = Under Review, 2 = Approved, 3 = Rejected
    const appStatus = application?.status ?? 0;
    const isAppCompleted = application?.isCompleted ?? false;
    const submittedDate = application?.submittedDate;
    const statusUpdatedDate = application?.statusUpdatedDate;
    const createdDate = application?.createdDate;

    // Special Consideration Status: 0 = Pending, 1 = Approved, 2 = Under Review, 3 = Rejected

    // Step 1: Application Submitted
    const step1Status = isAppCompleted || submittedDate ? "Completed" : "Pending";
    const step1Date = formatDate(submittedDate || createdDate);

    // Step 2: Under Review - Only completed if status moved beyond pending (status >= 1)
    const step2Status = appStatus >= 1 ? "Completed" : step1Status === "Completed" ? "In Progress" : "Pending";
    const step2Date = appStatus >= 1 ? formatDate(statusUpdatedDate) : step1Status === "Completed" ? formatDate(submittedDate) : "N/A";

    // Step 3: Approved - Completed if status is 2 (Approved)
    const step3Status = appStatus === 2 ? "Completed" : appStatus === 3 ? "Rejected" : step2Status === "Completed" ? "In Progress" : "Pending";
    const step3Date = appStatus >= 2 ? formatDate(statusUpdatedDate) : "N/A";

    return [
      {
        title: "Application\nSubmitted",
        status: step1Status,
        date: step1Date,
      },
      {
        title: "Under\nReview",
        status: step2Status,
        date: step2Date,
      },
      {
        title: appStatus === 3 ? "Rejected" : "Approved",
        status: step3Status,
        date: step3Date,
      },
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
        <p className="text-white text-lg">Loading tracking status...</p>
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
        {steps.map((step, index) => {
          const getStatusColor = (status: string) => {
            if (status === "Completed") return "bg-[#C6A95F]";
            if (status === "In Progress") return "bg-blue-500";
            if (status === "Rejected") return "bg-red-500";
            return "bg-gray-500";
          };

          const getStatusIcon = (status: string) => {
            if (status === "Completed") return <Check className="w-6 h-6 text-black" />;
            if (status === "In Progress") return <Clock className="w-6 h-6 text-white" />;
            if (status === "Rejected") return <X className="w-6 h-6 text-white" />;
            return null;
          };

          const statusColor = getStatusColor(step.status);
          const statusIcon = getStatusIcon(step.status);

          return (
            <div key={index} className="flex items-center gap-4 md:gap-6">
              <div className="flex flex-col items-center gap-3">
                <Card className="px-6 md:px-10 py-6 rounded-[30px] bg-white/15 border-none flex flex-col items-center">
                  {/* Circle with Icon or Text */}
                  <div className={`aspect-square w-[90px] rounded-full ${statusColor} flex items-center justify-center`}>
                    {statusIcon || (
                      <p className="text-sm font-medium text-center whitespace-pre-line text-black px-2">
                        {step.title}
                      </p>
                    )}
                  </div>

                  {/* Title (always show below circle) */}
                  <p className="text-base font-semibold text-white text-center mt-3 whitespace-pre-line">
                    {step.title}
                  </p>

                  {/* Status */}
                  <p className="text-sm font-medium text-white/80 text-center mt-1">
                    {step.status}
                  </p>
                </Card>

                {/* Date */}
                <p className="text-sm text-white/70 text-center font-medium">
                  {step.date}
                </p>
              </div>

              {/* Arrow */}
              {index !== steps.length - 1 && (
                <div className="hidden md:flex items-center shrink-0">
                  <div className={`w-[145px] h-[3px] ${step.status === "Completed" ? "bg-[#C6A95F]" : "bg-gray-500"} -mr-3`} />
                  <ArrowRight
                    className={step.status === "Completed" ? "text-[#C6A95F]" : "text-gray-500"}
                    size={30}
                    strokeWidth={2.5}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Messages Section */}
      <div className="mt-12 space-y-6">
        {/* Special Consideration Message */}
        {specialMessage && (
          <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
            <p className="text-[#C6A95F] text-sm font-semibold mb-2">
              Special Consideration Message
            </p>
            <p className="text-base md:text-lg leading-tight text-white">
              {specialMessage}
            </p>
          </div>
        )}

        {/* Admin Comments */}
        {adminComments && (
          <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
            <p className="text-[#C6A95F] text-sm font-semibold mb-2">
              Admin Comments
            </p>
            <p className="text-base md:text-lg leading-tight text-white">
              {adminComments}
            </p>
          </div>
        )}

        {/* Remarks */}
        {remarks && (
          <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
            <p className="text-[#C6A95F] text-sm font-semibold mb-2">
              Remarks
            </p>
            <p className="text-base md:text-lg leading-tight text-white">
              {remarks}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
