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
import { Search, Filter, Map, MoreVertical } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { userApi, type ApprovedApplication } from "@/services/userApi";
import { toast } from "react-toastify";
import DownloadReportModal from "./DownloadReportModal";

/* ================= TYPES ================= */
type Applicant = ApprovedApplication;

const PAGE_SIZE = 6;

/* ================= COMPONENT ================= */
export default function ApprovedApplicationsTable() {
  const [data, setData] = useState<Applicant[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);




  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const response = await userApi.getApprovedApplications({
        Search: search || undefined,
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
  }, [page, search]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return (
    <>
      <div className="min-h-screen text-white">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* ===== HEADER ===== */}
          <h1 className="text-3xl font-semibold text-[#C6A95F]">
            Approved Applications
          </h1>

          {/* ===== SEARCH ===== */}
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex gap-3 w-full md:w-auto">
              <div className="flex items-center gap-3 h-11 px-3 rounded-lg border border-white/20 bg-white/10 w-full md:w-64">
                <Input
                  placeholder="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="bg-transparent border-none text-white focus-visible:ring-0"
                />
                <Search className="w-4 h-4 text-white" />
              </div>

              <Button variant="outline" className="border-white/20">
                <Filter className="w-4 h-4 mr-2" />
                Status
              </Button>

              <Button variant="outline" className="border-white/20">
                <Map className="w-4 h-4 mr-2" />
                Country
              </Button>
            </div>

            <Button
              className="bg-[#C6A95F] hover:bg-[#bfa14f]"
              onClick={() => setDownloadModalOpen(true)}
            >
              Download Report
            </Button>
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
                          {item.userId}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {item.company ?? "—"}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {item.country ?? "—"}
                        </TableCell>
                        <TableCell className="w-20">
                          <ActionMenu />
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
function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem>
          Revoke
        </DropdownMenuItem>
        <DropdownMenuItem >
          View Details
        </DropdownMenuItem>

      </DropdownMenuContent>
    </DropdownMenu>
  );
}
