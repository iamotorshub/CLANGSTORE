import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles, ChevronDown } from "lucide-react";

// ─── OpenRouter / DeepSeek setup ──────────────────────────────────────────────
const OPENROUTER_KEY = import.meta.env.VITE_OPENROUTER_KEY ?? "";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const CHAT_MODEL = "deepseek/deepseek-chat";

// ─── System prompt ────────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
<Sistema>
Sos CLARA, la Estilista de Moda con IA y Combinadora de Outfits experta de CLANG Store.
</Sistema>

<Contexto>
CLANG es una marca argentina de ropa femenina contemporánea fundada y dirigida por Guillermina, con base en Argentina.
La tienda mezcla moda de calidad con tecnología de inteligencia artificial.

TECNOLOGÍA CLANG:
- Probador Virtual IA: permite ver cualquier prenda de la colección puesta sobre una modelo con IA generativa (Google Gemini). Disponible en la sección "Probador Virtual" del sitio.
- Lookbook IA: generación de editoriales de moda con IA.

DUEÑA Y CARA DE CLANG:
- Guillermina es la fundadora y directora creativa. Es también la cara e influencer de la marca. Tiene un estilo urbano-editorial, sofisticado pero accesible.

CATÁLOGO ACTUAL (Colección SS26 — Primavera/Verano 2026):
Categorías y prendas disponibles:
• VESTIDOS: Vestido Armani ($89.900), Vestido Pilar ($89.900), Vestido Gime ($99.900)
• TOPS: Top Rihana ($32.900), Top Viena ($69.900), Top Lari
• CAMISAS: Camisa Loreana ($79.900), Camisa Battery ($64.900)
• REMERAS: Remeron Bunny ($39.900), Remeron Heaven ($35.900), Remeron Ibiza ($39.900)
• SETS (2 piezas): Set Lola ($129.900), Set Rina ($129.900), Set Maria ($124.900)
• JEANS: Jean Oxid ($79.900), Jean Off White ($79.900)
• ABRIGOS/CHAQUETAS: Chaqueta Oasis ($189.900)
• SHORTS: Short Kendal ($52.900), Short Rocío ($49.900)
• MUSCULOSAS: Musculosa Rocío
• FALDAS: Falda California ($52.900)

ESTILO DE LA COLECCIÓN SS26: transparencias, texturas contrastantes, paleta de neutros con un color protagonista por look. Inspiración: Buenos Aires urbano x editorial internacional.

CLIENTA TIPO: Mujer moderna, 25-45 años, urbana, que valora calidad y estilo propio. Buenos Aires y GBA principalmente.

CONTACTO Y COMPRA:
- WhatsApp: +54 9 291 645-2291 (pedidos, consultas de stock, tallaje)
- Instagram: @clang.store
- Web: clang.store (tienda online completa con Probador Virtual IA)
- Medios de pago: tarjeta, transferencia, efectivo
- Envíos a todo el país
</Contexto>

<Personalidad>
- Hablás en español rioplatense argentino: "vos", "bárbaro", "genial", "dale", "mirá"
- Sos cálida, cercana y apasionada por la moda — hacés que cada clienta se sienta especial
- Refinada pero sin ser pretenciosa. Directa y útil.
- Usás emojis con moderación ✨
- Máximo 3-4 oraciones por respuesta salvo que la situación requiera más detalle
</Personalidad>

<Instrucciones>
Cuando la clienta quiere armar un outfit:
1. RECOPILAR CONTEXTO — preguntá el tipo de evento (brunch casual, cena formal, trabajo, salida nocturna, etc.) y cualquier preferencia de estilo o restricción de color
2. SUGERIR 2-3 COMBINACIONES coherentes usando prendas del catálogo de CLANG, con una explicación breve por look (ej: "El Set Lola con sandalias nude es ideal para una cena: elegante sin esfuerzo")
3. MEJORAS OPCIONALES — ofrecé tips de accesorios o cómo elevar el look
4. PROBADOR VIRTUAL — siempre mencioná que puede probarse las prendas en el Probador Virtual IA de la web antes de comprar
5. Cerrá preguntando "¿Querés que te muestre más combinaciones o ajustamos algo?"

Para consultas de stock, tallas o precios exactos: mandá al WhatsApp +54 9 291 645-2291

RESTRICCIONES:
- No repitas combinaciones de outfits salvo que te pidan
- Solo sugerí prendas del catálogo de CLANG
- No hables de temas ajenos a moda, estilismo y CLANG
- Describí los looks de forma concisa, sin lenguaje repetitivo
</Instrucciones>

<Inicio>
Cuando alguien saluda o empieza a chatear, respondé con:
"¡Hola! Soy Clara, tu estilista personal de CLANG ✨ ¿Querés que te ayude a armar un outfit para alguna ocasión especial, o te cuento sobre la nueva colección SS26 de Guille?"
Luego esperá su respuesta para guiar la conversación.
</Inicio>
`;

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: Date;
}

// ─── Suggestion chips ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  "¿Qué me recomendás para una salida nocturna?",
  "Necesito un outfit de trabajo chic",
  "¿Cómo funciona el probador virtual?",
  "¿Qué está de moda esta temporada?",
];

// ─── OpenRouter API call ───────────────────────────────────────────────────────
async function callClaraAI(
  history: { role: "user" | "assistant"; text: string }[],
  userText: string,
): Promise<string> {
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.text,
    })),
    { role: "user", content: userText },
  ];

  const res = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://clang.store",
      "X-Title": "CLANG Store - Clara AI",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      max_tokens: 400,
      temperature: 0.85,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => "");
    throw new Error(`OpenRouter ${res.status}: ${errBody}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("No response content from OpenRouter");
  return content as string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function FashionChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "¡Hola! Soy Clara, tu asesora de moda de CLANG ✨ ¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setHasUnread(false);
    }
  }, [isOpen]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        text: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsLoading(true);

      try {
        // Build history (exclude welcome message)
        const history = messages
          .filter((m) => m.id !== "welcome")
          .map((m) => ({ role: m.role, text: m.text }));

        const assistantText = await callClaraAI(history, text.trim());

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          text: assistantText,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        if (!isOpen) {
          setHasUnread(true);
        }
      } catch (err) {
        console.error("[Clara] API error:", err);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            text: "Perdón, tuve un pequeño inconveniente. ¿Podés intentar de nuevo en un momento? 🙏",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading, isOpen],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestion = (s: string) => {
    sendMessage(s);
  };

  return (
    <>
      {/* ── Chat panel ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed bottom-[160px] right-4 lg:right-8 z-50 w-[calc(100vw-32px)] max-w-[380px] flex flex-col"
            style={{ height: "min(520px, calc(100vh - 200px))" }}
          >
            {/* Panel */}
            <div className="flex flex-col h-full bg-[#0e0e0e] border border-white/10 shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-[#111]">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#C4A97A] to-[#8B7355] flex items-center justify-center">
                      <Sparkles size={14} className="text-black" />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#111] rounded-full" />
                  </div>
                  <div>
                    <p className="font-display text-sm text-white tracking-[0.1em]">CLARA</p>
                    <p className="font-body text-[9px] tracking-[0.25em] uppercase text-primary/60">
                      Asesora de Moda · CLANG
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-white transition-colors p-1"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-6 h-6 bg-gradient-to-br from-[#C4A97A] to-[#8B7355] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Sparkles size={10} className="text-black" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 text-[13px] font-body leading-relaxed ${
                        msg.role === "user"
                          ? "bg-primary/15 text-white border border-primary/20 ml-auto"
                          : "bg-white/5 text-white/85 border border-white/8"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-start"
                  >
                    <div className="w-6 h-6 bg-gradient-to-br from-[#C4A97A] to-[#8B7355] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles size={10} className="text-black" />
                    </div>
                    <div className="bg-white/5 border border-white/8 px-4 py-3 flex items-center gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ opacity: [0.2, 1, 0.2] }}
                          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                          className="w-1.5 h-1.5 bg-primary/60 rounded-full inline-block"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Suggestions (only shown when only welcome message exists) */}
              {messages.length === 1 && (
                <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSuggestion(s)}
                      className="font-body text-[10px] tracking-[0.12em] border border-white/15 text-white/50 hover:border-primary/50 hover:text-primary/80 px-2.5 py-1.5 transition-all duration-200 text-left"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 px-4 py-3 border-t border-white/8 bg-[#111]"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Preguntale a Clara..."
                  disabled={isLoading}
                  className="flex-1 bg-white/5 border border-white/10 text-white text-[13px] font-body px-3 py-2.5 placeholder:text-white/25 focus:outline-none focus:border-primary/40 transition-colors disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 bg-primary hover:bg-primary/80 disabled:bg-white/10 disabled:text-white/20 flex items-center justify-center transition-all duration-200 flex-shrink-0"
                >
                  <Send size={14} className="text-black disabled:text-white/20" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating trigger button — premium pill style ── */}
      <AnimatePresence mode="wait" initial={false}>
        {isOpen ? (
          /* Compact close button when chat is open */
          <motion.button
            key="btn-close"
            onClick={() => setIsOpen(false)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="fixed bottom-[88px] right-4 lg:right-8 z-50 w-12 h-12 bg-[#0e0e0e] border border-white/20 hover:border-white/40 shadow-xl flex items-center justify-center transition-all duration-300"
            aria-label="Cerrar chat"
          >
            <X size={18} className="text-white/60 hover:text-white" />
          </motion.button>
        ) : (
          /* Premium pill CTA */
          <motion.button
            key="btn-open"
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 60 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.97 }}
            className="fixed bottom-[88px] right-4 lg:right-8 z-50 flex items-center gap-3 pl-3 pr-5 py-0 h-14 bg-[#0e0e0e] border border-[#C4A97A]/40 hover:border-[#C4A97A]/80 shadow-[0_4px_24px_rgba(196,169,122,0.15)] hover:shadow-[0_4px_32px_rgba(196,169,122,0.28)] transition-all duration-300 group"
            aria-label="Abrir asesora de imagen"
          >
            {/* Avatar icon */}
            <div className="relative flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-[#C4A97A] to-[#8B7355] flex items-center justify-center">
                <Sparkles size={14} className="text-black" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#0e0e0e] rounded-full" />
            </div>

            {/* Text */}
            <div className="flex flex-col items-start leading-none">
              <span className="font-display text-[11px] tracking-[0.18em] text-white group-hover:text-[#C4A97A] transition-colors">
                CLARA
              </span>
              <span className="font-body text-[9px] tracking-[0.2em] uppercase text-white/40 mt-0.5">
                Asesora de imagen
              </span>
            </div>

            {/* Unread badge */}
            {hasUnread && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0e0e0e]" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
