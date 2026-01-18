import { useEffect } from "react"
import AddMember from "./comps/AddMember"
import EmailConfiguration from "./comps/EmailConfiguration"
import ProfileSetting from "./comps/ProfileSetting"

export default function Settings() {

  useEffect(() => {
    document.documentElement.style.height = "100%"
    document.documentElement.style.overflow = "hidden"

    document.body.style.height = "100%"
    document.body.style.overflow = "hidden"

    return () => {
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <div className="min-h-full flex flex-col gap-4 sm:gap-6 pb-6">
      <ProfileSetting />
      <AddMember />
      <EmailConfiguration />
    </div>
  )
}
