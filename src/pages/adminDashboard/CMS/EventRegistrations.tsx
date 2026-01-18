"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { getEventRegistrations, getCmsById, type EventRegistration } from "@/services/cmsApi";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

/* ================= FOOTER PAGINATION ================= */
function FooterPagination({
  page,
  total,
  setPage,
  totalItems,
  itemsPerPage,
}: {
  page: number;
  total: number;
  setPage: (v: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}) {
  const perPage = itemsPerPage || 10;
  const startItem = totalItems && totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endItem = totalItems && totalItems > 0 ? Math.min(page * perPage, totalItems) : 0;
  const totalPagesCalc = total > 0 ? total : 1;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-4 border-t border-white bg-[#101010] rounded-b-lg">
      <span className="text-sm text-white font-medium">
        {totalItems && totalItems > 0 ? (
          <>
            Showing {startItem}-{endItem} of {totalItems} items | Page {page} of {totalPagesCalc}
          </>
        ) : (
          <>Page {page} of {totalPagesCalc}</>
        )}
      </span>
      <div className="flex gap-3 justify-center sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px] cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPagesCalc}
          onClick={() => setPage(Math.min(totalPagesCalc, page + 1))}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px] cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

const downloadCSV = (data: EventRegistration[], eventTitle: string) => {
  const headers = ["Full Name", "Email", "Registered Date"];
  const csvData = data.map(item => [
    item.fullName || "N/A",
    item.email || "N/A",
    new Date(item.registrationDate).toLocaleDateString() || "N/A"
  ]);
  generateCSVReport(headers, csvData, `event_registrations_${eventTitle}`);
};

const downloadExcel = (data: EventRegistration[], eventTitle: string) => {
  const headers = ["Full Name", "Email", "Registered Date"];
  const excelData = data.map(item => [
    item.fullName || "N/A",
    item.email || "N/A",
    new Date(item.registrationDate).toLocaleDateString() || "N/A"
  ]);
  generateExcelReport(headers, excelData, `event_registrations_${eventTitle}`);
};

const downloadPDF = (data: EventRegistration[], eventTitle: string) => {
  const headers = ["Full Name", "Email", "Registered Date"];
  const pdfData = data.map(item => [
    item.fullName || "N/A",
    item.email || "N/A",
    new Date(item.registrationDate).toLocaleDateString() || "N/A"
  ]);
  generatePDFReport({
    title: `Event Registrations - ${eventTitle}`,
    headers,
    data: pdfData,
    filename: `event_registrations_${eventTitle}`
  });
};

export default function EventRegistrations() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [allRegistrations, setAllRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [eventTitle, setEventTitle] = useState("");

  // Client-side pagination
  const totalCount = allRegistrations.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE) || 1;
  const registrations = allRegistrations.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchRegistrations();
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const response = await getCmsById(Number(eventId));
      if (response.status && response.data) {
        setEventTitle(response.data.title);
      }
    } catch (error) {
      console.error("Failed to fetch event details:", error);
    }
  };

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await getEventRegistrations({
        EventId: Number(eventId),
      });

      if (response.status && response.data) {
        setAllRegistrations(response.data || []);
      } else {
        toast.error(response.message || "Failed to load registrations");
      }
    } catch (error: any) {
      console.error("Failed to fetch registrations:", error);
      toast.error(error?.message || "Failed to load registrations");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format: 'pdf' | 'csv' | 'excel') => {
    try {
      if (format === 'pdf') {
        downloadPDF(allRegistrations, eventTitle);
      } else if (format === 'csv') {
        downloadCSV(allRegistrations, eventTitle);
      } else {
        downloadExcel(allRegistrations, eventTitle);
      }
      toast.success(`${format.toUpperCase()} downloaded successfully`);
    } catch (error) {
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="p-6 font-inter">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-[#C6A95F] text-3xl font-semibold">Event Registrations</h1>
            {eventTitle && (
              <p className="text-white/60 text-sm mt-1">{eventTitle}</p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="site_btn" className="gap-2">
              <Download className="w-4 h-4" />
              Download Report
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-[#1a1a1a] border-white/10">
            <DropdownMenuItem
              onClick={() => handleDownload('pdf')}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              Download as PDF
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload('csv')}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              Download as CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDownload('excel')}
              className="text-white hover:bg-white/10 cursor-pointer"
            >
              Download as Excel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="border border-white rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '30%' }} />
              <col style={{ width: '35%' }} />
              <col style={{ width: '25%' }} />
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-[#101010]">
              <TableRow className="bg-white/5">
                <TableHead className="py-4 px-4">#</TableHead>
                <TableHead className="py-4 px-4">Full Name</TableHead>
                <TableHead className="py-4 px-4">Email</TableHead>
                <TableHead className="py-4 px-4">Registered Date</TableHead>
              </TableRow>
            </TableHeader>
          </Table>
          <ScrollArea className="h-[460px]">
            <Table className="min-w-full" style={{ tableLayout: 'fixed' }}>
              <colgroup>
                <col style={{ width: '10%' }} />
                <col style={{ width: '30%' }} />
                <col style={{ width: '35%' }} />
                <col style={{ width: '25%' }} />
              </colgroup>
              <TableBody>
                {loading ? (
                  <>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-4 px-4">
                          <Skeleton className="h-4 w-8" />
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Skeleton className="h-4 w-3/4" />
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Skeleton className="h-4 w-full" />
                        </TableCell>
                        <TableCell className="py-4 px-4">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : registrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-12 text-white/60">
                      No registrations found for this event
                    </TableCell>
                  </TableRow>
                ) : (
                  registrations.map((registration, index) => (
                    <TableRow key={registration.id} className="hover:bg-white/5">
                      <TableCell className="py-4 px-4">
                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="truncate" title={registration.fullName}>
                          {registration.fullName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <div className="truncate" title={registration.email}>
                          {registration.email || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4 px-4">
                        <span className="text-sm">
                          {new Date(registration.registrationDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>

        <FooterPagination
          page={page}
          total={totalPages}
          setPage={setPage}
          totalItems={totalCount}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>
    </div>
  );
}
