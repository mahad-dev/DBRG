import { Card, CardContent } from "@/components/ui/card";

export default function RecentlyUploaded() {
  const items = [
    {
      title: "Event Title",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      title: "News Title",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
    {
      title: "Report Title",
      desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
    },
  ];

  return (
    <Card className="bg-[#3A3A3A] border-none rounded-2xl shadow-lg p-6 w-full text-white font-inter">
      <CardContent className="p-0">
        {/* Heading */}
        <h2 className="text-[24px] font-semibold text-[#C6A95F] mb-4">
          Recently Uploaded
        </h2>

        {/* List */}
        <div className="space-y-6">
          {items.map((item, idx) => (
            <div key={idx} className="space-y-3">
              <div className="flex items-start gap-4">
                {/* Image placeholder */}
                <div className="w-36 h-[72px] bg-white rounded-sm border border-black/20"></div>

                {/* Text */}
                <div>
                  <p className="text-[20px] font-semibold leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[15px] leading-tight text-[#E5E5E5]">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Divider */}
              {idx !== items.length && (
                <div className="w-[80%] h-px mx-6 bg-white/40 mt-4"></div>
              )}
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-6">
          <button className="underline text-[15px] tracking-wide">View All</button>
        </div>
      </CardContent>
    </Card>
  );
}