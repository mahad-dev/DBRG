"use client";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  Clock3,
  Users,
  Bell,
  Library,
  LogOut,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import LogoutDialog from "@/components/LogoutDialog";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  disabled?: boolean;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { logout, application } = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  // Check if application is completed
  const isApplicationCompleted = application?.isCompleted ?? false;

  const handleLogout = () => {
    logout();
    navigate('/login');
    setLogoutDialogOpen(false);
  };

  return (
    <>
      {/* MOBILE OVERLAY */}
      <div
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out cursor-pointer",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 h-full w-72 bg-[#121212FC] text-white flex flex-col border-r border-white font-['Plus Jakarta Sans'] z-50 transform transition-transform duration-600 ease-in-out",
          mobileOpen ? "translate-x-0 z-9999" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ScrollArea className="h-screen px-6 pt-6 pb-8">
          {/* LOGO */}
          <div className="hidden lg:flex items-center gap-2 mb-10">
            <img src="/DBRG-logo.svg" alt="DBRG" className="w-14 h-14" />
            <span className="text-[32px] font-bold text-[#C6A95F]">DBRG</span>
          </div>
          <div className="flex lg:hidden items-center mb-8 justify-between">
            <div className="flex items-center gap-2">
              <img src="/DBRG-logo.svg" alt="DBRG" className="w-14 h-14" />
              <span className="text-[32px] font-bold text-[#C6A95F]">DBRG</span>
            </div>
            <Button variant="ghost" onClick={() => setMobileOpen(false)}>
              <ArrowRight size={26} color="#C6A95F" />
            </Button>
          </div>

          {/* NAVIGATION */}
          <div className="flex flex-col gap-2 mb-10">
            <NavItem
              icon={<Home size={26} />}
              label="Home"
              to="/dashboard"
              disabled={!isApplicationCompleted}
            />
            {/* Show Upload Details only if application is not completed */}
            {!isApplicationCompleted && (
              <NavItem
                icon={<BookOpen size={26} />}
                label="Upload Details"
                to="/dashboard/member-type/principal-member/upload-details"
              />
            )}
            <NavItem
              icon={<Clock3 size={26} />}
              label="Track Status"
              to="/dashboard/track-status"
              disabled={!isApplicationCompleted}
            />
            <NavItem
              icon={<BookOpen size={26} />}
              label="Upcoming Events"
              to="/dashboard/upcoming-events"
              disabled={!isApplicationCompleted}
            />
            <NavItem
              icon={<Users size={26} />}
              label="Members Directory"
              to="/dashboard/members-directory"
              disabled={!isApplicationCompleted}
            />
            <NavItem
              icon={<Bell size={26} />}
              label="Notifications"
              to="/dashboard/notifications"
              disabled={!isApplicationCompleted}
            />
            <NavItem
              icon={<Library size={26} />}
              label="Resource Library"
              to="/dashboard/resource-library"
              disabled={!isApplicationCompleted}
            />
            <Button
              variant="ghost"
              className="flex justify-start items-center gap-4 text-[18px] px-5 py-4 rounded-xl w-full font-semibold text-white hover:bg-[#1E1E1E]"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut size={26} />
              <span className="tracking-tight">Log Out</span>
            </Button>
          </div>

          {/* HELP CENTER CARD */}
          <Card className="bg-[#C6A95F] rounded-3xl mt-20 text-black relative shadow-lg text-center pt-16 pb-10">
            <div className="absolute -top-10 w-full flex justify-center">
              <div className="w-20 h-20 overflow-hidden rounded-full shadow-md">
                <img
                  src="/icons/fineGoldHelpCenter.svg"
                  className="w-full h-full"
                  alt="Help Center"
                />
              </div>
            </div>

            <CardContent className="px-6">
              <h3 className="text-[18px] text-white font-semibold">
                Help Center
              </h3>

              <p className="text-[16px] text-white mt-3">
                Having trouble in learning? Contact us for more questions.
              </p>

              <Button className="w-[156px] h-10 mt-6 bg-black text-white rounded-[10px]">
                Go To Help Center
              </Button>
            </CardContent>
          </Card>
        </ScrollArea>
      </aside>

      {/* LOGOUT CONFIRMATION DIALOG */}
      <LogoutDialog
        open={logoutDialogOpen}
        onOpenChange={setLogoutDialogOpen}
        onConfirm={handleLogout}
      />
    </>
  );
}

function NavItem({ icon, label, to, disabled = false }: NavItemProps) {
  if (disabled) {
    return (
      <div
        className={cn(
          "flex justify-start items-center gap-4 text-[18px] px-5 py-4 rounded-xl w-full font-semibold",
          "text-gray-500 cursor-not-allowed opacity-50"
        )}
      >
        {icon}
        <span className="tracking-tight">{label}</span>
      </div>
    );
  }

  return (
    <NavLink
      to={to}
      end={to === "/dashboard"}
      className={({ isActive }) =>
        cn(
          "flex justify-start items-center gap-4 text-[18px] px-5 py-4 rounded-xl w-full font-semibold",
          isActive ? "bg-[#C6A95F] text-black" : "text-white hover:bg-[#1E1E1E]"
        )
      }
    >
      {icon}
      <span className="tracking-tight">{label}</span>
    </NavLink>
  );
}
