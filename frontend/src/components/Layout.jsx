import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import AstraBackground from "./AstraBackground";

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-astra-bg relative overflow-hidden">
      {/* Animated background */}
      <AstraBackground />

      {/* Sidebar */}
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      {/* Main Content */}
      <main
        className="flex-1 relative z-10 overflow-auto"
        style={{ marginLeft: sidebarCollapsed ? "72px" : "272px", transition: "margin-left 0.3s ease" }}
      >
        <div className="min-h-screen p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
