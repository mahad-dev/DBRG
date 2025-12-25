import AddMember from "./comps/AddMember"
import EmailConfiguration from "./comps/EmailConfiguration"
import ProfileSetting from "./comps/ProfileSetting"


export default function Settings() {
  return (
    <div>
      <ProfileSetting/>
      <AddMember/>
      <EmailConfiguration/>
    </div>
  )
}
