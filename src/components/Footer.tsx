import { Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-display text-4xl tracking-[0.3em] text-foreground mb-1">CLANG</h3>
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary/60 mb-5">
              Moda con IA
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-6">
              Moda argentina con tecnología de última generación.
            </p>

            {/* Social links */}
            <div className="space-y-3">
              <a
                href="https://instagram.com/clang.store"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="w-7 h-7 border border-border group-hover:border-primary/40 flex items-center justify-center transition-colors">
                  <Instagram size={13} />
                </span>
                <span className="font-body text-[11px] tracking-[0.2em] uppercase">@clang.store</span>
              </a>

              <a
                href="https://wa.me/5492916452291"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 text-muted-foreground hover:text-primary transition-colors group"
              >
                <span className="w-7 h-7 border border-border group-hover:border-primary/40 flex items-center justify-center transition-colors">
                  <MessageCircle size={13} />
                </span>
                <span className="font-body text-[11px] tracking-[0.2em] uppercase">WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground mb-5">Shop</h4>
            <ul className="space-y-3">
              {["Novedades", "Vestidos", "Tops", "Sets", "Abrigos"].map((cat) => (
                <li key={cat}>
                  <Link
                    to="/productos"
                    className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiencia */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground mb-5">Nosotros</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/probador-virtual" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Probador Virtual
                </Link>
              </li>
              <li>
                <a href="/#sobre-nosotros" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li>
                <a href="/#envios" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Envíos
                </a>
              </li>
              <li>
                <a href="/#envios" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cambios y devoluciones
                </a>
              </li>
              <li>
                <a href="/#envios" className="font-body text-sm text-muted-foreground hover:text-primary transition-colors">
                  Medios de pago
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground mb-5">Contacto</h4>
            <div className="space-y-3">
              <a
                href="https://wa.me/5492916452291"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                +54 9 291 645-2291
              </a>
              <a
                href="https://instagram.com/clang.store"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors block"
              >
                @clang.store
              </a>

              {/* Payment badges */}
              <div className="pt-4">
                <p className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground/40 mb-3">
                  Medios de pago
                </p>
                <div className="flex flex-wrap gap-2">
                  {["Tarjeta", "Transferencia", "Efectivo"].map((method) => (
                    <span
                      key={method}
                      className="font-body text-[9px] tracking-[0.15em] uppercase border border-border text-muted-foreground/50 px-2 py-1"
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/40">
            CLANG &copy; 2025 — Todos los derechos reservados
          </p>

          {/* Center: Powered by IA MotorsHub */}
          <a
            href="https://iamotorshub.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 opacity-40 hover:opacity-100 transition-opacity duration-500"
            aria-label="Powered by IA MotorsHub"
          >
            <span className="font-body text-[9px] tracking-[0.25em] uppercase text-muted-foreground/60 group-hover:text-primary/60 transition-colors duration-300">
              Powered by
            </span>
            <img
              src="/logo-iamotorshub.png"
              alt="IA MotorsHub"
              className="h-4 w-auto object-contain brightness-0 invert group-hover:brightness-100 group-hover:invert-0 transition-all duration-500"
            />
          </a>

          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/30">
            Diseñado en Argentina &middot; Potenciado por Gemini AI
          </p>
        </div>
      </div>
    </footer>
  );
}
