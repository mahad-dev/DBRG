import Hero from "@/components/custom/ui/hero";
import MembershipBenefits from "./comps/MembershipBenefits";
import MembershipChapters from "./comps/MembershipChapters";
import MembershipProcess from "./comps/MembershipProcess";
import ChooseMembership from "./comps/ChooseMembership";
import MembershipFrameworkOverview from "./comps/MembershipFrameworkOverview";
import GovernanceProtocol from "./comps/GovernanceProtocol";
import MemberDirectory from "./comps/MemberDirectory";
import WithdrawalOrRejection from "./comps/WithdrawalOrRejection";
import GeneralRequirements from "./comps/GeneralRequirements";

export default function MemberShipPage() {
  return (
    <>
      <Hero
        image="/static/membership-bg.jpg"
        title="Membership"
        description="Home / Membership"
      />
      <MembershipBenefits />
      <MembershipProcess />
      <MembershipChapters />
      <GeneralRequirements />
      <MembershipFrameworkOverview />
      <GovernanceProtocol />
      <WithdrawalOrRejection />
      <MemberDirectory />
      <ChooseMembership />
    </>
  );
}
