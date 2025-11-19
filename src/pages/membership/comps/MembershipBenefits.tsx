import { Card, CardContent } from "@/components/ui/card";

export default function MembershipBenefits() {
  const benefits = [
    {
      id: 1,
      img: "/icons/member-network.svg",
      title: "Networking Opportunities:",
      desc: "Connect with industry leaders, regulators, and like-minded businesses to foster valuable partnerships.",
    },
    {
      id: 2,
      img: "/icons/member-insights.svg",
      title: "Exclusive Industry Insights:",
      desc: "Stay updated on the latest market trends, regulatory updates, and best practices in gold refining.",
    },
    {
      id: 3,
      img: "/icons/member-promote.svg",
      title: "Promote Your Business:",
      desc: "Gain visibility by being part of our recognized list of approved members, increasing your credibility.",
    },
    {
      id: 4,
      img: "/icons/member-events.svg",
      title: "Event Invitations:",
      desc: "Access exclusive DBRG-hosted events, webinars, and networking opportunities.",
    },
    {
      id: 5,
      img: "/icons/member-reports.svg",
      title: "Access to Industry Reports:",
      desc: "Receive reports on gold refining industry forecasts, updates, and business strategies.",
    },
    {
      id: 6,
      img: "/icons/member-regulatory.svg",
      title: "Regulatory Support:",
      desc: "Stay compliant with industry regulations and guidelines through regular updates.",
    },
  ];
  return (
    <section className="w-full bg-[#0E0E0E] text-white py-24 px-6 md:px-20 relative overflow-hidden">
      {/* Background Ellipse */}
      <div className="absolute top-46 -right-46 flex justify-center">
        <div className="w-[350px] h-[350px] bg-[#C6A95F]/20 blur-[100px] rounded-full"></div>
      </div>

      <div className="relative z-10  mx-auto">
        {/* Top Description */}
        <p
          className="
    text-[28px] 
    md:text-[30px] 
    leading-[100%] 
    text-center 
    font-gilroy 
    font-normal 
    mb-16 
    mx-auto
    max-w-6xl
    font-gilory-medium
  "
        >
          Joining Dubai Business Group for Bullion & Gold Refinery (DBRG)
          provides you with a unique opportunity to grow your business in the
          global bullion and gold refining sector. As a member, you will gain
          access to a range of benefits designed to help you stay ahead in a
          competitive market. From exclusive industry insights to valuable
          networking opportunities, DBRG offers a robust platform to support
          your business goals.
        </p>

        {/* Heading */}
        <h2
          className="text-center sm:text-left text-[#C6A95F] text-[48px] md:text-[62px] leading-[100%] font-normal mb-10"
          style={{
            fontFamily: "DM Serif Display",
            fontWeight: 400,
            letterSpacing: "0px",
          }}
        >
          Membership Benefits
        </h2>

        {/* Sub Paragraph */}
        <p className="text-[28px] md:text-[30px] leading-[100%] font-gilory-medium text-center sm:text-left font-normal mb-16 mx-auto">
          Joining Dubai Business Group for Bullion & Gold Refinery (DBRG)
          provides you with a unique opportunity to grow your business in the
          global bullion and gold refining sector. As a member, you will gain
          access to a range of benefits designed to help you stay ahead in a
          competitive market. From exclusive industry insights to valuable
          networking opportunities, DBRG offers a robust platform to support
          your business goals.
        </p>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-16">
          {benefits.map((item) => (
            <Card
              key={item.id}
              className="bg-transparent border-0 shadow-none text-center"
            >
              <CardContent className="p-0">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-20 h-20 mx-auto mb-5 object-contain"
                />

                <h3
                  className="text-[22px] font-semibold "
                  style={{ fontFamily: "Inter" }}
                >
                  {item.title}
                </h3>

                <p
                  className="text-[20px] leading-[100%]"
                  style={{ fontFamily: "Inter" }}
                >
                  {item.desc}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
