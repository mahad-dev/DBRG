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
    <div style={{ minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <ProfileSetting />
      <AddMember />
      <EmailConfiguration />
    </div>
  )
}
