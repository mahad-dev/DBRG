import ApplicantsTable from './comps/NewApplication';
import WithPermission from "@/components/WithPermission";

const Applications = () => {
  return (
    <WithPermission module="APPLICATION_MANAGEMENT">
      <ApplicantsTable />
    </WithPermission>
  );
};

export default Applications;
