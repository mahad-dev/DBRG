"use client";

import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { ArrowRight, Loader2, Check, Clock, X, FileSearch, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { uploadDetailsApi } from "@/services/uploadDetailsApi";

export enum ApplicationStatus {
  Approved = 1,
  Rejected = 2,
  AskForMoreDetails = 3,
}

export enum SpecialConsiderationStatus {
  Pending = 1,
  Accepted = 2,
  Rejected = 3,
}

interface Step {
  title: string;
  status: string;
  date: string;
}

export default function Tracking() {
  const { user } = useAuth();
  const apiCalledRef = useRef(false);

  const [steps, setSteps] = useState<Step[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [specialStatus, setSpecialStatus] = useState<SpecialConsiderationStatus | null>(null);
  const [adminComments, setAdminComments] = useState<string | null>(null);
  const [remarks, setRemarks] = useState<string | null>(null);
  const [askRequest, setAskRequest] = useState<string | null>(null);
  const [askResponse, setAskResponse] = useState<string | null>(null);
const [specialMessage, setSpecialMessage] = useState<string | null>(null);
  useEffect(() => {
    if (!user || apiCalledRef.current) return;
    apiCalledRef.current = true;

    const fetchTrackingStatus = async () => {
      try {
        const response = await uploadDetailsApi.trackStatus();
        if (response) {
          const { application, specialConsideration } = response;

          const specialStatusEnum: SpecialConsiderationStatus | null = specialConsideration
            ? (specialConsideration.status as SpecialConsiderationStatus)
            : null;

          setSpecialStatus(specialStatusEnum);
          setSteps(generateSteps(application, specialStatusEnum));
          if (specialConsideration?.message) { setSpecialMessage(specialConsideration.message); }
          if (application?.adminComments) setAdminComments(application.adminComments);
          if (specialConsideration?.remarks) setRemarks(specialConsideration.remarks);
          if (specialConsideration?.askMoreDetailsRequest) setAskRequest(specialConsideration.askMoreDetailsRequest);
          if (specialConsideration?.askMoreDetailsResponse) setAskResponse(specialConsideration.askMoreDetailsResponse);
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

  const generateSteps = (
    application: any,
    specialStatus: SpecialConsiderationStatus | null
  ): Step[] | null => {
    if (!application || Object.keys(application).length === 0) return null;

    const submittedDate = application?.submittedDate;
    const statusUpdatedDate = application?.statusUpdatedDate;
    const createdDate = application?.createdDate;

    const appStatus: ApplicationStatus = application?.status ?? ApplicationStatus.AskForMoreDetails;

    // Special Consideration rejected → stop application progression
    if (specialStatus === SpecialConsiderationStatus.Rejected) {
      return [
        { title: "Application Submitted", status: "Completed", date: formatDate(submittedDate || createdDate) },
        { title: "Special Consideration", status: "Rejected", date: formatDate(statusUpdatedDate || createdDate) },
        { title: "Application Closed", status: "Rejected", date: formatDate(statusUpdatedDate || createdDate) },
      ];
    }

    // Step 1: Application Submitted
    const step1Status = submittedDate ? "Completed" : "Pending";
    const step1Date = formatDate(submittedDate || createdDate);

    // Step 2: Special Consideration
    const step2Status =
      specialStatus === SpecialConsiderationStatus.Accepted
        ? "Completed"
        : specialStatus === SpecialConsiderationStatus.Pending
        ? "In Progress"
        : "Pending"; // No special consideration
    const step2Date = specialStatus === SpecialConsiderationStatus.Accepted ? formatDate(statusUpdatedDate) : "N/A";

    // Step 3: Application Result
    let step3Status = "Pending";
    let step3Title = "Under Review";
    let step3Date = "N/A";

    if (appStatus === ApplicationStatus.Approved) {
      step3Status = "Completed";
      step3Title = "Approved";
      step3Date = formatDate(statusUpdatedDate);
    } else if (appStatus === ApplicationStatus.Rejected) {
      step3Status = "Rejected";
      step3Title = "Rejected";
      step3Date = formatDate(statusUpdatedDate);
    } else if (appStatus === ApplicationStatus.AskForMoreDetails) {
      step3Status = "In Progress";
      step3Title = "Awaiting Your Response";
      step3Date = "N/A";
    }

    return [
      { title: "Application Submitted", status: step1Status, date: step1Date },
      { title: "Special Consideration", status: step2Status, date: step2Date },
      { title: step3Title, status: step3Status, date: step3Date },
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

  const hasNoData = !steps || steps.length === 0;

  return (
    <div className="w-full min-h-screen bg-[#111] text-white px-4 sm:px-6 md:px-10 py-12 font-inter">
      <h1 className="text-[#C6A95F] text-3xl md:text-4xl font-semibold">Track Status</h1>
      <p className="text-white text-xl md:text-2xl font-medium mt-8 mb-10">Timeline</p>

      {hasNoData ? (
        <div className="w-full flex flex-col items-center justify-center py-16 md:py-24">
          <Card className="max-w-2xl w-full px-8 md:px-12 py-12 md:py-16 rounded-[30px] bg-white/10 border-none flex flex-col items-center backdrop-blur-sm">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#C6A95F]/20 flex items-center justify-center mb-6">
              <FileSearch className="w-12 h-12 md:w-16 md:h-16 text-[#C6A95F]" strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-4">No Application Found</h2>
            <p className="text-base md:text-lg text-white/70 text-center mb-8 max-w-md leading-relaxed">
              You haven't submitted your application yet. Once submitted, you can track its progress here.
            </p>
            <button
              onClick={() => (window.location.href = "/dashboard/upload-details")}
              className="px-8 py-3 cursor-pointer bg-[#C6A95F] hover:bg-[#B39850] transition-colors rounded-full text-black font-semibold text-base md:text-lg shadow-lg hover:shadow-xl"
            >
              Start Application
            </button>
          </Card>
        </div>
      ) : (
        <>
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
                      <div className={`aspect-square w-[90px] rounded-full ${statusColor} flex items-center justify-center`}>
                        {statusIcon || (
                          <p className="text-sm font-medium text-center whitespace-pre-line text-black px-2">{step.title}</p>
                        )}
                      </div>
                      <p className="text-base font-semibold text-white text-center mt-3 whitespace-pre-line">{step.title}</p>
                      <p className="text-sm font-medium text-white/80 text-center mt-1">{step.status}</p>
                    </Card>
                    <p className="text-sm text-white/70 text-center font-medium">{step.date}</p>
                  </div>
                  {index !== steps.length - 1 && (
                    <div className="hidden md:flex items-center shrink-0">
                      <div className={`w-[145px] h-[3px] ${step.status === "Completed" ? "bg-[#C6A95F]" : "bg-gray-500"} -mr-3`} />
                      <ArrowRight className={step.status === "Completed" ? "text-[#C6A95F]" : "text-gray-500"} size={30} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Messages */}
          <div className="mt-12 space-y-6">
          {specialStatus === SpecialConsiderationStatus.Rejected && (
  <div className="w-full md:w-[870px] bg-red-600/20 p-6 rounded-lg text-center text-white font-semibold flex items-center gap-2">
    <XCircle className="w-6 h-6 text-red-600" />
    <span>Your special consideration was rejected. Unfortunately, your application cannot proceed.</span>
  </div>
)}
{specialMessage && ( <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg"> <p className="text-[#C6A95F] text-sm font-semibold mb-2"> Special Consideration Message </p> <p className="text-base md:text-lg leading-tight text-white"> {specialMessage} </p> </div> )}
            {adminComments && (
              <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
                <p className="text-[#C6A95F] text-sm font-semibold mb-2">Admin Comments</p>
                <p className="text-base md:text-lg leading-tight text-white">{adminComments}</p>
              </div>
            )}

            {remarks && (
              <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
                <p className="text-[#C6A95F] text-sm font-semibold mb-2">Remarks</p>
                <p className="text-base md:text-lg leading-tight text-white">{remarks}</p>
              </div>
            )}

            {askRequest && (
              <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
                <p className="text-[#C6A95F] text-sm font-semibold mb-2">Additional Information Requested</p>
                <p className="text-base md:text-lg leading-tight text-white">{askRequest}</p>
              </div>
            )}

            {askResponse && (
              <div className="w-full md:w-[870px] bg-white/10 p-6 rounded-lg">
                <p className="text-[#C6A95F] text-sm font-semibold mb-2">Your Response / Update</p>
                <p className="text-base md:text-lg leading-tight text-white">{askResponse}</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}