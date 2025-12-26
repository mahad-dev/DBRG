import BecomeMemberButton from "@/pages/layout/comps/BecomeMemberButton";

export default function MembershipProcess() {
  const steps = [
    {
      number: "01",
      text: "Register Online: Complete the registration form with your business details and contact information.",
    },
    {
      number: "02",
      text: "Submit Your Application: Fill out the application form, providing all necessary details about your company or professional profile.",
    },
    {
      number: "03",
      text: "Submit Supporting Documents: Upload any required documents that may include your business registration, compliance certifications, or other relevant paperwork.",
    },
    {
      number: "04",
      text: "Make Payment: If applicable, complete the payment for your membership.",
    },
    {
      number: "05",
      text: "Track Your Application: Once your application is submitted, you can track its status through the DBRG member portal.",
    },
  ];

  return (
    <section className="w-full bg-[#121212] text-white py-16 sm:py-20 px-4 sm:px-6 md:px-20">
      <div className="mx-auto">
        {/* Title */}
        <h2
          className="text-[32px] sm:text-[42px] md:text-[58px] text-[#C6A95F] font-normal mb-6 sm:mb-1"
          style={{ fontFamily: "DM Serif Display" }}
        >
          How to Apply for Membership
        </h2>

        {/* Description */}
        <p className="text-[18px] sm:text-[24px] leading-[1.2] mb-12 max-w-5xl font-gilory-medium">
          Becoming a member of DBRG is simple and straightforward. Follow these
          steps to join our network of industry leaders and professionals:
        </p>

        {/* Steps */}
        <div className="flex flex-col gap-16 sm:gap-20 relative">
          {steps.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8 relative"
            >
              {/* Vertical Line */}
              {index !== steps.length - 1 && (
                <span className="hidden sm:block absolute left-8 sm:left-10 top-20 sm:top-22 h-16 sm:h-16 w-px bg-[#FFFFFF]" />
              )}

              {/* Number Circle */}
              <div
                className="shrink-0 w-16 sm:w-20 h-16 sm:h-20 rounded-full border-2 border-[#C6A95F] flex justify-center items-center text-[#C6A95F] text-[20px] sm:text-[24px]"
                style={{ fontFamily: "Inter" }}
              >
                {item.number}
              </div>

              {/* Text */}
              <p className="text-[18px] sm:text-[24px] leading-[1.2] max-w-full sm:max-w-4xl font-gilory-medium">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        {/* Button */}
        <div className="mt-8 sm:mt-10">
          <BecomeMemberButton
            triggerText="Apply for Membership"
            triggerClassName="w-[223px] h-[52px] rounded-md text-[20px] font-medium flex justify-center items-center"
          />
        </div>
      </div>
    </section>
  );
}
