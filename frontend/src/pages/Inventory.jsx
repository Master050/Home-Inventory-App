import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Loader2, Save, ShoppingCart, RefreshCw, Lock, 
  TrendingUp, TrendingDown, Package, AlertTriangle, CheckCircle2,
  Activity, Zap, AlertCircle, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "../components/ConfirmDialog";

// Category color mapping
const CATEGORY_COLORS = {
  "Carnes": { bg: "#ef4444", text: "#fee2e2", border: "#f87171" },
  "Alimentos": { bg: "#10b981", text: "#d1fae5", border: "#34d399" },
  "Proteínas": { bg: "#3b82f6", text: "#dbeafe", border: "#60a5fa" },
  "Bebidas": { bg: "#22d3ee", text: "#cffafe", border: "#67e8f9" },
  "Limpeza": { bg: "#a855f7", text: "#f3e8ff", border: "#c084fc" },
  "Higiene": { bg: "#ec4899", text: "#fce7f3", border: "#f472b6" },
  "Geral": { bg: "#6366f1", text: "#e0e7ff", border: "#818cf8" },
  "Utensílios": { bg: "#f59e0b", text: "#fef3c7", border: "#fbbf24" },
  "Cozinha": { bg: "#71717a", text: "#f4f4f5", border: "#a1a1aa" },
};

const UNITS = ["un", "kg", "g", "L", "ml", "cx", "pct"];
const IMPORTANCE_LEVELS = ["Desejável", "Crítico"];

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanningRow, setScanningRow] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const scrollRef = useRef(null);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const now_iso = () => new Date().toISOString();

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
      const { 
        id, nome, categoria, quantidade_atual, quantidade_ideal, 
        preco_ultima_compra, unidade, importancia, 
        proteina, gordura, carboidrato, local_armazenamento 
      } = item;
      
      const { error } = await supabase
        .from("inventario_casa")
        .update({ 
          nome, categoria, quantidade_atual, quantidade_ideal, 
          preco_ultima_compra, unidade, importancia,
          local_armazenamento,
          ultimo_visto: now_iso()
        })
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
      unidade: "un",
      importancia: "Desejável",
      local_armazenamento: "A definir",
      criado_em: now_iso(),
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
    <div className="max-w-[98%] mx-auto w-full px-2 sm:px-4 py-8 space-y-8">
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
        <div className="w-full overflow-x-auto scrollbar-hide" ref={scrollRef}>
          <table className="w-full text-sm text-left table-fixed">
            <colgroup>
              <col style={{ width: "50px" }} />
              <col style={{ width: "auto" }} />
              <col style={{ width: "160px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "90px" }} />
              <col style={{ width: "220px" }} />
              <col style={{ width: "120px" }} />
              {isAdmin() && <col style={{ width: "120px" }} />}
            </colgroup>
            <thead className="bg-black/60 text-[10px] font-mono uppercase text-slate-400 border-b border-white/10">
              <tr>
                <th className="px-3 py-4 text-center">
                  <Activity size={14} className="mx-auto" />
                </th>
                <th className="px-3 py-4">Produto</th>
                <th className="px-3 py-4 text-center">Categoria</th>
                <th className="px-3 py-4 text-center">Un.</th>
                <th className="px-3 py-4 text-center">Atual</th>
                <th className="px-3 py-4 text-center">Ideal</th>
                <th className="px-3 py-4 text-center">Status/Local</th>
                <th className="px-3 py-4 text-right">Preço Un.</th>
                {isAdmin() && <th className="px-3 py-4 text-center">Ações</th>}
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
                        <td className="px-3 py-3">
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
                        <td className="px-3 py-2">
                          <input
                            value={item.nome || ""}
                            onChange={(e) => handleCellChange(item.id, "nome", e.target.value)}
                            disabled={!isAdmin()}
                            className={`w-full bg-transparent border-0 focus:ring-1 focus:ring-purple-500 rounded px-2 py-1.5 outline-none text-white placeholder-slate-600 break-words whitespace-normal ${
                              !isAdmin() ? "cursor-default" : ""
                            }`}
                          />
                        </td>

                        {/* Category Badge */}
                        <td className="px-3 py-2">
                          <div className="relative group/sel">
                            <select
                              value={item.categoria || "Geral"}
                              onChange={(e) => handleCellChange(item.id, "categoria", e.target.value)}
                              disabled={!isAdmin()}
                              className="w-full bg-black/20 border border-white/5 hover:border-white/20 focus:ring-1 focus:ring-purple-500 rounded-lg px-3 pr-10 py-1.5 outline-none text-slate-300 appearance-none transition-all cursor-pointer text-xs"
                            >
                              {Object.keys(CATEGORY_COLORS).map(cat => (
                                <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                              ))}
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover/sel:text-purple-400 transition-colors">
                              <ChevronDown size={14} />
                            </div>
                          </div>
                        </td>

                        {/* Unit Selector */}
                        <td className="px-3 py-2">
                          <div className="relative group/sel">
                            <select
                              value={item.unidade || "un"}
                              onChange={(e) => handleCellChange(item.id, "unidade", e.target.value)}
                              disabled={!isAdmin()}
                              className="w-full bg-black/20 border border-white/5 rounded-lg px-2 pr-6 py-1 outline-none text-slate-400 text-[10px] appearance-none text-center"
                            >
                              {UNITS.map(u => (
                                <option key={u} value={u} className="bg-slate-900">{u}</option>
                              ))}
                            </select>
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
                              <ChevronDown size={10} />
                            </div>
                          </div>
                        </td>

                        {/* Atual */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="text"
                            value={String(item.quantidade_atual).replace(".", ",")}
                            onChange={(e) => handleCellChange(item.id, "quantidade_atual", e.target.value)}
                            onBlur={(e) => handleCellChange(item.id, "quantidade_atual", parseNum(e.target.value))}
                            disabled={!isAdmin()}
                            className="w-full max-w-[60px] bg-black/40 border border-white/10 focus:border-purple-500 rounded px-2 py-1 text-center outline-none font-mono"
                          />
                        </td>

                        {/* Ideal */}
                        <td className="px-3 py-2 text-center">
                          <input
                            type="text"
                            value={String(item.quantidade_ideal).replace(".", ",")}
                            onChange={(e) => handleCellChange(item.id, "quantidade_ideal", e.target.value)}
                            onBlur={(e) => handleCellChange(item.id, "quantidade_ideal", parseNum(e.target.value))}
                            disabled={!isAdmin()}
                            className="w-full max-w-[60px] bg-black/20 border border-white/5 focus:border-purple-500 rounded px-2 py-1 text-center outline-none font-mono text-slate-500"
                          />
                        </td>

                        {/* Status/Local */}
                        <td className="px-3 py-2">
                          <div className="flex flex-col gap-1">
                            <div className="relative group/sel">
                              <select
                                value={item.importancia || "Desejável"}
                                onChange={(e) => handleCellChange(item.id, "importancia", e.target.value)}
                                disabled={!isAdmin()}
                                className={`w-full text-[9px] uppercase font-bold px-2 pr-8 py-1 rounded-md border appearance-none transition-all cursor-pointer ${
                                  item.importancia === 'Crítico' 
                                  ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                                  : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                } bg-transparent outline-none`}
                              >
                                {IMPORTANCE_LEVELS.map(lvl => (
                                  <option key={lvl} value={lvl} className="bg-slate-900">{lvl}</option>
                                ))}
                              </select>
                              <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                                <ChevronDown size={10} />
                              </div>
                            </div>
                            <input
                              placeholder="Local..."
                              value={item.local_armazenamento || ""}
                              onChange={(e) => handleCellChange(item.id, "local_armazenamento", e.target.value)}
                              disabled={!isAdmin()}
                              className="bg-transparent border-0 text-[10px] text-slate-500 outline-none hover:text-slate-300 w-full truncate px-1 text-center"
                            />
                          </div>
                        </td>

                        {/* Price */}
                        <td className="px-3 py-2 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-[9px] text-slate-600">R$</span>
                            <input
                              type="text"
                              value={String(item.preco_ultima_compra).replace(".", ",")}
                              onChange={(e) => handleCellChange(item.id, "preco_ultima_compra", e.target.value)}
                              onBlur={(e) => handleCellChange(item.id, "preco_ultima_compra", parseNum(e.target.value))}
                              disabled={!isAdmin()}
                              className="bg-transparent border-0 text-right outline-none text-blue-300 w-16 px-1 font-mono"
                            />
                          </div>
                        </td>



                        {/* Actions (Admin Only) */}
                        {isAdmin() && (
                          <td className="px-3 py-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteClick(item)}
                                className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/20 rounded transition-all"
                                title="Excluir Item"
                              >
                                <Trash2 size={16} />
                              </motion.button>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => navigate("/waste-log", { state: { prefill: item } })}
                                className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-400/20 rounded transition-all"
                                title="Registrar Desperdício"
                              >
                                <AlertCircle size={16} />
                              </motion.button>
                            </div>
                          </td>
                        )}
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              )}
            </tbody>

            {items.length > 0 && (
              <tfoot className="bg-black/90 border-t-2 border-purple-500/30 backdrop-blur-2xl">
                <tr className="font-bold border-b border-white/5">
                  <td className="px-3 py-4 text-center">
                    <Zap size={16} className="text-cyan-400 mx-auto" />
                  </td>
                  <td className="px-3 py-2 border-l border-white/5">
                    <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-slate-400 block mb-0.5 whitespace-nowrap">
                      Resumo Sincronizado
                    </span>
                    <div className="text-sm text-slate-500 font-mono italic">Cloud-Active</div>
                  </td>
                  <td className="px-3 py-2 border-l border-white/5 text-center">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5">Total</div>
                    <div className="text-base text-white font-mono">{totalItems}</div>
                  </td>
                  <td className="px-3 py-2 border-l border-white/5 text-center">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5">Falta</div>
                    <div className="text-base text-red-400 font-mono">{itemsToBuy.length}</div>
                  </td>
                  <td colSpan={2} className="px-3 py-2 text-center border-l border-white/5 bg-white/5">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-600 mb-0.5">Métrica</div>
                    <div className="text-sm text-slate-600 font-mono">FIXED</div>
                  </td>
                  <td className="px-3 py-2 border-l border-white/5 text-right">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-slate-500 mb-0.5 italic">Stock Value</div>
                    <div className="text-sm text-blue-300 font-mono">{formatCurrency(totalValue)}</div>
                  </td>
                  <td colSpan={2} className="px-4 py-3 text-right border-l border-white/10 bg-emerald-500/10">
                    <div className="text-[9px] font-heading uppercase tracking-widest text-emerald-400 mb-1 font-bold">Custo Est. Reposição</div>
                    <div className="text-xl text-emerald-400 font-mono tracking-tighter leading-none pulse-subtle">
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
