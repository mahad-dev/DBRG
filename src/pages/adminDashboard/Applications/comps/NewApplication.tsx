"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import apiClient from "@/services/apiClient";
import RemarksDialog from "./ApplicationRemarksModal";
import AskMoreDetailsModal from "./AskMoreDetailsModal";
import { useAuth } from "@/context/AuthContext";
import { COUNTRIES } from "@/constants/countries";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";
import { toast } from "react-toastify";
/* ================= TYPES ================= */
type Applicant = {
  id: number;
  name: string;
  company: string;
  country: string | null;
  status: number;
  submissionDate: string;
  userId: string;
};

const PAGE_SIZE = 6;

/* ================= HELPER FUNCTIONS ================= */
const getStatusText = (status: number): string => {
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "In Progress";
    case 2:
      return "Accepted";
    case 3:
      return "Rejected";
    default:
      return "Unknown";
  }
};

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country", "Status"];
  const csvData = data.map(item => [
    item.name || "N/A",
    item.company || "N/A",
    item.country || "N/A",
    getStatusText(item.status)
  ]);

  generateCSVReport(headers, csvData, "new_applications");
};

const downloadExcel = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country", "Status"];
  const excelData = data.map(item => [
    item.name || "N/A",
    item.company || "N/A",
    item.country || "N/A",
    getStatusText(item.status)
  ]);

  generateExcelReport(headers, excelData, "new_applications");
};

const downloadPDF = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country", "Status"];
  const pdfData = data.map(item => [
    item.name || "N/A",
    item.company || "N/A",
    item.country || "N/A",
    getStatusText(item.status)
  ]);

  generatePDFReport({
    title: "New Applications Report",
    headers,
    data: pdfData,
    filename: "new_applications"
  });
};

/* ================= COMPONENT ================= */
export default function ApplicantsTable() {
  const { canEdit } = useAuth();
  const hasEditAccess = canEdit('APPLICATION_MANAGEMENT');
  const [data, setData] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);

  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [addRemarksModal,setAddRemarksModal]=useState(false);
  const [askMoreDetailsModal, setAskMoreDetailsModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<Applicant | null>(null);

  /* ================= FETCH ================= */
  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get(
        "/UploadDetails/GetApplications",
        {
          params: {
            Search: search || undefined,
            Status: statusFilter,
            Country: countryFilter,
            PageNumber: page,
            PageSize: PAGE_SIZE,
          },
        }
      );

      setData(res.data.data.items);
      setTotalCount(res.data.data.totalCount);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error(error?.message || "Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, countryFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  /* ================= ACTIONS ================= */
  const handleApprove = async (comment: string) => {
    if (!selectedApplicant) return;
    try {
      await apiClient.put('/UploadDetails/ChangeApplicationStatus', {
        status: 2, // Accepted
        applicationId: selectedApplicant.id,
        comment,
      });
      setApproveModal(false);
      fetchApplicants();
    } catch (error: any) {
      console.error("Approve Error:", error);
      toast.error(error?.message || "Failed to approve application");
    }
  };

  const handleReject = async (comment: string) => {
    if (!selectedApplicant) return;
    try {
      await apiClient.put('/UploadDetails/ChangeApplicationStatus', {
        status: 3, // Rejected
        applicationId: selectedApplicant.id,
        comment,
      });
      setRejectModal(false);
      fetchApplicants();
    } catch (error: any) {
      console.error("Reject Error:", error);
      toast.error(error?.message || "Failed to reject application");
    }
  };

  const handleRemarks = async () => {
    if (!selectedApplicant) return;
    try {
      await apiClient.post(
        `/applications/${selectedApplicant.id}/remark`
      );
      setAddRemarksModal(false);


      fetchApplicants();
    } catch (error: any) {
      console.error("Reject Error:", error);
      toast.error(error?.message || "Failed to add remarks");
    }
  };

  const handleAskMoreDetails = async (details: string) => {
    if (!selectedApplicant) return;
    try {
      await apiClient.put('/UploadDetails/AskMoreDetails', {
        applicationId: selectedApplicant.id,
        details,
      });
      setAskMoreDetailsModal(false);
      fetchApplicants();
    } catch (error: any) {
      console.error("Ask More Details Error:", error);
      toast.error(error?.message || "Failed to request more details");
    }
  };

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== HEADER ===== */}
          <h1 className="text-3xl font-semibold text-[#C6A95F]">
            New Applications
          </h1>

          {/* ===== SEARCH & FILTERS ===== */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex items-center w-full md:max-w-[380px] gap-2 bg-white/10 rounded-lg px-4 h-11 border border-[#3A3A3A]">
              <Search className="w-4 h-4" />
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="bg-transparent border-none text-white focus-visible:ring-0"
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {/* Status Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 border-[#3A3A3A] cursor-pointer">
                    <Filter className="w-4 h-4 mr-1" />
                    {statusFilter === undefined ? "Status" : getStatusText(statusFilter)}
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
                    All
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter(0);
                      setPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setStatusFilter(1);
                      setPage(1);
                    }}
                    className="cursor-pointer"
                  >
                    In Progress
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
                  <Button variant="outline" className="h-11 border-[#3A3A3A] cursor-pointer">
                    <MapPin className="w-4 h-4 mr-1" />
                    {countryFilter || "Country"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white max-h-[300px] overflow-y-auto w-[250px]">
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="h-11 bg-[#C6A95F] hover:bg-[#bfa14f] cursor-pointer">
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
          </div>

          {/* ===== TABLE ===== */}
          <div className="border border-white rounded-lg overflow-hidden">
            <ScrollArea className="max-h-[520px]">
              <Table>
                <TableHeader>
                  <TableRow className="bg-white/5">
                    <TableHead>Name</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Country</TableHead>
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
                          <Skeleton className="h-4 w-28" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-5 w-5 rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center py-10 text-white/60"
                      >
                        No applications found
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.name || "N/A"}</TableCell>
                        <TableCell>{item.company || "N/A"}</TableCell>
                        <TableCell>{item.country || "N/A"}</TableCell>
                        <TableCell>
                          <ActionMenu
                            onApprove={() => {
                              setSelectedApplicant(item);
                              setApproveModal(true);
                            }}
                            onReject={() => {
                              setSelectedApplicant(item);
                              setRejectModal(true);
                            }}
                            onRemark={()=>{
                              setAddRemarksModal(true);
                            }}
                            onAskMoreDetails={() => {
                              setSelectedApplicant(item);
                              setAskMoreDetailsModal(true);
                            }}
                            canEdit={hasEditAccess}
                            userId={item.userId}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>

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
        open={addRemarksModal}
        onOpenChange={setAddRemarksModal}
        onConfirm={handleRemarks}
      />

      <AskMoreDetailsModal
        open={askMoreDetailsModal}
        onOpenChange={setAskMoreDetailsModal}
        onConfirm={handleAskMoreDetails}
        userName={selectedApplicant?.name}
        companyName={selectedApplicant?.company}
        status={getStatusText(selectedApplicant?.status || 0)}
        applicationDate={selectedApplicant?.submissionDate}
        country={selectedApplicant?.country || undefined}
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
  onRemark,
  // onAskMoreDetails,
  canEdit,
  userId,
}: {
  onApprove: () => void;
  onReject: () => void;
  onRemark: () => void;
  onAskMoreDetails: () => void;
  canEdit: boolean;
  userId: string;
}) {
  const { hasPermission } = useAuth();
  const canGet = hasPermission('APPLICATION_MANAGEMENT.GET');
  const navigate = useNavigate();

  const handleViewApplication = () => {
    navigate(`/admin/dashboard/applications/view?userId=${userId}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {canGet && <DropdownMenuItem onClick={handleViewApplication} className="cursor-pointer">View Application</DropdownMenuItem>}
        {canEdit && (
          <DropdownMenuItem onClick={onApprove} className="cursor-pointer">
            Approve
          </DropdownMenuItem>
        )}
        {canEdit && (
          <DropdownMenuItem onClick={onReject} className="cursor-pointer">
            Reject
          </DropdownMenuItem>
        )}
        {/* {canEdit && <DropdownMenuItem onClick={onAskMoreDetails} className="cursor-pointer">Ask for more details</DropdownMenuItem>} */}
        {canEdit && <DropdownMenuItem onClick={onRemark} className="cursor-pointer">Add Remarks</DropdownMenuItem>}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
