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
import { Search, Filter, MoreVertical, MapPin } from "lucide-react";

/* ================= TYPES ================= */

type User = {
  id: number;
  name: string;
  company: string;
  status: "Pending" | "Completed" | "Blocked";
  date: string;
};

/* ================= DATA ================= */

const usersSeed: User[] = Array.from({ length: 42 }).map((_, i) => ({
  id: i + 1,
  name: "Sanjana Shah",
  company: "Shah Investment",
  status: "Pending",
  date: ["01/06/2025", "02/06/2025", "03/06/2025", "04/06/2025"][i % 4],
}));

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENT ================= */

export default function UserManagementTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return usersSeed.filter((i) =>
      `${i.name} ${i.company} ${i.status}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const paginated = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, page]);

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        <h1 className="text-3xl sm:text-[38px] font-semibold text-[#C6A95F]">
          User Management
        </h1>

        {/* ================= SEARCH ================= */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex items-center w-full md:max-w-[380px] gap-2 bg-white/10 rounded-lg px-4 h-11 border border-[#3A3A3A]">
            <Search className="w-4 h-4" />
            <Input
              placeholder="Search name, company, country"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none text-white focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="h-11 border-[#3A3A3A]">
              <Filter className="w-4 h-4 mr-1" /> Status
            </Button>
            <Button variant="outline" className="h-11 border-[#3A3A3A]">
              <MapPin className="w-4 h-4 mr-1" /> Country
            </Button>
            <Button className="h-11 bg-[#D5B15F] text-black">
              Download Report
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
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    item.status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                    item.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-sm text-white/60">{item.date}</span>
                </div>
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
                    <TableHead className="py-4 px-2">Status</TableHead>
                    <TableHead className="py-4 px-2">Date</TableHead>
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
                      <TableCell className="py-4 px-2">
                        {item.status}
                      </TableCell>
                      <TableCell className="py-4 px-2">{item.date}</TableCell>
                      <TableCell className="py-4 px-2">
                        <ActionMenu />
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
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>View</DropdownMenuItem>
        <DropdownMenuItem className="text-red-500">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
