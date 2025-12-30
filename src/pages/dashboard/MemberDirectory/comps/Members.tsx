import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
import { Search, Map, ChevronLeft, ChevronRight, Loader2, X, Mail } from "lucide-react";
import { memberDirectoryApi, type Member } from "@/services/memberDirectoryApi";
import { toast } from "react-toastify";
import ContactMemberModal from "./ContactMemberModal";

export default function MembersDirectory({ onSwitchToInbox }: { onSwitchToInbox?: () => void }) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 6;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Common countries list (you can expand this)
  // const countries = [
  //   "United States",
  //   "United Kingdom",
  //   "Canada",
  //   "Australia",
  //   "Germany",
  //   "France",
  //   "Japan",
  //   "India",
  //   "China",
  //   "Brazil",
  //   "UAE",
  //   "Saudi Arabia",
  //   "Singapore",
  // ];

  // Fetch members from API
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await memberDirectoryApi.getMembers({
        Search: search || undefined,
        Country: country || undefined,
        PageNumber: currentPage,
        PageSize: pageSize,
      });

      setMembers(response.data);
      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast.error(error.message || "Failed to fetch members");
      setMembers([]);
      setTotalPages(1);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch members on component mount and when filters change
  useEffect(() => {
    fetchMembers();
  }, [currentPage, country]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchMembers();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Handle country selection
  const handleCountryChange = (value: string) => {
    setCountry(value);
    setCurrentPage(1);
  };

  // Clear country filter
  const clearCountryFilter = () => {
    setCountry("");
    setCurrentPage(1);
  };

  return (
    <div className="w-full min-h-screen flex flex-col gap-6">
      {/* Title */}
      <h1 className="font-inter font-semibold text-[28px] md:text-[38px] leading-[100%] tracking-normal text-[#C6A95F]">
        Member Directory
      </h1>

      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full">
        {/* Search Input */}
        <div className="relative w-full md:w-[350px]">
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              font-inter font-medium text-[18px] leading-[100%] tracking-[-0.01em] text-white
              placeholder:font-inter placeholder:font-medium placeholder:text-white
              bg-[#FFFFFF26] border-none h-12 pl-4 rounded-xl w-full
            "
          />
          <Search className="absolute right-3 top-3.5 h-5 w-5" color="white" />
        </div>

        {/* Country Filter */}
        {/* <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={country} onValueChange={handleCountryChange}>
            <SelectTrigger className="flex items-center gap-2 h-12 rounded-xl border-white text-white bg-transparent w-full md:w-[200px]">
              <Map className="h-5 w-5" />
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((countryName) => (
                <SelectItem key={countryName} value={countryName}>
                  {countryName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {country && (
            <Button
              variant="outline"
              size="icon"
              onClick={clearCountryFilter}
              className="h-12 w-12 rounded-xl border-white text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div> */}
      </div>

      {/* Section Title */}
      <h2 className="font-plusjakarta font-semibold text-[22px] md:text-[24px] leading-[150%] tracking-[-0.03em] text-[#C6A95F] mt-4">
        Members
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {loading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[#C6A95F]" />
          </div>
        ) : members.length > 0 ? (
          members.map((member) => (
            <Card
              key={member.id}
              className="bg-[#FFFFFF26] border-none rounded-2xl text-white w-full"
            >
              <CardContent className="flex flex-col gap-4">
                {/* Top Section */}
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar || "/static/company1.jpg"}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-plusjakarta font-semibold text-[16px] leading-[150%] tracking-[-0.02em] text-[#C6A95F]">
                      {member.company}
                    </p>
                    <p className="font-plusjakarta font-normal text-[12px] leading-[100%] tracking-[-0.01em] text-[#54577A]">
                      {member.location}
                    </p>
                  </div>
                </div>

                {/* Membership */}
                <div>
                  <p className="font-plusjakarta font-semibold text-[14px] leading-[200%] tracking-normal text-white">
                    {member.type || "Membership Type"}
                  </p>

                  <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[1.2] tracking-normal text-white mt-1">
                    {member.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-between mt-2 gap-3 w-full">
                  <Button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsModalOpen(true);
                    }}
                    className="
                      font-inter font-normal text-[14px] leading-[100%] tracking-normal
                      text-center w-full md:w-[132px] h-[37px]
                      rounded-[10px] p-2.5
                      bg-[#C6A95F] text-black
                    "
                  >
                    Contact Member
                  </Button>

                  <Button
                    className="
                      font-inter font-normal text-[14px] leading-[100%] tracking-normal text-black text-center
                      bg-white
                      w-full md:w-[115px] h-[37px] rounded-[10px] p-2.5
                    "
                  >
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-white col-span-full text-center mt-6">
            No members found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-10 w-10 rounded-lg border-white text-white disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-white font-inter font-medium text-[14px]">
              Page {currentPage} of {totalPages}
            </span>
            <span className="text-white/70 font-inter font-normal text-[12px]">
              ({totalCount} members)
            </span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-10 w-10 rounded-lg border-white text-white disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Contact Member Modal */}
      {selectedMember && (
        <ContactMemberModal
          memberId={selectedMember.id.toString()}
          memberName={selectedMember.company}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* Floating Action Button for Inbox */}
      {onSwitchToInbox && (
        <Button
          onClick={onSwitchToInbox}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#C6A95F] text-black shadow-lg hover:bg-[#C6A95F]/90 hover:shadow-xl transition-all duration-200 z-50"
          size="icon"
        >
          <Mail className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
