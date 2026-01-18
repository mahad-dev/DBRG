import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface StatsCardProps {
  title: string;
  value: string;
  increasePercentage: number;
  onViewAll?: () => void;
}

export default function StatsCard({ title, value, increasePercentage, onViewAll }: StatsCardProps) {
  return (
    <Card className="bg-[#C6A95F] text-black px-0 pb-0 rounded-xl pt-2 shadow-xl w-full">
      <CardContent className="py-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-3xl font-bold mt-2">{value}</p>

        <div className="flex justify-between font-normal items-center mt-2">
          <p className="text-sm text-white">This month {increasePercentage}% {increasePercentage >= 0 ? 'increase' : 'decrease'}</p>
          <Button
            variant="link"
            className="text-sm underline p-0 h-auto cursor-pointer"
            onClick={onViewAll}
          >
            View All
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
