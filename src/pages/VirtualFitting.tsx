import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from '@/components/ImageUpload';
import { fileToBase64, cn } from '@/lib/utils';
import { withGeminiRotation, imageUrlToBase64 } from '@/lib/geminiRotation';
import { Sparkles, ArrowRight, ChevronLeft, Camera, User, CheckCircle2, Heart } from 'lucide-react';
import { Typewriter } from '@/components/Typewriter';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SHOP_ITEMS = [
  { id: 'item1', name: 'CAMISA LOREANA', price: '$ 79.900', image_url: 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=400&q=80' },
  { id: 'item2', name: 'TOP RIHANA', price: '$ 32.900', image_url: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=400&q=80' },
  { id: 'item3', name: 'VESTIDO ARMANI', price: '$ 89.900', image_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?auto=format&fit=crop&w=400&q=80' },
  { id: 'item4', name: 'CHAQUETA OASIS', price: '$ 189.900', image_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=400&q=80' },
  { id: 'item5', name: 'JEAN OXID', price: '$ 65.000', image_url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80' },
  { id: 'item6', name: 'SET LOLA', price: '$ 110.000', image_url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=400&q=80' },
  { id: 'item7', name: 'FALDA CALIFORNIA', price: '$ 45.000', image_url: 'https://images.unsplash.com/photo-1583496661160-c588c443c982?auto=format&fit=crop&w=400&q=80' },
  { id: 'item8', name: 'SHORT ORIGINAL', price: '$ 35.000', image_url: 'https://images.unsplash.com/photo-1591369822096-ffd140ec948f?auto=format&fit=crop&w=400&q=80' },
];

type Step = 'INSTRUCTIONS' | 'UPLOAD' | 'GARMENT' | 'GENERATING' | 'RESULTS';

export default function VirtualFitting() {
  const [step, setStep] = useState<Step>('INSTRUCTIONS');

  const [userFile, setUserFile] = useState<File | null>(null);
  const [userPreview, setUserPreview] = useState<string | null>(null);

  const [selectedGarment, setSelectedGarment] = useState<any | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');

  const handleUserUpload = (file: File) => {
    setUserFile(file);
    setUserPreview(URL.createObjectURL(file));
  };

  const saveToCollection = (url: string) => {
    const saved = localStorage.getItem('clang_collection');
    const collection = saved ? JSON.parse(saved) : [];
    collection.push({ url, date: Date.now() });
    localStorage.setItem('clang_collection', JSON.stringify(collection));
    alert('Guardado en tu colección');
  };

  const handleGenerate = async () => {
    if (!userFile || !selectedGarment) return;

    setStep('GENERATING');
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      // Step 1: Convert user photo to base64
      setProgressText('Analizando tu foto...');
      const userBase64 = await fileToBase64(userFile);

      // Step 2: Convert garment image to base64 — CORS-safe (canvas method para iOS)
      setProgressText('Preparando la prenda...');
      const garmentBase64 = await imageUrlToBase64(selectedGarment.image_url);

      // Step 3: Generate virtual fitting with Gemini (key rotation on 429)
      setProgressText('Probando la prenda en vos...');

      const prompt = `FUSIÓN: Genera una fotografía hiperrealista de estudio donde el Sujeto (Image 1) esté vistiendo EXACTAMENTE la Prenda (Image 2).
FÍSICAS: La ropa debe tener una caída natural (natural drape), respetando la tensión de la tela sobre la volumetría del cuerpo humano.
ÓPTICA DE CÁMARA: Fotografía de estudio de frente, fondo blanco puro, buena iluminación suave y difusa.
TEXTURAS: Mantén la identidad del sujeto, su rostro, tono de piel y cabello.
RESTRICCIONES: BAJO NINGUNA CIRCUNSTANCIA debes generar lo siguiente: plastic skin, airbrushed, 3D render, CGI, over-saturated, morphed fabric, floating.`;

      const genResponse = await withGeminiRotation(async (aiClient) => {
        return await aiClient.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [
              { inlineData: { data: userBase64, mimeType: userFile.type } },
              { inlineData: { data: garmentBase64, mimeType: 'image/jpeg' } },
              { text: prompt }
            ]
          },
          config: {
            responseModalities: ['IMAGE', 'TEXT'],
          },
        });
      });

      let generatedBase64 = null;
      for (const part of genResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          generatedBase64 = part.inlineData.data;
          break;
        }
      }

      if (generatedBase64) {
        setResultImage(`data:image/jpeg;base64,${generatedBase64}`);
        setStep('RESULTS');
      } else {
        throw new Error("No se pudo generar la imagen de la prenda.");
      }

    } catch (err: any) {
      console.error('[VirtualFitting]', err);
      const msg: string = err.message || "";
      if (msg.includes("429") || msg.toLowerCase().includes("quota") || msg.toLowerCase().includes("rate")) {
        setError("¡La IA está muy pedida en este momento! 🔥 Esperá 30 segundos y volvé a intentarlo.");
      } else if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("fetch") || msg.toLowerCase().includes("cors")) {
        setError("No pudimos cargar la imagen de la prenda. Revisá tu conexión e intentá de nuevo.");
      } else if (msg.toLowerCase().includes("no se pudo")) {
        setError("La IA no pudo procesar las imágenes esta vez. Probá con otra foto o prenda.");
      } else {
        setError("Algo salió mal al generar el look. Volvé a intentarlo en un momento 🙌");
      }
      setStep('GARMENT');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white/20 font-sans">
      <Navbar />

      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-white/5 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#D4B895]/5 blur-[120px]" />
      </div>

      <main className="pt-32 pb-12 relative z-10 w-full min-h-screen">
        <div className="w-full max-w-7xl mx-auto p-6 font-sans">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight text-white mb-4">
              Probador Virtual
            </h1>
            <p className="text-white/60 text-sm md:text-base font-light max-w-xl mx-auto">
              Probá las prendas de CLANG antes de comprar. Subí tu foto y elegí qué ponerte.
            </p>
          </div>

          <div className="relative min-h-[700px] rounded-[2rem] bg-zinc-900/50 backdrop-blur-3xl overflow-hidden p-8 md:p-12 shadow-2xl border border-white/5">
            <AnimatePresence mode="wait">
              {step === 'INSTRUCTIONS' && (
                <motion.div
                  key="step-instructions"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center max-w-2xl mx-auto"
                >
                  <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-8 mb-8">
                    <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white/70" />
                      Instrucciones para mejor resultado
                    </h3>

                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">Foto de cuerpo entero</h4>
                          <p className="text-white/50 text-xs leading-relaxed">Subí una foto de cuerpo entero, de pie, en buena calidad y resolución.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <div className="w-5 h-5 bg-white rounded-sm" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">Fondo blanco o liso</h4>
                          <p className="text-white/50 text-xs leading-relaxed">Usamos una técnica similar al chroma key del cine: al tener un fondo uniforme, la IA puede separar tu silueta con mayor precisión para superponer las prendas de forma realista. Si vas a usar una prenda blanca, usá un fondo de otro color.</p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-white/70" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm mb-1">Buena iluminación</h4>
                          <p className="text-white/50 text-xs leading-relaxed">Evitá sombras fuertes o contraluz. La luz natural difusa es ideal.</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                      <h4 className="text-white/70 font-medium text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                        <span className="text-yellow-500">⚠</span> Importante
                      </h4>
                      <ul className="text-white/40 text-xs space-y-2 list-disc pl-4">
                        <li>Esta es una aproximación generada por IA y puede no reflejar exactamente cómo te quedará la prenda.</li>
                        <li>La calidad del resultado depende de la calidad de la foto subida, la iluminación y el fondo.</li>
                        <li>Los colores pueden variar según la pantalla.</li>
                      </ul>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('UPLOAD')}
                    className="w-full py-5 rounded-2xl bg-[#D4B895] text-black font-medium uppercase tracking-[0.2em] text-sm transition-all hover:bg-[#E5C9A6] flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(212,184,149,0.2)]"
                  >
                    Comenzar <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 'UPLOAD' && (
                <motion.div
                  key="step-upload"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center max-w-2xl mx-auto"
                >
                  <div className="flex items-center w-full mb-10">
                    <button onClick={() => setStep('INSTRUCTIONS')} className="p-3 hover:bg-white/10 rounded-full transition-colors mr-4">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        <Typewriter text="Tu Foto" delay={0.03} />
                      </h2>
                      <p className="text-white/50 text-sm md:text-base font-light">
                        Subí una foto tuya siguiendo las instrucciones.
                      </p>
                    </div>
                  </div>

                  <div className="w-full max-w-md mb-10">
                    <ImageUpload
                      label="Tu Foto"
                      image={userPreview}
                      onUpload={handleUserUpload}
                      onClear={() => {
                        setUserFile(null);
                        setUserPreview(null);
                      }}
                      className="w-full"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep('GARMENT')}
                    disabled={!userFile}
                    className="w-full max-w-md py-5 rounded-2xl bg-white text-black font-medium uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/90 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    Elegir Prenda <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {step === 'GARMENT' && (
                <motion.div
                  key="step-garment"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col h-full"
                >
                  <div className="flex items-center mb-10">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden mr-6 shrink-0 border border-white/20">
                      <img src={userPreview!} alt="User" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setStep('UPLOAD')}
                        className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <span className="text-[10px] uppercase tracking-widest text-white">Cambiar</span>
                      </button>
                    </div>
                    <div>
                      <h2 className="text-3xl md:text-4xl font-serif font-light mb-2">
                        <Typewriter text="Elegí tu prenda" delay={0.03} />
                      </h2>
                      <p className="text-white/50 text-sm md:text-base font-light">
                        Seleccioná una prenda del catálogo para probar
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                    {SHOP_ITEMS.map((item, idx) => (
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.4 }}
                        key={item.id}
                        onClick={() => setSelectedGarment(item)}
                        className={cn(
                          "relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all duration-300 text-left group",
                          selectedGarment?.id === item.id
                            ? "border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.15)] scale-[1.02]"
                            : "border-white/10 hover:border-white/30"
                        )}
                      >
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

                        <div className="absolute inset-0 p-4 flex flex-col justify-end">
                          <h3 className="font-serif text-sm md:text-base mb-1 text-white tracking-wide">{item.name}</h3>
                          <p className="text-xs font-light text-white/70">{item.price}</p>
                        </div>

                        {selectedGarment?.id === item.id && (
                          <div className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-auto flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerate}
                      disabled={!selectedGarment}
                      className="px-10 py-4 rounded-2xl bg-[#D4B895] text-black font-medium uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-[#E5C9A6] flex items-center gap-3 shadow-[0_0_30px_rgba(212,184,149,0.2)]"
                    >
                      <Sparkles className="w-5 h-5" /> Probar Prenda
                    </motion.button>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-6 p-4 rounded-xl bg-primary/8 border border-primary/20 text-foreground text-sm text-center flex items-center justify-center gap-3"
                    >
                      <span className="text-xl flex-shrink-0">
                        {error?.includes("pedida") ? "⏳" : error?.includes("conexión") ? "📡" : "✨"}
                      </span>
                      <span className="text-muted-foreground">{error}</span>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {step === 'GENERATING' && (
                <motion.div
                  key="step-generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-2xl z-20"
                >
                  <div className="relative w-24 h-24 mb-8">
                    <div className="absolute inset-0 border-t-2 border-[#D4B895]/50 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="absolute inset-2 border-r-2 border-[#D4B895]/80 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                    <div className="absolute inset-4 border-b-2 border-[#D4B895] rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
                  </div>
                  <div className="h-8 mb-2">
                    <Typewriter
                      text={progressText}
                      delay={0.02}
                      className="text-white uppercase tracking-[0.2em] text-sm md:text-base font-light"
                    />
                  </div>
                  <p className="text-white/40 text-xs font-light tracking-widest">Ajustando la prenda a tu medida...</p>
                </motion.div>
              )}

              {step === 'RESULTS' && (
                <motion.div
                  key="step-results"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col h-full items-center"
                >
                  <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl mb-10">
                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 mb-4">
                        <img src={userPreview!} alt="Tu foto" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-xs uppercase tracking-widest text-white/50">Tu foto</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center">
                      <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.1)] mb-4 relative">
                        <img src={resultImage!} alt="Resultado" className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10">
                          <span className="text-[10px] uppercase tracking-widest text-white">Resultado</span>
                        </div>
                      </div>
                      <span className="text-xs uppercase tracking-widest text-white/50">Con {selectedGarment?.name}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-4 mb-8">
                    <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                      WhatsApp
                    </button>
                    <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                      Instagram
                    </button>
                    <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
                      Compartir
                    </button>
                    <button
                      onClick={() => saveToCollection(resultImage!)}
                      className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4" /> Guardar
                    </button>
                  </div>

                  <div className="w-full max-w-4xl p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-8">
                    <p className="text-white/60 text-xs text-center leading-relaxed">
                      <span className="text-yellow-500 mr-2">⚠</span>
                      Esta es una aproximación generada por IA. Los colores, ajuste y caída real pueden variar. Para mejores resultados, visitá nuestro local o contactanos por WhatsApp.
                    </p>
                  </div>

                  <div className="flex gap-4 w-full max-w-4xl">
                    <button
                      onClick={() => {
                        setStep('GARMENT');
                        setSelectedGarment(null);
                        setResultImage(null);
                      }}
                      className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-white text-sm uppercase tracking-widest transition-colors"
                    >
                      Probar otra prenda
                    </button>
                    <button
                      onClick={() => {
                        setStep('UPLOAD');
                        setUserFile(null);
                        setUserPreview(null);
                        setSelectedGarment(null);
                        setResultImage(null);
                      }}
                      className="flex-1 py-4 rounded-xl bg-[#D4B895] hover:bg-[#E5C9A6] text-black font-medium text-sm uppercase tracking-widest transition-colors"
                    >
                      Nueva foto
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
