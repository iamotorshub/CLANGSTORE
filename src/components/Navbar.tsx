import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, Sparkles, Lock, LogOut, Camera, Sun, Moon, Home, Store, Users, Truck, Package } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAdmin } from "@/context/AdminAuthContext";
import { useTheme } from "@/context/ThemeContext";
import { LucideIcon } from "lucide-react";

interface NavLink {
  to: string;
  label: string;
  badge?: string;
  icon?: LucideIcon;
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, setIsOpen } = useCart();
  const { isAdmin, logout } = useAdmin();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Links visibles en desktop (siempre los mismos 5)
  const navLinks: NavLink[] = [
    { to: "/", label: "Inicio", icon: Home },
    { to: "/productos", label: "Shop", icon: Store },
    { to: "/probador-virtual", label: "Probador Virtual", badge: "IA", icon: Camera },
    { to: "/#sobre-nosotros", label: "Nosotros", icon: Users },
    { to: "/#envios", label: "Envíos", icon: Truck },
  ];

  // Links extra de admin (solo en menú mobile)
  const adminLinks: NavLink[] = isAdmin
    ? [
        { to: "/studio-ai", label: "AI Studio", badge: "Admin", icon: Sparkles },
        { to: "/admin/productos", label: "Productos", badge: "Admin", icon: Package },
      ]
    : [];

  const allMobileLinks = [...navLinks, ...adminLinks];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Promo banner — solo visible al hacer scroll */}
      <AnimatePresence>
        {scrolled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-background/95 border-b border-primary/15 overflow-hidden"
          >
            <div className="animate-marquee-promo whitespace-nowrap py-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <span key={i} className="mx-12 font-body text-[10px] tracking-[0.4em] uppercase text-white/60 inline-flex items-center gap-5">
                  <span className="text-primary font-semibold tracking-[0.35em]">3 CUOTAS SIN INTERÉS</span>
                  <span className="text-primary/40">·</span>
                  <span className="text-primary font-semibold tracking-[0.35em]">20% OFF EFECTIVO</span>
                  <span className="text-primary/40">·</span>
                  <span className="tracking-[0.35em]">10% OFF TRANSFERENCIA</span>
                  <span className="text-primary/40">·</span>
                  <span className="tracking-[0.35em]">ENVÍO GRATIS</span>
                  <span className="text-primary/40">·</span>
                  <span className="tracking-[0.35em]">CAMBIOS GRATIS</span>
                  <span className="text-primary/40">·</span>
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main nav — transparente en top, fondo al scrollear */}
      <nav
        className={`transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-2xl border-b border-border/40"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto relative flex items-center justify-between h-[68px] px-4 lg:px-8">
          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`lg:hidden hover:text-primary transition-colors w-8 ${scrolled ? "text-foreground" : "text-white"}`}
            aria-label="Menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = !link.to.includes("#") && location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`relative group font-body text-[11px] tracking-[0.22em] uppercase transition-colors duration-300 flex items-center gap-1.5 ${
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {Icon && <Icon size={12} className="text-primary/70" />}
                  {link.label}
                  {link.badge && (
                    <span className="text-[8px] px-1.5 py-0.5 bg-primary/12 text-primary tracking-wider border border-primary/20">
                      {link.badge}
                    </span>
                  )}
                  {/* Animated underline */}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-primary transition-all duration-300 ${
                      isActive ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          {/* Logo center */}
          <Link to="/" className="absolute left-[58%] -translate-x-1/2 lg:left-[60%]">
            <motion.h1
              whileHover={{ letterSpacing: "0.6em" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`font-display text-2xl lg:text-3xl tracking-[0.45em] font-semibold transition-colors duration-300 ${
                scrolled ? "text-foreground drop-shadow-none" : "text-white drop-shadow-[0_1px_8px_rgba(0,0,0,0.6)]"
              }`}
            >
              CLANG
            </motion.h1>
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-4">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="text-foreground/60 hover:text-primary transition-colors"
              title={theme === "dark" ? "Modo claro" : "Modo oscuro"}
              aria-label="Cambiar tema"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="sun"
                    initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Sun size={15} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                    animate={{ rotate: 0, opacity: 1, scale: 1 }}
                    exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Moon size={15} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>

            {isAdmin ? (
              <button
                onClick={logout}
                className="text-white/70 hover:text-primary transition-colors"
                title="Cerrar sesión admin"
              >
                <LogOut size={16} />
              </button>
            ) : (
              <Link
                to="/admin-login"
                className="text-white/40 hover:text-primary transition-colors hidden lg:block"
                title="Admin"
              >
                <Lock size={14} />
              </Link>
            )}
            <button
              onClick={() => setIsOpen(true)}
              className={`relative hover:text-primary transition-colors ${scrolled ? "text-foreground drop-shadow-none" : "text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)]"}`}
              aria-label="Carrito"
            >
              <ShoppingBag size={19} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[9px] font-bold flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-background/98 backdrop-blur-xl border-b border-border overflow-hidden"
          >
            <div className="container py-6 px-6">
              {/* Main nav links */}
              <div className="flex flex-col gap-0 mb-6">
                {allMobileLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = !link.to.includes("#") && location.pathname === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ delay: index * 0.05, duration: 0.25 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 py-3.5 border-b border-border/30 font-body text-sm tracking-[0.15em] uppercase transition-colors ${
                          isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
                        }`}
                      >
                        {Icon && (
                          <span className={`w-7 h-7 border flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? "border-primary/40 text-primary" : "border-border text-muted-foreground"}`}>
                            <Icon size={12} />
                          </span>
                        )}
                        {link.label}
                        {link.badge && (
                          <span className="ml-auto text-[8px] px-1.5 py-0.5 bg-primary/12 text-primary border border-primary/20 tracking-wider">
                            {link.badge}
                          </span>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Categorías rápidas */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.05 + 0.1 }}
              >
                <p className="font-body text-[9px] tracking-[0.35em] uppercase text-muted-foreground/40 mb-3">
                  Categorías
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {["Vestidos", "Tops", "Camisas", "Jeans", "Abrigos", "Sets"].map((cat, i) => (
                    <motion.div
                      key={cat}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: allMobileLinks.length * 0.05 + 0.15 + i * 0.04 }}
                    >
                      <Link
                        to={`/productos?categoria=${cat.toLowerCase()}`}
                        onClick={() => setMobileOpen(false)}
                        className="block border border-border/50 hover:border-primary/40 hover:text-primary text-muted-foreground/60 text-center font-body text-[10px] tracking-[0.2em] uppercase py-2.5 px-2 transition-all duration-200"
                      >
                        {cat}
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom: admin / logout */}
              <div className="mt-6 pt-4 border-t border-border/30">
                {!isAdmin ? (
                  <Link
                    to="/admin-login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors"
                  >
                    <Lock size={11} /> Admin
                  </Link>
                ) : (
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="flex items-center gap-2 font-body text-xs tracking-[0.2em] uppercase text-muted-foreground/50 hover:text-primary transition-colors"
                  >
                    <LogOut size={11} /> Cerrar Sesión
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
