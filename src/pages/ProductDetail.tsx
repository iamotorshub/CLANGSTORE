import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ShoppingBag, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: products = [] } = useProducts();
  const { addItem } = useCart();

  const product = products.find((p) => p.slug === slug);
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
  const [descOpen, setDescOpen] = useState(true);
  const [added, setAdded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);

  useEffect(() => {
    if (product?.sizes?.[0]) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  useEffect(() => {
    if (product) {
      setSelectedImage(product.image);
      setSelectedImageIndex(0);
    }
  }, [product]);

  if (!product) {
    return (
      <main className="pt-28 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="font-editorial italic text-6xl text-muted-foreground/20 mb-4">404</p>
          <p className="font-body text-sm text-muted-foreground mb-6">Producto no encontrado</p>
          <Link to="/productos" className="font-body text-[11px] tracking-[0.3em] uppercase border border-border px-6 py-3 hover:border-primary hover:text-primary transition-colors">
            Ver Catálogo
          </Link>
        </div>
      </main>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addItem(product, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsApp = () => {
    const msg = `Hola! Me interesa el producto *${product.name}* (${formatPrice(product.price)})${selectedSize ? ` - Talle: ${selectedSize}` : ""}. ¿Tienen stock?`;
    window.open(`https://wa.me/5492916452291?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const galleryImages = product.images?.length ? product.images : [product.image];
  const hasGallery = galleryImages.length > 1;
  const displayImage = selectedImage || product.image;

  return (
    <main className="pt-24 min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 lg:px-8 py-4">
        <div className="flex items-center gap-2 font-body text-[10px] tracking-[0.2em] uppercase text-muted-foreground/50">
          <Link to="/" className="hover:text-primary transition-colors">Inicio</Link>
          <ChevronRight size={10} />
          <Link to="/productos" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <Link to="/productos" className="hover:text-primary transition-colors">{product.category}</Link>
          <ChevronRight size={10} />
          <span className="text-foreground/60">{product.name}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Image — left (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7"
          >
            <div className="flex gap-3">
              {/* Vertical thumbnail strip — desktop only, only when gallery exists */}
              {hasGallery && (
                <div className="hidden lg:flex flex-col gap-2 w-16 flex-shrink-0">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedImage(img); setSelectedImageIndex(idx); }}
                      className={`aspect-[3/4] overflow-hidden border transition-all duration-200 ${
                        selectedImageIndex === idx
                          ? "border-primary opacity-100"
                          : "border-border/30 opacity-50 hover:opacity-80 hover:border-border/60"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image + mobile thumbnail strip */}
              <div className="flex-1 flex flex-col gap-3">
                <div className="aspect-[3/4] overflow-hidden bg-secondary relative">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={displayImage}
                      src={displayImage}
                      alt={product.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full object-cover img-hover-scale"
                    />
                  </AnimatePresence>
                  {product.isNew && (
                    <div className="absolute top-5 left-5">
                      <span className="bg-primary text-primary-foreground font-body text-[9px] tracking-[0.3em] uppercase px-3 py-1.5">
                        Nuevo
                      </span>
                    </div>
                  )}
                </div>

                {/* Mobile thumbnail strip — horizontal scroll */}
                {hasGallery && (
                  <div className="flex lg:hidden gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {galleryImages.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setSelectedImage(img); setSelectedImageIndex(idx); }}
                        className={`flex-shrink-0 w-14 aspect-[3/4] overflow-hidden border transition-all duration-200 ${
                          selectedImageIndex === idx
                            ? "border-primary opacity-100"
                            : "border-border/30 opacity-50"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Details — right (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 flex flex-col"
          >
            {/* Category */}
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-3">
              {product.category}
            </p>

            {/* Name */}
            <h1 className="font-display text-3xl lg:text-4xl text-foreground mb-5 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-8 pb-8 border-b border-border/40">
              <span className="font-display text-2xl text-primary">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="font-body text-sm text-muted-foreground/50 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Size selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70">Talle</p>
                  <button className="font-body text-[9px] tracking-wider uppercase text-muted-foreground/50 hover:text-primary transition-colors border-b border-muted-foreground/20">
                    Guía de talles
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`font-body text-[11px] tracking-wider uppercase px-4 py-2.5 border transition-all duration-200 ${
                        selectedSize === size
                          ? "border-primary text-primary bg-primary/5"
                          : "border-border/60 text-muted-foreground hover:border-foreground/40 hover:text-foreground"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <div className="flex flex-col gap-3 mb-8">
              <motion.button
                onClick={handleAddToCart}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center justify-center gap-3 py-4 font-body text-[11px] tracking-[0.3em] uppercase transition-all duration-300 ${
                  added
                    ? "bg-primary/20 text-primary border border-primary"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                <ShoppingBag size={14} />
                {added ? "¡Agregado!" : "Agregar al Carrito"}
              </motion.button>

              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center justify-center gap-3 py-4 font-body text-[11px] tracking-[0.3em] uppercase border border-border/60 text-muted-foreground hover:border-primary/40 hover:text-primary transition-all duration-200"
              >
                <MessageCircle size={14} />
                Consultar por WhatsApp
              </button>
            </div>

            {/* Description accordion */}
            <div className="border-t border-border/40">
              <button
                onClick={() => setDescOpen(!descOpen)}
                className="w-full flex items-center justify-between py-4 font-body text-[10px] tracking-[0.3em] uppercase text-foreground/70 hover:text-foreground transition-colors"
              >
                Descripción
                <motion.div animate={{ rotate: descOpen ? 180 : 0 }} transition={{ duration: 0.25 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {descOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ overflow: "hidden" }}
                  >
                    <p className="font-body text-sm text-muted-foreground leading-relaxed pb-6">
                      {product.description || "Prenda de confección nacional. Consultar disponibilidad de talles y colores."}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shipping info */}
            <div className="mt-auto pt-6 border-t border-border/40">
              <div className="space-y-2">
                {["Envío a todo el país en 24-48hs", "3 cuotas sin interés con todas las tarjetas", "Cambios gratuitos en 30 días"].map((info) => (
                  <p key={info} className="font-body text-[10px] tracking-wider text-muted-foreground/50 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-primary/50 flex-shrink-0" />
                    {info}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24 pt-16 border-t border-border/40">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2">Más de {product.category}</p>
                <h2 className="font-display text-2xl lg:text-3xl text-foreground">Te puede interesar</h2>
              </div>
              <Link to="/productos" className="font-body text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/20 hover:border-primary pb-0.5">
                Ver todo →
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="mt-20">
        <Footer />
      </div>
    </main>
  );
}
