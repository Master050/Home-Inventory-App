import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, ShoppingCart, Settings, ChevronLeft, ChevronRight, Home
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Estoque", icon: ShoppingCart },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  const location = useLocation();

  return (
    <aside
      data-testid="sidebar"
      className="fixed left-0 top-0 h-screen z-50 flex flex-col"
      style={{
        width: collapsed ? "72px" : "272px",
        transition: "width 0.3s ease",
        background: "rgba(3,3,6,0.92)",
        backdropFilter: "blur(30px)",
        borderRight: "1px solid rgba(168,85,247,0.12)",
        boxShadow: "4px 0 40px rgba(168,85,247,0.08)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center h-16 px-3 relative overflow-hidden"
        style={{ borderBottom: "1px solid rgba(168,85,247,0.1)" }}
      >
        {/* Aurora line at bottom of logo section */}
        <div className="aurora-line absolute bottom-0 left-0 right-0" />

        <div className="flex items-center gap-3 overflow-hidden w-full">
          {/* Logo - CSS version matching the Astra AI logo aesthetic */}
          <div
            className="flex-shrink-0 relative cursor-pointer sidebar-logo-glow"
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "14px",
              border: "1px solid rgba(168,85,247,0.45)",
              boxShadow: "0 0 20px rgba(168,85,247,0.45), 0 0 40px rgba(34,211,238,0.15)",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {/* Background gradient - deep space */}
            <div style={{
              position: "absolute", inset: 0,
              background: "radial-gradient(ellipse at 30% 20%, rgba(79,195,247,0.35) 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, rgba(168,85,247,0.45) 0%, transparent 50%), linear-gradient(135deg, #050510 0%, #0d0820 100%)",
            }} />
            {/* Glowing A letter */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <span style={{
                fontFamily: "Rajdhani", fontWeight: 700, fontSize: "22px", lineHeight: 1,
                background: "linear-gradient(135deg, #c0e8ff 0%, #a78bfa 50%, #22d3ee 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 6px rgba(168,85,247,0.9))",
              }}>A</span>
            </div>
            {/* Shimmer overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)",
              borderRadius: "14px",
            }} />
          </div>

          {!collapsed && (
            <div className="overflow-hidden min-w-0">
              <div
                className="font-heading font-bold text-xl tracking-wide leading-none"
                style={{
                  background: "linear-gradient(135deg, #c0e8ff 0%, #a78bfa 30%, #22d3ee 70%, #7dd3fc 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                }}
              >
                Home Inventory
              </div>
              <div className="flex items-center gap-1.5 mt-1">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee", animation: "status-pulse 2s ease-in-out infinite" }}
                />
                <span className="text-xs text-slate-500 font-body">Sincronizado</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button */}
      <button
        data-testid="sidebar-toggle"
        onClick={onToggle}
        className="absolute -right-3 top-5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-50 transition-all hover:scale-125"
        style={{
          background: "linear-gradient(135deg, #a855f7, #22d3ee)",
          border: "2px solid #050508",
          boxShadow: "0 0 12px rgba(168,85,247,0.6)",
        }}
      >
        {collapsed
          ? <ChevronRight size={12} className="text-white" />
          : <ChevronLeft size={12} className="text-white" />
        }
      </button>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="text-xs uppercase tracking-widest font-heading px-3 mb-3" style={{ color: "rgba(168,85,247,0.5)" }}>
            Principal
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }, idx) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <li key={path} className="stagger-item" style={{ animationDelay: `${idx * 0.07}s` }}>
                <NavLink
                  to={path}
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200 group relative"
                  style={{
                    background: isActive
                      ? "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(34,211,238,0.06))"
                      : "transparent",
                    borderLeft: isActive ? "2px solid #a855f7" : "2px solid transparent",
                    paddingLeft: "10px",
                    boxShadow: isActive ? "inset 0 0 20px rgba(168,85,247,0.1)" : "none",
                  }}
                >
                  {/* Active glow behind icon */}
                  {isActive && (
                    <div
                      style={{
                        position: "absolute",
                        left: "8px",
                        width: "24px",
                        height: "24px",
                        borderRadius: "8px",
                        background: "rgba(168,85,247,0.2)",
                        filter: "blur(8px)",
                      }}
                    />
                  )}
                  <Icon
                    size={19}
                    strokeWidth={isActive ? 2 : 1.5}
                    className="flex-shrink-0 transition-all duration-200 relative z-10"
                    style={{
                      color: isActive ? "#c084fc" : "#4b5563",
                      filter: isActive ? "drop-shadow(0 0 5px rgba(168,85,247,0.7))" : "none",
                    }}
                  />
                  {!collapsed && (
                    <span
                      className="font-body text-sm font-medium transition-all duration-200 relative z-10"
                      style={{ color: isActive ? "#e2e8f0" : "#4b5563" }}
                    >
                      {label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div
                      className="ml-auto w-1.5 h-1.5 rounded-full relative z-10"
                      style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }}
                    />
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 mx-3 aurora-line" />

        {!collapsed && (
          <p className="text-xs uppercase tracking-widest font-heading px-3 mb-3" style={{ color: "rgba(168,85,247,0.5)" }}>
            Sistema
          </p>
        )}
        <ul className="space-y-0.5">
          {bottomItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <NavLink
                  to={path}
                  data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200"
                  style={{
                    background: isActive ? "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(34,211,238,0.06))" : "transparent",
                    borderLeft: isActive ? "2px solid #a855f7" : "2px solid transparent",
                    paddingLeft: "10px",
                  }}
                >
                  <Icon
                    size={19}
                    strokeWidth={1.5}
                    className="flex-shrink-0"
                    style={{ color: isActive ? "#c084fc" : "#4b5563" }}
                  />
                  {!collapsed && (
                    <span
                      className="font-body text-sm font-medium"
                      style={{ color: isActive ? "#e2e8f0" : "#4b5563" }}
                    >
                      {label}
                    </span>
                  )}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-3" style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}>
          <div
            className="p-3 flex items-center gap-2 rounded-xl"
            style={{
              background: "rgba(168,85,247,0.06)",
              border: "1px solid rgba(168,85,247,0.15)",
            }}
          >
            <div className="relative flex-shrink-0">
              <Home size={15} style={{ color: "#22d3ee", filter: "drop-shadow(0 0 4px #22d3ee)" }} />
            </div>
            <div>
              <p className="text-xs text-white font-body leading-none">Home Inventory</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#475569" }}>v1.0.0</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee", animation: "status-pulse 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      )}
    </aside>
  );
}
