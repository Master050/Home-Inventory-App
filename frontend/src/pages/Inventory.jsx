import React, { useEffect, useState, useRef } from "react";
import { supabase } from "../config/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Loader2, Save, ShoppingCart, RefreshCw, Lock, 
  TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle2,
  Activity, Zap
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

// Category color mapping
const CATEGORY_COLORS = {
  "Alimentos": { bg: "#10b981", text: "#d1fae5", border: "#34d399" },
  "Bebidas": { bg: "#22d3ee", text: "#cffafe", border: "#67e8f9" },
  "Limpeza": { bg: "#a855f7", text: "#f3e8ff", border: "#c084fc" },
  "Higiene": { bg: "#ec4899", text: "#fce7f3", border: "#f472b6" },
  "Geral": { bg: "#6366f1", text: "#e0e7ff", border: "#818cf8" },
  "Utensílios": { bg: "#f59e0b", text: "#fef3c7", border: "#fbbf24" },
  "Cozinha": { bg: "#ef4444", text: "#fee2e2", border: "#f87171" },
};

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanningRow, setScanningRow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const scrollRef = useRef(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("inventario_casa")
      .select("*")
      .order("criado_em", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar dados do Supabase");
      console.error(error);
    } else {
      setItems(data || []);
      // Animate scanning effect (Desktop only for performance)
      if (window.innerWidth >= 768) {
        data?.forEach((_, idx) => {
          setTimeout(() => setScanningRow(idx), idx * 50);
        });
        setTimeout(() => setScanningRow(null), (data?.length || 0) * 50 + 500);
      }
    }
    setLoading(false);
  };

  const handleCellChange = (id, field, value) => {
    if (!isAdmin()) {
      toast.error("Você não tem permissão para editar");
      return;
    }

    let processedValue = value;
    
    // Autocorreção para campos numéricos
    if (["quantidade_atual", "quantidade_ideal", "preco_ultima_compra"].includes(field)) {
      // Se for string (vindo de um input text ou sanitização), limpa formatos estranhos
      if (typeof value === "string") {
        // Permite apenas números e um separador (ponto ou vírgula)
        processedValue = value.replace(/[^\d.,]/g, "").replace(",", ".");
        
        // Evita múltiplos pontos
        const parts = processedValue.split(".");
        if (parts.length > 2) processedValue = parts[0] + "." + parts.slice(1).join("");
      }
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: processedValue, is_dirty: true } : item))
    );
  };

  const saveChanges = async () => {
    if (!isAdmin()) {
      toast.error("Você não tem permissão para salvar");
      return;
    }

    const dirtyItems = items.filter((i) => i.is_dirty);
    if (dirtyItems.length === 0) {
      toast.info("Nenhuma alteração pendente.");
      return;
    }

    setSaving(true);
    let successCount = 0;

    for (const item of dirtyItems) {
      const { id, nome, categoria, quantidade_atual, quantidade_ideal, preco_ultima_compra } = item;
      const { error } = await supabase
        .from("inventario_casa")
        .update({ nome, categoria, quantidade_atual, quantidade_ideal, preco_ultima_compra })
        .eq("id", id);

      if (!error) successCount++;
    }

    if (successCount === dirtyItems.length) {
      toast.success(`${successCount} itens atualizados com sucesso!`);
      setItems((prev) => prev.map((i) => ({ ...i, is_dirty: false })));
    } else {
      toast.error("Houve um erro ao salvar alguns itens.");
    }
    setSaving(false);
  };

  const addNewItem = async () => {
    if (!isAdmin()) {
      toast.error("Você não tem permissão para adicionar itens");
      return;
    }

    const newItem = {
      nome: "Novo Produto",
      categoria: "Geral",
      quantidade_atual: 0,
      quantidade_ideal: 1,
      preco_ultima_compra: 0.0,
    };

    const { data, error } = await supabase
      .from("inventario_casa")
      .insert([newItem])
      .select();

    if (error) {
      toast.error("Erro ao criar nova linha");
    } else if (data) {
      setItems([data[0], ...items]);
      toast.success("Nova linha adicionada");
    }
  };

  const deleteItem = async (id) => {
    if (!isAdmin()) {
      toast.error("Você não tem permissão para deletar");
      return;
    }

    const { error } = await supabase.from("inventario_casa").delete().eq("id", id);
    if (!error) {
      setItems(items.filter((i) => i.id !== id));
      toast.success("Item removido com sucesso!");
    } else {
      toast.error("Erro ao remover item");
    }
  };

  const handleDeleteClick = (item) => {
    setDeleteConfirm({
      id: item.id,
      name: item.nome,
    });
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const getCategoryColor = (cat) => {
    return CATEGORY_COLORS[cat] || CATEGORY_COLORS["Geral"];
  };

  const getStockPercentage = (atual, ideal) => {
    if (ideal === 0) return 100;
    return Math.min((atual / ideal) * 100, 100);
  };

  const getHealthColor = (percentage) => {
    if (percentage >= 80) return "#10b981";
    if (percentage >= 50) return "#f59e0b";
    return "#ef4444";
  };

  // Helper to ensure numbers are correctly parsed (handling strings/commas)
  const parseNum = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    return Number(String(val).replace(",", ".")) || 0;
  };

  // Calculations
  const itemsToBuy = items.filter((i) => parseNum(i.quantidade_atual) < parseNum(i.quantidade_ideal));
  const totalCostEstimate = itemsToBuy.reduce((acc, curr) => {
    const ideal = parseNum(curr.quantidade_ideal);
    const atual = parseNum(curr.quantidade_atual);
    const preco = parseNum(curr.preco_ultima_compra);
    const diff = Math.max(0, ideal - atual);
    return acc + diff * preco;
  }, 0);

  const totalItems = items.length;
  const totalValue = items.reduce(
    (acc, curr) => acc + parseNum(curr.quantidade_atual) * parseNum(curr.preco_ultima_compra),
    0
  );
  const stockHealth = items.length > 0
    ? items.reduce((acc, curr) => {
        const atual = parseNum(curr.quantidade_atual);
        const ideal = parseNum(curr.quantidade_ideal);
        return acc + getStockPercentage(atual, ideal);
      }, 0) / items.length
    : 100;

  return (
    <div className="space-y-6">
      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => deleteItem(deleteConfirm?.id)}
        title="Deletar Item"
        message={`Tem certeza que deseja remover "${deleteConfirm?.name}" do inventário? Esta ação não pode ser desfeita.`}
        confirmText="Sim, Deletar"
        cancelText="Cancelar"
        variant="danger"
      />

      {/* Enhanced Header with Health Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card card-shine flex flex-col lg:flex-row items-start lg:items-center justify-between p-6 overflow-hidden relative gap-4"
      >
        <div className="scan-line" style={{ animationDuration: "5s" }} />

        <div className="relative z-10 flex-1 w-full lg:w-auto">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative">
              <ShoppingCart size={28} className="text-purple-400" style={{ filter: "drop-shadow(0 0 8px #a855f7)" }} />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 border border-purple-500/30 rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-purple-300 to-cyan-300">
                HOME INVENTORY
              </h1>
              <p className="text-slate-400 font-mono text-xs md:text-sm mt-1">
                Gestão de dispensa inteligente conectada à Nuvem
              </p>
            </div>
          </div>

          {/* Health Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
              <span className="text-xs font-heading uppercase tracking-widest text-slate-500">
                Saúde Geral do Estoque
              </span>
              <span className="text-sm font-mono font-bold" style={{ color: getHealthColor(stockHealth) }}>
                {stockHealth.toFixed(0)}%
              </span>
            </div>
            <div className="relative h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stockHealth}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full rounded-full relative"
                style={{
                  background: `linear-gradient(90deg, ${getHealthColor(stockHealth)}, ${getHealthColor(stockHealth)}dd)`,
                  boxShadow: `0 0 10px ${getHealthColor(stockHealth)}80`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-end lg:justify-start items-center gap-3 relative z-10 w-full lg:w-auto mt-4 lg:mt-0">
          {/* Stats Quick View */}
          {itemsToBuy.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-end px-4 py-2 rounded-lg"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.3)",
              }}
            >
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} className="text-red-400" />
                <span className="text-sm text-red-400 font-mono font-bold">{itemsToBuy.length} Em Falta</span>
              </div>
              <span className="text-xs text-slate-400 font-mono tracking-tighter">
                {formatCurrency(totalCostEstimate)}
              </span>
            </motion.div>
          )}

          <button
            onClick={fetchInventory}
            className="p-2.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-slate-300 hover:text-white hover:border-cyan-500/30 group"
          >
            <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" />
          </button>

          {isAdmin() && (
            <>
              <button
                onClick={saveChanges}
                disabled={saving}
                className="px-4 py-2.5 rounded-lg bg-purple-600/20 border border-purple-500/30 hover:bg-purple-600/40 transition-all flex items-center gap-2 text-purple-200 font-semibold disabled:opacity-50 hover:scale-105"
              >
                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                <span className="hidden md:inline">Salvar</span>
              </button>

              <button
                onClick={addNewItem}
                className="px-4 py-2.5 rounded-lg bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/40 transition-all flex items-center gap-2 text-blue-200 font-semibold hover:scale-105"
              >
                <Plus size={16} />
                <span className="hidden md:inline">Nova Linha</span>
              </button>
            </>
          )}

          {!isAdmin() && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <Lock size={14} className="text-amber-400" />
              <span className="text-xs font-mono text-amber-400">Somente Visualização</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Enhanced Table */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card card-shine overflow-hidden"
      >
        <div className="w-full overflow-x-auto" ref={scrollRef}>
          <table className="w-full text-sm text-left min-w-[1000px]">
            <thead className="bg-black/40 text-xs font-mono uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-3 py-3" style={{ width: "50px" }}>
                  <Activity size={14} className="mx-auto" />
                </th>
                <th className="px-3 py-3" style={{ width: "200px" }}>Produto</th>
                <th className="px-3 py-3" style={{ width: "140px" }}>Categoria</th>
                <th className="px-3 py-3" style={{ width: "180px" }}>Estoque</th>
                <th className="px-3 py-3 text-center" style={{ width: "100px" }}>Atual</th>
                <th className="px-3 py-3 text-center" style={{ width: "100px" }}>Ideal</th>
                <th className="px-3 py-3 text-right" style={{ width: "120px" }}>Preço Un.</th>
                {isAdmin() && <th className="px-3 py-3 text-center" style={{ width: "80px" }}>Ações</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={isAdmin() ? 8 : 7} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin" size={32} />
                      <p className="font-mono text-sm">Carregando inventário...</p>
                      <div className="flex gap-2">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 rounded-full bg-purple-500"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                          />
                        ))}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin() ? 8 : 7} className="px-6 py-12 text-center text-slate-500">
                    <Package size={48} className="mx-auto mb-3 opacity-30" />
                    Nenhum item adicionado à sua casa.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {items.map((item, index) => {
                    const outOfStock = Number(item.quantidade_atual) < Number(item.quantidade_ideal);
                    const percentage = getStockPercentage(item.quantidade_atual, item.quantidade_ideal);
                    const categoryColor = getCategoryColor(item.categoria);
                    const isScanning = scanningRow === index;

                    return (
                      <motion.tr
                        key={item.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: isMobile ? 0 : index * 0.05 }}
                        className={`group hover:bg-white/5 transition-all duration-300 relative ${
                          item.is_dirty ? "bg-amber-900/10" : ""
                        } ${isScanning ? "bg-cyan-500/10" : ""}`}
                        style={{
                          borderLeft: outOfStock ? "3px solid #ef4444" : "3px solid transparent",
                        }}
                      >
                        {/* Status Indicator */}
                        <td className="px-3 py-3" style={{ width: "50px" }}>
                          {/* Hover Glow Effect */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 via-cyan-500 to-purple-500"
                            style={{ boxShadow: "0 0 20px currentColor" }}
                          />

                          {/* Scanning Effect */}
                          {isScanning && (
                            <motion.div
                              initial={{ left: 0 }}
                              animate={{ left: "100%" }}
                              transition={{ duration: 0.5 }}
                              className="absolute top-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent pointer-events-none"
                            />
                          )}

                          <motion.div
                            animate={{
                              scale: outOfStock ? [1, 1.2, 1] : 1,
                              boxShadow: outOfStock
                                ? ["0 0 8px rgba(239,68,68,0.6)", "0 0 12px rgba(239,68,68,0.8)", "0 0 8px rgba(239,68,68,0.6)"]
                                : "0 0 8px rgba(16,185,129,0.3)",
                            }}
                            transition={{ duration: 2, repeat: outOfStock ? Infinity : 0 }}
                            className={`w-3 h-3 rounded-full mx-auto ${
                              outOfStock ? "bg-red-500" : "bg-emerald-500"
                            }`}
                          />
                        </td>

                        {/* Product Name */}
                        <td className="px-3 py-2" style={{ width: "200px" }}>
                          <input
                            value={item.nome || ""}
                            onChange={(e) => handleCellChange(item.id, "nome", e.target.value)}
                            disabled={!isAdmin()}
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-purple-500 rounded px-2 py-1.5 outline-none text-white placeholder-slate-600 ${
                              !isAdmin() ? "cursor-default" : ""
                            }`}
                          />
                        </td>

                        {/* Category Badge */}
                        <td className="px-3 py-2" style={{ width: "140px" }}>
                          {isAdmin() ? (
                            <input
                              value={item.categoria || ""}
                              onChange={(e) => handleCellChange(item.id, "categoria", e.target.value)}
                              className="w-full bg-transparent border-0 focus:ring-1 focus:ring-purple-500 rounded px-2 py-1.5 outline-none text-slate-300 placeholder-slate-600"
                            />
                          ) : (
                            <span
                              className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: `${categoryColor.bg}20`,
                                color: categoryColor.text,
                                border: `1px solid ${categoryColor.border}40`,
                              }}
                            >
                              {item.categoria}
                            </span>
                          )}
                        </td>

                        {/* Progress Bar */}
                        <td className="px-3 py-2" style={{ width: "180px" }}>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500">Nível</span>
                              <span
                                className="font-bold"
                                style={{ color: getHealthColor(percentage) }}
                              >
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                            <div className="relative h-2 bg-black/40 rounded-full overflow-hidden border border-white/10">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: isMobile ? 0 : index * 0.05 }}
                                className="h-full rounded-full"
                                style={{
                                  background: `linear-gradient(90deg, ${getHealthColor(percentage)}, ${getHealthColor(percentage)}dd)`,
                                  boxShadow: `0 0 8px ${getHealthColor(percentage)}60`,
                                }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-2 text-center" style={{ width: "100px" }}>
                          <input
                            type="text"
                            value={String(item.quantidade_atual).replace(".", ",")}
                            onChange={(e) => handleCellChange(item.id, "quantidade_atual", e.target.value)}
                            onBlur={(e) => {
                              const clean = parseNum(e.target.value);
                              handleCellChange(item.id, "quantidade_atual", clean);
                            }}
                            disabled={!isAdmin()}
                            className={`w-20 bg-black/20 border border-white/10 focus:border-purple-500 rounded px-2 py-1.5 text-center outline-none ${
                              !isAdmin() ? "cursor-default" : ""
                            }`}
                          />
                        </td>

                        {/* Ideal */}
                        <td className="px-3 py-2 text-center" style={{ width: "100px" }}>
                          <input
                            type="text"
                            value={String(item.quantidade_ideal).replace(".", ",")}
                            onChange={(e) => handleCellChange(item.id, "quantidade_ideal", e.target.value)}
                            onBlur={(e) => {
                              const clean = parseNum(e.target.value);
                              handleCellChange(item.id, "quantidade_ideal", clean);
                            }}
                            disabled={!isAdmin()}
                            className={`w-20 bg-black/20 border border-white/10 focus:border-purple-500 rounded px-2 py-1.5 text-center outline-none opacity-80 ${
                              !isAdmin() ? "cursor-default" : ""
                            }`}
                          />
                        </td>

                        {/* Price */}
                        <td className="px-3 py-2 text-right" style={{ width: "120px" }}>
                          <div className="flex justify-end items-center gap-1">
                            <span className="text-slate-500 text-xs">R$</span>
                        <input
                          type="text"
                          value={String(item.preco_ultima_compra).replace(".", ",")}
                          onChange={(e) =>
                            handleCellChange(item.id, "preco_ultima_compra", e.target.value)
                          }
                          onBlur={(e) => {
                            // Ao sair do campo, garante formato numérico limpo
                            const clean = parseNum(e.target.value);
                            handleCellChange(item.id, "preco_ultima_compra", clean);
                          }}
                          disabled={!isAdmin()}
                          className={`w-24 bg-transparent border-0 focus:ring-1 focus:ring-purple-500 rounded px-2 py-1.5 text-right outline-none text-blue-300 ${
                            !isAdmin() ? "cursor-default" : ""
                          }`}
                        />
                          </div>
                        </td>

                        {/* Actions (Admin Only) */}
                        {isAdmin() && (
                          <td className="px-3 py-2 text-center" style={{ width: "80px" }}>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDeleteClick(item)}
                              className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/20 rounded transition-all"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>

            {/* Footer Summary */}
            {items.length > 0 && (
              <tfoot className="bg-black/90 border-t-2 border-purple-500/30 backdrop-blur-2xl">
                <tr className="font-bold border-b border-white/5">
                  <td colSpan={2} className="px-3 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                        <Zap size={16} className="text-cyan-400" />
                      </div>
                      <div>
                        <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-400 block">
                          Resumo
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center border-l border-white/5">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5">Itens</div>
                    <div className="text-base text-white font-mono">{totalItems}</div>
                  </td>
                  <td className="px-3 py-2 text-center border-l border-white/5">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5">Falta</div>
                    <div className="text-base text-red-400 font-mono">{itemsToBuy.length}</div>
                  </td>
                  <td colSpan={2} className="px-3 py-2 text-right border-l border-white/5 bg-white/5">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5">Estoque</div>
                    <div className="text-sm text-slate-300 font-mono">{formatCurrency(totalValue)}</div>
                  </td>
                  <td colSpan={isAdmin() ? 2 : 1} className="px-4 py-2 text-right border-l border-white/10 bg-emerald-500/10">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-emerald-400 mb-0.5">Reposição</div>
                    <div className="text-xl text-emerald-400 font-mono tracking-tighter">
                      {formatCurrency(totalCostEstimate)}
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </motion.div>
    </div>
  );
}
