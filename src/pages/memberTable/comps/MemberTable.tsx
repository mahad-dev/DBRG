"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

interface Member {
  id: number;
  name: string;
  email: string;
  mobile: string;
  message: string;
  membershipType: string;
}

export default function MemberTable() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<number | null>(null);

  const pageSize = 10;
  const API_BASE = import.meta.env.VITE_API_URL as string;
  console.log("ff", API_BASE);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/ContactUs/GetAll`, {
        params: { PageNumber: pageNumber, PageSize: pageSize },
      });
      setMembers(res.data.data.items);
    } catch (error) {
      toast.error("Failed to fetch members!");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setSelectedMemberId(id);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedMemberId) return;
    setDeletingId(selectedMemberId);
    try {
      await axios.delete(`${API_BASE}/ContactUs/Delete`, {
        params: { id: selectedMemberId },
      });
      toast.success("Member deleted successfully!");
      setMembers((prev) => prev.filter((m) => m.id !== selectedMemberId));
      setDeleteModalOpen(false);
    } catch (error) {
      toast.error("Failed to delete member!");
    } finally {
      setDeletingId(null);
      setSelectedMemberId(null);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [pageNumber]);

  return (
    <div className="w-full text-white">
      <ScrollArea className="w-full rounded-lg border">
        <Table className="min-w-full md:min-w-[600px]">
          <TableHeader>
            <TableRow>
              <TableHead className="text-left">Name</TableHead>
              <TableHead className="text-left hidden sm:table-cell">
                Email
              </TableHead>
              <TableHead className="text-left hidden md:table-cell">
                Mobile
              </TableHead>
              <TableHead className="text-left hidden lg:table-cell">
                Message
              </TableHead>
               <TableHead className="text-left hidden lg:table-cell">
                Membership Type
              </TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10">
                  <Loader2 className="animate-spin mx-auto" size={24} />
                </TableCell>
              </TableRow>
            ) : members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  No members found.
                </TableCell>
              </TableRow>
            ) : (
              members.map((member) => (
                <TableRow
                  key={member.id}
                  className="hover:bg-gray-800 transition"
                >
                  <TableCell>{member.name}</TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {member.email}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {member.mobile}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {member.message}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {member.membershipType || "N/A"}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirmDelete(member.id)}
                      disabled={deletingId === member.id}
                      className="cursor-pointer disabled:cursor-not-allowed"
                    >
                      {deletingId === member.id ? (
                        <Loader2 className="animate-spin w-4 h-4" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Pagination */}
      <div className="flex justify-end mt-4 gap-2 flex-wrap">
        <Button
          size="sm"
          onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
          disabled={pageNumber === 1}
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <span className="flex items-center px-2">{pageNumber}</span>
        <Button
          size="sm"
          onClick={() => setPageNumber((prev) => prev + 1)}
          disabled={members.length < pageSize}
          className="cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="max-w-sm p-6 rounded-xl bg-[#0f0f0f] text-white">
          <DialogHeader>
            <DialogTitle>Delete Member</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this member? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingId !== null}
              className="cursor-pointer disabled:cursor-not-allowed"
            >
              {deletingId !== null ? (
                <Loader2 className="animate-spin w-4 h-4" />
              ) : (
                "Delete"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
