import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { ChevronRight, ChevronLeft, Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import AstraBackground from "./AstraBackground";
import CursorFollower from "./CursorFollower";

export default function Layout() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(isMobile);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
      } else {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fechar sidebar no mobile ao mudar de rota
  useEffect(() => {
    if (isMobile && !sidebarCollapsed) {
      setSidebarCollapsed(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, isMobile]);

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98,
      filter: "blur(10px)",
    },
    enter: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.98,
      filter: "blur(10px)",
      transition: {
        duration: 0.3,
        ease: [0.25, 0.1, 0.25, 1],
      },
    },
  };

  return (
    <div className="flex min-h-screen bg-astra-bg relative overflow-hidden">
      {/* Animated background */}
      <AstraBackground />

      {/* Cursor Follower (desktop only) */}
      {!isMobile && <CursorFollower />}

      {/* Mobile Top Header */}
      {isMobile && (
        <div 
          className="fixed top-0 left-0 right-0 h-16 z-[60] bg-black/60 backdrop-blur-md flex items-center px-4"
          style={{ borderBottom: "1px solid rgba(168,85,247,0.15)" }}
        >
          <button 
            onClick={() => setSidebarCollapsed(false)} 
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-95 group"
            style={{ 
              background: "linear-gradient(135deg, #a855f7, #22d3ee)",
              border: "2px solid rgba(0,0,0,0.8)",
              boxShadow: "0 0 15px rgba(168,85,247,0.5)",
            }}
          >
            <ChevronRight size={20} className="text-white transition-transform group-active:translate-x-1" />
          </button>
          <span 
            className="ml-4 font-heading font-bold text-lg tracking-tight"
            style={{
              background: "linear-gradient(135deg, #c0e8ff 0%, #a78bfa 30%, #22d3ee 70%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Home Inventory
          </span>
        </div>
      )}

      {/* Mobile Overlay to close sidebar */}
      {isMobile && !sidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70]" 
          onClick={() => setSidebarCollapsed(true)} 
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} 
        isMobile={isMobile} 
      />

      {/* Main Content with Page Transitions */}
      <main
        className={`flex-1 relative z-10 overflow-x-hidden ${isMobile ? 'pt-16 w-full max-w-[100vw]' : ''}`}
        style={{ 
          marginLeft: isMobile ? "0px" : (sidebarCollapsed ? "72px" : "272px"), 
          transition: "margin-left 0.3s ease" 
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="min-h-screen p-4 md:p-6 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Custom Toaster */}
      <Toaster
        position={isMobile ? "bottom-center" : "top-right"}
        expand={true}
        richColors
        closeButton
        toastOptions={{
          style: {
            background: "rgba(3,3,6,0.95)",
            border: "1px solid rgba(168,85,247,0.3)",
            borderRadius: "12px",
            backdropFilter: "blur(20px)",
            color: "#fff",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: "14px",
            padding: "16px",
            boxShadow: "0 0 30px rgba(168,85,247,0.3), 0 8px 32px rgba(0,0,0,0.5)",
          },
          className: "custom-toast",
          duration: 3000,
          success: {
            style: {
              border: "1px solid rgba(16,185,129,0.4)",
              boxShadow: "0 0 30px rgba(16,185,129,0.3), 0 8px 32px rgba(0,0,0,0.5)",
            },
            iconTheme: {
              primary: "#10b981",
              secondary: "#d1fae5",
            },
          },
          error: {
            style: {
              border: "1px solid rgba(239,68,68,0.4)",
              boxShadow: "0 0 30px rgba(239,68,68,0.3), 0 8px 32px rgba(0,0,0,0.5)",
            },
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fee2e2",
            },
          },
        }}
      />
    </div>
  );
}
