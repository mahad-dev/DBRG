import UserManagementTable from "./comps/UserManagementTable";
import WithPermission from "@/components/WithPermission";

export default function UserManagement() {
  return (
    <WithPermission module="USER_MANAGEMENT">
      <UserManagementTable />
    </WithPermission>
  );
}
