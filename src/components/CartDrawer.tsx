import { X, Minus, Plus, ShoppingBag, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, totalPrice, totalItems } = useCart();

  const handleWhatsApp = () => {
    const lines = items.map((item) => {
      const size = item.size ? ` — Talle: ${item.size}` : "";
      const color = item.color ? ` — Color: ${item.color}` : "";
      return `• ${item.product.name}${size}${color} x${item.quantity} (${formatPrice(item.product.price * item.quantity)})`;
    });
    const message = [
      "Hola! Quiero hacer el siguiente pedido:",
      "",
      ...lines,
      "",
      `*Total: ${formatPrice(totalPrice)}*`,
    ].join("\n");
    const url = `https://wa.me/5492916452291?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-card border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} className="text-primary" />
                <h2 className="font-display text-base tracking-[0.25em] uppercase text-foreground">
                  Carrito
                </h2>
                {totalItems > 0 && (
                  <span className="bg-primary text-primary-foreground font-body text-[10px] tracking-wider w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors border border-transparent hover:border-border"
              >
                <X size={16} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <ShoppingBag size={40} className="text-muted-foreground/20" />
                  <div>
                    <p className="font-display text-sm text-muted-foreground/50 italic mb-1">
                      Tu carrito está vacío
                    </p>
                    <p className="font-body text-[10px] tracking-[0.25em] uppercase text-muted-foreground/30">
                      Explorá nuestra colección
                    </p>
                  </div>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-3 pb-6 border-b border-border last:border-0 last:pb-0">
                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-secondary overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-body text-[11px] tracking-[0.15em] uppercase text-foreground truncate mb-1">
                        {item.product.name}
                      </h3>
                      {item.size && (
                        <p className="font-body text-[10px] text-muted-foreground/60">Talle: {item.size}</p>
                      )}
                      {item.color && (
                        <p className="font-body text-[10px] text-muted-foreground/60">Color: {item.color}</p>
                      )}
                      <p className="font-body text-sm text-primary mt-1.5">{formatPrice(item.product.price)}</p>

                      {/* Qty controls */}
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="font-body text-sm text-foreground w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-7 h-7 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-muted-foreground/40 hover:text-muted-foreground transition-colors self-start mt-0.5 p-1"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4 bg-card">
                {/* Subtotal */}
                <div className="flex justify-between items-baseline">
                  <span className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
                    Subtotal
                  </span>
                  <span className="font-display text-xl text-foreground">{formatPrice(totalPrice)}</span>
                </div>

                <p className="font-body text-[9px] tracking-[0.2em] uppercase text-muted-foreground/40">
                  Envío calculado al finalizar
                </p>

                {/* MercadoPago CTA */}
                <button
                  onClick={() => window.open("https://www.mercadopago.com.ar", "_blank")}
                  className="w-full flex items-center justify-center gap-3 py-4 font-body text-[11px] tracking-[0.3em] uppercase text-white transition-all duration-300 hover:scale-[1.01] hover:brightness-110"
                  style={{ background: "#009EE3" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/>
                  </svg>
                  Pagar con MercadoPago
                </button>

                {/* WhatsApp CTA */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-3 py-4 font-body text-[11px] tracking-[0.3em] uppercase text-primary-foreground glow-gold transition-all duration-300 hover:scale-[1.01]"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)))" }}
                >
                  <MessageCircle size={14} />
                  Consultar por WhatsApp
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
