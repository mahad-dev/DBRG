import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getPublicNews } from "@/services/cmsApi";
import type { CmsItem } from "@/types/cms";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

export default function PressRelease() {
  const [pressReleases, setPressReleases] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPressReleases = async () => {
      try {
        setLoading(true);
        const response = await getPublicNews({
          PageNumber: 1,
          PageSize: 10,
        });

        if (response.status && response.data?.items) {
          // Filter only press releases (items with "press release" in title/description)
          const pressReleasesOnly = response.data.items.filter((item) => {
            const searchText = `${item.title} ${item.description}`.toLowerCase();
            return searchText.includes('press release');
          });
          setPressReleases(pressReleasesOnly);
        }
      } catch (error: any) {
        console.error('Failed to fetch press releases:', error);
        toast.error('Failed to load press releases');
      } finally {
        setLoading(false);
      }
    };

    fetchPressReleases();
  }, []);

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

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20 relative z-10">
          <Loader2 className="w-12 h-12 animate-spin text-[#C6A95F]" />
        </div>
      ) : pressReleases.length === 0 ? (
        <div className="text-center py-20 text-white/60 relative z-10">
          No press releases available at the moment
        </div>
      ) : (
        /* Cards */
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {pressReleases.slice(0, 6).map((release) => (
            <div
              key={release.id}
              className="rounded-xl p-4 flex flex-col justify-between bg-transparent"
            >
              {/* Image */}
              <div className="w-full h-[220px] rounded-xl mb-4 overflow-hidden bg-[#D9D9D9] flex items-center justify-center">
                {release.bannerPath ? (
                  <img
                    src={release.bannerPath}
                    alt={release.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/static/pressRelease1.jpg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-[#D9D9D9]" />
                )}
              </div>

              <h3 className="text-[22px] md:text-[26px] font-gilory font-bold mb-2">
                {release.title}
              </h3>

              <p className="text-[16px] md:text-[22px] font-gilory leading-[1.2] mb-4">
                {release.description.length > 150
                  ? `${release.description.substring(0, 150)}...`
                  : release.description}
              </p>
              {release.link && (
                <div>
                  <Button
                    onClick={() => window.open(release.link, '_blank')}
                    className="underline m-0 p-0 text-[16px] md:text-[18px]"
                  >
                    Read Full Article
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
