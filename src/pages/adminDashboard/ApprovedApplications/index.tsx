import ApprovedApplicationsTable from "./comps/ApprovedApplicationsTable";
import WithPermission from "@/components/WithPermission";

export default function ApprovedApplications() {
  return (
    <WithPermission module="APPLICATION_MANAGEMENT">
      <ApprovedApplicationsTable />
    </WithPermission>
  );
}
