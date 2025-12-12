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

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
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

            <NavItem
              icon={<LogOut size={24} />}
              label="Log out"
              to="/admin/dashboard/logout"
            />
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
