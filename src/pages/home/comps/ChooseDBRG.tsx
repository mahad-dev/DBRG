import { Card, CardContent } from "@/components/ui/card";

export default function ChooseDBRG() {
  const features = [
    {
      icon: "/icons/leadership.svg",
      title: "Industry Leadership:",
      description:
        "With years of expertise, DBRG is a leader in the bullion and gold refining industry.",
    },
    {
      icon: "/icons/networking-opportunity.svg",
      title: "Networking Opportunities:",
      description:
        "Access a vast network of professionals, businesses, and regulators.",
    },
    {
      icon: "/icons/complience.svg",
      title: "Compliance & Transparency:",
      description:
        "We ensure that all members adhere to global standards, fostering trust in the industry.",
    },
    {
      icon: "/icons/exclusive.svg",
      title: "Exclusive Resources:",
      description:
        "Enjoy access to industry reports, whitepapers, and regulatory notices.",
    },
  ];

  return (
    <section
      className="relative w-full text-white px-4 sm:px-6 md:px-16 py-16 md:py-20 bg-cover bg-center"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.8)), url('/static/choose-DBRG.jpg')",
      }}
    >
      {/* Title */}
      <h2
        className="
          font-['DM_Serif_Display']
          text-[56px] md:text-[62px]
          leading-[100%]
          text-[#C6A95F]
          mb-10 md:mb-12
          font-normal
          tracking-[0]
        "
      >
        Why Choose DBRG
      </h2>

      {/* Feature Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="bg-transparent border-none shadow-none text-left flex flex-col"
          >
            <CardContent className="flex flex-col gap-4 p-0">
              {/* Icon */}
              <img
                src={feature.icon}
                alt={feature.title}
                className="w-18 h-18"
              />

              {/* Feature Title */}
              <h3
                className="
                  font-['Inter']
                  font-semibold
                  text-[22px]
                  leading-[100%]
                  text-[#C6A95F]
                  tracking-[0]
                "
              >
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p
                className="
                  font-gilroy-medium
                  text-[20px] md:text-[20px]
                  leading-[100%]
                  text-white
                  tracking-[0]
                "
              >
                {feature.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
