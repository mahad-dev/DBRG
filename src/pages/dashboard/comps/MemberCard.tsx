import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function MemberCard() {
  return (
    <Card className="relative overflow-hidden rounded-2xl p-6 flex flex-col items-center text-black bg-[#C6A95F]">
      {/* Background image with opacity */}
      <div className="absolute inset-0 bg-[url('/static/DBRGLOGO.png')] bg-cover bg-center bg-no-repeat opacity-10" />
      <img
        src="/static/UserImg.png"
        width={100}
        height={100}
        className="rounded-full"
        alt="profile"
      />

      <h2 className="mt-3 font-gilroy font-bold text-[24px] leading-[100%] tracking-[0]">
        Sanjana Shah
      </h2>

      <p className="font-inter font-medium text-[16px] leading-[100%] tracking-[0] mt-1 opacity-80">
        Shah Investment
      </p>

      <p className="font-inter font-medium text-[16px] leading-[100%] tracking-[0] opacity-80">
        Member ID - abc123xyz#
      </p>

      <p className="font-inter font-medium text-[16px] leading-[100%] tracking-[0] opacity-80">
        Principal Member
      </p>

      <div className="w-16 h-16 mt-3 rounded-md overflow-hidden">
        <img
          src="/icons/QRCODE.svg"
          alt="icon"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-4 w-full">
        <Button className="cursor-pointer bg-black text-white w-[124px] h-11 px-2.5 py-2.5 rounded-[10px] flex items-center justify-center gap-2.5">
          Download
        </Button>

        <Button className="cursor-pointer bg-black text-white w-[167px] h-11 px-2.5 py-2.5 rounded-[10px] flex items-center justify-center gap-2.5">
          Add to e-Wallet
        </Button>
      </div>
    </Card>
  );
}
