import { motion } from "framer-motion";
import HeroCarousel from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import AIStudioTeaser from "@/components/AIStudioTeaser";
import EditorialProductGrid from "@/components/EditorialProductGrid";
import SobreNosotros from "@/components/SobreNosotros";
import Envios from "@/components/Envios";
import Footer from "@/components/Footer";
import { products, categories } from "@/data/products";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";

const Index = () => {
  const featured = products.filter((p) => p.isFeatured);
  const newest = products.filter((p) => p.isNew);

  // Section header component
  const SectionHeader = ({
    label,
    title,
    linkTo,
    linkLabel = "Ver todo",
  }: {
    label: string;
    title: string;
    linkTo?: string;
    linkLabel?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="flex items-end justify-between mb-12"
    >
      <div>
        <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2">{label}</p>
        <h2 className="font-display text-3xl lg:text-4xl text-foreground">{title}</h2>
      </div>
      {linkTo && (
        <Link
          to={linkTo}
          className="font-body text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/20 hover:border-primary pb-0.5"
        >
          {linkLabel} →
        </Link>
      )}
    </motion.div>
  );

  return (
    <main>
      {/* 1. Hero */}
      <HeroCarousel />

      {/* 2. Category Marquee Strip */}
      <div className="py-5 border-y border-border/50 overflow-hidden bg-card/50">
        <div className="flex animate-marquee-slow whitespace-nowrap">
          {[...categories, ...categories, ...categories].map((cat, i) => (
            <span key={i} className="mx-10 font-editorial italic text-2xl lg:text-3xl text-muted-foreground/60 select-none">
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Novedades */}
      {newest.length > 0 && (
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4 lg:px-8">
            <SectionHeader label="Lo último" title="Novedades" linkTo="/productos" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {newest.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Editorial Split Banner */}
      <section className="grid lg:grid-cols-2 min-h-[65vh] border-y border-border/40">
        {/* Text side */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="bg-card flex flex-col justify-center px-10 lg:px-20 py-20 lg:py-0"
        >
          <p className="font-editorial italic text-[80px] lg:text-[120px] leading-none text-primary/15 mb-4 select-none">
            SS26
          </p>
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4">Nueva Colección</p>
          <h2 className="font-display text-3xl lg:text-5xl text-foreground mb-6 leading-tight">
            La Moda que<br />
            <em>te define</em>
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-sm mb-10">
            Piezas diseñadas para la mujer que conoce su estilo. Texturas únicas, cortes estudiados, y la tecnología IA que te permite verlas puestas antes de comprar.
          </p>
          <Link
            to="/productos"
            className="inline-flex items-center gap-3 self-start font-body text-[11px] tracking-[0.3em] uppercase border border-foreground/30 text-foreground hover:border-primary hover:text-primary px-8 py-4 transition-all duration-500 group"
          >
            Ver Colección
            <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-300" />
          </Link>
        </motion.div>

        {/* Image side */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative min-h-[50vh] lg:min-h-0 img-hover-scale"
        >
          <img
            src={hero1}
            alt="Colección SS26"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-card/20 to-transparent" />
        </motion.div>
      </section>

      {/* 5. AI Studio Teaser */}
      <AIStudioTeaser />

      {/* 6. Editorial Destacados */}
      {featured.length > 0 && (
        <EditorialProductGrid
          products={featured}
          title="Productos Destacados"
          label="Selección"
        />
      )}

      {/* 7. Sobre Nosotros */}
      <SobreNosotros />

      {/* 8. Envíos y Pagos */}
      <Envios />

      {/* 9. Newsletter */}
      <section className="py-24 border-t border-border/40">
        <div className="container mx-auto px-4 text-center max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="font-editorial italic text-[64px] text-primary/10 leading-none mb-2 select-none">◌</p>
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Newsletter</p>
            <h2 className="font-display text-2xl lg:text-3xl text-foreground mb-3">Sumate al Inner Circle</h2>
            <p className="font-body text-sm text-muted-foreground mb-10 max-w-sm mx-auto leading-relaxed">
              Preventas exclusivas, descuentos anticipados y el mejor contenido fashion directo a tu inbox.
            </p>
            <form
              className="flex gap-0 border border-border hover:border-primary/40 transition-colors"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 bg-transparent px-5 py-4 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary text-primary-foreground px-8 py-4 font-body text-[10px] tracking-[0.35em] uppercase hover:bg-primary/90 transition-colors flex-shrink-0"
              >
                Unirse
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 10. Footer */}
      <Footer />
    </main>
  );
};

export default Index;
