import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import { categories } from "@/data/products";
import { useProducts } from "@/hooks/useProducts";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState("Todos");
  const { data: products = [] } = useProducts();

  const filtered = activeCategory === "Todos"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <main className="pt-28 min-h-screen">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-14 pt-8"
        >
          <div className="flex items-end justify-between">
            <div>
              <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-2">Catálogo</p>
              <h1 className="font-display text-4xl lg:text-6xl text-foreground">Shop</h1>
            </div>
            <p className="font-body text-sm text-muted-foreground/50 hidden lg:block">
              {filtered.length} {filtered.length === 1 ? "prenda" : "prendas"}
            </p>
          </div>
        </motion.div>

        {/* Filter bar */}
        <div className="flex items-center gap-0 mb-12 border-b border-border/40 overflow-x-auto pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative flex-shrink-0 font-body text-[10px] tracking-[0.25em] uppercase px-5 py-4 transition-colors duration-200 ${
                activeCategory === cat
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
              {activeCategory === cat && (
                <motion.div
                  layoutId="filter-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-primary"
                />
              )}
            </button>
          ))}
          <div className="flex-1" />
          <span className="font-body text-[10px] text-muted-foreground/40 pr-4 flex-shrink-0 hidden lg:block">
            {filtered.length} items
          </span>
        </div>

        {/* Editorial Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 mb-24"
          >
            {filtered.map((product, i) => {
              // Every 7th item (0, 7, 14...) gets featured large treatment on desktop
              const isFeaturedSlot = i % 7 === 0 && filtered.length > 3;
              return (
                <div
                  key={product.id}
                  className={isFeaturedSlot ? "col-span-2 row-span-2" : "col-span-1"}
                >
                  <div className={isFeaturedSlot ? "h-full" : ""}>
                    <ProductCard product={product} index={i} />
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <Footer />
    </main>
  );
}
