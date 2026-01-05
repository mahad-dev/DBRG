import Notifications from "./comps/Notifications";
import WithPermission from "@/components/WithPermission";

export default function SendNotifications() {
  return (
    <WithPermission module="NOTIFICATION_MANAGEMENT">
      <Notifications />
    </WithPermission>
  );
}
