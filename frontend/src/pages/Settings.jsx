import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Eye,
  Database,
  Download,
  Upload,
  Trash2,
  Sun,
  Moon,
  Bell,
  Palette,
  Globe,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

function SectionCard({ title, subtitle, icon: Icon, color, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-card card-shine relative overflow-hidden p-6 space-y-5"
    >
      <div className="scan-line" style={{ animationDuration: "9s" }} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: `linear-gradient(90deg, transparent, ${color}60, transparent)`,
        }}
      />
      <div
        className="flex items-center gap-3 pb-4 relative z-10"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div
          className="p-2.5 rounded-xl"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}
        >
          <Icon size={18} style={{ color, filter: `drop-shadow(0 0 5px ${color})` }} strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-heading font-bold text-base uppercase tracking-widest text-white">{title}</h2>
          <p className="text-xs text-slate-600 font-mono">{subtitle}</p>
        </div>
      </div>
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

export default function Settings() {
  const { user } = useAuth();
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [language, setLanguage] = useState("pt-BR");
  const [autoBackup, setAutoBackup] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSavePreferences = () => {
    // Simulate save
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleExportData = () => {
    // Mock export functionality
    console.log("Exporting data...");
  };

  const handleImportData = () => {
    // Mock import functionality
    console.log("Importing data...");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass-card card-shine relative overflow-hidden"
        style={{ padding: "24px 32px" }}
      >
        <div className="scan-line" style={{ animationDuration: "7s" }} />
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-transparent border-t-purple-500 border-r-cyan-500 rounded-full"
                style={{ padding: "6px" }}
              />
              <div
                className="p-3 rounded-xl relative z-10"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.3)",
                }}
              >
                <SettingsIcon
                  size={24}
                  style={{ color: "#a855f7", filter: "drop-shadow(0 0 8px #a855f7)" }}
                  strokeWidth={1.5}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1
                  className="font-heading font-bold text-3xl tracking-widest"
                  style={{
                    background: "linear-gradient(135deg, #fff 0%, #c0e8ff 30%, #a78bfa 60%, #22d3ee 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  CONFIGURAÇÕES
                </h1>
                <Sparkles size={16} className="text-purple-400 animate-pulse" />
              </div>
              <p className="text-sm text-slate-400 font-mono">
                <span className="mr-2" style={{ color: "#a855f7" }}>▸</span>
                Personalize sua experiência no sistema
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* User Profile */}
      <SectionCard
        title="Perfil do Usuário"
        subtitle="informações da conta atual"
        icon={User}
        color="#22d3ee"
      >
        <div className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/10">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background:
                user?.role === "admin"
                  ? "linear-gradient(135deg, rgba(168,85,247,0.3), rgba(124,58,237,0.2))"
                  : "linear-gradient(135deg, rgba(34,211,238,0.3), rgba(79,195,247,0.2))",
              border: user?.role === "admin" ? "2px solid rgba(168,85,247,0.5)" : "2px solid rgba(34,211,238,0.5)",
            }}
          >
            {user?.role === "admin" ? (
              <Shield size={28} className="text-purple-400" />
            ) : (
              <Eye size={28} className="text-cyan-400" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-heading font-bold text-white mb-1">{user?.username}</h3>
            <p
              className="text-sm font-mono mb-2"
              style={{ color: user?.role === "admin" ? "#a855f7" : "#22d3ee" }}
            >
              {user?.role === "admin" ? "Administrador - Acesso Completo" : "Visualizador - Somente Leitura"}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
              <div
                className="w-2 h-2 rounded-full bg-emerald-500"
                style={{ boxShadow: "0 0 8px #10b981", animation: "status-pulse 2s ease-in-out infinite" }}
              />
              <span>Sessão ativa</span>
            </div>
          </div>
        </div>

        {user?.role === "admin" && (
          <div
            className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/30 text-sm text-slate-300 font-body"
          >
            <strong className="text-purple-400">Permissões:</strong> Adicionar, editar e deletar itens do inventário.
          </div>
        )}
      </SectionCard>

      {/* Preferences */}
      <SectionCard
        title="Preferências"
        subtitle="personalize a interface"
        icon={Palette}
        color="#a855f7"
      >
        <div className="space-y-4">
          {/* Theme Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-3">
              {theme === "dark" ? (
                <Moon size={18} className="text-purple-400" />
              ) : (
                <Sun size={18} className="text-amber-400" />
              )}
              <div>
                <p className="text-sm font-body font-medium text-white">Tema</p>
                <p className="text-xs text-slate-500 font-mono">Aparência da interface</p>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{
                background: theme === "dark" ? "rgba(168,85,247,0.3)" : "rgba(245,158,11,0.3)",
                border: theme === "dark" ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(245,158,11,0.5)",
              }}
            >
              <motion.div
                animate={{ x: theme === "dark" ? 0 : 28 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-3">
              <Bell size={18} className="text-cyan-400" />
              <div>
                <p className="text-sm font-body font-medium text-white">Notificações</p>
                <p className="text-xs text-slate-500 font-mono">Alertas de estoque baixo</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{
                background: notifications ? "rgba(16,185,129,0.3)" : "rgba(100,116,139,0.3)",
                border: notifications ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(100,116,139,0.5)",
              }}
            >
              <motion.div
                animate={{ x: notifications ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Language */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10">
            <div className="flex items-center gap-3">
              <Globe size={18} className="text-emerald-400" />
              <div>
                <p className="text-sm font-body font-medium text-white">Idioma</p>
                <p className="text-xs text-slate-500 font-mono">Português (Brasil)</p>
              </div>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-black/30 border border-white/10 text-white text-sm font-mono outline-none focus:border-emerald-500/50 cursor-pointer"
            >
              <option value="pt-BR">Português (BR)</option>
              <option value="en-US">English (US)</option>
              <option value="es-ES">Español</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <motion.button
          onClick={handleSavePreferences}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-3 rounded-xl font-heading font-bold tracking-wider text-sm flex items-center justify-center gap-2 relative overflow-hidden group"
          style={{
            background: "linear-gradient(135deg, #a855f7, #7c3aed)",
            border: "1px solid rgba(168,85,247,0.5)",
            boxShadow: "0 0 20px rgba(168,85,247,0.3)",
          }}
        >
          <div className="scan-line" style={{ animationDuration: "2s" }} />
          {saveSuccess ? (
            <>
              <CheckCircle2 size={16} />
              Salvo com Sucesso!
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Salvar Preferências
            </>
          )}
        </motion.button>
      </SectionCard>

      {/* Data Management */}
      <SectionCard
        title="Gerenciamento de Dados"
        subtitle="backup e restauração"
        icon={Database}
        color="#4fc3f7"
      >
        <div className="space-y-3">
          {/* Auto Backup */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-black/20 border border-white/10">
            <div>
              <p className="text-sm font-body font-medium text-white mb-1">Backup Automático</p>
              <p className="text-xs text-slate-500 font-mono">Sincronização com Supabase</p>
            </div>
            <button
              onClick={() => setAutoBackup(!autoBackup)}
              className="relative w-14 h-7 rounded-full transition-all"
              style={{
                background: autoBackup ? "rgba(34,211,238,0.3)" : "rgba(100,116,139,0.3)",
                border: autoBackup ? "1px solid rgba(34,211,238,0.5)" : "1px solid rgba(100,116,139,0.5)",
              }}
            >
              <motion.div
                animate={{ x: autoBackup ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="absolute top-0.5 left-0.5 w-6 h-6 rounded-full bg-white shadow-lg"
              />
            </button>
          </div>

          {/* Export */}
          <motion.button
            onClick={handleExportData}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-4 rounded-xl bg-black/20 border border-white/10 hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:bg-cyan-500/20 transition-all">
                <Download size={18} className="text-cyan-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-medium text-white">Exportar Dados</p>
                <p className="text-xs text-slate-500 font-mono">Download em formato JSON</p>
              </div>
            </div>
          </motion.button>

          {/* Import */}
          <motion.button
            onClick={handleImportData}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full p-4 rounded-xl bg-black/20 border border-white/10 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 group-hover:bg-purple-500/20 transition-all">
                <Upload size={18} className="text-purple-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-body font-medium text-white">Importar Dados</p>
                <p className="text-xs text-slate-500 font-mono">Restaurar de arquivo JSON</p>
              </div>
            </div>
          </motion.button>

          {/* Danger Zone - Admin Only */}
          {user?.role === "admin" && (
            <div className="pt-4 border-t border-white/5">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full p-4 rounded-xl bg-red-500/5 border border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30 group-hover:bg-red-500/20 transition-all">
                    <Trash2 size={18} className="text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-body font-medium text-red-400">Limpar Todos os Dados</p>
                    <p className="text-xs text-slate-500 font-mono">Ação permanente - use com cuidado</p>
                  </div>
                </div>
              </motion.button>
            </div>
          )}
        </div>
      </SectionCard>

      {/* System Info */}
      <SectionCard
        title="Informações do Sistema"
        subtitle="versão e detalhes técnicos"
        icon={Sparkles}
        color="#10b981"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: "Versão", value: "2.0.0", color: "#a855f7" },
            { label: "Backend", value: "FastAPI + MongoDB", color: "#22d3ee" },
            { label: "Frontend", value: "React 19 + Tailwind", color: "#10b981" },
          ].map((info, i) => (
            <motion.div
              key={info.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="p-4 rounded-xl relative overflow-hidden group"
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                transition: "border-color 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${info.color}30`;
                e.currentTarget.style.boxShadow = `0 0 20px -5px ${info.color}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "-10px",
                  right: "-10px",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${info.color}15 0%, transparent 70%)`,
                  filter: "blur(8px)",
                }}
              />
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: info.color, boxShadow: `0 0 4px ${info.color}` }}
                />
                <p className="text-xs text-slate-500 font-heading uppercase tracking-widest">{info.label}</p>
              </div>
              <p className="text-sm font-mono text-slate-300">{info.value}</p>
            </motion.div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
