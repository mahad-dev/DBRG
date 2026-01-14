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
import { userApi, type ApprovedApplication } from "@/services/userApi";
import { toast } from "react-toastify";
import DownloadReportModal from "./DownloadReportModal";
import { useAuth } from "@/context/AuthContext";
import { COUNTRIES } from "@/constants/countries";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";

/* ================= TYPES ================= */
type Applicant = ApprovedApplication;

const PAGE_SIZE = 6;

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country"];
  const csvData = data.map(item => [
    item.userId || "N/A",
    item.company || "N/A",
    item.country || "N/A"
  ]);

  generateCSVReport(headers, csvData, "approved_applications");
};

const downloadExcel = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country"];
  const excelData = data.map(item => [
    item.userId || "N/A",
    item.company || "N/A",
    item.country || "N/A"
  ]);

  generateExcelReport(headers, excelData, "approved_applications");
};

const downloadPDF = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country"];
  const pdfData = data.map(item => [
    item.userId || "N/A",
    item.company || "N/A",
    item.country || "N/A"
  ]);

  generatePDFReport({
    title: "Approved Applications Report",
    headers,
    data: pdfData,
    filename: "approved_applications"
  });
};

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


/* ================= COMPONENT ================= */
export default function ApprovedApplicationsTable() {
  const { canEdit } = useAuth();
  const hasEditAccess = canEdit('APPLICATION_MANAGEMENT');
  const [data, setData] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [countryFilter, setCountryFilter] = useState<string | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);




  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await userApi.getApprovedApplications({
        Search: search || undefined,
        Status: statusFilter,
        Country: countryFilter,
        PageNumber: page,
        PageSize: PAGE_SIZE,
      });

      setData(response.data);
      setTotalCount(response.totalCount);
    } catch (error: any) {
      console.error("Error fetching approved applications:", error);
      toast.error(error?.message || "Failed to load approved applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, countryFilter]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== HEADER ===== */}
          <h1 className="text-3xl font-semibold text-[#C6A95F]">
            Approved Applications
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
                      <TableRow key={item.userId}>
                        <TableCell className="max-w-[200px] truncate">
                          {item.userId || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.company || "N/A"}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {item.country || "N/A"}
                        </TableCell>
                        <TableCell className="w-20">
                          <ActionMenu canEdit={hasEditAccess} userId={item.userId} />
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

      <DownloadReportModal
        open={downloadModalOpen}
        onOpenChange={setDownloadModalOpen}
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
function ActionMenu({ canEdit, userId }: { canEdit: boolean; userId: string }) {
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
        {canGet && (
          <DropdownMenuItem onClick={handleViewApplication} className="cursor-pointer">
            View Details
          </DropdownMenuItem>
        )}
        {canEdit && (
          <DropdownMenuItem className="cursor-pointer">
            Revoke
          </DropdownMenuItem>
        )}

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
