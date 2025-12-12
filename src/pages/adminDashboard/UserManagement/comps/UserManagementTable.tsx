"use client";

import { useState } from "react";
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

type User = {
  id: string;
  name: string;
  company: string;
  status: "Pending" | "Completed" | "Blocked";
  country: string;
  avatar?: string;
};

const usersSeed: User[] = [
  { id: "1", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "India", avatar: "https://i.pravatar.cc/40?img=1" },
  { id: "2", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "USA", avatar: "https://i.pravatar.cc/40?img=2" },
  { id: "3", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "UK", avatar: "https://i.pravatar.cc/40?img=3" },
  { id: "4", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "Germany", avatar: "https://i.pravatar.cc/40?img=4" },
  { id: "5", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "Australia", avatar: "https://i.pravatar.cc/40?img=5" },
  { id: "6", name: "Sanjana Shah", company: "Shah Investment", status: "Pending", country: "Singapore", avatar: "https://i.pravatar.cc/40?img=6" },
]

export default function UserManagementTable() {
  const [users] = useState(usersSeed);

  return (
    <div className="min-h-screen w-full font-inter bg-[#121212] text-white p-4">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
          <h1 className="text-[38px] font-semibold text-[#C6A95F] tracking-wide">
            User Management
          </h1>


        {/* SEARCH + FILTERS */}

<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
  {/* LEFT: Search Bar */}
  <div className="flex-1 flex items-center gap-2 bg-[#FFFFFF]/15 rounded-lg px-4 py-2 border border-[#3A3A3A] shadow-inner">
    <Search className="w-4 h-4 text-white" />
    <Input
      placeholder="Search"
      className="bg-transparent border-none rounded-none shadow-none text-white placeholder:text-white focus-visible:ring-0"
    />
  </div>

  {/* RIGHT: Filters + Download */}
  <div className="flex flex-wrap items-center gap-2">
    <Button
      variant="outline"
      className="flex items-center gap-2 border-[#3A3A3A] text-white bg-[#101010] hover:bg-[#1B1B1B]"
    >
      <Filter className="w-4 h-4" />
      Status
    </Button>

    <Button
      variant="outline"
      className="flex items-center gap-2 border-[#3A3A3A] text-white bg-[#101010] hover:bg-[#1B1B1B]"
    >
      <MapPin className="w-4 h-4" />
      Country
    </Button>

    <Button className="bg-[#D5B15F] text-black font-medium rounded-lg px-5 py-2 shadow-md">
      Download Report
    </Button>
  </div>
</div>


        {/* TABLE + SCROLL */}
        <div className="overflow-x-auto rounded-lg border border-white">
          <ScrollArea className="max-h-[600px]">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="border-b border-[#3A3A3A] h-14 bg-[#FFFFFF]/10">
                  <TableHead className="text-gray-300 font-medium">Name</TableHead>
                  <TableHead className="text-gray-300 font-medium">Company</TableHead>
                  <TableHead className="text-gray-300 font-medium">Status</TableHead>
                  <TableHead className="text-gray-300 font-medium">Country</TableHead>
                  <TableHead className="text-gray-300 font-medium">Action</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users.map((u) => (
                  <TableRow
                    key={u.id}
                    className="hover:bg-[#181818] border-b border-white h-16"
                  >
                    {/* NAME */}
                    <TableCell className="flex items-center gap-3 text-white">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback>{u.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-[15px]">{u.name}</span>
                    </TableCell>

                    {/* COMPANY */}
                    <TableCell className="text-gray-300">{u.company}</TableCell>

                    {/* STATUS */}
                    <TableCell>
                       
                          {u.status}
                    </TableCell>

                    {/* COUNTRY */}
                    <TableCell className="text-gray-300">{u.country}</TableCell>

                    {/* ACTION */}
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreVertical className="w-5 h-5" color="white" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-white text-black border border-gray-200 shadow-xl rounded-md w-44 py-1"
                        >
                          <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                            Remove
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                            Replace
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                            Ask for more details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer px-3 py-2 hover:bg-gray-100">
                            View Application
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* FOOTER / PAGINATION INSIDE SCROLL */}
            <div className="flex justify-between items-center px-4 py-2 border-t border-white bg-[#101010] sticky bottom-0">
              <span className="text-gray-400 text-sm">1 of 100</span>
              <Button variant="link" className="text-[#C6A95F] hover:text-[#e2c675] text-sm">
                Next →
              </Button>
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  );
}
