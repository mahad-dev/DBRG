import { Button } from "@/components/ui/button";

const boardMembers = [
  {
    id: 1,
    name: "Name",
    role: "Co-Founder",
    image: "/static/board-member1.jpg",
  },
  {
    id: 2,
    name: "Name",
    role: "Co-Founder",
    image: "/static/board-member2.jpg",
  },
  {
    id: 3,
    name: "Name",
    role: "CEO",
    image: "/static/board-member3.jpg",
  },
];

export default function BoardMembersDBRG() {
  return (
    <section
      className="relative w-full px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-24 text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/static/board-members-bg.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/76"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-[#C6A95F] font-['DM_Serif_Display'] text-4xl sm:text-5xl md:text-6xl mb-6">
          Board Members
        </h2>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-[20px] leading-[1.4] max-w-6xl mb-14 sm:mb-16 md:mb-20">
          The DBRG Board comprises distinguished industry leaders and professionals who
          provide strategic direction and ensure that we continue to meet our mission
          and vision. These experts bring a wealth of knowledge and experience to our
          organization, guiding us towards greater achievements.
        </p>

        {/* Cards using MAP */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-10 place-items-center w-full">
          {boardMembers.map((member) => (
            <div
              key={member.id}
              className="relative rounded-3xl overflow-hidden shadow-xl w-full max-w-sm"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover"
              />

              {/* Text inside image */}
              <div className="p-4 text-left absolute bottom-0">
                <p className="text-lg sm:text-xl font-semibold text-white">{member.name}</p>
                <p className="text-sm text-gray-300">{member.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* View More Button */}
        <div className="mt-12 sm:mt-14 flex justify-center">
          <Button className="bg-transparent border border-[#C6A95F] text-[#C6A95F] px-8 sm:px-10 py-2 rounded-full hover:bg-[#C6A95F] hover:text-black transition-all duration-300 text-base sm:text-lg">
            View More
          </Button>
        </div>
      </div>
    </section>
  );
}
