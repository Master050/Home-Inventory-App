import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../config/supabaseClient";
import { useLocation } from "react-router-dom";
import { Trash2, Plus, Calendar, AlertCircle, TrendingDown, Save } from "lucide-react";

export default function WasteLog() {
  const location = useLocation();
  const [logs, setLogs] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ 
    item_id: location.state?.prefill?.id || "", 
    quantidade: 0, 
    motivo: "Vencido" 
  });

  useEffect(() => {
    if (location.state?.prefill) setShowAdd(true);
    fetchData();
  }, [location.state]);

  const fetchData = async () => {
    const { data: logData } = await supabase.from("waste_log").select("*").order("data", { ascending: false });
    const { data: itemData } = await supabase.from("inventario_casa").select("id, nome");
    
    if (logData) setLogs(logData);
    if (itemData) setItems(itemData);
    setLoading(false);
  };

  const handleAddWaste = async () => {
    if (!newEntry.item_id || newEntry.quantidade <= 0) return;
    
    const item = items.find(i => i.id === newEntry.item_id);
    const entry = {
      ...newEntry,
      item_nome: item.nome,
      data: new Date().toISOString()
    };

    const { error } = await supabase.from("waste_log").insert([entry]);
    if (!error) {
      setShowAdd(false);
      setNewEntry({ item_id: "", quantidade: 0, motivo: "Vencido" });
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-heading font-bold text-white flex items-center gap-2">
            <Trash2 className="text-rose-400" />
            REGISTRO DE DESPERDÍCIO
          </h1>
          <p className="text-slate-400 text-sm font-mono mt-1 uppercase tracking-tighter">
            Controle de perdas e eficiência do estoque
          </p>
        </div>
        
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-rose-500/20 border border-rose-500/40 text-rose-400 rounded-xl flex items-center gap-2 hover:bg-rose-500/30 transition-all font-mono text-sm uppercase"
        >
          <Plus size={16} />
          Registrar Perda
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-4 border-l-4 border-rose-500">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Total de Itens Perdidos</p>
          <h3 className="text-2xl font-bold text-white">{logs.reduce((acc, l) => acc + Number(l.quantidade), 0)}</h3>
        </div>
        <div className="glass-card p-4 border-l-4 border-amber-500">
          <p className="text-[10px] font-mono text-slate-500 uppercase">Motivo Principal</p>
          <h3 className="text-2xl font-bold text-white">Vencimento</h3>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Item</th>
              <th className="px-4 py-3">Qtd</th>
              <th className="px-4 py-3">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-3 text-xs text-slate-400">
                  {new Date(log.data).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-white">{log.item_nome}</td>
                <td className="px-4 py-3 text-sm text-rose-300 font-bold">-{log.quantidade}</td>
                <td className="px-4 py-3">
                  <span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400 uppercase">
                    {log.motivo}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowAdd(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card w-full max-w-md relative z-10 p-6"
            >
              <h2 className="text-xl font-bold text-white mb-6">Novo Registro</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-mono">Item</label>
                  <select
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-rose-500/50"
                    value={newEntry.item_id}
                    onChange={(e) => setNewEntry({...newEntry, item_id: e.target.value})}
                  >
                    <option value="">Selecione...</option>
                    {items.map(item => <option key={item.id} value={item.id}>{item.nome}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-mono">Quantidade</label>
                  <input
                    type="number"
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-rose-500/50"
                    value={newEntry.quantidade}
                    onChange={(e) => setNewEntry({...newEntry, quantidade: e.target.value})}
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1 uppercase font-mono">Motivo</label>
                  <select
                    className="w-full bg-slate-900 border border-white/10 rounded-lg p-2 text-white outline-none focus:border-rose-500/50"
                    value={newEntry.motivo}
                    onChange={(e) => setNewEntry({...newEntry, motivo: e.target.value})}
                  >
                    <option value="Vencido">Vencido</option>
                    <option value="Estragado">Estragado</option>
                    <option value="Derramado/Quebrado">Derramado/Quebrado</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={() => setShowAdd(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-white/5 text-slate-400 hover:bg-white/10 transition-all font-mono uppercase text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleAddWaste}
                    className="flex-1 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-500 transition-all font-mono uppercase text-xs"
                  >
                    Salvar
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
