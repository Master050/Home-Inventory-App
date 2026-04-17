import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { Lock, User, LogIn, AlertCircle, Home, Sparkles } from "lucide-react";
import AstraBackground from "../components/AstraBackground";
import LoginSuccessAnimation from "../components/LoginSuccessAnimation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessAnim, setShowSuccessAnim] = useState(false);
  const [loginUsername, setLoginUsername] = useState(null);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [isManualLogin, setIsManualLogin] = useState(false);

  useEffect(() => {
    if (isAuthenticated && !showSuccessAnim && !isManualLogin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, showSuccessAnim, isManualLogin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setIsManualLogin(true); // Bloca a auto navegação do useEffect

    const result = await login(username, password);

    if (result.success) {
      setLoading(false);
      // Show success animation
      setLoginUsername(username);
      setShowSuccessAnim(true);
      
      // Navigate to dashboard after animation (5 seconds to fully enjoy it)
      setTimeout(() => {
        setShowSuccessAnim(false);
        navigate("/dashboard");
      }, 5000);
    } else {
      setError(result.message);
      setIsManualLogin(false); // Restaura em caso de erro
      // Shake animation on error
      const form = document.getElementById("login-form");
      form.classList.add("shake");
      setTimeout(() => form.classList.remove("shake"), 500);
      setLoading(false);
    }
  };

  const quickLogin = async (user, pass) => {
    // For ADMIN, only fill username and require manual password entry
    if (user === "ADMIN") {
      setUsername(user);
      setPassword(""); // Don't auto-fill password
      setError("");
      // Focus password field
      setTimeout(() => {
        document.getElementById("password-input")?.focus();
      }, 100);
      return;
    }

    // For Mãe and Pai, auto-login
    setUsername(user);
    setPassword(pass);
    setError("");
    setLoading(true);
    setIsManualLogin(true); // Bloca a auto navegação do useEffect

    const result = await login(user, pass);

    if (result.success) {
      setLoading(false);
      // Show success animation
      setLoginUsername(user);
      setShowSuccessAnim(true);
      
      // Navigate to dashboard after animation (5 seconds)
      setTimeout(() => {
        setShowSuccessAnim(false);
        navigate("/dashboard");
      }, 5000);
    } else {
      setError(result.message);
      setIsManualLogin(false); // Restaura em caso de erro
      setLoading(false);
    }
  };

  return (
    <>
      {/* Success Animation */}
      <AnimatePresence>
        {showSuccessAnim && (
          <LoginSuccessAnimation
            username={loginUsername}
            onComplete={() => {}} // No skip functionality
          />
        )}
      </AnimatePresence>

      <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
      <AstraBackground />

      {/* Floating particles for login page */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: i % 3 === 0 ? "#a855f7" : i % 3 === 1 ? "#22d3ee" : "#4fc3f7",
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 10px currentColor`
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 relative"
            style={{
              background: "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(34,211,238,0.1))",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow: "0 0 40px rgba(168,85,247,0.3)"
            }}
          >
            <div
              className="ring-rotate absolute"
              style={{
                inset: "-8px",
                borderRadius: "50%",
                border: "2px solid transparent",
                borderTopColor: "rgba(168,85,247,0.6)",
                borderRightColor: "rgba(34,211,238,0.4)"
              }}
            />
            <Home size={36} className="text-purple-400" style={{ filter: "drop-shadow(0 0 10px #a855f7)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-heading font-bold tracking-wider mb-2"
            style={{
              background: "linear-gradient(135deg, #fff 0%, #c0e8ff 30%, #a78bfa 60%, #22d3ee 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 0 20px rgba(168,85,247,0.5))"
            }}
          >
            HOME INVENTORY
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 font-mono text-sm flex items-center justify-center gap-2"
          >
            <Sparkles size={14} className="text-cyan-400" />
            Sistema de Gestão Inteligente
          </motion.p>
        </div>

        {/* Login Card */}
        <motion.div
          id="login-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card card-shine p-8 relative overflow-hidden"
        >
          <div className="scan-line" style={{ animationDuration: "6s" }} />

          <div className="relative z-10">
            <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2 text-white">
              <Lock size={20} className="text-purple-400" />
              Autenticação
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="text-xs font-heading uppercase tracking-widest block mb-2 text-slate-400">
                  Usuário
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite seu usuário"
                    className="w-full pl-12 pr-4 py-3 rounded-xl font-body text-sm text-white bg-black/30 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-xs font-heading uppercase tracking-widest block mb-2 text-slate-400">
                  Senha
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    id="password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full pl-12 pr-4 py-3 rounded-xl font-body text-sm text-white bg-black/30 border border-white/10 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all outline-none placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm"
                  >
                    <AlertCircle size={16} />
                    <span className="font-mono">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3 rounded-xl font-heading font-bold tracking-wider text-sm flex items-center justify-center gap-2 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                  border: "1px solid rgba(168,85,247,0.5)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.3)"
                }}
              >
                <div className="scan-line" style={{ animationDuration: "2s" }} />
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Autenticando...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Entrar no Sistema
                  </>
                )}
              </motion.button>
            </form>

            {/* Quick Access */}
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-xs text-slate-500 font-heading uppercase tracking-widest mb-3 text-center">
                Acesso Rápido
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "ADMIN", pass: "223344", color: "#a855f7", requirePassword: true },
                  { name: "Mãe", pass: "123456", color: "#22d3ee", requirePassword: false },
                  { name: "Pai", pass: "123456", color: "#4fc3f7", requirePassword: false }
                ].map((u) => (
                  <motion.button
                    key={u.name}
                    onClick={() => quickLogin(u.name, u.pass)}
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2 px-3 rounded-lg text-xs font-body font-medium transition-all relative overflow-hidden group"
                    style={{
                      background: `${u.color}15`,
                      border: `1px solid ${u.color}30`,
                      color: u.color
                    }}
                  >
                    {u.requirePassword && (
                      <div className="absolute top-1 right-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      </div>
                    )}
                    {u.name}
                  </motion.button>
                ))}
              </div>
              <p className="text-xs text-slate-600 font-mono text-center mt-3">
                {username === "ADMIN" ? "Digite a senha para continuar" : "Clique para login automático"}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 font-mono">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Online e Seguro
          </div>
        </motion.div>
      </motion.div>

      <style jsx="true">{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
    </>
  );
}
