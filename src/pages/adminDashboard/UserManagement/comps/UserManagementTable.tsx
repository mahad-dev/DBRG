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
import { Search, Filter, MoreVertical, MapPin, Download } from "lucide-react";
import { userApi, type User } from "@/services/userApi";
import ReplaceDelegateModal from "./ReplaceDelegateModal";
import ViewUserModal from "./ViewUserModal";
import { useAuth } from "@/context/AuthContext";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";

/* ================= TYPES ================= */

type StatusType = "Pending" | "Completed" | "Blocked";

const ITEMS_PER_PAGE = 6;

/* ================= EXPORT FUNCTIONS ================= */

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getStatusLabel = (status: number | null): string => {
  if (status === null) return "Pending";
  switch (status) {
    case 0:
      return "Pending";
    case 1:
      return "Pending";
    case 2:
      return "Completed";
    case 3:
      return "Blocked";
    default:
      return "Pending";
  }
};

const downloadCSV = (data: User[]) => {
  const headers = ["Name", "Company", "Status", "Date"];
  const csvData = data.map(item => [
    item.name,
    item.company || "N/A",
    getStatusLabel(item.status),
    formatDate(item.submissionDate)
  ]);

  generateCSVReport(headers, csvData, "user_management");
};

const downloadExcel = (data: User[]) => {
  const headers = ["Name", "Company", "Status", "Date"];
  const excelData = data.map(item => [
    item.name,
    item.company || "N/A",
    getStatusLabel(item.status),
    formatDate(item.submissionDate)
  ]);

  generateExcelReport(headers, excelData, "user_management");
};

const downloadPDF = (data: User[]) => {
  const headers = ["Name", "Company", "Status", "Date"];
  const pdfData = data.map(item => [
    item.name,
    item.company || "N/A",
    getStatusLabel(item.status),
    formatDate(item.submissionDate)
  ]);

  generatePDFReport({
    title: "User Management Report",
    headers,
    data: pdfData,
    filename: "user_management"
  });
};

/* ================= COMPONENT ================= */

export default function UserManagementTable() {
  const { canEdit } = useAuth();
  const hasEditAccess = canEdit('USER_MANAGEMENT');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await userApi.getUsers({
        Search: search || undefined,
        Status: selectedStatus ?? undefined,
        Country: selectedCountry || undefined,
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

  // Fetch users on mount and when page/search/filters change
  useEffect(() => {
    fetchUsers();
  }, [page, search, selectedStatus, selectedCountry]);

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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-[#3A3A3A] cursor-pointer">
                  <Filter className="w-4 h-4 mr-1" />
                  {selectedStatus !== null
                    ? selectedStatus === 0 ? "Pending"
                    : selectedStatus === 1 ? "In Progress"
                    : selectedStatus === 2 ? "Completed"
                    : "Blocked"
                    : "Status"
                  }
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus(null);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  All
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus(0);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  Pending
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus(1);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus(2);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  Completed
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedStatus(3);
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  Blocked
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-11 border-[#3A3A3A] cursor-pointer">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedCountry || "Country"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white max-h-[300px] overflow-y-auto w-[250px]">
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedCountry("");
                    setPage(1);
                  }}
                  className="cursor-pointer"
                >
                  All Countries
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Afghanistan"); setPage(1); }} className="cursor-pointer">Afghanistan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Albania"); setPage(1); }} className="cursor-pointer">Albania</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Algeria"); setPage(1); }} className="cursor-pointer">Algeria</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Andorra"); setPage(1); }} className="cursor-pointer">Andorra</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Angola"); setPage(1); }} className="cursor-pointer">Angola</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Argentina"); setPage(1); }} className="cursor-pointer">Argentina</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Armenia"); setPage(1); }} className="cursor-pointer">Armenia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Australia"); setPage(1); }} className="cursor-pointer">Australia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Austria"); setPage(1); }} className="cursor-pointer">Austria</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Azerbaijan"); setPage(1); }} className="cursor-pointer">Azerbaijan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bahamas"); setPage(1); }} className="cursor-pointer">Bahamas</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bahrain"); setPage(1); }} className="cursor-pointer">Bahrain</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bangladesh"); setPage(1); }} className="cursor-pointer">Bangladesh</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Barbados"); setPage(1); }} className="cursor-pointer">Barbados</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Belarus"); setPage(1); }} className="cursor-pointer">Belarus</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Belgium"); setPage(1); }} className="cursor-pointer">Belgium</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Belize"); setPage(1); }} className="cursor-pointer">Belize</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Benin"); setPage(1); }} className="cursor-pointer">Benin</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bhutan"); setPage(1); }} className="cursor-pointer">Bhutan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bolivia"); setPage(1); }} className="cursor-pointer">Bolivia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bosnia and Herzegovina"); setPage(1); }} className="cursor-pointer">Bosnia and Herzegovina</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Botswana"); setPage(1); }} className="cursor-pointer">Botswana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Brazil"); setPage(1); }} className="cursor-pointer">Brazil</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Brunei"); setPage(1); }} className="cursor-pointer">Brunei</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Bulgaria"); setPage(1); }} className="cursor-pointer">Bulgaria</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Burkina Faso"); setPage(1); }} className="cursor-pointer">Burkina Faso</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Burundi"); setPage(1); }} className="cursor-pointer">Burundi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Cambodia"); setPage(1); }} className="cursor-pointer">Cambodia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Cameroon"); setPage(1); }} className="cursor-pointer">Cameroon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Canada"); setPage(1); }} className="cursor-pointer">Canada</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Cape Verde"); setPage(1); }} className="cursor-pointer">Cape Verde</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Central African Republic"); setPage(1); }} className="cursor-pointer">Central African Republic</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Chad"); setPage(1); }} className="cursor-pointer">Chad</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Chile"); setPage(1); }} className="cursor-pointer">Chile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("China"); setPage(1); }} className="cursor-pointer">China</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Colombia"); setPage(1); }} className="cursor-pointer">Colombia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Comoros"); setPage(1); }} className="cursor-pointer">Comoros</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Congo"); setPage(1); }} className="cursor-pointer">Congo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Costa Rica"); setPage(1); }} className="cursor-pointer">Costa Rica</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Croatia"); setPage(1); }} className="cursor-pointer">Croatia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Cuba"); setPage(1); }} className="cursor-pointer">Cuba</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Cyprus"); setPage(1); }} className="cursor-pointer">Cyprus</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Czech Republic"); setPage(1); }} className="cursor-pointer">Czech Republic</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Denmark"); setPage(1); }} className="cursor-pointer">Denmark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Djibouti"); setPage(1); }} className="cursor-pointer">Djibouti</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Dominica"); setPage(1); }} className="cursor-pointer">Dominica</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Dominican Republic"); setPage(1); }} className="cursor-pointer">Dominican Republic</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Ecuador"); setPage(1); }} className="cursor-pointer">Ecuador</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Egypt"); setPage(1); }} className="cursor-pointer">Egypt</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("El Salvador"); setPage(1); }} className="cursor-pointer">El Salvador</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Equatorial Guinea"); setPage(1); }} className="cursor-pointer">Equatorial Guinea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Eritrea"); setPage(1); }} className="cursor-pointer">Eritrea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Estonia"); setPage(1); }} className="cursor-pointer">Estonia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Ethiopia"); setPage(1); }} className="cursor-pointer">Ethiopia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Fiji"); setPage(1); }} className="cursor-pointer">Fiji</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Finland"); setPage(1); }} className="cursor-pointer">Finland</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("France"); setPage(1); }} className="cursor-pointer">France</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Gabon"); setPage(1); }} className="cursor-pointer">Gabon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Gambia"); setPage(1); }} className="cursor-pointer">Gambia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Georgia"); setPage(1); }} className="cursor-pointer">Georgia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Germany"); setPage(1); }} className="cursor-pointer">Germany</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Ghana"); setPage(1); }} className="cursor-pointer">Ghana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Greece"); setPage(1); }} className="cursor-pointer">Greece</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Grenada"); setPage(1); }} className="cursor-pointer">Grenada</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Guatemala"); setPage(1); }} className="cursor-pointer">Guatemala</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Guinea"); setPage(1); }} className="cursor-pointer">Guinea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Guinea-Bissau"); setPage(1); }} className="cursor-pointer">Guinea-Bissau</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Guyana"); setPage(1); }} className="cursor-pointer">Guyana</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Haiti"); setPage(1); }} className="cursor-pointer">Haiti</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Honduras"); setPage(1); }} className="cursor-pointer">Honduras</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Hungary"); setPage(1); }} className="cursor-pointer">Hungary</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Iceland"); setPage(1); }} className="cursor-pointer">Iceland</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("India"); setPage(1); }} className="cursor-pointer">India</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Indonesia"); setPage(1); }} className="cursor-pointer">Indonesia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Iran"); setPage(1); }} className="cursor-pointer">Iran</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Iraq"); setPage(1); }} className="cursor-pointer">Iraq</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Ireland"); setPage(1); }} className="cursor-pointer">Ireland</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Israel"); setPage(1); }} className="cursor-pointer">Israel</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Italy"); setPage(1); }} className="cursor-pointer">Italy</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Jamaica"); setPage(1); }} className="cursor-pointer">Jamaica</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Japan"); setPage(1); }} className="cursor-pointer">Japan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Jordan"); setPage(1); }} className="cursor-pointer">Jordan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Kazakhstan"); setPage(1); }} className="cursor-pointer">Kazakhstan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Kenya"); setPage(1); }} className="cursor-pointer">Kenya</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Kiribati"); setPage(1); }} className="cursor-pointer">Kiribati</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Kuwait"); setPage(1); }} className="cursor-pointer">Kuwait</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Kyrgyzstan"); setPage(1); }} className="cursor-pointer">Kyrgyzstan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Laos"); setPage(1); }} className="cursor-pointer">Laos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Latvia"); setPage(1); }} className="cursor-pointer">Latvia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Lebanon"); setPage(1); }} className="cursor-pointer">Lebanon</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Lesotho"); setPage(1); }} className="cursor-pointer">Lesotho</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Liberia"); setPage(1); }} className="cursor-pointer">Liberia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Libya"); setPage(1); }} className="cursor-pointer">Libya</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Liechtenstein"); setPage(1); }} className="cursor-pointer">Liechtenstein</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Lithuania"); setPage(1); }} className="cursor-pointer">Lithuania</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Luxembourg"); setPage(1); }} className="cursor-pointer">Luxembourg</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Madagascar"); setPage(1); }} className="cursor-pointer">Madagascar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Malawi"); setPage(1); }} className="cursor-pointer">Malawi</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Malaysia"); setPage(1); }} className="cursor-pointer">Malaysia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Maldives"); setPage(1); }} className="cursor-pointer">Maldives</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mali"); setPage(1); }} className="cursor-pointer">Mali</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Malta"); setPage(1); }} className="cursor-pointer">Malta</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Marshall Islands"); setPage(1); }} className="cursor-pointer">Marshall Islands</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mauritania"); setPage(1); }} className="cursor-pointer">Mauritania</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mauritius"); setPage(1); }} className="cursor-pointer">Mauritius</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mexico"); setPage(1); }} className="cursor-pointer">Mexico</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Micronesia"); setPage(1); }} className="cursor-pointer">Micronesia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Moldova"); setPage(1); }} className="cursor-pointer">Moldova</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Monaco"); setPage(1); }} className="cursor-pointer">Monaco</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mongolia"); setPage(1); }} className="cursor-pointer">Mongolia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Montenegro"); setPage(1); }} className="cursor-pointer">Montenegro</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Morocco"); setPage(1); }} className="cursor-pointer">Morocco</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Mozambique"); setPage(1); }} className="cursor-pointer">Mozambique</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Myanmar"); setPage(1); }} className="cursor-pointer">Myanmar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Namibia"); setPage(1); }} className="cursor-pointer">Namibia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Nauru"); setPage(1); }} className="cursor-pointer">Nauru</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Nepal"); setPage(1); }} className="cursor-pointer">Nepal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Netherlands"); setPage(1); }} className="cursor-pointer">Netherlands</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("New Zealand"); setPage(1); }} className="cursor-pointer">New Zealand</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Nicaragua"); setPage(1); }} className="cursor-pointer">Nicaragua</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Niger"); setPage(1); }} className="cursor-pointer">Niger</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Nigeria"); setPage(1); }} className="cursor-pointer">Nigeria</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("North Korea"); setPage(1); }} className="cursor-pointer">North Korea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("North Macedonia"); setPage(1); }} className="cursor-pointer">North Macedonia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Norway"); setPage(1); }} className="cursor-pointer">Norway</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Oman"); setPage(1); }} className="cursor-pointer">Oman</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Pakistan"); setPage(1); }} className="cursor-pointer">Pakistan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Palau"); setPage(1); }} className="cursor-pointer">Palau</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Palestine"); setPage(1); }} className="cursor-pointer">Palestine</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Panama"); setPage(1); }} className="cursor-pointer">Panama</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Papua New Guinea"); setPage(1); }} className="cursor-pointer">Papua New Guinea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Paraguay"); setPage(1); }} className="cursor-pointer">Paraguay</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Peru"); setPage(1); }} className="cursor-pointer">Peru</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Philippines"); setPage(1); }} className="cursor-pointer">Philippines</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Poland"); setPage(1); }} className="cursor-pointer">Poland</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Portugal"); setPage(1); }} className="cursor-pointer">Portugal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Qatar"); setPage(1); }} className="cursor-pointer">Qatar</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Romania"); setPage(1); }} className="cursor-pointer">Romania</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Russia"); setPage(1); }} className="cursor-pointer">Russia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Rwanda"); setPage(1); }} className="cursor-pointer">Rwanda</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Saint Kitts and Nevis"); setPage(1); }} className="cursor-pointer">Saint Kitts and Nevis</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Saint Lucia"); setPage(1); }} className="cursor-pointer">Saint Lucia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Saint Vincent and the Grenadines"); setPage(1); }} className="cursor-pointer">Saint Vincent and the Grenadines</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Samoa"); setPage(1); }} className="cursor-pointer">Samoa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("San Marino"); setPage(1); }} className="cursor-pointer">San Marino</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Sao Tome and Principe"); setPage(1); }} className="cursor-pointer">Sao Tome and Principe</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Saudi Arabia"); setPage(1); }} className="cursor-pointer">Saudi Arabia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Senegal"); setPage(1); }} className="cursor-pointer">Senegal</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Serbia"); setPage(1); }} className="cursor-pointer">Serbia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Seychelles"); setPage(1); }} className="cursor-pointer">Seychelles</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Sierra Leone"); setPage(1); }} className="cursor-pointer">Sierra Leone</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Singapore"); setPage(1); }} className="cursor-pointer">Singapore</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Slovakia"); setPage(1); }} className="cursor-pointer">Slovakia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Slovenia"); setPage(1); }} className="cursor-pointer">Slovenia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Solomon Islands"); setPage(1); }} className="cursor-pointer">Solomon Islands</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Somalia"); setPage(1); }} className="cursor-pointer">Somalia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("South Africa"); setPage(1); }} className="cursor-pointer">South Africa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("South Korea"); setPage(1); }} className="cursor-pointer">South Korea</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("South Sudan"); setPage(1); }} className="cursor-pointer">South Sudan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Spain"); setPage(1); }} className="cursor-pointer">Spain</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Sri Lanka"); setPage(1); }} className="cursor-pointer">Sri Lanka</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Sudan"); setPage(1); }} className="cursor-pointer">Sudan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Suriname"); setPage(1); }} className="cursor-pointer">Suriname</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Sweden"); setPage(1); }} className="cursor-pointer">Sweden</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Switzerland"); setPage(1); }} className="cursor-pointer">Switzerland</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Syria"); setPage(1); }} className="cursor-pointer">Syria</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Taiwan"); setPage(1); }} className="cursor-pointer">Taiwan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Tajikistan"); setPage(1); }} className="cursor-pointer">Tajikistan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Tanzania"); setPage(1); }} className="cursor-pointer">Tanzania</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Thailand"); setPage(1); }} className="cursor-pointer">Thailand</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Timor-Leste"); setPage(1); }} className="cursor-pointer">Timor-Leste</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Togo"); setPage(1); }} className="cursor-pointer">Togo</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Tonga"); setPage(1); }} className="cursor-pointer">Tonga</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Trinidad and Tobago"); setPage(1); }} className="cursor-pointer">Trinidad and Tobago</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Tunisia"); setPage(1); }} className="cursor-pointer">Tunisia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Turkey"); setPage(1); }} className="cursor-pointer">Turkey</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Turkmenistan"); setPage(1); }} className="cursor-pointer">Turkmenistan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Tuvalu"); setPage(1); }} className="cursor-pointer">Tuvalu</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Uganda"); setPage(1); }} className="cursor-pointer">Uganda</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Ukraine"); setPage(1); }} className="cursor-pointer">Ukraine</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("United Arab Emirates"); setPage(1); }} className="cursor-pointer">United Arab Emirates</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("United Kingdom"); setPage(1); }} className="cursor-pointer">United Kingdom</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("United States"); setPage(1); }} className="cursor-pointer">United States</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Uruguay"); setPage(1); }} className="cursor-pointer">Uruguay</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Uzbekistan"); setPage(1); }} className="cursor-pointer">Uzbekistan</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Vanuatu"); setPage(1); }} className="cursor-pointer">Vanuatu</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Vatican City"); setPage(1); }} className="cursor-pointer">Vatican City</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Venezuela"); setPage(1); }} className="cursor-pointer">Venezuela</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Vietnam"); setPage(1); }} className="cursor-pointer">Vietnam</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Yemen"); setPage(1); }} className="cursor-pointer">Yemen</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Zambia"); setPage(1); }} className="cursor-pointer">Zambia</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { setSelectedCountry("Zimbabwe"); setPage(1); }} className="cursor-pointer">Zimbabwe</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="h-11 bg-[#D5B15F] text-black cursor-pointer">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white">
                <DropdownMenuItem onClick={() => downloadPDF(users)} className="cursor-pointer">
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(users)} className="cursor-pointer">
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadExcel(users)} className="cursor-pointer">
                  Download as Excel
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
                      <h3 className="text-lg font-semibold text-white flex-1">{item.name || "N/A"}</h3>
                      <ActionMenu user={item} onReplace={fetchUsers} canEdit={hasEditAccess} />
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
                          
                            {item.name || "N/A"}
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
                            <ActionMenu user={item} onReplace={fetchUsers} canEdit={hasEditAccess} />
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

function ActionMenu({ user, onReplace, canEdit }: { user: User; onReplace: () => void; canEdit: boolean }) {
  const [replaceModalOpen, setReplaceModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const { hasPermission } = useAuth();
  const canGet = hasPermission('USER_MANAGEMENT.GET');

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white">
          {canGet && (
            <DropdownMenuItem onClick={() => setViewModalOpen(true)} className="cursor-pointer">
              View
            </DropdownMenuItem>
          )}
          {canEdit && <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>}
          {canEdit && user.status === 2 && (
            <DropdownMenuItem onClick={() => setReplaceModalOpen(true)} className="cursor-pointer">
              Replace
            </DropdownMenuItem>
          )}
          {/* {canEdit && (
            <DropdownMenuItem className="text-red-500 cursor-pointer">
              Delete
            </DropdownMenuItem>
          )} */}
        </DropdownMenuContent>
      </DropdownMenu>

      {canGet && (
        <ViewUserModal
          open={viewModalOpen}
          onClose={() => setViewModalOpen(false)}
          userId={user.userId}
        />
      )}

      {canEdit && (
        <ReplaceDelegateModal
          open={replaceModalOpen}
          onClose={() => setReplaceModalOpen(false)}
          user={user}
          onSuccess={onReplace}
        />
      )}
    </>
  );
}
