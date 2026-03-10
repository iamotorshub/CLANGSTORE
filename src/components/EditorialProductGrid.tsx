import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface EditorialProductGridProps {
  products: Product[];
  title?: string;
  label?: string;
}

export default function EditorialProductGrid({
  products,
  title = "Destacados",
  label = "Selección",
}: EditorialProductGridProps) {
  const { addItem } = useCart();

  if (!products.length) return null;

  // First 3 form the hero row, rest go in the standard grid
  const [featured, second, third, ...rest] = products;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2">{label}</p>
            <h2 className="font-display text-3xl lg:text-4xl text-foreground">{title}</h2>
          </div>
          <Link
            to="/productos"
            className="font-body text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/20 hover:border-primary pb-0.5"
          >
            Ver todo →
          </Link>
        </motion.div>

        {/* Hero row: featured (3/5 width) + 2 stacked (2/5) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 mb-5">
          {featured && (
            <EditorialCard
              product={featured}
              index={0}
              isLarge
              className="lg:col-span-3"
              onAdd={() => addItem(featured)}
            />
          )}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
            {second && <EditorialCard product={second} index={1} onAdd={() => addItem(second)} />}
            {third && <EditorialCard product={third} index={2} onAdd={() => addItem(third)} />}
          </div>
        </div>

        {/* Remaining products — 3-col grid with editorial numbers */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {rest.map((product, i) => (
              <EditorialCard
                key={product.id}
                product={product}
                index={i + 3}
                editorialNumber={String(i + 4).padStart(2, "0")}
                onAdd={() => addItem(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Internal card component ───────────────────────────────────────────────

interface EditorialCardProps {
  product: Product;
  index: number;
  isLarge?: boolean;
  className?: string;
  editorialNumber?: string;
  onAdd: () => void;
}

function EditorialCard({
  product,
  index,
  isLarge,
  className = "",
  editorialNumber,
  onAdd,
}: EditorialCardProps) {
  const aspectClass = isLarge ? "aspect-[3/4] lg:aspect-[4/5]" : "aspect-[3/4]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative ${className}`}
    >
      <Link to={`/producto/${product.slug}`} className="block">
        {/* Image container */}
        <div className={`relative ${aspectClass} overflow-hidden bg-secondary`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Bottom gradient — always visible */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

          {/* Always-visible product info */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70 mb-1 truncate">
              {product.name}
            </p>
            <p className="font-body text-sm text-primary font-medium">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Editorial number — top right */}
          {editorialNumber && (
            <p className="absolute top-3 right-3 font-display italic text-2xl text-white/15 leading-none select-none pointer-events-none">
              {editorialNumber}
            </p>
          )}

          {/* New badge */}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-[9px] tracking-[0.25em] uppercase px-2 py-1">
              Nuevo
            </span>
          )}

          {/* Discount badge (only if no isNew badge) */}
          {!product.isNew && product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground font-body text-[9px] tracking-[0.2em] uppercase px-2 py-1">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>
      </Link>

      {/* Add to cart — sibling of Link, slides up from bottom on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
        <button
          onClick={onAdd}
          aria-label={`Agregar ${product.name} al carrito`}
          className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.3em] uppercase py-3 hover:bg-primary/90 transition-colors"
        >
          <ShoppingBag size={12} />
          Agregar
        </button>
      </div>
    </motion.div>
  );
}
