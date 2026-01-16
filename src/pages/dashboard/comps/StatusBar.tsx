import { Card } from "@/components/ui/card";

interface StatusBarProps {
  message?: string;
}

export function StatusBar({ message = "Your Application is under review" }: StatusBarProps) {
  return (
    <Card className="bg-[#FFFFFF26] border-none rounded-xl p-4 flex flex-row items-center gap-4">
      <div className="bg-white rounded-full shrink-0 aspect-square w-4 sm:w-8"></div>

      <p className="text-white font-inter font-semibold text-[16px] leading-[150%] truncate">
        {message}
      </p>
    </Card>
  );
}
