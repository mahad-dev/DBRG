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

/* ================= TYPES ================= */

type CMSItem = {
  id: number;
  title: string;
  description: string;
  status: "Draft" | "Published" | "Unpublished";
  date: string;
};

/* ================= DATA ================= */

const cmsData: CMSItem[] = [
  { id: 1, title: "Event", description: "Lorem ipsum dolor consectetur ...", status: "Draft", date: "09/07/2025" },
  { id: 2, title: "News Latter", description: "Lorem ipsum dolor consectetur ...", status: "Published", date: "18/06/2025" },
  { id: 3, title: "Report", description: "Lorem ipsum dolor consectetur ...", status: "Published", date: "18/06/2025" },
  { id: 4, title: "FAQ", description: "Lorem ipsum dolor consectetur ...", status: "Unpublished", date: "09/07/2025" },
  { id: 5, title: "Sanjana Shah", description: "Lorem ipsum dolor consectetur ...", status: "Draft", date: "18/06/2025" },
  { id: 6, title: "FAQ", description: "Lorem ipsum dolor consectetur ...", status: "Published", date: "18/06/2025" },
  { id: 7, title: "Report", description: "Lorem ipsum dolor consectetur ...", status: "Draft", date: "03/07/2025" },
];

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENT ================= */

export default function CMSTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredData = useMemo(() => {
    return cmsData.filter((i) =>
      `${i.title} ${i.description} ${i.status}`
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

        {/* ===== HEADER ===== */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-[#C6A95F]">
            CMS Management
          </h1>
          <div className="flex gap-2">
            <Button className="bg-[#C6A95F] text-black hover:bg-[#bfa14f]">
              Add
            </Button>
            <Button className="bg-[#C6A95F] text-black hover:bg-[#bfa14f]">
              Download Report
            </Button>
          </div>
        </div>

        {/* ===== SEARCH & FILTER ===== */}
        <div className="flex flex-col md:flex-row gap-3 justify-between">
          <div className="flex items-center gap-2 bg-white/10 px-4 h-11 rounded-lg border border-[#2E2E2E] w-full md:max-w-[420px]">
            <Search className="w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="bg-transparent border-none focus-visible:ring-0"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="border-[#2E2E2E]">
              <Filter className="w-4 h-4 mr-1" /> Status
            </Button>
            <Button variant="outline" className="border-[#2E2E2E]">
              <Calendar className="w-4 h-4 mr-1" /> Date
            </Button>
          </div>
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden md:block border border-[#2E2E2E] rounded-lg overflow-hidden">
          <ScrollArea className="max-h-[520px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/5">
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginated.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell className="text-gray-400">
                      {item.description}
                    </TableCell>
                    <TableCell>
                      {item.status} 
                    </TableCell>
                    <TableCell>{item.date}</TableCell>
                    <TableCell>
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <FooterPagination page={page} total={totalPages} setPage={setPage} />
        </div>

        {/* ===== MOBILE CARDS ===== */}
        <div className="md:hidden space-y-3">
          {paginated.map((item) => (
            <div
              key={item.id}
              className="border border-[#2E2E2E] rounded-xl p-4 bg-[#141414]"
            >
              <div className="flex justify-between">
                <h3 className="font-medium">{item.title}</h3>
                <ActionMenu />
              </div>
              <p className="text-sm text-gray-400 mt-1">
                {item.description}
              </p>
              <div className="mt-3 text-sm flex justify-between">
               <span className="text-gray-400">{item.status} </span>
                <span className="text-gray-400">{item.date}</span>
              </div>
            </div>
          ))}

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
    <div className="flex justify-between items-center px-4 py-3 border-t border-[#2E2E2E] bg-[#101010]">
      <span className="text-sm text-gray-400">
        {page} of {total}
      </span>
      <Button
        variant="outline"
        size="sm"
        disabled={page === total}
        onClick={() => setPage(page + 1)}
      >
        Next
      </Button>
    </div>
  );
}

function ActionMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-gray-400" />
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
