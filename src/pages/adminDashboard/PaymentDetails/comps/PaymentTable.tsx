"use client";

import { useMemo, useState } from "react";
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
import { Search, Filter, Calendar, MoreVertical } from "lucide-react";
import GenerateInvoiceModal from "./GenerateInvoice";

/* ================= TYPES ================= */

type PaymentItem = {
  id: number;
  name: string;
  company: string;
  date: string;
  time: string;
  status: "Pending" | "Completed" | "Rejected";
  amount: string;
};

/* ================= DATA ================= */

const paymentData: PaymentItem[] = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  name: ["Sanjana Shah", "John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"][i % 5],
  company: ["Shah Investment", "Doe Corp", "Smith LLC", "Johnson Inc", "Brown Enterprises"][i % 5],
  date: ["01/06/2025", "02/06/2025", "03/06/2025", "04/06/2025", "05/06/2025"][i % 5],
  time: ["09:34 AM", "10:15 AM", "11:45 AM", "02:30 PM", "04:20 PM"][i % 5],
  status: ["Pending", "Completed", "Rejected"][i % 3] as "Pending" | "Completed" | "Rejected",
  amount: ["1,00,000 $", "55,000 $", "98,098 $", "10,000 $", "75,500 $"][i % 5],
}));

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENT ================= */

export default function PaymentTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [generateInvoice,setgenerateInvoice]=useState(false);

  const filteredData = useMemo(() => {
    return paymentData.filter((i) =>
      `${i.name} ${i.company} ${i.status} ${i.amount}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  const handleGenerateInvoice = () => {

  setgenerateInvoice(true);
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
            <Button className="bg-black text-[#C6A95F] border-[#C6A95F] border-2 w-full sm:w-auto" onClick={() => setgenerateInvoice(true)}>
              Generate Invoice
            </Button>
            <Button className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto">
              Add Payment
            </Button>
            <Button className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto">
              Download Report
            </Button>
          </div>
        </div>

        {/* ===== MODALS ===== */}
                <GenerateInvoiceModal
                  open={generateInvoice}
                  onOpenChange={setgenerateInvoice}
                  onConfirm={handleGenerateInvoice}
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
            <Button
              variant="outline"
              className="h-11 border-white/20 flex items-center justify-center gap-2 flex-1 sm:flex-initial min-w-[100px]"
            >
              <Filter className="w-4 h-4" />
              Status
            </Button>

            {/* Date Filter */}
            <Button
              variant="outline"
              className="h-11 border-white/20 flex items-center justify-center gap-2 flex-1 sm:flex-initial min-w-[100px]"
            >
              <Calendar className="w-4 h-4" />
              Date
            </Button>
          </div>
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="block sm:hidden">
          <div className="space-y-4">
            {paginated.map((item) => (
              <div key={item.id} className="border border-white rounded-lg p-4 bg-white/5 shadow-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-white flex-1">{item.name}</h3>
                  <ActionMenu />
                </div>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">{item.company}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium px-2 py-1 rounded-full text-white">
                    {item.status}
                  </span>
                  <span className="text-sm text-white/60">{item.date} {item.time}</span>
                </div>
                <div className="mt-2 text-sm font-semibold text-white">{item.amount}</div>
              </div>
            ))}
          </div>
          <FooterPagination page={page} total={totalPages} setPage={setPage} />
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
                  {paginated.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="py-4 px-2 flex items-center gap-3">
                        <img
                          src="/static/UserImg.png"
                          alt="user"
                          width={36}
                          height={36}
                          className="rounded-full"
                        />
                        {item.name}
                      </TableCell>
                      <TableCell className="py-4 px-4 sm:px-16">
                        {item.company}
                      </TableCell>
                      <TableCell className="py-4 px-2">{item.date}</TableCell>
                      <TableCell className="py-4 px-2">{item.time}</TableCell>
                      <TableCell className="py-4 px-2">
                        <span className="font-medium text-white">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-2 font-semibold">{item.amount}</TableCell>
                      <TableCell className="py-4 px-2">
                        <ActionMenu/>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          <FooterPagination page={page} total={totalPages} setPage={setPage} />
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
            className="border-white text-white hover:bg-white/10 min-w-[80px]"
          >
            Previous
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={page === total}
          onClick={() => setPage(page + 1)}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
