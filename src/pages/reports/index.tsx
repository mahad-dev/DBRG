import Hero from "@/components/custom/ui/hero";
import Report from "./comps/Report";
import Compliance from "./comps/Compliance";
import ReportQueries from "./comps/ReportQueries";

export default function ReportsPage() {
  return (
    <>
      <Hero
        image="/static/reports-bg.jpg"
        title="Reports & Publications"
        description="Home / Reports & Publications"
      />
      <Report />
      <ReportQueries/>
      <Compliance />
    </>
  );
}
