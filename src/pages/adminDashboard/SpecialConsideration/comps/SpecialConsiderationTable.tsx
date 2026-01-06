"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MapPin, MoreVertical, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ApprovedDialog from "./ApproveModal";
import RejectDialog from "./RejectModal";
import RemarksDialog from "./RemarksModal";
import apiClient from "@/services/apiClient";
import { COUNTRIES } from "@/constants/countries";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";

/* ================= TYPES ================= */
type ConsiderationRequest = {
  id: number;
  name: string;
  companyName: string | null;
  country: string | null;
  membershipType: number;
  message: string;
  status: number;
  applicationDate: string;
  remarks: string | null;
  statusChangedDate?: string | null;
};

/* ================= UTILITY FUNCTIONS ================= */
const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Accepted";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const PAGE_SIZE = 10;

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: ConsiderationRequest[]) => {
  const headers = ["Name", "Company Name", "Membership Category", "Country", "Message", "Status"];
  const csvData = data.map(item => [
    item.name || "N/A",
    item.companyName || "N/A",
    item.membershipType?.toString() || "N/A",
    item.country || "N/A",
    item.message || "N/A",
    getStatusText(item.status)
  ]);

  generateCSVReport(headers, csvData, "special_consideration");
};

const downloadExcel = (data: ConsiderationRequest[]) => {
  const headers = ["Name", "Company Name", "Membership Category", "Country", "Message", "Status"];
  const excelData = data.map(item => [
    item.name || "N/A",
    item.companyName || "N/A",
    item.membershipType?.toString() || "N/A",
    item.country || "N/A",
    item.message || "N/A",
    getStatusText(item.status)
  ]);

  generateExcelReport(headers, excelData, "special_consideration");
};

const downloadPDF = (data: ConsiderationRequest[]) => {
  const headers = ["Name", "Company Name", "Membership Category", "Country", "Message", "Status"];
  const pdfData = data.map(item => [
    item.name || "N/A",
    item.companyName || "N/A",
    item.membershipType?.toString() || "N/A",
    item.country || "N/A",
    item.message || "N/A",
    getStatusText(item.status)
  ]);

  generatePDFReport({
    title: "Special Consideration Report",
    headers,
    data: pdfData,
    filename: "special_consideration"
  });
};

/* ================= COMPONENT ================= */
export default function SpecialConsiderationTable() {
  const [data, setData] = useState<ConsiderationRequest[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [remarksModal, setRemarksModal] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<ConsiderationRequest | null>(null);

  /* ================= FETCH FROM API ================= */
  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/SpecialConsideration/GetApplications", {
        params: {
          Search: search || undefined,
          Status: statusFilter,
          Country: countryFilter,
          PageNumber: page,
          PageSize: PAGE_SIZE,
        },
      });

      setData(res.data.data.items || []);
      setTotalRecords(res.data.data.totalRecords || 0);
    } catch (error) {
      console.error("Fetch Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, search, statusFilter, countryFilter]);

  const totalPages = Math.ceil(totalRecords / PAGE_SIZE);

  /* ================= HANDLERS ================= */
  const handleApprove = async () => {
    if (!selectedRequest) return;
    try {
      await apiClient.put("/SpecialConsideration/ChangeApplicationStatus", {
        id: selectedRequest.id,
        status: 2,
      });
      setApproveModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Approve Error:", error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      await apiClient.put("/SpecialConsideration/ChangeApplicationStatus", {
        id: selectedRequest.id,
        status: 3,
      });
      setRejectModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Reject Error:", error);
    }
  };

  const handleAddRemarks = async (remarks: string) => {
    if (!selectedRequest) return;
    try {
      await apiClient.put("/SpecialConsideration/AddRemarks", {
        applicationId: selectedRequest.id,
        remarks,
      });
      setRemarksModal(false);
      fetchRequests();
    } catch (error) {
      console.error("Add Remarks Error:", error);
    }
  };

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== HEADER ===== */}
          <h1 className="text-3xl font-semibold text-[#C6A95F]">
            Special Consideration Requests
          </h1>

          {/* ===== SEARCH & FILTER ===== */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-3">
              <div className="flex items-center w-full md:max-w-[380px] gap-2 bg-white/10 rounded-lg px-4 h-11 border border-[#3A3A3A]">
                <Search className="w-4 h-4" />
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent border-none text-white focus-visible:ring-0 placeholder:text-white/50"
                />
              </div>

              <div className="flex gap-2">
                {/* Status Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-[#3A3A3A] h-11 cursor-pointer">
                      <Filter className="w-4 h-4 mr-1" />
                      {statusFilter ? getStatusText(statusFilter) : "Status"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white">
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter(undefined);
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      All Statuses
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter(1);
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter(2);
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      Accepted
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setStatusFilter(3);
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      Rejected
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Country Filter */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-[#3A3A3A] h-11 w-[250px] cursor-pointer justify-start">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{countryFilter || "Country"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="bg-white w-[250px] max-h-[300px] overflow-y-auto">
                    <DropdownMenuItem
                      onClick={() => {
                        setCountryFilter(undefined);
                        setPage(1);
                      }}
                      className="cursor-pointer"
                    >
                      All Countries
                    </DropdownMenuItem>
                    {COUNTRIES.map((country) => (
                      <DropdownMenuItem
                        key={country}
                        onClick={() => {
                          setCountryFilter(country);
                          setPage(1);
                        }}
                        className="cursor-pointer"
                      >
                        {country}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#C6A95F] hover:bg-[#bfa14f] cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => downloadPDF(data)} className="cursor-pointer">
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(data)} className="cursor-pointer">
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadExcel(data)} className="cursor-pointer">
                  Download as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ===== TABLE ===== */}
          <div className="border border-white rounded-lg overflow-hidden relative">
            <ScrollArea className="max-h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Company Name</TableHead>
                    <TableHead>Membership Category</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: PAGE_SIZE }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-5 w-5 rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-10 text-muted-foreground"
                      >
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          {item.name ? (item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {item.companyName ? (item.companyName.length > 30 ? `${item.companyName.substring(0, 30)}...` : item.companyName) : "N/A"}
                        </TableCell>
                        <TableCell>{item.membershipType || "N/A"}</TableCell>
                        <TableCell>
                          {item.country ? (item.country.length > 30 ? `${item.country.substring(0, 30)}...` : item.country) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {item.message ? (item.message.length > 50 ? `${item.message.substring(0, 50)}...` : item.message) : "N/A"}
                        </TableCell>
                        <TableCell>
                          <ActionMenu
                            onApprove={() => {
                              setSelectedRequest(item);
                              setApproveModal(true);
                            }}
                            onReject={() => {
                              setSelectedRequest(item);
                              setRejectModal(true);
                            }}
                            onAddRemarks={() => {
                              setSelectedRequest(item);
                              setRemarksModal(true);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

            {/* PAGINATION */}
            <FooterPagination
              page={page}
              total={totalPages}
              setPage={setPage}
            />
          </div>
        </div>
      </div>

      {/* ===== MODALS ===== */}
      <ApprovedDialog
        open={approveModal}
        onOpenChange={setApproveModal}
        onConfirm={handleApprove}
      />

      <RejectDialog
        open={rejectModal}
        onOpenChange={setRejectModal}
        onConfirm={handleReject}
      />

      <RemarksDialog
        open={remarksModal}
        onOpenChange={setRemarksModal}
        onConfirm={handleAddRemarks}
        userName={selectedRequest?.name}
        companyName={selectedRequest?.companyName ?? undefined}
        status={getStatusText(selectedRequest?.status || 0)}
        approvalOrRejectionDate={selectedRequest?.statusChangedDate ? formatDate(selectedRequest.statusChangedDate) : undefined}
        applicationDate={formatDate(selectedRequest?.applicationDate || "")}
        membershipCategory={selectedRequest?.membershipType?.toString()}
        requestMessage={selectedRequest?.message}
        remarks={selectedRequest?.remarks ?? undefined}
      />
    </>
  );
}

/* ================= PAGINATION ================= */
function FooterPagination({
  page,
  total,
  setPage,
}: {
  page: number;
  total: number;
  setPage: (v: number) => void;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-4 border-t border-white">
      <span className="text-sm">
        Page {page} of {total}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page === total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

/* ================= ACTION MENU ================= */
function ActionMenu({
  onApprove,
  onReject,
  onAddRemarks,
}: {
  onApprove: () => void;
  onReject: () => void;
  onAddRemarks: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem onClick={onApprove} className="cursor-pointer">Approve</DropdownMenuItem>
        <DropdownMenuItem onClick={onReject} className="cursor-pointer">Reject</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">Ask for more details</DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer">View Application</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddRemarks} className="cursor-pointer">Add Remarks</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
