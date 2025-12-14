"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  CreditCard,
  Handshake,
  LogOut,
  Settings,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavLink } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import LogoutDialog from "@/components/LogoutDialog";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

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
          "fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ease-in-out",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* SIDEBAR */}
      <aside
        className={cn(
          "fixed lg:static top-0 left-0 h-full w-72 bg-[#111111] text-white flex flex-col font-['Plus Jakarta Sans'] border-r border-[#333] z-50 transform transition-transform duration-500 ease-in-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <ScrollArea className="h-screen px-6 pt-8 pb-8">

          {/* LOGO */}
          <div className="flex items-center gap-3 mb-12">
            <img src="/DBRG-logo.svg" className="w-14 h-14" alt="DBRG" />
            <span className="text-[32px] font-bold text-[#C6A95F]">DBRG</span>
          </div>

          {/* MENU ITEMS */}
          <nav className="flex flex-col gap-7 text-[18px] font-medium">
            <NavItem
              icon={<LayoutDashboard size={24} />}
              label="Dashboard"
              to="/admin/dashboard"
            />

            <NavItem
              icon={<Users size={24} />}
              label="User Management"
              to="/admin/dashboard/user-management"
            />

            <NavItem
              icon={<MessageSquare size={24} />}
              label="Send Notification"
              to="/admin/dashboard/send-notification"
            />

            <NavItem
              icon={<BookOpen size={24} />}
              label="CMS"
              to="/admin/dashboard/cms"
            />

            <NavItem
              icon={<CreditCard size={24} />}
              label="Payment Details"
              to="/admin/dashboard/payment-details"
            />

            <NavItem
              icon={<Handshake size={24} />}
              label="Special Consideration"
              to="/admin/dashboard/special-consideration"
            />

            <Button
              variant="ghost"
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all tracking-tight text-white hover:bg-[#1A1A1A] w-full justify-start"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut size={24} />
              <span>Log out</span>
            </Button>
          </nav>

          {/* SETTINGS AT BOTTOM */}
          <div className="mt-32">
            <NavItem
              icon={<Settings size={24} />}
              label="Settings"
              to="/admin/dashboard/settings"
            />
          </div>
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

function NavItem({
  icon,
  label,
  to,
}: {
  icon: React.ReactNode;
  label: string;
  to: string;
}) {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        cn(
          "flex items-center gap-4 px-4 py-3 rounded-xl transition-all tracking-tight",
          isActive
            ? "bg-white text-black font-semibold"
            : "text-white hover:bg-[#1A1A1A]"
        )
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}
