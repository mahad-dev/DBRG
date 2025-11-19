import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, User, Star } from "lucide-react";

export default function MemberDirectory() {
  return (
    <section className="w-full bg-[#0e0e0e] text-white px-6 md:px-16 py-20">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
          Members Directory
        </h2>

        {/* Sub-heading */}
        <p className="text-lg md:text-xl text-gray-300 max-w-5xl">
          As a member of DBRG, you will be listed in our exclusive Members Directory, providing visibility and recognition within the industry. The directory features businesses and professionals who are committed to maintaining the highest standards in the gold refining and bullion trade.
        </p>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-16">
          {/* Card 1 */}
          <Card className="bg-transparent shadow-none border-none text-center">
            <CardContent className="flex flex-col items-center text-center p-0">
              <div className="mb-4">
                <Search className="w-14 h-14 text-[#C6A95F]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">Search & Filter Options:</h3>
              <p className="text-gray-300 text-[15px] leading-relaxed max-w-xs">
                Our directory allows you to search for members by category, location, services, and more.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="bg-transparent shadow-none border-none text-center">
            <CardContent className="flex flex-col items-center text-center p-0">
              <div className="mb-4">
                <User className="w-14 h-14 text-[#C6A95F]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">Member Profiles:</h3>
              <p className="text-gray-300 text-[15px] leading-relaxed max-w-xs">
                Each approved member has a profile page showcasing their business, including brief company details and services.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="bg-transparent shadow-none border-none text-center">
            <CardContent className="flex flex-col items-center text-center p-0">
              <div className="mb-4">
                <Star className="w-14 h-14 text-[#C6A95F]" strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-lg mb-2">Optional Member Logos:</h3>
              <p className="text-gray-300 text-[15px] leading-relaxed max-w-xs">
                Member logos and company profiles can be featured to enhance visibility and trust.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-14">
          <Button
            className="bg-[#C6A95F] text-black font-medium px-8 py-6 rounded-xl text-lg hover:bg-[#b49650] transition"
          >
            View Members Directory
          </Button>
        </div>
      </div>
    </section>
  );
}