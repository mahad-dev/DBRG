import Hero from "@/components/custom/ui/hero";
import Article from "./comps/Article";
import PressRelease from "./comps/PressRelease";
import FollowDBRGMedia from "./comps/FollowDBRGMedia";
import DBRGMedia from "./comps/DBRGMedia";

export default function NewsPage() {
  return (
    <>
      <Hero
        image="/static/news-bg.jpg"
        title="News & Media"
        description="Home / News & Media"
      />
      <Article />
      <PressRelease />
      <DBRGMedia />
      <FollowDBRGMedia />
    </>
  );
}
