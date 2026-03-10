import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [liked, setLiked] = useState(false);
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-4 img-hover-scale">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Hover overlay — slides up from bottom (desktop) / always visible on mobile */}
        <div className="absolute inset-x-0 bottom-0 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-500 ease-out">
          <div className="bg-gradient-to-t from-black/90 to-transparent pt-12 pb-3 px-4">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70 mb-2 hidden md:block">
              {product.name}
            </p>
            <button
              onClick={handleAdd}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.3em] uppercase py-2.5 md:py-3 hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              <ShoppingBag size={12} />
              Agregar
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="bg-primary text-primary-foreground font-body text-[9px] tracking-[0.25em] uppercase px-2 py-1">
              Nuevo
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="bg-background/80 backdrop-blur-sm text-foreground font-body text-[9px] tracking-[0.2em] uppercase px-2 py-1">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Gallery dots — bottom right, only when multiple images */}
        {product.images && product.images.length > 1 && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {product.images.map((_, idx) => (
              <span
                key={idx}
                className={`block rounded-full transition-all duration-200 ${
                  idx === 0 ? "w-1.5 h-1.5 bg-primary" : "w-1 h-1 bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* Wishlist — visible on hover (desktop) or always (mobile) */}
        <button
          onClick={handleLike}
          className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 text-white/70 hover:text-primary"
          aria-label="Guardar"
        >
          <Heart
            size={17}
            fill={liked ? "currentColor" : "none"}
            className={liked ? "text-primary" : ""}
          />
        </button>
      </div>

      {/* Product info */}
      <Link to={`/producto/${product.slug}`} className="block">
        <div className="space-y-1.5">
          <h3 className="font-body text-[11px] tracking-[0.2em] uppercase text-foreground/80 hover:text-foreground transition-colors leading-relaxed">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="font-body text-sm text-primary font-medium">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="font-body text-xs text-muted-foreground/50 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          {/* Size indicators */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="flex items-center gap-1 pt-0.5">
              {product.sizes.slice(0, 4).map((size) => (
                <span
                  key={size}
                  className="font-body text-[8px] tracking-wider text-muted-foreground/50 border border-border/40 px-1.5 py-0.5"
                >
                  {size}
                </span>
              ))}
              {product.sizes.length > 4 && (
                <span className="font-body text-[8px] text-muted-foreground/40">+{product.sizes.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
