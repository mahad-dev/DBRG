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
import { Search, Filter, MoreVertical, Download } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import GenerateInvoiceModal from "./GenerateInvoice";
import apiClient from "@/services/apiClient";
import { useAuth } from "@/context/AuthContext";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";
import { toast } from "react-toastify";

/* ================= TYPES ================= */

type PaymentItem = {
  id: number;
  userId: string;
  companyName: string;
  date: string;
  dueDate: string;
  paymentStatus: number;
  amount: number;
  invoiceNumber: string;
  vatNumber: string;
};

const ITEMS_PER_PAGE = 6;

/* ================= HELPER FUNCTIONS ================= */

const getStatusText = (status: number): string => {
  switch (status) {
    case 1:
      return "Pending";
    case 2:
      return "Completed";
    case 3:
      return "Rejected";
    default:
      return "Pending";
  }
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: PaymentItem[]) => {
  const headers = ["Name", "Company", "Date", "Time", "Status", "Amount", "Invoice Number", "VAT Number"];
  const csvData = data.map(item => [
    item.userId || "N/A",
    item.companyName || "N/A",
    formatDate(item.date),
    formatTime(item.date),
    getStatusText(item.paymentStatus),
    item.amount ? `$${item.amount.toLocaleString()}` : "N/A",
    item.invoiceNumber || "N/A",
    item.vatNumber || "N/A"
  ]);

  generateCSVReport(headers, csvData, "payment_report");
};

const downloadExcel = (data: PaymentItem[]) => {
  const headers = ["Name", "Company", "Date", "Time", "Status", "Amount", "Invoice Number", "VAT Number"];
  const excelData = data.map(item => [
    item.userId || "N/A",
    item.companyName || "N/A",
    formatDate(item.date),
    formatTime(item.date),
    getStatusText(item.paymentStatus),
    item.amount ? `$${item.amount.toLocaleString()}` : "N/A",
    item.invoiceNumber || "N/A",
    item.vatNumber || "N/A"
  ]);

  generateExcelReport(headers, excelData, "payment_report");
};

const downloadPDF = (data: PaymentItem[]) => {
  const headers = ["Name", "Company", "Date", "Time", "Status", "Amount", "Invoice Number", "VAT Number"];
  const pdfData = data.map(item => [
    item.userId || "N/A",
    item.companyName || "N/A",
    formatDate(item.date),
    formatTime(item.date),
    getStatusText(item.paymentStatus),
    item.amount ? `$${item.amount.toLocaleString()}` : "N/A",
    item.invoiceNumber || "N/A",
    item.vatNumber || "N/A"
  ]);

  generatePDFReport({
    title: "Payment Report",
    headers,
    data: pdfData,
    filename: "payment_report"
  });
};

/* ================= COMPONENT ================= */

export default function PaymentTable() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);
  const [generateInvoice, setgenerateInvoice] = useState(false);
  const [data, setData] = useState<PaymentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [editPaymentId, setEditPaymentId] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const { canCreate, canEdit } = useAuth();
  const hasCreateAccess = canCreate('PAYMENTS');
  const hasEditAccess = canEdit('PAYMENTS');

  /* ================= FETCH FROM API ================= */
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/Payment/GetAll", {
        params: {
          Search: search || undefined,
          Status: statusFilter,
          PageNumber: page,
          PageSize: ITEMS_PER_PAGE,
        },
      });

      setData(res.data.data.items || []);
      setTotalCount(res.data.data.totalRecords || 0);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      toast.error(error?.message || "Failed to fetch payment details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleInvoiceSuccess = () => {
    fetchPayments();
  };

  const handleEdit = (paymentId: number) => {
    setEditPaymentId(paymentId);
    setIsEditMode(true);
    setgenerateInvoice(true);
  };

  const handleModalClose = (open: boolean) => {
    setgenerateInvoice(open);
    if (!open) {
      setEditPaymentId(null);
      setIsEditMode(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold text-[#C6A95F] text-center sm:text-left">
            Payment Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
            {hasCreateAccess && (
              <Button className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto cursor-pointer" onClick={() => setgenerateInvoice(true)}>
                Add Payment
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto cursor-pointer">
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

        {/* ===== MODALS ===== */}
                <GenerateInvoiceModal
                  open={generateInvoice}
                  onOpenChange={handleModalClose}
                  onConfirm={handleInvoiceSuccess}
                  paymentId={editPaymentId}
                  isEditMode={isEditMode}
                />


        {/* ===== SEARCH & FILTER ===== */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Title */}
          <h1 className="text-2xl font-semibold whitespace-nowrap">
            Payment List
          </h1>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-2">
            {/* Search */}
            <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-white/20 bg-white/10 min-w-0 flex-1 sm:flex-initial">
              <Input
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 w-full placeholder:text-white bg-transparent border-none text-white focus-visible:ring-0"
              />
              <Search className="w-4 h-4 text-white shrink-0" />
            </div>

            {/* Status Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-11 border-white/20 flex items-center justify-center gap-2 flex-1 sm:flex-initial min-w-[100px] cursor-pointer"
                >
                  <Filter className="w-4 h-4" />
                  {statusFilter === undefined ? "Status" : getStatusText(statusFilter)}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
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
                  Completed
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
          </div>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="block sm:hidden">
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                <div key={i} className="border border-white rounded-lg p-4 bg-white/5 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-5 w-5 rounded-full" />
                  </div>
                  <Skeleton className="h-4 w-48 mb-3" />
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <Skeleton className="h-4 w-20 mt-2" />
                </div>
              ))}
            </div>
          ) : data.length === 0 ? (
            <div className="border border-white/20 rounded-lg p-8 bg-white/5 text-center">
              <p className="text-white/60">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.map((item) => (
                <div key={item.id} className="border border-white rounded-lg p-4 bg-white/5 shadow-lg">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-semibold text-white flex-1">{item.userId || "N/A"}</h3>
                    <ActionMenu canEdit={hasEditAccess} payment={item} onEdit={handleEdit} />
                  </div>
                  <p className="text-sm text-white/80 mb-3 leading-relaxed">{item.companyName || "N/A"}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium px-2 py-1 rounded-full text-white">
                      {getStatusText(item.paymentStatus)}
                    </span>
                    <span className="text-sm text-white/60">{formatDate(item.date)} {formatTime(item.date)}</span>
                  </div>
                  <div className="mt-2 text-sm font-semibold text-white">{item.amount ? `$${item.amount.toLocaleString()}` : "N/A"}</div>
                </div>
              ))}
            </div>
          )}
          {!loading && data.length > 0 && (
            <FooterPagination page={page} total={totalPages} setPage={setPage} />
          )}
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden sm:block border border-white rounded-lg overflow-hidden">
          <ScrollArea className="max-h-[520px]">
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow className="bg-white/5">
                    <TableHead className="py-4 px-2">Name</TableHead>
                    <TableHead className="py-4 px-4 sm:px-16">Company</TableHead>
                    <TableHead className="py-4 px-2">Date</TableHead>
                    <TableHead className="py-4 px-2">Time</TableHead>
                    <TableHead className="py-4 px-2">Status</TableHead>
                    <TableHead className="py-4 px-2">Amount</TableHead>
                    <TableHead className="py-4 px-2">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {loading ? (
                    Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <Skeleton className="w-9 h-9 rounded-full" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-4 sm:px-16">
                          <Skeleton className="h-4 w-40" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-20" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-5 w-5 rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="py-12 text-center">
                        <p className="text-white/60">No payments found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="py-4 px-2 flex items-center gap-3">
                          <img
                            src="/static/UserImg.png"
                            alt="user"
                            width={36}
                            height={36}
                            className="rounded-full"
                          />
                          {item.userId || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-4 sm:px-16">
                          {item.companyName || "N/A"}
                        </TableCell>
                        <TableCell className="py-4 px-2">{formatDate(item.date)}</TableCell>
                        <TableCell className="py-4 px-2">{formatTime(item.date)}</TableCell>
                        <TableCell className="py-4 px-2">
                          <span className="font-medium text-white">
                            {getStatusText(item.paymentStatus)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-2 font-semibold">{item.amount ? `$${item.amount.toLocaleString()}` : "N/A"}</TableCell>
                        <TableCell className="py-4 px-2">
                          <ActionMenu canEdit={hasEditAccess} payment={item} onEdit={handleEdit} />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {!loading && data.length > 0 && (
            <FooterPagination page={page} total={totalPages} setPage={setPage} />
          )}
        </div>
      </div>

    </div>
  );
}

/* ================= COMPONENTS ================= */

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
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-4 border-t border-white bg-[#101010] rounded-b-lg">
      <span className="text-sm text-white font-medium">
        Page {page} of {total}
      </span>
      <div className="flex gap-3 justify-center sm:justify-end">
        {page > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            className="border-white text-white hover:bg-white/10 min-w-[80px] cursor-pointer"
          >
            Previous
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={page === total}
          onClick={() => setPage(page + 1)}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px] cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ActionMenu({ canEdit, payment, onEdit }: { canEdit: boolean; payment: PaymentItem; onEdit: (paymentId: number) => void }) {
  const { hasPermission } = useAuth();
  const canGet = hasPermission('PAYMENTS.GET');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {canGet && <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>}
        {canEdit && <DropdownMenuItem onClick={() => onEdit(payment.id)} className="cursor-pointer">Edit</DropdownMenuItem>}
        {canEdit && (
          <DropdownMenuItem className="text-red-500 cursor-pointer">
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
