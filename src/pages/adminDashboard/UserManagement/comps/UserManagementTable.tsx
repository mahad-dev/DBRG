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
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, MoreVertical, MapPin } from "lucide-react";
import { userApi, type User } from "@/services/userApi";
import ReplaceDelegateModal from "./ReplaceDelegateModal";

/* ================= TYPES ================= */

type StatusType = "Pending" | "Completed" | "Blocked";

const ITEMS_PER_PAGE = 6;

/* ================= COMPONENT ================= */

export default function UserManagementTable() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getUsers({
        Search: search || undefined,
        PageNumber: page,
        PageSize: ITEMS_PER_PAGE,
      });

      // Handle response - check if data is an array or if it's nested
      const usersData = Array.isArray(response.data) ? response.data : Array.isArray(response) ? response : [];

      setUsers(usersData);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalCount || usersData.length);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users on mount and when page/search changes
  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // Helper function to get status label
  const getStatusLabel = (status: number | null): StatusType => {
    if (status === null) return "Pending";
    switch (status) {
      case 0:
        return "Pending";
      case 1:
        return "Pending"; // In Progress -> showing as Pending
      case 2:
        return "Completed"; // Approved
      case 3:
        return "Blocked"; // Rejected
      default:
        return "Pending";
    }
  };

  // Helper function to format date
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

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
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-red-500/50 rounded-lg p-8 bg-red-500/10 text-center">
              <p className="text-red-400">{error}</p>
              <Button
                onClick={fetchUsers}
                className="mt-4 bg-[#D5B15F] text-black hover:bg-[#C6A95F]"
              >
                Try Again
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="border border-white/20 rounded-lg p-8 bg-white/5 text-center">
              <p className="text-white/60">No users found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((item) => {
                const status = getStatusLabel(item.status);
                return (
                  <div key={item.userId} className="border border-white rounded-lg p-4 bg-white/5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-white flex-1">{item.name}</h3>
                      <ActionMenu user={item} onReplace={fetchUsers} />
                    </div>
                    <p className="text-sm text-white/80 mb-3 leading-relaxed">{item.company || "N/A"}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                        status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {status}
                      </span>
                      <span className="text-sm text-white/60">{formatDate(item.submissionDate)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {!loading && !error && users.length > 0 && (
            <FooterPagination page={page} total={totalPages} setPage={setPage} totalCount={totalCount} />
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
                    <TableHead className="py-4 px-2">Status</TableHead>
                    <TableHead className="py-4 px-2">Date</TableHead>
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
                          <Skeleton className="h-6 w-20 rounded-full" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-4 w-24" />
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <Skeleton className="h-5 w-5 rounded" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                          <p className="text-red-400">{error}</p>
                          <Button
                            onClick={fetchUsers}
                            className="bg-[#D5B15F] text-black hover:bg-[#C6A95F]"
                          >
                            Try Again
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-12 text-center">
                        <p className="text-white/60">No users found</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((item) => {
                      const status = getStatusLabel(item.status);
                      return (
                        <TableRow key={item.userId}>
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
                            {item.company || "N/A"}
                          </TableCell>
                          <TableCell className="py-4 px-2">
                            <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                              status === 'Completed' ? 'bg-green-500/20 text-green-300' :
                              status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300' :
                              'bg-red-500/20 text-red-300'
                            }`}>
                              {status}
                            </span>
                          </TableCell>
                          <TableCell className="py-4 px-2">{formatDate(item.submissionDate)}</TableCell>
                          <TableCell className="py-4 px-2">
                            <ActionMenu user={item} onReplace={fetchUsers} />
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>

          {!loading && !error && users.length > 0 && (
            <FooterPagination page={page} total={totalPages} setPage={setPage} totalCount={totalCount} />
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
  totalCount,
}: {
  page: number;
  total: number;
  setPage: (v: number) => void;
  totalCount?: number;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-4 border-t border-white bg-[#101010] rounded-b-lg">
      <span className="text-sm text-white font-medium">
        Page {page} of {total}
        {totalCount !== undefined && ` • ${totalCount} total users`}
      </span>
      <div className="flex gap-3 justify-center sm:justify-end">
        {page > 1 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            className="border-white text-white hover:bg-white/10 min-w-20"
          >
            Previous
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          disabled={page === total}
          onClick={() => setPage(page + 1)}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-20"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ActionMenu({ user, onReplace }: { user: User; onReplace: () => void }) {
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setReplaceModalOpen(true)}>
            Replace
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ReplaceDelegateModal
        open={replaceModalOpen}
        onClose={() => setReplaceModalOpen(false)}
        user={user}
        onSuccess={onReplace}
      />
    </>
  );
}
