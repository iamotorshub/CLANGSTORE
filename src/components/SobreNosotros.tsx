import { motion } from "framer-motion";
import hero1 from "@/assets/hero-1.jpg";

const values = [
  {
    icon: "✦",
    title: "Diseño con propósito",
    desc: "Cada prenda está seleccionada con atención al corte, la textura y la forma. Creemos que la moda bien elegida es una forma de arte cotidiano.",
  },
  {
    icon: "◈",
    title: "Tecnología IA integrada",
    desc: "Somos la primera tienda argentina con probador virtual. Probate cualquier prenda desde tu celular, antes de comprar.",
  },
  {
    icon: "◇",
    title: "Moda argentina",
    desc: "Nacimos en Argentina y pensamos para la mujer argentina: talles reales, precios accesibles y servicio personalizado por WhatsApp.",
  },
];

export default function SobreNosotros() {
  return (
    <section id="sobre-nosotros" className="py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 flex items-center gap-3"
        >
          <span className="w-6 h-px bg-primary" />
          Nuestra Historia
        </motion.p>

        {/* Layout: text left, image right */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="font-display text-4xl lg:text-6xl text-foreground leading-tight mb-8"
            >
              Moda que te<br />
              <em className="text-primary">empodera</em>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
              className="font-body text-base text-muted-foreground leading-relaxed mb-6"
            >
              CLANG nació de la convicción de que vestirse bien no tiene que ser complicado. Somos una marca argentina que combina curaduría de moda editorial con tecnología de inteligencia artificial para que encontrés tu estilo de forma fácil, divertida y sin dudas.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.3 }}
              className="font-body text-base text-muted-foreground leading-relaxed mb-10"
            >
              Nuestras prendas son pensadas para la mujer que sabe lo que quiere: calidad, estilo propio y la libertad de probarse todo desde su celular con nuestro probador virtual con IA.
            </motion.p>

            {/* Values list */}
            <div className="space-y-6">
              {values.map((v, i) => (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
                  className="flex gap-4"
                >
                  <span className="text-primary text-lg mt-0.5 flex-shrink-0 w-6 text-center">{v.icon}</span>
                  <div>
                    <h4 className="font-display text-base text-foreground mb-1">{v.title}</h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right — image with decorative elements */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Decorative gold border frame */}
            <div className="absolute -top-4 -right-4 w-full h-full border border-primary/20 z-0" />

            <div className="relative z-10 aspect-[3/4] overflow-hidden img-hover-scale">
              <img
                src="/hero-guillerminahero.png"
                alt="CLANG — Moda editorial argentina"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = hero1;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating stat card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -bottom-6 -left-6 bg-card border border-border/60 px-6 py-5 backdrop-blur-sm shadow-xl z-20"
            >
              <p className="font-editorial italic text-4xl text-primary leading-none mb-1">+500</p>
              <p className="font-body text-[10px] tracking-[0.3em] uppercase text-muted-foreground">Clientas felices</p>
            </motion.div>

            {/* Gold decorative text */}
            <p className="absolute -top-6 -left-2 font-editorial italic text-[80px] leading-none text-primary/8 select-none pointer-events-none">
              SS26
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
