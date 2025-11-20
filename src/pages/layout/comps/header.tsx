import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Menu, X } from "lucide-react";
import BecomeMemberModal from "./BecomeMemberModal";

export default function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
  }, [mobileOpen]);

  // Scroll header blur
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    ["Home", "/"],
    ["About Us", "/about"],
    ["Membership", "/membership"],
    ["Events", "/events"],
    ["News", "/news-media"],
    ["Reports", "/reports"],
    ["Contact Us", "/contact"],
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <header
        className={`fixed z-50 transition-all duration-300 ${
          scrolled
            ? "top-4 inset-x-4 rounded-xl bg-opacity-60 backdrop-blur-lg"
            : "top-0 inset-x-0 bg-transparent"
        }`}
      >
        {/* Desktop Header */}
        <div className="hidden xl:flex justify-center w-full">
          <div className="w-[95%] max-w-[1600px] mt-4 flex items-center justify-between px-8 py-4 bg-transparent">
            <Link to="/" className="w-[54px] h-[61px]">
              <img src="/DBRG-logo.svg" className="w-full h-full" />
            </Link>

            <NavigationMenu>
              <NavigationMenuList className="space-x-10 text-sm">
                {navItems.map(([label, link]) => {
                  const active = location.pathname === link;
                  return (
                    <NavigationMenuItem
                      key={label}
                      onClick={() => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                      }}
                    >
                      <NavigationMenuLink asChild>
                        <Link
                          to={link}
                          className={`transition-colors font-inter text-[20px] leading-[100%] ${
                            active
                              ? "text-[#C6A95F] font-medium"
                              : "text-white font-normal hover:text-[#C6A95F]"
                          }`}
                        >
                          {label}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            <div className="flex space-x-4">
              <BecomeMemberModal />
              {/* <Button
                variant="site_btn_transparent"
                className="w-[110px] h-[46px] rounded-[10px] border border-current"
              >
                Log In
              </Button> */}
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="xl:hidden flex items-center justify-between px-4 py-4 mt-2 w-full">
          <Link to="/" className="w-[50px] h-[55px]">
            <img src="/DBRG-logo.svg" className="w-full h-full" />
          </Link>

          <button onClick={() => setMobileOpen(true)}>
            <Menu className="text-[#C6A95F] w-8 h-8" />
          </button>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR (OUTSIDE HEADER) ================= */}
      <div
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-black/60 transition-opacity duration-500 ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        } z-[99999]`}
      >
        {/* Panel */}
        <div
          className={`w-[70%] h-full bg-[#0d0d0d] px-6 py-8 shadow-xl transform transition-transform duration-500 ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-2">
              <img src="/DBRG-logo.svg" className="w-[50px] h-[55px]" />
              <p className="text-[#C6A95F] text-xl font-semibold">DBRG</p>
            </div>

            <button onClick={() => setMobileOpen(false)}>
              <X className="text-[#C6A95F] w-7 h-7" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex flex-col space-y-6 text-white">
            {navItems.map(([label, link]) => {
              const active = location.pathname === link;
              return (
                <Link
                  key={label}
                  to={link}
                  onClick={() => setMobileOpen(false)}
                  className={`text-lg font-inter ${
                    active ? "text-[#C6A95F]" : "text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-6">
            <BecomeMemberModal
              triggerText="Become a Member"
              onOpen={() => setMobileOpen(false)}
            />
          </div>
        </div>
      </div>
    </>
  );
}
