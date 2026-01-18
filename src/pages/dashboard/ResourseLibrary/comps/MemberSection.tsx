"use client";

import MemberCard from "./MemberCard";
import type { Member } from "@/services/memberDirectoryApi";

interface MemberSectionProps {
  title: string;
  members: Member[];
  enableScroll?: boolean;
}

export default function MemberSection({ title, members, enableScroll = false }: MemberSectionProps) {
  return (
    <div className="flex flex-col gap-6 w-full h-full">
      {/* HEADER */}
      <div className="flex items-center justify-between w-full">
        <h2 className="text-[22px] md:text-[24px] font-semibold text-[#C6A95F]">
          {title}
        </h2>
      </div>

      {/* GRID WITH VERTICAL SCROLL */}
      <div
        className={enableScroll ? "overflow-y-auto overflow-x-hidden pr-2 pb-4" : "overflow-y-visible overflow-x-hidden pr-2 pb-4"}
        style={enableScroll ? {
          scrollbarWidth: 'thin',
          scrollbarColor: '#C6A95F #1A1A1A',
          maxHeight: 'calc(50vh - 80px)'
        } : {}}
      >
        {members.length === 0 ? (
          <div className="w-full text-center py-8">
            <p className="text-white/70">No members available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div key={member.id}>
                <MemberCard
                  id={parseInt(member.id) || 0}
                  memberId={member.id}
                  title={member.company}
                  name={member.name}
                  email={member.email}
                  membershipType={member.membershipType}
                  country={member.country || "N/A"}
                  img={member.profilePicturePath || "/static/resourseImg.jpg"}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
