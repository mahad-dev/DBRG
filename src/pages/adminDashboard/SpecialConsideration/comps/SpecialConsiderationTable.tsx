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
import ApprovedDialog from "./ApproveModal";
import RejectDialog from "./RejectModal";
import RemarksDialog from "./RemarksModal";
import apiClient from "@/services/apiClient";

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

/* ================= COMPONENT ================= */
export default function SpecialConsiderationTable() {
  const [data, setData] = useState<ConsiderationRequest[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

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
  }, [page, search]);

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

            <Button className="bg-[#C6A95F] hover:bg-[#bfa14f]">
              Download Report
            </Button>
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
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="flex justify-center items-center min-h-[400px]">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                      </TableCell>
                    </TableRow>
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
                          {item.name.length > 30 ? `${item.name.substring(0, 30)}...` : item.name}
                        </TableCell>
                        <TableCell>
                          {item.companyName && item.companyName.length > 30 ? `${item.companyName.substring(0, 30)}...` : item.companyName ?? "—"}
                        </TableCell>
                        <TableCell>{item.membershipType}</TableCell>
                        <TableCell>
                          {item.country && item.country.length > 30 ? `${item.country.substring(0, 30)}...` : item.country ?? "—"}
                        </TableCell>
                        <TableCell>
                          {item.message.length > 50 ? `${item.message.substring(0, 50)}...` : item.message}
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
        <DropdownMenuItem onClick={onApprove}>Approve</DropdownMenuItem>
        <DropdownMenuItem onClick={onReject}>Reject</DropdownMenuItem>
        <DropdownMenuItem>Ask for more details</DropdownMenuItem>
        <DropdownMenuItem>View Application</DropdownMenuItem>
        <DropdownMenuItem onClick={onAddRemarks}>Add Remarks</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
