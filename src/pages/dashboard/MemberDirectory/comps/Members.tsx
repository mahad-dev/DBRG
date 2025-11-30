import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Map } from "lucide-react";

export default function MembersDirectory() {
  const [search, setSearch] = useState("");

  const members = [
    {
      id: 1,
      company: "Arbaz",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company1.jpg",
    },
    {
      id: 2,
      company: "Company Name",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company2.jpg",
    },
    {
      id: 3,
      company: "Company Name",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company1.jpg",
    },
    {
      id: 4,
      company: "Company Name",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company2.jpg",
    },
    {
      id: 5,
      company: "Company Name",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company1.jpg",
    },
    {
      id: 6,
      company: "Company Name",
      location: "New York City, USA",
      type: "Membership Type",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
      avatar: "/static/company2.jpg",
    },
  ];

  // Filter members based on search input
  const filteredMembers = members.filter((member) =>
    member.company.toLowerCase().includes(search.toLowerCase())
  );

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

        {/* Filter Button */}
        <Button
          variant="outline"
          className="flex items-center gap-2 h-12 rounded-xl border-white text-white w-full md:w-auto"
        >
          <Map className="h-5 w-5" /> Country
        </Button>
      </div>

      {/* Section Title */}
      <h2 className="font-plusjakarta font-semibold text-[22px] md:text-[24px] leading-[150%] tracking-[-0.03em] text-[#C6A95F] mt-4">
        Members
      </h2>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Card
              key={member.id}
              className="bg-[#FFFFFF26] border-none rounded-2xl text-white w-full"
            >
              <CardContent className="flex flex-col gap-4">
                {/* Top Section */}
                <div className="flex items-center gap-4">
                  <img
                    src={member.avatar}
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
                    Membership Type
                  </p>

                  <p className="font-inter font-normal text-[14px] md:text-[16px] leading-[1.2] tracking-normal text-white mt-1">
                    {member.description}
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex flex-wrap items-center justify-between mt-2 gap-3 w-full">
                  <Button
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
    </div>
  );
}
