import CMSTable from "./comps/CMSTable";
import WithPermission from "@/components/WithPermission";

export default function CMS() {
  return (
    <WithPermission module="CMS">
      <CMSTable />
    </WithPermission>
  );
}
