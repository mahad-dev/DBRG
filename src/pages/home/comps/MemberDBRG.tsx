import BecomeMemberButton from "@/pages/layout/comps/BecomeMemberButton";

export default function MemberDBRG() {
  const benefits = [
    {
      icon: "/icons/member-benefits.svg",
      title: "Membership Benefits:",
      description:
        "Gain access to exclusive industry reports, regulatory updates, and global networking events.",
    },
    {
      icon: "/icons/simple-application-process.svg",
      title: "Simple Application Process:",
      description: "Easily register and apply to become a part of DBRG today.",
    },
  ];

  return (
    <section className="w-full bg-[#0F0F0F] text-white py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-16 xl:px-20">
      <div className="max-w-7xl mx-auto">
        {/* TOP: Image + Text */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Image */}
          <div className="rounded-xl overflow-hidden shadow-lg w-full h-[280px] sm:h-80 md:h-[360px] lg:h-[400px]">
            <img
              src="/static/members.jpg"
              alt="Member group"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Text */}
          <div>
            <h2
              className="
              font-['DM_Serif_Display']
              font-normal
              text-[42px] sm:text-[52px] md:text-[62px]
              leading-[100%]
              tracking-[0]
              text-[#C6A95F]
              mb-4 sm:mb-6
            "
            >
              Become a Member
            </h2>

            <p
              className="
              font-gilroy-medium
              text-[20px] sm:text-[22px] md:text-[24px]
              leading-[100%]
              tracking-[0]
              text-white
            "
            >
              Joining DBRG opens the door to numerous opportunities, resources,
              and networking events tailored to the gold refining and bullion
              industry.
            </p>
          </div>
        </div>

        {/* BENEFITS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12 mt-10 sm:mt-16">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="flex gap-4 sm:gap-5 md:gap-6 items-center"
            >
              <div className="flex items-center justify-center">
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="w-14 h-14 sm:w-24 sm:h-24"
                />
              </div>

              <div>
                <span className="font-gilroy-bold font-bold text-[20px] sm:text-[22px] leading-[100%] text-white mb-1">
                  {benefit.title + " "}
                </span>
                <span className="font-gilroy-medium text-[20px] sm:text-[22px] leading-[100%] text-white">
                  {benefit.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* BUTTON — Centered */}
        <div className="flex justify-center mt-12 sm:mt-16">
         <BecomeMemberButton
  triggerClassName="
    w-[202px]
    h-[52px]
    rounded-[10px]
    px-2.5
    py-2.5
    text-lg
    sm:text-xl
    flex
    items-center
    justify-center
    gap-2.5
  "
/>
        </div>
      </div>
    </section>
  );
}
