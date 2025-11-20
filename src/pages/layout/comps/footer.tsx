import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative w-full bg-[#121212] text-white py-20 px-6">
      <div
        className="absolute top-0 left-0 w-full h-2 sm:h-2 md:h-2.5"
        style={{
          background: "linear-gradient(90deg, #121212, #C6A95F, #121212)",
        }}
      />
      {/* TOP ROW: Technology Partner */}
      <div className="flex gap-4 items-center w-full justify-center mb-16">
        <p
          className="
    text-[20px]
    leading-[22px]
    tracking-[0px]
    text-gray-300
    font-gilroy-bold
    font-bold
  "
        >
          Technology Partner :
        </p>

        <a href="https://www.orosoft.com/" target="_blank" rel="noopener noreferrer">
  <img src="/OroSoft-Logo.svg" alt="OroSoft" className="w-32 mt-2" />
</a>

      </div>

      {/* MAIN GRID */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-14">
        {/* COLUMN 1 — LOGO + ADDRESS */}
        <div className="space-y-8">
          {/* Exact Logo Row */}
          <div className="flex items-center gap-4">
            <div className="w-[54px] h-[61px] rounded-xl flex items-center justify-center opacity-100">
              <img src="/DBRG-logo.svg" className="w-[54px] h-[61px]" />
            </div>
            <span
              className="
    text-[34px]
    leading-[100%]
    tracking-[0px]
    text-[#C6A95F]
    font-gilroy-bold
    font-bold
  "
            >
              DBRG
            </span>
          </div>

          {/* Address details EXACT like image */}
          <div className="space-y-4 text-gray-300 text-sm">
            <p
              className="
    flex items-start gap-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    font-normal
    text-[#77808B]
    font-roboto
  "
            >
              <MapPin color="white" className="mt-1" size={28} />
              Dubai, UAE
            </p>

            <p
              className="
    flex items-start gap-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    font-normal
    text-[#77808B]
    font-roboto
  "
            >
              <Mail size={18} color="white" />
              info@dbrg.ae
            </p>

            <p
              className="
    flex items-start gap-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    font-normal
    text-[#77808B]
    font-roboto
  "
            >
              <Phone size={18} color="white" />
              +971 056 539 1246
            </p>
          </div>
        </div>

        {/* COLUMN 2 — SERVICE */}
        <div>
          <h3
            className="
    text-[16px]
    leading-[22px]
    tracking-[0px]
    mb-6
    text-white
    font-gilroy-bold
    font-bold
  "
          >
            Service
          </h3>
          <ul
            className="
    space-y-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    text-[#77808B]
    font-gilroy-semi-bold
    font-semibold
  "
          >
            <li>About Us</li>
            <li>Memberships</li>
            <li>Events</li>
            <li>News & Articles</li>
            <li>Resources</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* COLUMN 3 — COMPANY */}
        <div>
          <h3
            className="
    text-[16px]
    leading-[22px]
    tracking-[0px]
    font-bold
    mb-6
    text-white
    font-gilroy-bold
  "
          >
            Company
          </h3>

          <ul
            className="
    space-y-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    text-[#77808B]
    font-gilroy-semi-bold
    font-semibold
  "
          >
            <li>Service</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* COLUMN 4 — Our Social Media */}
        <div>
          <h3
            className="
    text-[16px]
    leading-[22px]
    tracking-[0px]
    font-bold
    mb-6
    text-white
    font-gilroy-bold
  "
          >
            Our Social Media
          </h3>
          <ul
            className="
    space-y-3
    text-[16px]
    leading-[150%]
    tracking-[0px]
    font-semibold
    text-[#77808B]
    font:gilroy-semi-bold
  "
          >
            <li>Dribbble</li>
            <li>Behance</li>
            <li>Medium</li>
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>

        {/* COLUMN 5 — NEWSLETTER */}
        <div>
          <h3 className="text-lg font-bold mb-6 font-gilroy-bold">
            Join a Newsletter
          </h3>

          <p
            className="
    font-roboto
    font-normal
    text-[16px]
    leading-[150%]
    tracking-[0%]
    mb-2
    text-[#77808B]
  "
          >
            Your Email
          </p>

          <Input
            placeholder="Enter Your Email"
            className="bg-white text-black placeholder:text-gray-500 h-12 mb-4"
          />

          <Button
            variant="site_btn"
            className="
    w-[120px]
    h-[52px]
    rounded-[10px]
    p-2.5
    font-gilroy-semi-bold
    font-normal
    text-[20px]
    leading-[100%]
    tracking-[0%]
    text-center
  "
          >
            Join Now
          </Button>

          <p
            className="
    font-roboto
    font-normal
    text-[16px]
    leading-[150%]
    tracking-[0%]
    mt-6
    text-[#77808B]
  "
          >
            Copyright DBRG
          </p>
        </div>
      </div>
    </footer>
  );
}
