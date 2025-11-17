import Hero from "@/components/custom/ui/hero";
import MissionDBRG from "./comps/MissionDBRG";
import BoardMembersDBRG from "./comps/BoardMembersDBRG";
import StructureDBRG from "./comps/StructureDBRG";

export default function AboutPage() {
  return (
    <>
      <Hero
        image="/static/about-bg.png"
        title="About DBRG"
        description="Learn about our mission, leadership, and industry impact."
      />
      <MissionDBRG />
      <BoardMembersDBRG />
      <StructureDBRG />
    </>
  );
}
