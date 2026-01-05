import PaymentTable from "./comps/PaymentTable";
import WithPermission from "@/components/WithPermission";

export default function PaymentDetails() {
  return (
    <WithPermission module="PAYMENTS">
      <PaymentTable />
    </WithPermission>
  );
}
