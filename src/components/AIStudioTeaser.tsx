import { motion } from "framer-motion";
import { Sparkles, Wand2, Camera, ImageIcon, User } from "lucide-react";
import { Link } from "react-router-dom";
import urbanBa from "@/assets/ai-results/urban-ba.jpg";

export default function AIStudioTeaser() {
  const steps = [
    { num: "01", icon: Camera, label: "Subí tu prenda", desc: "Foto de cualquier ángulo" },
    { num: "02", icon: User, label: "Elegí tu modelo IA", desc: "5 modelos digitales" },
    { num: "03", icon: ImageIcon, label: "Seleccioná escenario", desc: "Estudio, urbano, París..." },
    { num: "04", icon: Wand2, label: "Generá el lookbook", desc: "8 fotos editoriales en 30s" },
  ];

  return (
    <section className="py-24 lg:py-36 bg-card border-y border-border relative overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/6 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full bg-primary/4 blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <Sparkles size={14} className="text-primary" />
              <span className="font-body text-[10px] tracking-[0.4em] uppercase text-primary">Powered by Gemini AI</span>
            </div>

            <h2 className="font-display text-4xl lg:text-6xl text-foreground mb-6 leading-[1.05]">
              AI Fashion<br />
              <em className="text-primary/80">Studio</em>
            </h2>

            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-10 max-w-sm">
              Creá contenido fotográfico editorial en minutos. Sin sesión de fotos, sin modelos, sin presupuesto.
            </p>

            {/* Steps */}
            <div className="space-y-5 mb-10">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.num}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-4"
                  >
                    <span className="font-editorial italic text-3xl text-primary/25 w-8 flex-shrink-0 leading-none">{step.num}</span>
                    <div className="w-px h-8 bg-border flex-shrink-0" />
                    <Icon size={14} className="text-primary/60 flex-shrink-0" />
                    <div>
                      <p className="font-body text-[11px] tracking-[0.2em] uppercase text-foreground">{step.label}</p>
                      <p className="font-body text-xs text-muted-foreground/60">{step.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <Link
              to="/probador-virtual"
              className="inline-flex items-center gap-3 px-8 py-4 font-body text-[11px] tracking-[0.3em] uppercase text-primary-foreground glow-gold transition-all duration-300 hover:scale-[1.02]"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold-light)), hsl(var(--gold)), hsl(var(--gold-dark)))" }}
            >
              <Wand2 size={13} />
              Probá el Probador Virtual
            </Link>
          </motion.div>

          {/* Right: Preview grid */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-3">
              {/* Upload placeholder */}
              <div className="aspect-[3/4] border border-dashed border-primary/25 flex flex-col items-center justify-center gap-3 bg-secondary/40">
                <Camera size={28} className="text-primary/30" />
                <span className="font-body text-[9px] tracking-[0.3em] uppercase text-muted-foreground/40">Tu prenda</span>
              </div>

              {/* Result 1 */}
              <div className="aspect-[3/4] relative overflow-hidden group img-hover-scale">
                <img src={urbanBa} alt="AI Result" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="font-body text-[9px] tracking-widest uppercase text-white/70">Callejón Urbano</span>
                </div>
              </div>

              {/* Result 2 */}
              <div className="col-span-2 aspect-[16/7] relative overflow-hidden group img-hover-scale">
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <source src="/video/hero-models-walking.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="font-body text-[9px] tracking-[0.3em] uppercase text-white/60 mb-1">Resultado IA</p>
                  <p className="font-display text-lg text-white">Balcón Parisino</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 bg-primary text-primary-foreground px-4 py-2 flex items-center gap-2"
            >
              <Sparkles size={11} />
              <span className="font-body text-[9px] tracking-[0.3em] uppercase">Gemini AI</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
