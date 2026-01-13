import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemberDirectory() {
  const features = [
    {
      id: 1,
      title: "Search & Filter Options :",
      desc: "Our directory allows you to search for members by category, location, services, and more.",
      icon: "/icons/search.svg",
    },
    {
      id: 2,
      title: "Member Profiles :",
      desc: "Each approved member has a profile page showcasing their business, including brief company details and services.",
      icon: "/icons/member.svg",
    },
    {
      id: 3,
      title: "Optional Member Logos :",
      desc: "Member logos and company profiles can be featured to enhance visibility and trust.",
      icon: "/icons/memberOptional.svg",
    },
  ];

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 sm:px-10 md:px-16 py-16 md:py-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Heading */}
        <h2 className="font-gilroy-bold font-bold text-[30px] sm:text-[36px] md:text-[44px] leading-tight mb-4">
          Members Directory
        </h2>

        {/* Subheading */}
        <p className="font-gilroy-medium text-[16px] sm:text-[18px] md:text-[22px] leading-[120%] max-w-8xl">
          As a member of DBRG, you will be listed in our exclusive Members Directory,
          providing visibility and recognition within the industry. The directory features
          businesses and professionals who are committed to maintaining the highest
          standards in the gold refining and bullion trade.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 mt-14 mx-auto max-w-6xl">
          {features.map((item) => (
            <Card
              key={item.id}
              className="bg-transparent shadow-none border-none"
            >
              <CardContent className="flex flex-col p-0">
                
                {/* Icon */}
                <img
                  src={item.icon}
                  alt={item.title}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mb-4"
                />

                <h3 className="font-gilroy-bold font-bold text-[18px] sm:text-[20px] md:text-[22px] leading-tight">
                  {item.title}
                </h3>

                <p className="font-gilroy-medium text-[16px] sm:text-[18px] md:text-[20px] leading-[150%] max-w-sm">
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Button */}
        <div className="flex justify-center mt-12">
          <Button
          variant={"site_btn"}
            className="
              cursor-pointer
              font-gilroy-semibold
              text-[16px] sm:text-[18px] md:text-[20px]
              w-[200px] sm:w-[230px] md:w-[260px]
              h-12 sm:h-[50px] md:h-[52px]
              rounded-[10px]
              hover:bg-[#b49650]
              transition
            "
          >
            View Members Directory
          </Button>
        </div>
      </div>
    </section>
  );
}
