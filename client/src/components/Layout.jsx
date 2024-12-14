"use client";

import { useState } from "react";
import TopNavbar from "./TopNavbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [showNav, setShowNav] = useState(true);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar showNav={showNav} onClose={() => setShowNav(false)} />

      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <TopNavbar onMenuClick={() => setShowNav(!showNav)} />

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}
