import { Card, CardContent } from "@/components/ui/card";

export default function UpcomingEvents() {
return (
<Card className="bg-[#1E1E1E] rounded-xl w-full">
<CardContent>
<h2 className="text-xl font-semibold mb-4 text-[#caa95a]">Upcoming Events</h2>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
{[1, 2, 3, 4].map((item) => (
<div key={item} className="bg-[#FFFFFF]/20 rounded-xl p-4">
<div className="w-full h-28 bg-white rounded-md mb-3"></div>
<h3 className="text-lg font-semibold text-[#caa95a]">Expo 2025</h3>
<p className="text-sm">09/07/2025</p>
<p className="text-sm text-gray-300 mt-1">
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
</p>
</div>
))}
</div>
<button className="underline text-sm w-full text-center mt-4">View All</button>
</CardContent>
</Card>
);
}