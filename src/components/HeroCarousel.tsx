import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";

interface Slide {
  image?: string;
  video?: string;
  fallbackImage?: string;
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  tag?: string;
  duration?: number;
  objectPosition?: string;
  /** zoom-out: true → reduce Ken Burns on images, or scale-down on video */
  zoomOut?: boolean;
}

// ─── Slide order ─────────────────────────────────────────────────────────────
// 1. Colección SS26   → hero1
// 2. Nueva Temporada  → hero-guillerminahero ("la de ella")
// 3. AI Lookbook      → hero5.mp4  (zoom IN normal — no zoomOut)
// 4. Lo Esencial      → hero-4.png
// 5. En Movimiento    → hero-models-walking.mp4 (zoomOut: scale down, logos arriba visibles)
const HERO_SLIDES: Slide[] = [
  {
    image: hero1,
    title: "Colección SS26",
    subtitle: "ESTILO SIN FILTROS",
    cta: "Descubrí más",
    link: "/productos",
    tag: "Campaña",
    duration: 6000,
  },
  {
    image: "/hero-guillerminahero.png",
    title: "Nueva Temporada",
    subtitle: "PRENDAS QUE HABLAN POR VOS",
    cta: "Ver Colección",
    link: "/productos",
    tag: "Editorial",
    duration: 6000,
    objectPosition: "center top",
  },
  {
    video: "/video/hero5.mp4",
    fallbackImage: "/hero-guillerminahero.png",
    title: "AI Lookbook",
    subtitle: "21 PIEZAS. INFINITAS FORMAS DE USARLAS.",
    cta: "Explorar",
    link: "/productos",
    tag: "Studio",
    duration: 8000,
  },
  {
    image: "/hero-4.png",
    title: "Lo Esencial",
    subtitle: "CADA PIEZA CUENTA UNA HISTORIA",
    cta: "Ver todo",
    link: "/productos",
    tag: "Lookbook",
    duration: 6000,
  },
  {
    video: "/video/hero-models-walking.mp4",
    fallbackImage: "/hero-guillerminahero.png",
    title: "En Movimiento",
    subtitle: "LA MODA QUE SE VIVE",
    cta: "Ver todo",
    link: "/productos",
    tag: "Editorial",
    duration: 9000,
    zoomOut: true,
  },
  {
    image: "/hero-3.png",
    title: "Balcón",
    subtitle: "LA CIUDAD COMO FONDO",
    cta: "Ver Colección",
    link: "/productos",
    tag: "Editorial",
    duration: 6000,
  },
];

// Split title into chars for staggered animation
function AnimatedTitle({ text, slideKey }: { text: string; slideKey: string }) {
  const chars = text.split("");
  return (
    <motion.h1
      key={slideKey + "-title"}
      className="font-display text-5xl sm:text-6xl lg:text-8xl font-semibold text-white leading-[0.95] tracking-[-0.01em] mb-6"
    >
      {chars.map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.3 + i * 0.04,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ display: char === " " ? "inline" : "inline-block" }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = HERO_SLIDES.length;

  const advanceSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % total);
    setProgressKey((k) => k + 1);
  }, [total]);

  // Auto-advance timer — reset whenever slide changes
  useEffect(() => {
    setVideoError(false);

    // Only set a timer for image slides or as a safety fallback for videos
    const slide = HERO_SLIDES[current];
    const isVideo = !!slide.video;

    if (timerRef.current) clearTimeout(timerRef.current);

    if (!isVideo) {
      timerRef.current = setTimeout(advanceSlide, slide.duration ?? 6000);
    } else {
      // Safety fallback — advance if video fails to fire onEnded
      timerRef.current = setTimeout(advanceSlide, (slide.duration ?? 8000) + 2000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [current, advanceSlide]);

  // Auto-play video when slide changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => setVideoError(true));
    }
  }, [current]);

  const slide = HERO_SLIDES[current];

  const goTo = (index: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent(index);
    setProgressKey((k) => k + 1);
  };

  // Ken Burns params per slide
  const imageInitialScale = slide.zoomOut ? 1.0 : 1.02;
  const imageFinalScale = slide.zoomOut ? 1.03 : 1.07;

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Top gradient — ensures navbar legibility */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10 pointer-events-none" />

      {/* Slides */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {slide.video && !videoError ? (
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
              style={slide.zoomOut ? { objectPosition: "center top" } : undefined}
              poster={slide.fallbackImage}
              onError={() => setVideoError(true)}
              onEnded={advanceSlide}
            >
              <source src={slide.video} type="video/mp4" />
            </video>
          ) : slide.video && videoError && slide.fallbackImage ? (
            <img
              src={slide.fallbackImage}
              alt={slide.title}
              className="w-full h-full object-cover"
              style={{ objectPosition: slide.objectPosition ?? "center" }}
            />
          ) : slide.image ? (
            <motion.img
              src={slide.image}
              alt={slide.title}
              initial={{ scale: imageInitialScale }}
              animate={{ scale: imageFinalScale }}
              transition={{
                duration: (slide.duration ?? 6000) / 1000,
                ease: "linear",
              }}
              className="w-full h-full object-cover"
              style={{ objectPosition: slide.objectPosition ?? "center" }}
            />
          ) : null}

          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Slide content */}
      <div className="absolute inset-0 flex flex-col justify-end pb-20 lg:pb-28 px-6 lg:px-16">
        <AnimatePresence mode="wait">
          <motion.div key={current + "-content"}>
            {/* Tag */}
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-4 flex items-center gap-3"
            >
              <span className="w-8 h-px bg-primary inline-block" />
              {slide.tag}
            </motion.p>

            {/* Animated title */}
            <AnimatedTitle text={slide.title} slideKey={String(current)} />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="font-body text-sm tracking-[0.2em] uppercase text-white/60 mb-8"
            >
              {slide.subtitle}
            </motion.p>

            {/* CTA */}
            {slide.cta && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.75 }}
              >
                <Link
                  to={slide.link}
                  className="inline-flex items-center gap-3 font-body text-xs tracking-[0.3em] uppercase text-white border border-white/40 px-8 py-4 hover:border-primary hover:text-primary transition-all duration-500 group"
                >
                  {slide.cta}
                  <span className="w-4 h-px bg-current transition-all duration-300 group-hover:w-8" />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-8 right-6 lg:right-16 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Ir al slide ${i + 1}`}
            className={`transition-all duration-300 ${
              i === current
                ? "w-6 h-1 bg-primary"
                : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60 rounded-full"
            }`}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0">
        <div className="h-[2px] bg-white/10 w-full">
          <motion.div
            key={progressKey}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: (slide.duration ?? 6000) / 1000,
              ease: "linear",
            }}
            className="h-full bg-primary"
          />
        </div>
      </div>
    </section>
  );
}
