import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";
import {
  Package, AlertTriangle, CreditCard, Box, ChevronRight, Zap, Target, Layers,
  Clock, Calendar, TrendingUp, TrendingDown, Activity, CheckCircle2
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";

// ── Real-time Clock Component ──
function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const formattedDate = time.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-cyan-400" />
        <span className="text-2xl font-mono font-bold text-white tabular-nums">
          {formattedTime}
        </span>
      </div>
      <div className="h-6 w-px bg-white/20" />
      <div className="flex items-center gap-2">
        <Calendar size={16} className="text-purple-400" />
        <span className="text-sm font-body text-slate-400 capitalize">
          {formattedDate}
        </span>
      </div>
    </div>
  );
}

// ── Animated Numbers ──
function useCountUp(target, duration = 1200, delay = 0) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === null || target === undefined) return;
    const timeout = setTimeout(() => {
      if (target === 0) {
        setCount(0);
        return;
      }
      let start = 0;
      const steps = 40;
      const stepVal = target / steps;
      const stepTime = duration / steps;
      const timer = setInterval(() => {
        start += stepVal;
        if (start >= target) {
          setCount(target);
          clearInterval(timer);
        } else setCount(start);
      }, stepTime);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(timeout);
  }, [target, duration, delay]);
  return count;
}

// ── Enhanced Stat Card ──
function StatCard({ label, value, sublabel, icon: Icon, color, glow, delay, onClick, prefix = "", trend }) {
  const isCurrency = prefix !== "";
  const counted = useCountUp(value, 1000, delay * 150);

  const displayValue = isCurrency
    ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(counted)
    : Math.floor(counted);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay: delay * 0.08 }}
      onClick={onClick}
      className={`glass-card card-shine relative overflow-hidden group ${onClick ? "cursor-pointer" : ""}`}
      style={{
        padding: "16px 20px",
        transition: "transform 0.3s, box-shadow 0.3s, border-color 0.3s",
      }}
      whileHover={{
        y: onClick ? -6 : 0,
        boxShadow: onClick ? `0 0 50px -8px ${glow}, 0 12px 40px rgba(0,0,0,0.5)` : "",
        borderColor: `${color}70`,
      }}
    >
      <div className="scan-line" style={{ animationDelay: `${delay * 0.8}s`, animationDuration: "4s" }} />
      
      {/* Background Glow */}
      <motion.div
        animate={{
          opacity: [0.4, 0.7, 0.4],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          filter: "blur(25px)",
        }}
      />

      <div className="relative z-10 flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="p-2 rounded-xl"
              style={{ background: `${color}20`, border: `1px solid ${color}40` }}
            >
              <Icon size={16} style={{ color, filter: `drop-shadow(0 0 6px ${color})` }} strokeWidth={2} />
            </motion.div>
            <span className="text-xs font-heading uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>
              {label}
            </span>
          </div>

          <div className="flex items-end gap-3 mb-3">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: delay * 0.1 + 0.3, type: "spring", stiffness: 200 }}
              className="font-heading font-bold leading-none"
              style={{
                fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                color: "#ffffff",
                textShadow: `0 0 25px ${glow}, 0 0 10px ${glow}`,
              }}
            >
              {displayValue}
            </motion.span>

            {/* Trend Indicator */}
            {trend !== undefined && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: delay * 0.1 + 0.5 }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg mb-1"
                style={{
                  background: trend >= 0 ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                  border: trend >= 0 ? "1px solid rgba(16,185,129,0.3)" : "1px solid rgba(239,68,68,0.3)",
                }}
              >
                {trend >= 0 ? (
                  <TrendingUp size={12} className="text-emerald-400" />
                ) : (
                  <TrendingDown size={12} className="text-red-400" />
                )}
                <span
                  className="text-xs font-mono font-bold"
                  style={{ color: trend >= 0 ? "#10b981" : "#ef4444" }}
                >
                  {Math.abs(trend)}%
                </span>
              </motion.div>
            )}
          </div>

          <p className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
            {sublabel}
          </p>
        </div>
      </div>

      {/* Hover Ripple Effect */}
      {onClick && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ scale: 0, opacity: 0.5 }}
          whileHover={{ scale: 2, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `radial-gradient(circle, ${color}40 0%, transparent 70%)`,
          }}
        />
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, missing: 0, cost: 0, categories: [] });
  const [loading, setLoading] = useState(true);
  const [prevStats, setPrevStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInventory();
    // Refresh every 30 seconds
    const interval = setInterval(fetchInventory, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchInventory = async () => {
    const { data } = await supabase.from("inventario_casa").select("*");
    if (data) {
      setItems(data);
      calculateStats(data);
    }
    setLoading(false);
  };

  const calculateStats = (data) => {
    const total = data.length;
    let missingCount = 0;
    let totalCost = 0;
    const catMap = {};

    data.forEach((item) => {
      const atual = Number(item.quantidade_atual) || 0;
      const ideal = Number(item.quantidade_ideal) || 1; // avoid div by zero
      const itemHealth = Math.min(100, (atual / ideal) * 100);
      const isMissing = atual < ideal;
      
      if (isMissing) {
        missingCount++;
        totalCost += (ideal - atual) * (item.preco_ultima_compra || 0);
      }
      
      const catName = item.categoria || "Geral";
      if (!catMap[catName]) {
        catMap[catName] = { nome: catName, total_itens: 0, em_falta: 0, soma_saude: 0 };
      }
      
      catMap[catName].total_itens++;
      catMap[catName].soma_saude += itemHealth;
      if (isMissing) catMap[catName].em_falta++;
    });

    const categories = Object.values(catMap).map(cat => ({
      ...cat,
      // Saúde real: média da saúde dos itens da categoria (100% se tudo estiver no ideal)
      saude: Math.round(cat.soma_saude / cat.total_itens)
    })).sort((a, b) => b.saude - a.saude); // Ordenar por saúde (menores primeiro pode ser útil, mas manteremos os maiores no topo conforme original)

    const newStats = {
      total,
      missing: missingCount,
      cost: totalCost,
      categories,
    };

    setPrevStats(stats);
    setStats(newStats);
  };

  const calculateTrend = (current, previous) => {
    if (!previous || previous === 0) return undefined;
    return Math.round(((current - previous) / previous) * 100);
  };

  const totalAtualValue = items.reduce((acc, i) => acc + (Number(i.quantidade_atual) || 0), 0);
  const totalIdealValue = items.reduce((acc, i) => acc + (Number(i.quantidade_ideal) || 0), 0);
  const stockHealth = totalIdealValue > 0 ? Math.round(Math.min(100, (totalAtualValue / totalIdealValue) * 100)) : 100;

  if (loading) return null;

  return (
    <div className="space-y-4">
      {/* ── Enhanced Banner with Live Clock ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card card-shine relative overflow-hidden p-6"
      >
        <div className="scan-line" style={{ animationDuration: "6s" }} />

        {/* Animated Background Orbs */}
        <motion.div
          animate={{
            x: [0, 20, 0],
            y: [0, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-60 h-60 rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, #a855f7 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            <div>
              <h1
                className="font-heading font-bold text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-300 to-cyan-300 mb-1 flex items-center gap-2"
                style={{ filter: "drop-shadow(0 0 15px rgba(168,85,247,0.4))" }}
              >
                <Activity className="text-purple-400" size={32} />
                ESTATÍSTICAS DA CASA
              </h1>
              <LiveClock />
            </div>

            <button
              onClick={() => navigate("/inventory")}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl text-white text-sm font-mono flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg hover:shadow-purple-500/50 relative overflow-hidden group w-full lg:w-auto mt-4 lg:mt-0"
            >
              <div className="scan-line" style={{ animationDuration: "2s" }} />
              <span className="relative z-10">Visualizar Estoque</span>
              <ChevronRight size={16} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Health Status Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap size={14} className="text-cyan-400" />
                </motion.div>
                <span className="font-mono text-xs font-semibold tracking-widest uppercase text-slate-400">
                  Saúde Geral do Sistema
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono font-bold text-white">
                  {stockHealth}%
                </span>
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    background: stats.missing > 0 ? "#f43f5e" : "#10b981",
                    boxShadow: `0 0 10px ${stats.missing > 0 ? "#f43f5e" : "#10b981"}`,
                    animation: "status-pulse 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Animated Health Bar */}
            <div className="relative h-3 bg-black/50 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockHealth}%` }}
                transition={{ duration: 2, ease: "easeOut", delay: 0.3 }}
                className="h-full relative overflow-hidden rounded-full"
                style={{
                  background: `linear-gradient(90deg, 
                    ${stockHealth > 80 ? "#10b981" : stockHealth > 50 ? "#f59e0b" : "#ef4444"} 0%, 
                    ${stockHealth > 80 ? "#10b981" : stockHealth > 50 ? "#f59e0b" : "#ef4444"}aa 100%)`,
                  boxShadow: `0 0 15px ${stockHealth > 80 ? "#10b981" : stockHealth > 50 ? "#f59e0b" : "#ef4444"}80`,
                }}
              >
                {/* Shine Effect - CONTAINED */}
                <motion.div
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"
                  style={{ width: "30%" }}
                />
              </motion.div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                STATUS: {stats.missing > 0 ? `${stats.missing} REPOSIÇÕES PENDENTES` : "CONDIÇÕES IDEAIS"}
              </p>
              {stats.missing > 0 && (
                <span className="text-xs font-mono text-amber-400 animate-pulse">
                  ⚠ Atenção Necessária
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Grid Principal de Cards com Trends ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total de Produtos"
          value={stats.total}
          sublabel="registrados no sistema"
          icon={Package}
          color="#a855f7"
          glow="rgba(168,85,247,0.6)"
          delay={1}
          onClick={() => navigate("/inventory")}
          trend={calculateTrend(stats.total, prevStats?.total)}
        />
        <StatCard
          label="Itens em Falta"
          value={stats.missing}
          sublabel="urgência de compra"
          icon={AlertTriangle}
          color="#f43f5e"
          glow="rgba(244,63,94,0.6)"
          delay={2}
          onClick={() => navigate("/inventory")}
          trend={calculateTrend(stats.missing, prevStats?.missing)}
        />
        <StatCard
          label="Custo Estimado"
          value={stats.cost}
          prefix="R$"
          sublabel="próxima compra"
          icon={CreditCard}
          color="#22d3ee"
          glow="rgba(34,211,238,0.6)"
          delay={3}
          trend={calculateTrend(stats.cost, prevStats?.cost)}
        />
        <StatCard
          label="Categorias"
          value={stats.categories.length}
          sublabel="departamentos"
          icon={Layers}
          color="#10b981"
          glow="rgba(16,185,129,0.6)"
          delay={4}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        {/* ── Enhanced Chart - Distribuição por Categoria ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="xl:col-span-8 p-4 md:p-6 glass-card card-shine relative overflow-hidden"
        >
          <div className="scan-line" style={{ animationDuration: "8s" }} />

          <div className="flex items-center gap-2 mb-6 relative z-10">
            <Box size={18} style={{ color: "#a855f7" }} />
            <h2 className="font-heading font-bold text-base tracking-widest text-white uppercase">
              Saúde por Categoria
            </h2>
          </div>

          {stats.categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.categories.map((cat, index) => {
                const colors = [
                  { bg: "#a855f7", light: "#c084fc" },
                  { bg: "#22d3ee", light: "#67e8f9" },
                  { bg: "#10b981", light: "#34d399" },
                  { bg: "#f59e0b", light: "#fbbf24" },
                  { bg: "#ec4899", light: "#f472b6" },
                  { bg: "#6366f1", light: "#818cf8" },
                  { bg: "#ef4444", light: "#f87171" },
                ];
                const color = colors[index % colors.length];
                const hasIssues = cat.em_falta > 0;

                return (
                  <motion.div
                    key={cat.nome}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative p-4 rounded-xl overflow-hidden group cursor-pointer"
                    style={{
                      background: `${color.bg}08`,
                      border: `1px solid ${color.bg}20`,
                    }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: `${color.bg}60`,
                      boxShadow: `0 0 30px ${color.bg}40`,
                    }}
                  >
                    {/* Background glow */}
                    <div
                      className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-3xl"
                      style={{ background: color.bg }}
                    />

                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 relative z-10"
                      style={{
                        background: `${color.bg}20`,
                        border: `1px solid ${color.bg}40`,
                      }}
                    >
                      <Package size={20} style={{ color: color.light }} />
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                      <h3 className="text-white font-heading font-bold text-lg mb-1">
                        {cat.nome}
                      </h3>

                      <div className="flex items-baseline gap-2 mb-2">
                        <span
                          className="text-2xl font-bold"
                          style={{
                            color: color.light,
                            textShadow: `0 0 15px ${color.bg}60`,
                          }}
                        >
                          {cat.saude}%
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono tracking-tighter">
                          CAPACIDADE DO ESTOQUE ({cat.total_itens} {cat.total_itens === 1 ? 'ITEM' : 'ITENS'})
                        </span>
                      </div>
 
                      {/* Progress bar */}
                      <div className="h-1.5 bg-black/40 rounded-full overflow-hidden mb-2">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.saude}%` }}
                          transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${color.bg}, ${color.light})`,
                            boxShadow: `0 0 10px ${color.bg}60`,
                          }}
                        />
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {hasIssues ? (
                          <>
                            <AlertTriangle size={12} className="text-red-400" />
                            <span className="text-xs font-mono text-red-400">
                              {cat.em_falta} em falta
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            <span className="text-xs font-mono text-emerald-400">
                              Completo
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-slate-500">
              <Package size={48} className="mb-4 opacity-30" />
              <p className="font-mono text-sm">Nenhuma categoria ainda</p>
            </div>
          )}
        </motion.div>

        {/* ── Enhanced Urgent Actions with Mini Progress ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="xl:col-span-4 p-6 glass-card card-shine relative overflow-hidden flex flex-col h-[400px] xl:h-auto xl:max-h-[600px] mt-4 xl:mt-0"
        >
          <div className="scan-line" style={{ animationDuration: "7s" }} />

          <div className="flex items-center gap-2 mb-6 pb-4 relative z-10 border-b border-white/5">
            <Target size={18} className="text-rose-400" />
            <h2 className="font-heading font-bold text-base tracking-widest text-white uppercase">
              Ações Urgentes
            </h2>
            {stats.missing > 0 && (
              <span className="ml-auto px-2 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-mono font-bold">
                {stats.missing}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar relative z-10">
            <AnimatePresence mode="wait">
              {items.filter((i) => i.quantidade_atual < i.quantidade_ideal).length === 0 ? (
                <motion.div
                  key="no-issues"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="flex flex-col items-center justify-center h-full py-12"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle2 className="text-emerald-400 mb-4" size={48} />
                  </motion.div>
                  <p className="text-emerald-400 font-heading font-bold text-lg mb-2">
                    TUDO CERTO!
                  </p>
                  <p className="text-slate-500 font-mono text-xs text-center">
                    Sem pendências no momento.
                    <br />
                    Estoque estável.
                  </p>
                  <motion.div
                    className="mt-4 flex gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-emerald-500"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 1, 0.3],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              ) : (
                items
                  .filter((i) => i.quantidade_atual < i.quantidade_ideal)
                  .map((item, idx) => {
                    const percentage = (item.quantidade_atual / item.quantidade_ideal) * 100;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -20, scale: 0.9 }}
                        transition={{ delay: 0.05 * idx }}
                        className="group relative flex flex-col p-4 rounded-xl transition-all cursor-pointer"
                        style={{
                          background: "rgba(244,63,94,0.05)",
                          border: "1px solid rgba(244,63,94,0.15)",
                        }}
                        whileHover={{
                          background: "rgba(244,63,94,0.12)",
                          borderColor: "rgba(244,63,94,0.3)",
                          scale: 1.02,
                        }}
                        onClick={() => navigate("/inventory")}
                      >
                        {/* Item Info */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3 flex-1">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="p-2 rounded-lg bg-rose-500/20 border border-rose-500/30"
                            >
                              <AlertTriangle size={14} className="text-rose-400" />
                            </motion.div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-white text-sm font-semibold mb-0.5 truncate">
                                {item.nome}
                              </h3>
                              <p
                                className="text-[10px] font-mono tracking-widest uppercase text-slate-500"
                              >
                                {item.categoria}
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-baseline gap-1">
                              <span
                                className="text-rose-400 font-bold text-lg"
                                style={{ filter: "drop-shadow(0 0 6px rgba(244,63,94,0.5))" }}
                              >
                                {item.quantidade_atual}
                              </span>
                              <span className="font-mono text-xs text-slate-500">
                                / {item.quantidade_ideal}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Mini Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-600 font-mono">Nível</span>
                            <span className="text-rose-400 font-mono font-bold">
                              {percentage.toFixed(0)}%
                            </span>
                          </div>
                          <div className="relative h-1.5 bg-black/40 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 1, delay: idx * 0.1 }}
                              className="h-full rounded-full"
                              style={{
                                background: "linear-gradient(90deg, #ef4444, #f87171)",
                                boxShadow: "0 0 8px rgba(239,68,68,0.5)",
                              }}
                            />
                          </div>
                        </div>

                        {/* Hover Glow */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl bg-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ boxShadow: "0 0 12px #f43f5e" }}
                        />
                      </motion.div>
                    );
                  })
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style jsx="true">{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(244, 63, 94, 0.2);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(244, 63, 94, 0.4);
        }
      `}</style>
    </div>
  );
}
