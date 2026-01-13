"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./comps/header";
import Sidebar from "./comps/sidebar";

export default function AdminDashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-[#121212] text-white overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="p-4 bg-[#121212] shrink-0">
          <Header setMobileOpen={setMobileOpen} />
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
