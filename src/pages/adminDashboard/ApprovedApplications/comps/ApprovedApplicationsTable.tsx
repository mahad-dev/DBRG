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

  const csvContent = [
    headers.join(","),
    ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `approved_applications_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadExcel = (data: Applicant[]) => {
  const headers = ["Name", "Company", "Country"];
  const excelData = data.map(item => [
    item.userId || "N/A",
    item.company || "N/A",
    item.country || "N/A"
  ]);

  let html = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">';
  html += '<head><meta charset="utf-8" /><style>table { border-collapse: collapse; } th, td { border: 1px solid #ddd; padding: 8px; }</style></head>';
  html += '<body><table>';
  html += '<tr>' + headers.map(h => `<th>${h}</th>`).join('') + '</tr>';
  html += excelData.map(row => '<tr>' + row.map(cell => `<td>${cell}</td>`).join('') + '</tr>').join('');
  html += '</table></body></html>';

  const blob = new Blob([html], { type: "application/vnd.ms-excel" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", `approved_applications_${new Date().toISOString().split('T')[0]}.xls`);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const downloadPDF = (data: Applicant[]) => {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Approved Applications Report</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #C6A95F; text-align: center; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background-color: #C6A95F; color: white; padding: 12px; text-align: left; border: 1px solid #ddd; }
        td { padding: 10px; border: 1px solid #ddd; }
        tr:nth-child(even) { background-color: #f9f9f9; }
        .footer { margin-top: 30px; text-align: center; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Approved Applications Report</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Company</th>
            <th>Country</th>
          </tr>
        </thead>
        <tbody>
  `;

  data.forEach(item => {
    html += `
      <tr>
        <td>${item.userId || "N/A"}</td>
        <td>${item.company || "N/A"}</td>
        <td>${item.country || "N/A"}</td>
      </tr>
    `;
  });

  html += `
        </tbody>
      </table>
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([html], { type: 'text/html' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `approved_applications_${new Date().toISOString().split('T')[0]}.html`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
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
    } catch (error) {
      console.error("Error fetching approved applications:", error);
      toast.error("Failed to load approved applications");
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
