import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function AboutDBRG() {
  return (
    <section className="w-full bg-[#121212] text-white py-16 px-4 sm:px-6 md:px-16">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h2
          className="
            font-['DM_Serif_Display']
            font-normal
            text-[40px] sm:text-[48px] md:text-[56px]
            leading-[100%]
            tracking-[0]
            text-[#C6A95F]
          "
        >
          About DBRG
        </h2>

        <p
          className="
            font-gilroy-medium
            text-[20px] sm:text-[24px] md:text-[28px]
            leading-[140%] md:leading-[100%]
            tracking-[0]
            text-white
            mt-4 md:mt-2
          "
        >
          The Dubai Business Group for Bullion & Gold Refinery (DBRG) is at the
          forefront of innovation and excellence in the gold refining and
          bullion industry. As a leading organization, we aim to advance global
          standards, facilitate industry collaboration, and ensure compliance
          with international regulations. Our group connects businesses,
          regulators, and industry experts to ensure the highest levels of
          transparency and trust in the precious metals market.
        </p>
      </div>

      {/* Team Image Section */}
      <div className="max-w-6xl mx-auto mb-12">
        <img
          src="/static/DBRG-team-meeting.jpg"
          alt="DBRG team meeting"
          className="w-full h-auto md:h-[389px] object-cover rounded-xl"
        />
      </div>

      {/* Mission & Vision Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <Card
          className="relative border-none shadow-xl bg-cover bg-center text-white overflow-hidden rounded-xl"
          style={{ backgroundImage: "url('/static/card-image.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <CardContent className="relative z-10 p-6 sm:p-8 md:p-10">
            <CardTitle
              className="
                font-['Inter']
                font-semibold
                text-[28px] sm:text-[32px] md:text-[38px]
                leading-[100%]
                tracking-[0]
                text-[#C6A95F]
              "
            >
              Mission
            </CardTitle>

            <CardDescription
              className="
                font-gilroy-medium
                text-[20px] sm:text-[22px] md:text-[24px]
                leading-[140%] md:leading-[100%]
                tracking-[0]
                text-white
                mt-4
              "
            >
              To establish DBRG as the leading advocate for growth, compliance,
              and innovation in the bullion and gold refining industry. We aim
              to empower businesses through collaboration, education, and access
              to the best industry practices.
            </CardDescription>
          </CardContent>
        </Card>

        {/* Vision Card */}
        <Card
          className="relative border-none shadow-xl bg-cover bg-center text-white overflow-hidden rounded-xl"
          style={{ backgroundImage: "url('/static/card-image.jpg')" }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          <CardContent className="relative z-10 p-6 sm:p-8 md:p-10">
            <CardTitle
              className="
                font-['Inter']
                font-semibold
                text-[28px] sm:text-[32px] md:text-[38px]
                leading-[100%]
                tracking-[0]
                text-[#C6A95F]
              "
            >
              Vision
            </CardTitle>

            <CardDescription
              className="
                font-gilroy-medium
                text-[20px] sm:text-[22px] md:text-[24px]
                leading-[140%] md:leading-[100%]
                tracking-[0]
                text-white
                mt-4
              "
            >
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
              tempor incididunt ut labore et dolore magna aliqua.
            </CardDescription>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
