import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    id: 1,
    title: "[Press Release Title]",
    description:
      "DBRG announces a new partnership with international regulators to promote ethical standards in the gold refining sector.",
    link: "#",
    image: null,
  },
  {
    id: 2,
    title: "[Press Release Title]",
    description:
      "DBRG launches a new industry initiative focused on sustainability in gold refining processes.",
    link: "#",
    image: null,
  },
  {
    id: 3,
    title: "[Press Release Title]",
    description:
      "Announcing DBRG's upcoming conference on innovation and technology in the gold refining industry.",
    link: "/static/pressRelease1.jpg",
    image: "/static/pressRelease1.jpg",
  },
];

export default function PressRelease() {
  return (
    <section
      className="w-full text-white px-4 md:px-12 py-16 font-gilory relative"
      style={{
        background:
          "linear-gradient(rgba(0,0,0,0.75), rgba(0,0,0,0.75)), url(/static/pressRelease.jpg) center/cover no-repeat",
      }}
    >
      {/* Heading */}
      <div className="max-w-6xl mx-auto mb-12 relative z-10">
        <h2 className="text-[62px] leading-[100%] font-['DM_Serif_Display'] text-[#C6A95F] mb-4">
          Press Releases
        </h2>

        <p className="text-[20px] md:text-[22px] max-w-6xl leading-[1.2]">
          As part of our commitment to keeping our stakeholders informed, DBRG regularly issues
          press releases to announce new initiatives, collaborations, and other significant updates
          within the bullion and gold refining industry. Our press releases serve as an official
          communication channel that provides clarity on our actions, objectives, and contributions
          to the industry.
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {pressReleases.map((release) => (
          <div
            key={release.id}
            className="rounded-xl p-4 flex flex-col justify-between bg-transparent"
          >
            {/* Image */}
            <div className="w-full h-[220px] rounded-xl mb-4 overflow-hidden bg-[#D9D9D9] flex items-center justify-center">
              {release.image ? (
                <img
                  src={release.image}
                  alt={release.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#D9D9D9]" />
              )}
            </div>

            <h3 className="text-[22px] md:text-[26px] font-gilory font-bold mb-2">
              {release.title}
            </h3>

            <p className="text-[16px] md:text-[22px] font-gilory leading-[1.2] mb-4">
              {release.description}
            </p>
              <div>
            <Button
              onClick={() => (window.location.href = release.link)}
              className="underline m-0 p-0 text-[16px] md:text-[18px]"
            >
              Read Full Article
            </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
