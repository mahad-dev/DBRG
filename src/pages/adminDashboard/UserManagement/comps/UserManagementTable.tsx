"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MapPin, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";

/* ================= TYPES ================= */

type User = {
  id: string;
  name: string;
  company: string;
  status: "Pending" | "Completed" | "Blocked";
  country: string;
  avatar?: string;
};

/* ================= DATA ================= */

const usersSeed: User[] = Array.from({ length: 42 }).map((_, i) => ({
  id: `${i + 1}`,
  name: "Sanjana Shah",
  company: "Shah Investment",
  status: "Pending",
  country: ["India", "USA", "UK", "Germany"][i % 4],
  avatar: `https://i.pravatar.cc/40?img=${i + 1}`,
}));

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENT ================= */

export default function UserManagementTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  /* ===== SEARCH FILTER ===== */
  const filteredUsers = useMemo(() => {
    return usersSeed.filter((u) =>
      `${u.name} ${u.company} ${u.country}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  /* ===== PAGINATION ===== */
  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, page]);

  return (
    <div className="min-h-screen w-full bg-[#121212] text-white p-4">
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

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden md:block border border-[#3A3A3A] rounded-lg overflow-hidden">
          <ScrollArea className="max-h-[520px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-white/10">
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {paginatedUsers.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>{u.name[0]}</AvatarFallback>
                      </Avatar>
                      {u.name}
                    </TableCell>
                    <TableCell>{u.company}</TableCell>
                    <TableCell>{u.status}</TableCell>
                    <TableCell>{u.country}</TableCell>
                    <TableCell className="text-right">
                      <ActionMenu />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>

          <Pagination page={page} setPage={setPage} total={totalPages} />
        </div>

        {/* ================= MOBILE CARDS ================= */}
        <div className="md:hidden space-y-3">
          {paginatedUsers.map((u) => (
            <div
              key={u.id}
              className="bg-[#181818] border border-[#3A3A3A] rounded-xl p-4"
            >
              <div className="flex justify-between">
                <div className="flex gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={u.avatar} />
                  </Avatar>
                  <div>
                    <p className="font-medium">{u.name}</p>
                    <p className="text-sm text-gray-400">{u.company}</p>
                  </div>
                </div>
                <ActionMenu />
              </div>

              <div className="text-sm mt-3 text-gray-400">
                <p>Status: {u.status}</p>
                <p>Country: {u.country}</p>
              </div>
            </div>
          ))}

          <Pagination page={page} setPage={setPage} total={totalPages} />
        </div>
      </div>
    </div>
  );
}

/* ================= PAGINATION ================= */

function Pagination({
  page,
  setPage,
  total,
}: {
  page: number;
  setPage: (v: number) => void;
  total: number;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-t border-[#3A3A3A] bg-[#101010]">
      <span className="text-sm text-gray-400">
        Page {page} of {total}
      </span>
      <div className="flex gap-2">
        <Button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          variant="outline"
          size="sm"
        >
          Prev
        </Button>
        <Button
          disabled={page === total}
          onClick={() => setPage(page + 1)}
          variant="outline"
          size="sm"
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
        <MoreVertical className="w-5 h-5 cursor-pointer" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Remove</DropdownMenuItem>
        <DropdownMenuItem>Replace</DropdownMenuItem>
        <DropdownMenuItem>Ask for more details</DropdownMenuItem>
        <DropdownMenuItem>View Application</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
