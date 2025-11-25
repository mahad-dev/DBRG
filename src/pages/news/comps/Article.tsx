import { Button } from "@/components/ui/button";

const articles = [
  {
    id: 1,
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    image: "/static/article1.jpg",
    link: "#",
  },
  {
    id: 2,
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    image: "/static/article2.jpg",
    link: "#",
  },
  {
    id: 3,
    title: "Title",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
    image: "/static/article3.jpg",
    link: "#",
  },
];

export default function Article() {
  const featured = articles[0]; // Use first article as featured

  return (
    <section className="w-full bg-[#0e0e0e] text-white px-4 md:px-12 py-16">
      {/* Top Description */}
      <div className="max-w-5xl mx-auto text-center space-y-6 mb-16 font-gilory leading-[1.4]">
        <p className="text-[20px] md:text-[24px] leading-relaxed">
          At Dubai Business Group for Bullion & Gold Refinery (DBRG), we keep
          our members and the industry informed through our regularly updated
          news articles and newsletters. We cover a wide range of topics related
          to the gold refining and bullion industry, including market trends,
          regulatory updates, innovations in technology, and more.
        </p>
        <p className="text-[20px] md:text-[24px] leading-relaxed">
          Our news articles provide timely insights, and our newsletters are
          packed with essential information for businesses and professionals in
          the precious metals sector. Stay up to date with the latest
          developments that can impact your business and the industry.
        </p>
      </div>

      {/* Main Featured Article */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center mb-20">
        {/* Image */}
        <div className="w-full h-[260px] md:h-80 rounded-xl overflow-hidden">
          <img
            src={featured.image}
            alt={featured.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text */}
        <div className="space-y-4">
          <h2 className="font-gilroy font-normal text-[44px] leading-[100%] tracking-[0]">
            {featured.title}
          </h2>

          <p className="font-gilroy font-normal text-[24px] leading-[100%] tracking-[0]">
            {featured.description}
          </p>

          <Button
            className="p-0 m-0 cursor-pointer font-inter font-normal text-[18px] leading-[100%] underline decoration-solid decoration-1 underline-offset-2 tracking-[0]"
            onClick={() => (window.location.href = featured.link)}
          >
            Read Full Article
          </Button>
        </div>
      </div>

      {/* Article Cards */}
      <div className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-10">
        {articles.map((article) => (
          <div
            key={article.id}
            className="bg-[#161616] rounded-xl border overflow-hidden shadow-xl flex flex-col"
          >
            {/* Image */}
            <div className="w-full h-[250px] overflow-hidden p-4">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Text */}
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                <h3 className="font-gilroy font-normal text-[24px] md:text-[28px] leading-[1.3] tracking-[0]">
                  {featured.title}
                </h3>

                <p className="font-gilroy font-normal text-[20px] md:text-[22px] leading-[100%] tracking-[0] text-gray-300">
                  {article.description}
                </p>
              </div>
              <div className="mt-3">
                <Button
                  className="p-0 m-0 cursor-pointer font-inter font-normal text-[18px] leading-[100%] underline decoration-solid decoration-1 underline-offset-2 tracking-[0]"
                  onClick={() => (window.location.href = article.link)}
                >
                  Read Full Article
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
