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
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="p-4 sticky top-0 z-50">
          <Header setMobileOpen={setMobileOpen} />
        </div>

        {/* PAGE CONTENT */}
        <main className="p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
