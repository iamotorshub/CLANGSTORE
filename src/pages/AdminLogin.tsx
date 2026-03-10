import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, AlertCircle, Sparkles } from "lucide-react";
import { useAdmin } from "@/context/AdminAuthContext";
import Footer from "@/components/Footer";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/studio-ai");
    } else {
      setError("Credenciales inválidas. Contactá al administrador.");
    }
  };

  return (
    <main className="pt-28 min-h-screen">
      <div className="container mx-auto px-4 max-w-md py-20">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="w-16 h-16 border border-primary/30 flex items-center justify-center mx-auto mb-6">
            <Lock size={24} className="text-primary" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={14} className="text-primary" />
            <span className="font-body text-[10px] tracking-[0.35em] uppercase text-primary">Acceso Restringido</span>
          </div>
          <h1 className="font-display text-3xl text-foreground mb-3">Panel Admin</h1>
          <p className="font-body text-sm text-muted-foreground">
            Esta sección es exclusiva para administradores de CLANG Store.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 border border-destructive/30 bg-destructive/5 flex items-center gap-2">
              <AlertCircle size={14} className="text-destructive" />
              <p className="font-body text-xs text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@clang.store"
              className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-card border border-border px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 font-body text-sm tracking-widest uppercase text-primary-foreground glow-gold"
            style={{ background: "linear-gradient(135deg, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)))" }}
          >
            Iniciar Sesión
          </button>
        </form>

        <p className="font-body text-[10px] text-muted-foreground text-center mt-8">
          Demo: admin@clang.store / clang2025
        </p>
      </div>
      <Footer />
    </main>
  );
}
