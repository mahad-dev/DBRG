import Hero from "@/components/custom/ui/hero";
import Events from "./comps/Events";
import PastEvents from "./comps/PastEvents";
import DBRGEvents from "./comps/DBRGEvents";

export default function EventsPage() {
  return (
    <>
      <Hero
        image="/static/events-bg.jpg"
        title="Events"
        description="Home / Events"
      />
      <Events />
      <PastEvents />
      <DBRGEvents />
    </>
  );
}
