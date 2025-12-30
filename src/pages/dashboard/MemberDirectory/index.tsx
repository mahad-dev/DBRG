import { useState } from "react";
import Members from "./comps/Members";
import Inbox from "./comps/Inbox";

export default function MemberDirectory() {
  const [activeTab, setActiveTab] = useState<"members" | "inbox">("members");

  return (
    <div className="px-2">
   

      {/* Content */}
      {activeTab === "members" ? (
        <Members onSwitchToInbox={() => setActiveTab("inbox")} />
      ) : (
        <Inbox />
      )}
    </div>
  );
}
