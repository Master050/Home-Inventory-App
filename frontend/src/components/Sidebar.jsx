import React, { useState, useRef } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import * as Tooltip from "@radix-ui/react-tooltip";
import MatrixRain from "./MatrixRain";
import {
  LayoutDashboard, ShoppingCart, Settings, ChevronLeft, ChevronRight, Home, LogOut, User, Shield, Eye
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/inventory", label: "Estoque", icon: ShoppingCart },
];

const bottomItems = [
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle, isMobile }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [showMatrix, setShowMatrix] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Triple click detector for Matrix Easter Egg
  const handleLogoClick = () => {
    clickCountRef.current += 1;

    if (clickCountRef.current === 3) {
      setShowMatrix(true);
      clickCountRef.current = 0;
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
    } else {
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 500);
    }
  };

  // Tooltip Item Wrapper
  const NavItemWithTooltip = ({ children, label, collapsed }) => {
    // No mobile a sidebar nunca colapsa em ícones pequenos,
    // ela simplesmente fica off-canvas.
    if (!collapsed || isMobile) return children;

    return (
      <Tooltip.Provider delayDuration={100}>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              side="right"
              className="px-3 py-2 rounded-lg text-sm font-body text-white z-50"
              style={{
                background: "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(124,58,237,0.95))",
                border: "1px solid rgba(168,85,247,0.5)",
                boxShadow: "0 0 20px rgba(168,85,247,0.5), 0 4px 12px rgba(0,0,0,0.5)",
                backdropFilter: "blur(10px)",
              }}
              sideOffset={10}
            >
              {label}
              <Tooltip.Arrow
                className="fill-purple-600"
                style={{ filter: "drop-shadow(0 0 2px rgba(168,85,247,0.5))" }}
              />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  };

  return (
    <>
    <aside
      data-testid="sidebar"
      className={`fixed top-0 left-0 h-screen z-[80] flex flex-col transition-all duration-300 ${
        isMobile ? (collapsed ? "-translate-x-full" : "translate-x-0 shadow-[10px_0_60px_rgba(0,0,0,0.8)]") : ""
      }`}
      style={{
        width: isMobile ? "280px" : (collapsed ? "72px" : "272px"),
        background: isMobile ? "rgba(7,7,12,0.98)" : "rgba(3,3,6,0.92)",
        backdropFilter: isMobile ? "none" : "blur(30px)", // Otimização performance mobile
        borderRight: "1px solid rgba(168,85,247,0.15)",
        boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
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
            onClick={handleLogoClick}
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
            title="Triple-click for a surprise! 🎉"
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

          {(!collapsed || isMobile) && (
            <div className="overflow-hidden min-w-0 flex-1">
              <div
                className="font-heading font-bold text-xl tracking-wide leading-none truncate"
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
              <div className="flex items-center gap-1.5 mt-1 truncate">
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: "#22d3ee", boxShadow: "0 0 6px #22d3ee", animation: "status-pulse 2s ease-in-out infinite" }}
                />
                <span className="text-xs text-slate-500 font-body">Sincronizado</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button - Hide on Mobile since we use Top Header */}
      {!isMobile && (
        <button
          data-testid="sidebar-toggle"
          onClick={onToggle}
          className="absolute -right-3 top-5 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer z-[60] transition-all hover:scale-125"
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
      )}

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 overflow-y-auto overflow-x-hidden">
        {(!collapsed || isMobile) && (
          <p className="text-xs uppercase tracking-widest font-heading px-3 mb-3" style={{ color: "rgba(168,85,247,0.5)" }}>
            Principal
          </p>
        )}
        <ul className="space-y-0.5">
          {navItems.map(({ path, label, icon: Icon }, idx) => {
            const isActive = location.pathname === path || location.pathname.startsWith(path + "/");
            return (
              <li key={path} className={isMobile ? "" : "stagger-item"} style={{ animationDelay: isMobile ? "0s" : `${idx * 0.07}s` }}>
                <NavItemWithTooltip label={label} collapsed={collapsed}>
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
                    {(!collapsed || isMobile) && (
                      <span
                        className="font-body text-sm font-medium transition-all duration-200 relative z-10"
                        style={{ color: isActive ? "#e2e8f0" : "#4b5563" }}
                      >
                        {label}
                      </span>
                    )}
                    {isActive && (!collapsed || isMobile) && (
                      <div
                        className="ml-auto w-1.5 h-1.5 rounded-full relative z-10"
                        style={{ background: "#a855f7", boxShadow: "0 0 8px #a855f7" }}
                      />
                    )}
                  </NavLink>
                </NavItemWithTooltip>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 mx-3 aurora-line" />

        {(!collapsed || isMobile) && (
          <p className="text-xs uppercase tracking-widest font-heading px-3 mb-3" style={{ color: "rgba(168,85,247,0.5)" }}>
            Sistema
          </p>
        )}
        <ul className="space-y-0.5">
          {bottomItems.map(({ path, label, icon: Icon }) => {
            const isActive = location.pathname === path;
            return (
              <li key={path}>
                <NavItemWithTooltip label={label} collapsed={collapsed}>
                  <NavLink
                    to={path}
                    data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all duration-200"
                    style={{
                      background: isActive
                        ? "linear-gradient(135deg, rgba(168,85,247,0.18), rgba(34,211,238,0.06))"
                        : "transparent",
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
                    {(!collapsed || isMobile) && (
                      <span
                        className="font-body text-sm font-medium"
                        style={{ color: isActive ? "#e2e8f0" : "#4b5563" }}
                      >
                        {label}
                      </span>
                    )}
                  </NavLink>
                </NavItemWithTooltip>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {(!collapsed || isMobile) && (
        <div className="p-3 space-y-3" style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}>
          {/* User Info */}
          <div
            className="p-3 rounded-xl relative overflow-hidden group"
            style={{
              background: "rgba(168,85,247,0.06)",
              border: "1px solid rgba(168,85,247,0.15)",
            }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{
                  background: user?.role === "admin" 
                    ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))"
                    : "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(79,195,247,0.2))",
                  border: user?.role === "admin" ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(34,211,238,0.4)"
                }}
              >
                {user?.role === "admin" ? (
                  <Shield size={16} className="text-purple-400" />
                ) : (
                  <Eye size={16} className="text-cyan-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-body font-medium leading-none truncate">
                  {user?.username}
                </p>
                <p 
                  className="text-xs font-mono mt-1 leading-none"
                  style={{ color: user?.role === "admin" ? "#a855f7" : "#22d3ee" }}
                >
                  {user?.role === "admin" ? "Acesso Completo" : "Visualização"}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full p-3 flex items-center justify-center gap-2 rounded-xl transition-all hover:bg-red-500/10 border border-transparent hover:border-red-500/30 group"
          >
            <LogOut size={16} className="text-slate-500 group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-body text-slate-500 group-hover:text-red-400 transition-colors">
              Sair do Sistema
            </span>
          </button>
          
          {/* App Info */}
          <div
            className="p-3 flex items-center gap-2 rounded-xl"
            style={{
              background: "rgba(34,211,238,0.04)",
              border: "1px solid rgba(34,211,238,0.1)",
            }}
          >
            <div className="relative flex-shrink-0">
              <Home size={15} style={{ color: "#22d3ee", filter: "drop-shadow(0 0 4px #22d3ee)" }} />
            </div>
            <div>
              <p className="text-xs text-white font-body leading-none">Home Inventory</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "#475569" }}>v2.1.0</p>
            </div>
            <div
              className="ml-auto w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: "#22d3ee", boxShadow: "0 0 8px #22d3ee", animation: "status-pulse 2s ease-in-out infinite" }}
            />
          </div>
        </div>
      )}

      {/* Collapsed Footer - Just indicators */}
      {(collapsed && !isMobile) && (
        <div className="p-2 space-y-2" style={{ borderTop: "1px solid rgba(168,85,247,0.1)" }}>
          {/* User indicator */}
          <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <div className="flex justify-center">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer"
                    style={{
                      background: user?.role === "admin" ? "rgba(168,85,247,0.2)" : "rgba(34,211,238,0.2)",
                      border:
                        user?.role === "admin" ? "1px solid rgba(168,85,247,0.4)" : "1px solid rgba(34,211,238,0.4)",
                    }}
                  >
                    {user?.role === "admin" ? (
                      <Shield size={18} className="text-purple-400" />
                    ) : (
                      <Eye size={18} className="text-cyan-400" />
                    )}
                  </div>
                </div>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="px-3 py-2 rounded-lg text-sm font-body text-white z-50 flex flex-col gap-1"
                  style={{
                    background: "linear-gradient(135deg, rgba(168,85,247,0.95), rgba(124,58,237,0.95))",
                    border: "1px solid rgba(168,85,247,0.5)",
                    boxShadow: "0 0 20px rgba(168,85,247,0.5), 0 4px 12px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(10px)",
                  }}
                  sideOffset={10}
                >
                  <span className="font-bold">{user?.username}</span>
                  <span className="text-xs opacity-80">
                    {user?.role === "admin" ? "Acesso Completo" : "Visualização"}
                  </span>
                  <Tooltip.Arrow
                    className="fill-purple-600"
                    style={{ filter: "drop-shadow(0 0 2px rgba(168,85,247,0.5))" }}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>

          {/* Logout */}
          <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <button
                  onClick={handleLogout}
                  className="w-full p-2.5 flex items-center justify-center rounded-lg transition-all hover:bg-red-500/10 border border-transparent hover:border-red-500/30"
                >
                  <LogOut size={18} className="text-slate-500 hover:text-red-400 transition-colors" />
                </button>
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  side="right"
                  className="px-3 py-2 rounded-lg text-sm font-body text-white z-50"
                  style={{
                    background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(185,28,28,0.95))",
                    border: "1px solid rgba(239,68,68,0.5)",
                    boxShadow: "0 0 20px rgba(239,68,68,0.5), 0 4px 12px rgba(0,0,0,0.5)",
                    backdropFilter: "blur(10px)",
                  }}
                  sideOffset={10}
                >
                  Sair do Sistema
                  <Tooltip.Arrow
                    className="fill-red-600"
                    style={{ filter: "drop-shadow(0 0 2px rgba(239,68,68,0.5))" }}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        </div>
      )}
      </aside>
      
      {/* Matrix Easter Egg */}
      {showMatrix && <MatrixRain onClose={() => setShowMatrix(false)} />}
    </>
  );
}
