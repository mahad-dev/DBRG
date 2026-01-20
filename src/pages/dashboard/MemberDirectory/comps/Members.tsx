import { useState, useEffect, useRef, useCallback } from "react";
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
import { Search, Loader2, Mail } from "lucide-react";
import { memberDirectoryApi, type Member } from "@/services/memberDirectoryApi";
import { toast } from "react-toastify";
import ContactMemberModal from "./ContactMemberModal";
import ViewProfileModal from "./ViewProfileModal";

// Helper function to get initials from name or email
const getInitials = (name: string, email: string): string => {
  if (name && name.trim()) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  }
  // Fallback to email first letter
  return email.substring(0, 1).toUpperCase();
};

// Helper function to generate random background color
const getRandomColor = (id: string): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#264653',
    '#8338EC', '#3A86FF', '#FB5607', '#FF006E', '#FFBE0B'
  ];
  // Use id to consistently generate same color for same member
  const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

// Helper function to get membership type name
const getMembershipTypeName = (type: number): string => {
  switch (type) {
    case 1: return "Principal Member";
    case 2: return "Contributing Member";
    case 3: return "Affiliate Member";
    case 4: return "Associate Member";
    default: return "Member";
  }
};

const PAGE_SIZE = 9;

export default function MembersDirectory({ onSwitchToInbox }: { onSwitchToInbox?: () => void }) {
  const [search, setSearch] = useState("");
  const [country] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedMemberForProfile, setSelectedMemberForProfile] = useState<Member | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

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
  const fetchMembers = useCallback(async (page: number, searchQuery: string, append: boolean = false) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response = await memberDirectoryApi.getMembers({
        Search: searchQuery || undefined,
        Country: country || undefined,
        PageNumber: page,
        PageSize: PAGE_SIZE,
      });

      setTotalPages(response.totalPages);
      setTotalCount(response.totalCount);
      setHasMore(page < response.totalPages);

      if (append) {
        setMembers(prev => [...prev, ...response.data]);
      } else {
        setMembers(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast.error(error.message || "Failed to fetch members");
      if (!append) {
        setMembers([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [country]);

  // Load more members when scrolling
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchMembers(nextPage, search, true);
  }, [currentPage, search, hasMore, loadingMore, fetchMembers]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loading, loadMore]);

  // Initial fetch on mount
  useEffect(() => {
    fetchMembers(1, search, false);
  }, [country]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      setMembers([]);
      setHasMore(true);
      fetchMembers(1, search, false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search]);



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
              className="bg-[#FFFFFF26] border-none rounded-2xl text-white w-full h-full flex flex-col"
            >
              <CardContent className="flex flex-col gap-4 px-6 flex-1">
                {/* Top Section */}
                <div className="flex items-center gap-4">
                  {member.profilePicturePath ? (
                    <img
                      src={member.profilePicturePath}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-lg flex-shrink-0"
                      style={{ backgroundColor: getRandomColor(member.id) }}
                    >
                      {getInitials(member.name, member.email)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-plusjakarta font-semibold text-[16px] leading-[150%] tracking-[-0.02em] text-[#C6A95F] truncate">
                      {member.name}
                    </p>
                    <p className="font-plusjakarta font-normal text-[12px] leading-[100%] tracking-[-0.01em] text-white/70 truncate">
                      {member.email}
                    </p>
                  </div>
                </div>

                {/* Company and Country */}
                <div className="flex-1">
                  <p className="font-plusjakarta font-semibold text-[14px] leading-[150%] tracking-normal text-white truncate">
                    {member.company || "N/A"}
                  </p>
                  <p className="font-plusjakarta font-normal text-[12px] leading-[100%] tracking-[-0.01em] text-white/60 mt-1 truncate">
                    {member.country || "N/A"}
                  </p>
                </div>

                {/* Membership Type */}
                <div>
                  <p className="font-plusjakarta font-medium text-[14px] leading-[150%] tracking-normal text-[#C6A95F]">
                    {getMembershipTypeName(member.membershipType)}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full mt-auto">
                  <Button
                    onClick={() => {
                      setSelectedMember(member);
                      setIsModalOpen(true);
                    }}
                    className="
                      cursor-pointer
                      font-inter font-normal text-[14px] leading-[100%] tracking-normal
                      text-center flex-1 h-[37px]
                      rounded-[10px] p-2.5
                      bg-[#C6A95F] text-black hover:bg-[#C6A95F]/90
                    "
                  >
                    Contact Member
                  </Button>

                  <Button
                    onClick={() => {
                      setSelectedMemberForProfile(member);
                      setIsProfileModalOpen(true);
                    }}
                    className="
                      cursor-pointer
                      font-inter font-normal text-[14px] leading-[100%] tracking-normal text-black text-center
                      bg-white hover:bg-white/90
                      flex-1 h-[37px] rounded-[10px] p-2.5
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

      {/* Infinite Scroll Trigger */}
      {!loading && members.length > 0 && (
        <div ref={loadMoreRef} className="flex flex-col items-center justify-center py-6">
          {loadingMore ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#C6A95F]" />
              <span className="text-white/70 font-inter font-normal text-[14px]">
                Loading more...
              </span>
            </div>
          ) : hasMore ? (
            <span className="text-white/50 font-inter font-normal text-[12px]">
              Scroll for more
            </span>
          ) : totalCount > 0 ? (
            <span className="text-white/50 font-inter font-normal text-[12px]">
              Showing all {totalCount} members
            </span>
          ) : null}
        </div>
      )}

      {/* Contact Member Modal */}
      {selectedMember && (
        <ContactMemberModal
          memberId={selectedMember.id}
          memberName={selectedMember.name}
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      )}

      {/* View Profile Modal */}
      {selectedMemberForProfile && (
        <ViewProfileModal
          userId={selectedMemberForProfile.id}
          isOpen={isProfileModalOpen}
          onOpenChange={setIsProfileModalOpen}
        />
      )}

      {/* Floating Action Button for Inbox */}
      {onSwitchToInbox && (
        <Button
          onClick={onSwitchToInbox}
          className="cursor-pointer fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#C6A95F] text-black shadow-lg hover:bg-[#C6A95F]/90 hover:shadow-xl transition-all duration-200 z-50"
          size="icon"
        >
          <Mail className="h-6 w-6" />
        </Button>
      )}
    </div>
  );
}
