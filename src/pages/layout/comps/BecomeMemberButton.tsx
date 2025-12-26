import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface BecomeMemberModalProps {
  triggerClassName?: string;
  triggerText?: string;
  onOpen?: () => void;
}

export default function BecomeMemberButton({
  triggerClassName,
  triggerText = "Become a Member",
  onOpen,
}: BecomeMemberModalProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onOpen) onOpen();
    navigate("/signup");
  };

  return (
    <Button
      variant={"site_btn"}
      className={
        triggerClassName
          ? triggerClassName
          : "w-full cursor-pointer sm:w-[155px] h-[46px] rounded-lg bg-[#C6A95F] text-black font-semibold hover:bg-[#b79a55]"
      }
      onClick={handleClick}
    >
      {triggerText}
    </Button>
  );
}
