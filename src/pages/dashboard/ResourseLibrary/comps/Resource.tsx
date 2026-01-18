"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Loader2} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ResourceSection from "./ResourceSection";
import MemberSection from "./MemberSection";
import { getResources } from "@/services/cmsApi";
import { memberDirectoryApi } from "@/services/memberDirectoryApi";
import type { CmsItem } from "@/types/cms";
import type { Member } from "@/services/memberDirectoryApi";
import { toast } from "react-toastify";

type FilterType = "all" | "resources" | "members";

export default function ResourceLibrary() {
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<CmsItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingResources, setLoadingResources] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    fetchResources();
    fetchMembers();
  }, []);

  // Auto-search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (search) {
        handleSearch();
      } else {
        // Reset to initial data when search is cleared
        fetchResources();
        fetchMembers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, filter]);

  const fetchResources = async () => {
    try {
      setLoadingResources(true);
      const response = await getResources({
        PageNumber: 1,
        PageSize: 10,
      });

      if (response.status && response.data?.items) {
        setResources(response.data.items);
      }
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      toast.error(error?.response?.data?.message || "Failed to load resources");
    } finally {
      setLoadingResources(false);
    }
  };

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      const response = await memberDirectoryApi.getMembers({
        PageNumber: 1,
        PageSize: 10,
      });

      if (response.data) {
        setMembers(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching members:", error);
      toast.error("Failed to load members");
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleSearch = async () => {
    // Search resources
    if (filter === "all" || filter === "resources") {
      try {
        setLoadingResources(true);
        const response = await getResources({
          Search: search,
          PageNumber: 1,
          PageSize: 10,
        });

        if (response.status && response.data?.items) {
          setResources(response.data.items);
        }
      } catch (error: any) {
        console.error("Error searching resources:", error);
        toast.error(error?.response?.data?.message || "Failed to search resources");
      } finally {
        setLoadingResources(false);
      }
    }

    // Search members
    if (filter === "all" || filter === "members") {
      try {
        setLoadingMembers(true);
        const response = await memberDirectoryApi.getMembers({
          Search: search,
          PageNumber: 1,
          PageSize: 10,
        });

        if (response.data) {
          setMembers(response.data);
        }
      } catch (error: any) {
        console.error("Error searching members:", error);
        toast.error("Failed to search members");
      } finally {
        setLoadingMembers(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getFilterLabel = () => {
    switch (filter) {
      case "all":
        return "All";
      case "resources":
        return "Resources";
      case "members":
        return "Members";
      default:
        return "All";
    }
  };

  const shouldShowResources = filter === "all" || filter === "resources";
  const shouldShowMembers = filter === "all" || filter === "members";

  const transformToResourceFormat = (items: CmsItem[]) => {
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      type: item.documentPaths && item.documentPaths.length > 0
        ? item.documentPaths[0].split('.').pop()?.toUpperCase() || "FILE"
        : "FILE",
      date: new Date(item.date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      img: item.bannerPath || "/static/resourseImg.jpg",
      documentPaths: item.documentPaths || [],
      link: item.link,
    }));
  };

  const resourcesFormatted = transformToResourceFormat(resources);

  return (
    <div className="w-full min-h-screen flex flex-col gap-10 px-4 sm:px-6 lg:px-12 py-6">

      {/* Header */}
      <h1 className="text-[28px] md:text-[36px] font-semibold text-[#C6A95F]">
        Resource Library
      </h1>

      {/* Search + Filter */}
      <div className="flex flex-wrap gap-4">
        <div className="relative w-full sm:w-[340px]">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search"
            className="h-14 bg-[#1A1A1A] border border-[#2A2A2A] text-white pl-12 rounded-xl"
          />
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white cursor-pointer"
            onClick={handleSearch}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-14 bg-[#1A1A1A] border border-[#2A2A2A] text-white rounded-xl flex items-center gap-2 px-6 cursor-pointer hover:bg-[#2A2A2A]">
              <SlidersHorizontal /> Filter: {getFilterLabel()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-[#1A1A1A] border border-[#2A2A2A] text-white">
            <DropdownMenuItem
              onClick={() => setFilter("all")}
              className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A]"
            >
              All
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilter("resources")}
              className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A]"
            >
              Resources
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setFilter("members")}
              className="cursor-pointer hover:bg-[#2A2A2A] focus:bg-[#2A2A2A]"
            >
              Members
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Resources Section */}
      {shouldShowResources && (
        loadingResources ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-[#C6A95F] animate-spin" />
          </div>
        ) : (
          <ResourceSection title="Resources" items={resourcesFormatted} enableScroll={filter === "all"} />
        )
      )}

      {/* Members Section */}
      {shouldShowMembers && (
        loadingMembers ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-[#C6A95F] animate-spin" />
          </div>
        ) : (
          <MemberSection title="Members" members={members} enableScroll={filter === "all"} />
        )
      )}
    </div>
  );
}
