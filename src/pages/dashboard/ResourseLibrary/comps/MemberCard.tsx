"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ContactMemberModal from "../../MemberDirectory/comps/ContactMemberModal";
import ViewProfileModal from "../../MemberDirectory/comps/ViewProfileModal";

interface MemberCardProps {
  id: number;
  memberId: string;
  title: string; // company name
  name: string;
  email: string;
  membershipType: number;
  country: string;
  img: string; // profilePicturePath
}

// Helper function to get initials from name or company
const getInitials = (name: string, company: string): string => {
  if (name && name.trim()) {
    const nameParts = name.trim().split(' ');
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    return name.trim().substring(0, 2).toUpperCase();
  }
  // Fallback to company first letter
  return company.substring(0, 1).toUpperCase();
};

// Helper function to generate random background color
const getRandomColor = (id: number): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8',
    '#F7DC6F', '#BB8FCE', '#85C1E2', '#F8B739', '#52B788',
    '#E76F51', '#2A9D8F', '#E9C46A', '#F4A261', '#264653',
    '#8338EC', '#3A86FF', '#FB5607', '#FF006E', '#FFBE0B'
  ];
  // Use id to consistently generate same color for same member
  const index = id % colors.length;
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

export default function MemberCard({ id, memberId, title, name, email, membershipType, country, img }: MemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  return (
    <>
      <Card className="bg-[#FFFFFF26] border-none rounded-2xl text-white w-full h-full flex flex-col">
        <CardContent className="flex flex-col gap-4 px-6 flex-1">
          {/* Top Section */}
          <div className="flex items-center gap-4">
          {img && img !== "/static/resourseImg.jpg" ? (
            <img
              src={img}
              alt={name}
              className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const div = document.createElement('div');
                  div.className = 'w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-lg flex-shrink-0';
                  div.style.backgroundColor = getRandomColor(id);
                  div.textContent = getInitials(name, title);
                  parent.appendChild(div);
                }
              }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white text-lg flex-shrink-0"
              style={{ backgroundColor: getRandomColor(id) }}
            >
              {getInitials(name, title)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-plusjakarta font-semibold text-[16px] leading-[150%] tracking-[-0.02em] text-[#C6A95F] truncate">
              {name}
            </p>
            <p className="font-plusjakarta font-normal text-[12px] leading-[100%] tracking-[-0.01em] text-white/70 truncate">
              {email}
            </p>
          </div>
        </div>

        {/* Company and Country */}
        <div className="flex-1">
          <p className="font-plusjakarta font-semibold text-[14px] leading-[150%] tracking-normal text-white truncate">
            {title || "N/A"}
          </p>
          <p className="font-plusjakarta font-normal text-[12px] leading-[100%] tracking-[-0.01em] text-white/60 mt-1 truncate">
            {country || "N/A"}
          </p>
        </div>

        {/* Membership Type */}
        <div>
          <p className="font-plusjakarta font-medium text-[14px] leading-[150%] tracking-normal text-[#C6A95F]">
            {getMembershipTypeName(membershipType)}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full mt-auto">
          <Button
            onClick={() => setIsModalOpen(true)}
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
            onClick={() => setIsProfileModalOpen(true)}
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

      {/* Contact Member Modal */}
      <ContactMemberModal
        memberId={memberId}
        memberName={name}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />

      {/* View Profile Modal */}
      <ViewProfileModal
        userId={memberId}
        isOpen={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
      />
    </>
  );
}
