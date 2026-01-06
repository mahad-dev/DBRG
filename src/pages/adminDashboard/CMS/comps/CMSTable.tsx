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
import { Search, Filter, Calendar, MoreVertical, Download } from "lucide-react";
import EditAndAddModal from "./EditAndAddModal";
import { useAuth } from "@/context/AuthContext";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";

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
];

const ITEMS_PER_PAGE = 6;

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: CMSItem[]) => {
  const headers = ["Title", "Description", "Status", "Date"];
  const csvData = data.map(item => [
    item.title || "N/A",
    item.description || "N/A",
    item.status || "N/A",
    item.date || "N/A"
  ]);

  generateCSVReport(headers, csvData, "cms_report");
};

const downloadExcel = (data: CMSItem[]) => {
  const headers = ["Title", "Description", "Status", "Date"];
  const excelData = data.map(item => [
    item.title || "N/A",
    item.description || "N/A",
    item.status || "N/A",
    item.date || "N/A"
  ]);

  generateExcelReport(headers, excelData, "cms_report");
};

const downloadPDF = (data: CMSItem[]) => {
  const headers = ["Title", "Description", "Status", "Date"];
  const pdfData = data.map(item => [
    item.title || "N/A",
    item.description || "N/A",
    item.status || "N/A",
    item.date || "N/A"
  ]);

  generatePDFReport({
    title: "CMS Report",
    headers,
    data: pdfData,
    filename: "cms_report"
  });
};

/* ================= COMPONENT ================= */

export default function CMSTable() {
  const { canCreate, canEdit } = useAuth();
  const hasCreateAccess = canCreate('CMS');
  const hasEditAccess = canEdit('CMS');
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editModal,setEditModal]=useState(false);

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


  
const handleEdit = () => {

  setEditModal(true);
};

  return (
    <div className="min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* ===== HEADER ===== */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-semibold text-[#C6A95F] text-center sm:text-left">
            CMS Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:justify-end">
            {hasCreateAccess && (
              <Button className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto cursor-pointer">
                Add
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
                <DropdownMenuItem onClick={() => downloadPDF(paginated)} className="cursor-pointer">
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(paginated)} className="cursor-pointer">
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadExcel(paginated)} className="cursor-pointer">
                  Download as Excel
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* ===== SEARCH & FILTER ===== */}
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  {/* Title */}
  <h1 className="text-2xl font-semibold whitespace-nowrap">
    CMS List
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
                  <h3 className="text-lg font-semibold text-white flex-1">{item.title || "N/A"}</h3>
                  <ActionMenu onEdit={() => handleEdit()} canEdit={hasEditAccess} />
                </div>
                <p className="text-sm text-white/80 mb-3 leading-relaxed">{item.description || "N/A"}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    item.status === 'Published' ? 'bg-green-500/20 text-green-300' :
                    item.status === 'Draft' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-red-500/20 text-red-300'
                  }`}>
                    {item.status || "N/A"}
                  </span>
                  <span className="text-sm text-white/60">{item.date || "N/A"}</span>
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
                    <TableHead className="py-4 px-2">Title</TableHead>
                    <TableHead className="py-4 px-4 sm:px-16">Description</TableHead>
                    <TableHead className="py-4 px-2">Status</TableHead>
                    <TableHead className="py-4 px-2">Date</TableHead>
                    <TableHead className="py-4 px-2">Action</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {paginated.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="py-4 px-2">{item.title || "N/A"}</TableCell>
                      <TableCell className="py-4 px-4 sm:px-16">
                        {item.description || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 px-2">
                        {item.status || "N/A"}
                      </TableCell>
                      <TableCell className="py-4 px-2">{item.date || "N/A"}</TableCell>
                      <TableCell className="py-4 px-2">
                        <ActionMenu onEdit={() => handleEdit()} canEdit={hasEditAccess} />
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

      {/* ===== MODALS ===== */}
          <EditAndAddModal
            open={editModal}
            onOpenChange={setEditModal}
            onConfirm={handleEdit}
          />
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

function ActionMenu({
  onEdit,
  canEdit,
}:{
  onEdit: () => void;
  canEdit: boolean;
}) {
  const { hasPermission } = useAuth();
  const canGet = hasPermission('CMS.GET');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MoreVertical className="w-5 h-5 cursor-pointer text-white" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white">
        {canGet && <DropdownMenuItem className="cursor-pointer">View</DropdownMenuItem>}
        {canEdit && <DropdownMenuItem onClick={onEdit} className="cursor-pointer">Edit</DropdownMenuItem>}
        {canEdit && (
          <DropdownMenuItem className="text-red-500 cursor-pointer">
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
