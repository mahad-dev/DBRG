 "use client";

import { useState, useEffect } from "react";
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
import { Search, Filter, CalendarIcon, MoreVertical, Download, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import EditAndAddModal from "./EditAndAddModal";
import ViewModal from "./ViewModal";
import { useAuth } from "@/context/AuthContext";
import { generatePDFReport, generateCSVReport, generateExcelReport } from "@/utils/pdfExport";
import { getAllCms, updateCms } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { CategoryLabels } from "@/types/cms";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 10;

/* ================= EXPORT FUNCTIONS ================= */

const downloadCSV = (data: CmsItem[]) => {
  const headers = ["Title", "Category", "Description", "Status", "Date"];
  const csvData = data.map(item => [
    item.title || "N/A",
    CategoryLabels[item.category] || "N/A",
    item.description || "N/A",
    item.isPublished ? "Published" : "Draft",
    new Date(item.date).toLocaleDateString() || "N/A"
  ]);

  generateCSVReport(headers, csvData, "cms_report");
};

const downloadExcel = (data: CmsItem[]) => {
  const headers = ["Title", "Category", "Description", "Status", "Date"];
  const excelData = data.map(item => [
    item.title || "N/A",
    CategoryLabels[item.category] || "N/A",
    item.description || "N/A",
    item.isPublished ? "Published" : "Draft",
    new Date(item.date).toLocaleDateString() || "N/A"
  ]);

  generateExcelReport(headers, excelData, "cms_report");
};

const downloadPDF = (data: CmsItem[]) => {
  const headers = ["Title", "Category", "Description", "Status", "Date"];
  const pdfData = data.map(item => [
    item.title || "N/A",
    CategoryLabels[item.category] || "N/A",
    item.description || "N/A",
    item.isPublished ? "Published" : "Draft",
    new Date(item.date).toLocaleDateString() || "N/A"
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

  const [cmsItems, setCmsItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<boolean | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const [editModal, setEditModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // Fetch CMS data
  const fetchCmsData = async () => {
    try {
      setLoading(true);
      const response = await getAllCms({
        Search: search || undefined,
        IsPublished: statusFilter,
        StartDate: startDate ? startDate.toISOString() : undefined,
        EndDate: endDate ? endDate.toISOString() : undefined,
        PageNumber: page,
        PageSize: ITEMS_PER_PAGE,
      });

      console.log('API Response:', response); // Debug log

      // Handle different possible response structures
      if (response.status) {
        // Check if data is an array directly
        if (Array.isArray(response.data)) {
          setCmsItems(response.data);
          setTotalCount(response.data.length);
          setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        }
        // Check if data has an items property (like userApi)
        else if (response.data && typeof response.data === 'object' && 'items' in response.data && Array.isArray(response.data.items)) {
          setCmsItems(response.data.items);
          const dataWithItems = response.data as { items: CmsItem[]; totalCount?: number };
          const count = dataWithItems.totalCount || dataWithItems.items.length;
          setTotalCount(count);
          setTotalPages(Math.ceil(count / ITEMS_PER_PAGE));
        }
        // Fallback: empty array
        else {
          console.warn('Unexpected response structure:', response);
          setCmsItems([]);
          setTotalCount(0);
          setTotalPages(1);
        }
      } else {
        setCmsItems([]);
        setTotalCount(0);
        setTotalPages(1);
      }
    } catch (error: any) {
      console.error('Failed to fetch CMS data:', error);
      toast.error(error.message || 'Failed to load CMS data');
      setCmsItems([]); // Ensure it's always an array
      setTotalCount(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchCmsData();
  }, []);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 when search changes
      fetchCmsData();
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch when other filters change
  useEffect(() => {
    fetchCmsData();
  }, [page, statusFilter, startDate, endDate]);

  const handleView = (itemId: number) => {
    setSelectedItemId(itemId);
    setViewModal(true);
  };

  const handleEdit = (item: CmsItem) => {
    setEditItemId(item.id);
    setEditModal(true);
  };

  const handleEditFromView = (item: CmsItem) => {
    setEditItemId(item.id);
    setViewModal(false);
    setEditModal(true);
  };

  const handleAdd = () => {
    setEditItemId(null);
    setEditModal(true);
  };

  const handleTogglePublish = async (item: CmsItem) => {
    try {
      await updateCms({
        id: item.id,
        title: item.title,
        description: item.description,
        date: item.date,
        link: item.link || null,
        documentIds: item.documentIds,
        isPublished: !item.isPublished,
        category: item.category,
        bannerId: item.bannerId || 0,
      });

      toast.success(item.isPublished ? 'Item unpublished successfully' : 'Item published successfully');
      fetchCmsData(); // Refresh data
    } catch (error: any) {
      console.error('Failed to toggle publish status:', error);
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleModalSuccess = () => {
    fetchCmsData(); // Refresh data after create/update
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
              <Button onClick={handleAdd} className="bg-[#C6A95F] text-white hover:bg-[#bfa14f] w-full sm:w-auto cursor-pointer">
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
                <DropdownMenuItem onClick={() => downloadPDF(cmsItems)} className="cursor-pointer">
                  Download as PDF
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadCSV(cmsItems)} className="cursor-pointer">
                  Download as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => downloadExcel(cmsItems)} className="cursor-pointer">
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
    <div className="flex items-center gap-2 h-11 px-3 rounded-lg border border-white/20 bg-white/10 min-w-0 sm:min-w-[200px]">
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
          className="h-11 border-white/20 flex items-center justify-center gap-2 min-w-[100px] cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          Status
          {statusFilter !== undefined && (
            <span className="ml-1 w-2 h-2 rounded-full bg-[#C6A95F]" />
          )}
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
            setStatusFilter(true);
            setPage(1);
          }}
          className="cursor-pointer"
        >
          Published
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setStatusFilter(false);
            setPage(1);
          }}
          className="cursor-pointer"
        >
          Draft
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

    {/* Date Filter */}
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-11 border-white/20 flex items-center justify-center gap-2 min-w-[100px] cursor-pointer"
        >
          <CalendarIcon className="w-4 h-4" />
          Date
          {(startDate || endDate) && (
            <span className="ml-1 w-2 h-2 rounded-full bg-[#C6A95F]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4 bg-white" align="end">
        <div className="space-y-4">
          {/* Selected Dates Display - Clickable */}
          <div className="grid grid-cols-2 gap-3">
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md border border-gray-200 transition-colors">
                  <label className="text-xs font-medium text-gray-600 block mb-1 cursor-pointer">
                    Start Date
                  </label>
                  <div className="text-sm font-semibold text-gray-900">
                    {startDate ? format(startDate, "MMM dd, yyyy") : "Select"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date);
                    if (endDate && date && date > endDate) {
                      setEndDate(undefined);
                    }
                    setPage(1);
                  }}
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer hover:bg-gray-50 p-2 rounded-md border border-gray-200 transition-colors">
                  <label className="text-xs font-medium text-gray-600 block mb-1 cursor-pointer">
                    End Date
                  </label>
                  <div className="text-sm font-semibold text-gray-900">
                    {endDate ? format(endDate, "MMM dd, yyyy") : "Select"}
                  </div>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date);
                    setPage(1);
                  }}
                  disabled={(date) => startDate ? date < startDate : false}
                  className="rounded-md border-0"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Button */}
          {(startDate || endDate) && (
            <Button
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
                setPage(1);
              }}
              variant="outline"
              className="w-full text-sm cursor-pointer"
            >
              Clear Dates
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  </div>
</div>


        {/* ===== MOBILE CARDS ===== */}
        <div className="block sm:hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#C6A95F]" />
            </div>
          ) : cmsItems.length === 0 ? (
            <div className="text-center py-12 text-white/60">
              No CMS items found
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {cmsItems.map((item) => (
                  <div key={item.id} className="border border-white rounded-lg p-4 bg-white/5 shadow-lg">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white">{item.title || "N/A"}</h3>
                        <span className="text-xs text-[#C6A95F]">{CategoryLabels[item.category]}</span>
                      </div>
                      <ActionMenu
                        item={item}
                        onView={() => handleView(item.id)}
                        onEdit={() => handleEdit(item)}
                        onTogglePublish={() => handleTogglePublish(item)}
                        canEdit={hasEditAccess}
                      />
                    </div>
                    <p className="text-sm text-white/80 mb-3 leading-relaxed line-clamp-2">{item.description || "N/A"}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        item.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {item.isPublished ? 'Published' : 'Draft'}
                      </span>
                      <span className="text-sm text-white/60">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
              <FooterPagination
                page={page}
                total={totalPages}
                setPage={setPage}
                totalItems={totalCount}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>

        {/* ===== DESKTOP TABLE ===== */}
        <div className="hidden sm:block border border-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full table-fixed">
              <TableHeader className="sticky top-0 z-10 bg-[#101010]">
                <TableRow className="bg-white/5">
                  <TableHead className="py-4 px-3 w-[20%]">Title</TableHead>
                  <TableHead className="py-4 px-3 w-[12%]">Category</TableHead>
                  <TableHead className="py-4 px-3 w-[35%]">Description</TableHead>
                  <TableHead className="py-4 px-3 w-[12%]">Status</TableHead>
                  <TableHead className="py-4 px-3 w-[13%]">Date</TableHead>
                  <TableHead className="py-4 px-3 w-[8%] text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
            </Table>
            <ScrollArea className="h-[460px]">
              <Table className="min-w-full table-fixed">
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-[#C6A95F] mx-auto" />
                      </TableCell>
                    </TableRow>
                  ) : cmsItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-12 text-white/60">
                        No CMS items found
                      </TableCell>
                    </TableRow>
                  ) : (
                    cmsItems.map((item) => (
                      <TableRow key={item.id} className="hover:bg-white/5">
                        <TableCell className="py-4 px-3">
                          <div className="truncate max-w-full overflow-hidden" title={item.title}>
                            {item.title || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <span className="text-[#C6A95F] whitespace-nowrap">{CategoryLabels[item.category]}</span>
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <div className="line-clamp-2 text-sm leading-relaxed max-w-full overflow-hidden" title={item.description}>
                            {item.description || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full whitespace-nowrap inline-block ${
                            item.isPublished ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                          }`}>
                            {item.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-3">
                          <span className="text-sm whitespace-nowrap">
                            {new Date(item.date).toLocaleDateString()}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-3 text-center">
                          <ActionMenu
                            item={item}
                            onView={() => handleView(item.id)}
                            onEdit={() => handleEdit(item)}
                            onTogglePublish={() => handleTogglePublish(item)}
                            canEdit={hasEditAccess}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>

          <FooterPagination
            page={page}
            total={totalPages}
            setPage={setPage}
            totalItems={totalCount}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      </div>

      {/* ===== MODALS ===== */}
          <ViewModal
            open={viewModal}
            onOpenChange={setViewModal}
            itemId={selectedItemId}
            onEdit={handleEditFromView}
          />

          <EditAndAddModal
            open={editModal}
            onOpenChange={setEditModal}
            editItemId={editItemId}
            onSuccess={handleModalSuccess}
          />
    </div>

    
  );
}

/* ================= COMPONENTS ================= */



function FooterPagination({
  page,
  total,
  setPage,
  totalItems,
  itemsPerPage,
}: {
  page: number;
  total: number;
  setPage: (v: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}) {
  const perPage = itemsPerPage || 10;
  const startItem = totalItems && totalItems > 0 ? (page - 1) * perPage + 1 : 0;
  const endItem = totalItems && totalItems > 0 ? Math.min(page * perPage, totalItems) : 0;
  const totalPagesCalc = total > 0 ? total : 1;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 px-4 py-4 border-t border-white bg-[#101010] rounded-b-lg">
      <span className="text-sm text-white font-medium">
        {totalItems && totalItems > 0 ? (
          <>
            Showing {startItem}-{endItem} of {totalItems} items | Page {page} of {totalPagesCalc}
          </>
        ) : (
          <>Page {page} of {totalPagesCalc}</>
        )}
      </span>
      <div className="flex gap-3 justify-center sm:justify-end">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => setPage(Math.max(1, page - 1))}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px] cursor-pointer disabled:cursor-not-allowed"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPagesCalc}
          onClick={() => setPage(Math.min(totalPagesCalc, page + 1))}
          className="border-white text-white hover:bg-white/10 disabled:opacity-50 min-w-[80px] cursor-pointer disabled:cursor-not-allowed"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

function ActionMenu({
  item,
  onView,
  onEdit,
  onTogglePublish,
  canEdit,
}:{
  item: CmsItem;
  onView: () => void;
  onEdit: () => void;
  onTogglePublish: () => void;
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
        {canGet && <DropdownMenuItem onClick={onView} className="cursor-pointer">View</DropdownMenuItem>}
        {canEdit && <DropdownMenuItem onClick={onEdit} className="cursor-pointer">Edit</DropdownMenuItem>}
        {canEdit && (
          <DropdownMenuItem onClick={onTogglePublish} className="cursor-pointer">
            {item.isPublished ? 'Unpublish' : 'Publish'}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
