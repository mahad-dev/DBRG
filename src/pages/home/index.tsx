import Hero from "../../components/custom/ui/hero";
import AboutDBRG from "./comps/AboutDBRG";
import ChooseDBRG from "./comps/ChooseDBRG";
import MemberDBRG from "./comps/MemberDBRG";
import NewsDBRG from "./comps/NewsDBRG";
import UpcomingEventsDBRG from "./comps/UpcomingEventsDBRG";

export default function HomePage() {
  return (
    <>
      <Hero
        image="/static/gold-bg.jpg"
        title="Welcome to Dubai Business Group for Bullion & Gold Refinery (DBRG)"
        description="Welcome to DBRG, the premier business group for bullion and gold refining in
Dubai. Our mission is to foster a thriving community that promotes transparency,
quality, and sustainability within the gold refining and precious metals industry. We
offer a platform for businesses and professionals to collaborate, grow, and stay
ahead of industry trends."
      />
      <AboutDBRG />
      <ChooseDBRG />
      <MemberDBRG />
      {/* <NewsDBRG /> */}
      {/* <UpcomingEventsDBRG /> */}
    </>
  );
}
