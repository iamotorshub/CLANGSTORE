import { motion } from "framer-motion";
import { Truck, RefreshCcw, CreditCard, Shield, MessageCircle } from "lucide-react";

const shippingInfo = [
  {
    icon: Truck,
    title: "Envío Express",
    subtitle: "24 a 48 hs hábiles",
    desc: "A todo el país con seguimiento en tiempo real. Coordinamos por WhatsApp para que nunca te pierdas tu pedido.",
    highlight: "Gratis +$50.000",
  },
  {
    icon: RefreshCcw,
    title: "Cambios Gratis",
    subtitle: "30 días para decidir",
    desc: "Si tu talle no era el correcto o querés cambiarlo por otro color, lo gestionamos sin costo. Sólo avisanos por WhatsApp.",
    highlight: "Sin costo",
  },
  {
    icon: CreditCard,
    title: "Medios de Pago",
    subtitle: "3 cuotas sin interés",
    desc: "Aceptamos todas las tarjetas de crédito en 3 cuotas sin interés. También 20% OFF pagando en efectivo o transferencia.",
    highlight: "3 cuotas sin interés",
  },
  {
    icon: Shield,
    title: "Compra Segura",
    subtitle: "100% garantizado",
    desc: "Todos los pagos son procesados de forma segura. Trabajamos con MercadoPago y transferencia bancaria verificada.",
    highlight: "MercadoPago",
  },
];

const faqs = [
  {
    q: "¿Cuánto tarda en llegar mi pedido?",
    a: "El envío express demora entre 24 y 48 horas hábiles en la mayoría del país. Te mandamos el código de seguimiento por WhatsApp.",
  },
  {
    q: "¿Cómo funciona el probador virtual?",
    a: "Subís una foto tuya y nuestro sistema de IA te muestra cómo te queda la prenda antes de comprarla. Es 100% gratis e ilimitado.",
  },
  {
    q: "¿Puedo devolver una prenda?",
    a: "Sí, tenés 30 días para cambios o devoluciones sin costo. La única condición es que la prenda esté sin uso y con etiquetas.",
  },
  {
    q: "¿Hacen envíos a todo Argentina?",
    a: "Sí, enviamos a todo el país con Andreani y OCA. El costo varía según la zona — gratis en compras mayores a $50.000.",
  },
];

export default function Envios() {
  return (
    <section id="envios" className="py-24 lg:py-32 bg-card/30 border-t border-border/40">
      <div className="container mx-auto px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16 lg:mb-20"
        >
          <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3">Información</p>
          <h2 className="font-display text-3xl lg:text-5xl text-foreground mb-4">
            Envíos y Pagos
          </h2>
          <p className="font-body text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Todo lo que necesitás saber para comprar con confianza.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {shippingInfo.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group relative bg-card border border-border hover:border-primary/30 p-6 transition-all duration-300"
              >
                {/* Icon */}
                <div className="w-10 h-10 border border-primary/30 flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors">
                  <Icon size={16} className="text-primary" />
                </div>

                <h3 className="font-display text-lg text-foreground mb-1">{item.title}</h3>
                <p className="font-body text-[10px] tracking-[0.25em] uppercase text-primary/70 mb-3">{item.subtitle}</p>
                <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">{item.desc}</p>

                {/* Highlight badge */}
                <span className="inline-block font-body text-[9px] tracking-[0.25em] uppercase border border-primary/30 text-primary px-2.5 py-1">
                  {item.highlight}
                </span>

                {/* Decorative number */}
                <span className="absolute top-4 right-4 font-editorial italic text-5xl text-primary/6 leading-none select-none pointer-events-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-border/60 mb-20" />

        {/* FAQ Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20">
          {/* Left: FAQ heading */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
          >
            <p className="font-body text-[10px] tracking-[0.4em] uppercase text-primary mb-3 flex items-center gap-3">
              <span className="w-6 h-px bg-primary" />
              Preguntas Frecuentes
            </p>
            <h3 className="font-display text-3xl lg:text-4xl text-foreground mb-6">
              ¿Tenés alguna<br />duda?
            </h3>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-8">
              Respondemos todas tus consultas por WhatsApp en menos de 1 hora durante el horario de atención.
            </p>

            <a
              href="https://wa.me/5492916452291?text=Hola!%20Tengo%20una%20consulta%20sobre%20un%20pedido"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 font-body text-[11px] tracking-[0.3em] uppercase border border-foreground/30 text-foreground hover:border-primary hover:text-primary px-8 py-4 transition-all duration-500 group"
            >
              <MessageCircle size={14} />
              Escribinos
              <span className="w-4 h-px bg-current group-hover:w-8 transition-all duration-300" />
            </a>
          </motion.div>

          {/* Right: FAQ items */}
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                className="border-b border-border/50 py-5 group"
              >
                <h4 className="font-body text-sm tracking-[0.05em] text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                  {faq.q}
                </h4>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
