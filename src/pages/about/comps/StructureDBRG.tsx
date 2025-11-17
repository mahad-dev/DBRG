export default function StructureDBRG() {
  const items = [
    {
      title: "Leadership Team",
      text: "Responsible for setting the strategic goals and driving DBRG’s vision.",
    },
    {
      title: "Membership Services",
      text: "Dedicated to assisting members with resources, applications, and network-building.",
    },
    {
      title: "Events & Conferences",
      text: "Organizes key industry events, seminars, and workshops to promote knowledge sharing.",
    },
    {
      title: "Regulatory Affairs",
      text: "Focuses on ensuring that our members comply with local and international industry regulations.",
    },
    {
      title: "Research & Development",
      text: "Offers market insights and promotes innovation within the gold refining sector.",
    },
  ];

  return (
    <section className="w-full bg-[#0c0c0c] text-white px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 py-16 sm:py-20 md:py-24">
      <div className="max-w-[1500px] mx-auto">

        {/* Heading */}
        <h2 className="
          font-['DM_Serif_Display']
          text-[40px] sm:text-[50px] md:text-[62px]
          leading-none
          text-[#C6A95F]
          mb-4 text-center md:text-left
        ">
          Organizational Structure
        </h2>

        <p className="
          font-gilory-medium
          text-[18px] sm:text-[20px] md:text-[24px]
          leading-normal
          max-w-4xl
          mb-12 sm:mb-14 md:mb-16
          text-center md:text-left
        ">
          DBRG operates through a well-defined organizational structure
          that facilitates efficiency, transparency, and collaboration. Our
          leadership team is dedicated to overseeing the overall direction
          of the organization, while specialized departments focus on
          different facets of our mission:
        </p>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-12 lg:gap-16 items-start">

          {/* Left Text List */}
          <div className="space-y-8">
            {items.map((item, index) => (
              <div key={index}>
                
                <p className="text-[20px] sm:text-[22px] md:text-[24px] leading-[1.4] mb-3">
                  <span className="font-gilory-bold font-bold text-white">
                    {item.title}:
                  </span>
                  <span className="font-gilory-semibold ml-2 text-white">
                    {item.text}
                  </span>
                </p>

                {/* Divider */}
                <div className="w-full h-px bg-white" />
              </div>
            ))}
          </div>

          {/* Right Info Card */}
          <div className="
            w-full 
            h-[220px] sm:h-[260px] md:h-[340px] lg:h-[420px] xl:h-[460px]
            bg-[#D9D9D9]
            rounded-xl 
          " />
        </div>
      </div>
    </section>
  );
}
