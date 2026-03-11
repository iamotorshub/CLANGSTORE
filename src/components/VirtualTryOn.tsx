import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageUpload } from './ImageUpload';
import { fileToBase64, cn } from '@/lib/utils';
import { withGeminiRotation } from '@/lib/geminiRotation';
import { Sparkles, Download, ArrowRight, ChevronLeft, Check } from 'lucide-react';
import { Typewriter } from './Typewriter';

import prod1 from '@/assets/products/camisa-loreana.webp';
import prod2 from '@/assets/products/jean-oxid.jpg';
import prod3 from '@/assets/products/vestido-gime.webp';
import prod4 from '@/assets/products/short-kendal.webp';

const PRESET_GARMENTS = [
  { id: 'prod1', name: 'Camisa Loreana', image: prod1 },
  { id: 'prod2', name: 'Jean Oxid', image: prod2 },
  { id: 'prod3', name: 'Vestido Gime', image: prod3 },
  { id: 'prod4', name: 'Short Kendal', image: prod4 },
];

const FALLBACK_MUSES = [
  { id: 'MIA', name: 'Mia', description: 'Rock chic, edgy, modern, Argentina', defaultImage: '' },
  { id: 'MARTINA', name: 'Martina', description: 'Classic beauty, long straight hair, elegant, Argentina', defaultImage: '' },
  { id: 'LOLA', name: 'Lola', description: 'Trendy, expressive, dark hair, urban, Argentina', defaultImage: '' },
  { id: 'SOFIA', name: 'Sofia', description: 'Boho chic, wavy hair, soft features, Argentina', defaultImage: '' },
  { id: 'VALENTINA', name: 'Valentina', description: 'Luxury boss, sharp features, sleek, Argentina', defaultImage: '' },
];

const LOCATIONS = [
  { id: 'loc1', name: 'Minimalist White Studio', prompt: 'in a minimalist white studio with soft diffused lighting' },
  { id: 'loc2', name: 'Paris Street', prompt: 'on a cobblestone Paris street walking, cinematic lighting' },
  { id: 'loc3', name: 'Milan Runway', prompt: 'walking down a high fashion runway in Milan' },
  { id: 'loc4', name: 'Night Event', prompt: 'at a luxurious night event with cinematic neon lighting and bokeh' },
  { id: 'loc5', name: 'Desert Dunes', prompt: 'in a bright majestic desert dune landscape at sunset' },
  { id: 'loc6', name: 'Nature/Resort', prompt: 'at a high-end nature resort with lush greenery and natural sunlight' },
  { id: 'loc7', name: 'Nordic Cabin', prompt: 'in a cozy luxury nordic cabin with natural soft window light' },
  { id: 'loc8', name: 'Cyberpunk City', prompt: 'in a neon-lit futuristic cyberpunk Tokyo alley' },
  { id: 'loc9', name: 'Santorini Coast', prompt: 'on a sun-drenched white terrace in Santorini with blue sea background' },
  { id: 'loc10', name: 'Vintage Cafe', prompt: 'sitting elegantly in a vintage Italian cafe during morning light' },
  { id: 'loc11', name: 'Brutalist Architecture', prompt: 'standing confidently against dramatic brutalist concrete architecture' },
  { id: 'loc12', name: 'Yacht Deck', prompt: 'relaxing on the deck of a luxury yacht in the Mediterranean' },
];

type Step = 'GARMENT' | 'MODEL' | 'GENERATING' | 'RESULTS';

export function VirtualTryOn() {
  const [step, setStep] = useState<Step>('GARMENT');

  const [garmentFile, setGarmentFile] = useState<File | null>(null);
  const [garmentPreview, setGarmentPreview] = useState<string | null>(null);

  const [muses, setMuses] = useState(FALLBACK_MUSES);
  const [selectedMuse, setSelectedMuse] = useState<typeof FALLBACK_MUSES[0] | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [results, setResults] = useState<{ location: string, url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [progressText, setProgressText] = useState<string>('');
  const [imageCount, setImageCount] = useState<number>(4);

  // Store photos mapped by muse ID
  const [musePhotos, setMusePhotos] = useState<Record<string, string[]>>({});

  useEffect(() => {
    // 1. Get all images from the specific model directories
    const modules = import.meta.glob('@/assets/models/*/*.{png,jpg,jpeg}', { eager: true, query: '?url', import: 'default' });

    // 2. Group them by folder name (which corresponds to model ID)
    const groupedPhotos: Record<string, string[]> = {
      MIA: [],
      MARTINA: [],
      LOLA: [],
      SOFIA: [],
      VALENTINA: []
    };

    for (const path in modules) {
      const url = modules[path] as string;
      const folderNameMatch = path.match(/models\/([^/]+)\//);
      if (folderNameMatch && folderNameMatch[1]) {
        const museId = folderNameMatch[1].toUpperCase();
        if (groupedPhotos[museId]) {
          groupedPhotos[museId].push(url);
        }
      }
    }

    setMusePhotos(groupedPhotos);

    // Set default images for fallbacks from the loaded group
    setMuses(prev => prev.map(m => ({
      ...m,
      defaultImage: groupedPhotos[m.id]?.[0] || ''
    })));
  }, []);

  const handleGarmentUpload = (file: File) => {
    setGarmentFile(file);
    setGarmentPreview(URL.createObjectURL(file));
  };

  const handlePresetGarment = async (imageUrl: string, name: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], `${name}.jpg`, { type: blob.type });
      setGarmentFile(file);
      setGarmentPreview(imageUrl);
    } catch (error) {
      console.error("Error loading preset garment:", error);
    }
  };

  const uploadToSupabase = async (file: File, bucket: string, path: string) => {
    if (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === 'YOUR_SUPABASE_URL') {
      console.warn('Supabase not configured, skipping upload');
      return 'mock_url';
    }

    try {
      const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
      if (error) {
        console.warn("Supabase upload error:", error.message);
        return 'mock_url'; // Fallback to let the generation continue
      }
      const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(path);
      return publicUrlData.publicUrl;
    } catch (e) {
      console.warn("Exception during Supabase upload:", e);
      return 'mock_url';
    }
  };

  const handleGenerate = async () => {
    if (!garmentFile || !selectedMuse || !selectedPhoto) return;

    setStep('GENERATING');
    setIsGenerating(true);
    setError(null);
    setResults([]);

    try {
      setProgressText('Analizando la prenda...');
      const garmentBase64 = await fileToBase64(garmentFile);

      setProgressText('Cargando foto de la modelo...');
      let modelBase64 = "";
      let modelMimeType = "image/jpeg";
      try {
        const res = await fetch(selectedPhoto);
        const blob = await res.blob();
        modelMimeType = blob.type;
        modelBase64 = await fileToBase64(new File([blob], "model.jpg", { type: blob.type }));
      } catch (e) {
        console.warn("No se pudo cargar la foto de la modelo", e);
      }

      const studioLocation = LOCATIONS.find(l => l.name === 'Minimalist White Studio') || LOCATIONS[0];
      const otherLocations = LOCATIONS.filter(l => l.name !== 'Minimalist White Studio');
      const shuffledOtherLocations = [...otherLocations].sort(() => 0.5 - Math.random());
      const selectedLocations = [studioLocation];
      for (let i = 0; i < imageCount - 1; i++) {
        if (shuffledOtherLocations[i]) selectedLocations.push(shuffledOtherLocations[i]);
      }

      const generatedImages: { location: string, url: string }[] = [];

      for (let i = 0; i < selectedLocations.length; i++) {
        const loc = selectedLocations[i];
        setProgressText(`Sintetizando Look ${i + 1}/${selectedLocations.length}: ${loc.name}...`);

        const prompt = `Generate a hyper-realistic fashion editorial photo of a model wearing Reference Image 1 (The Garment).
        The identity and face of the model MUST perfectly match Reference Image 2 (Base Photo).
        Model description: ${selectedMuse.description}.
        Setting: ${loc.prompt}.
        CRITICAL INSTRUCTION: The pose MUST BE completely different from a standard straight-on photo. Generate a unique, highly dynamic, and editorial fashion pose.
        Optics: Canon EOS R5, 85mm f/1.4 lens. Natural drape, subtle skin pores, 35mm film grain.
        NO plastic skin, NO 3D render, NO floating elements.`;

        const parts: Array<{ text: string } | { inlineData: { data: string; mimeType: string } }> = [
          { text: "Reference Image 1 (Garment):" },
          { inlineData: { data: garmentBase64, mimeType: garmentFile.type } }
        ];
        if (modelBase64) {
          parts.push({ text: "Reference Image 2 (Base Photo of Model):" });
          parts.push({ inlineData: { data: modelBase64, mimeType: modelMimeType } });
        }
        parts.push({ text: prompt });

        const response = await withGeminiRotation(async (client) =>
          client.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: { responseModalities: ['IMAGE', 'TEXT'] } as any,
          })
        );

        let generatedBase64 = null;
        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if ((part as any).inlineData) {
            generatedBase64 = (part as any).inlineData.data;
            break;
          }
        }

        if (generatedBase64) {
          generatedImages.push({ location: loc.name, url: `data:image/jpeg;base64,${generatedBase64}` });
        } else {
          // Fallback: Pollinations con descripción textual
          const seed = Math.floor(Math.random() * 999999);
          const fallbackPrompt = encodeURIComponent(`High fashion editorial photography, ${selectedMuse.description} model, ${loc.prompt}, dynamic editorial pose, Canon 85mm, film grain`);
          generatedImages.push({ location: loc.name, url: `https://image.pollinations.ai/prompt/${fallbackPrompt}?width=768&height=1024&seed=${seed}&model=flux&nologo=true` });
        }
      }

      if (generatedImages.length > 0) {
        setResults(generatedImages);
        setStep('RESULTS');

      } else {
        throw new Error("Failed to generate lookbook images.");
      }

    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : "An error occurred during generation.";
      setError(errorMessage);
      setStep('MODEL'); // Go back on error
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 font-sans">
      <div className="text-center mb-16 flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-display uppercase tracking-[0.2em] mb-4 text-white">CLANGSTORE</h1>
        <p className="text-white/60 tracking-[0.3em] uppercase text-xs md:text-sm font-light">Luxury AI Fashion Stylist • Lookbook Edition</p>
      </div>

      <div className="relative min-h-[700px] rounded-[2rem] glass-panel overflow-hidden p-8 md:p-12 shadow-2xl">
        <AnimatePresence mode="wait">
          {step === 'GARMENT' && (
            <motion.div
              key="step-garment"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center w-full max-w-4xl mx-auto"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-serif font-light mb-4">
                  <Typewriter text="Step 01: The Garment" delay={0.03} />
                </h2>
                <motion.p
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  className="text-white/50 text-sm md:text-base font-light"
                >
                  Sube tu prenda o elegí una de nuestro Shop.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 w-full mb-12">
                {/* Upload Section */}
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 mb-6 font-medium">Sube tu Imagen</h3>
                  <ImageUpload
                    label=""
                    image={garmentPreview && !PRESET_GARMENTS.find(p => p.image === garmentPreview) ? garmentPreview : null}
                    onUpload={handleGarmentUpload}
                    onClear={() => {
                      setGarmentFile(null);
                      setGarmentPreview(null);
                    }}
                    className="w-full max-w-sm"
                  />
                </div>

                {/* Preset Garments */}
                <div className="flex flex-col items-center w-full">
                  <h3 className="text-xs uppercase tracking-[0.2em] text-white/50 mb-6 font-medium">Desde el Shop</h3>
                  <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    {PRESET_GARMENTS.map(prod => (
                      <button
                        key={prod.id}
                        onClick={() => handlePresetGarment(prod.image, prod.name)}
                        className={cn(
                          "relative aspect-[3/4] rounded-2xl overflow-hidden border transition-all text-left group glass-panel-hover",
                          garmentPreview === prod.image ? "border-white ring-2 ring-white/50" : "border-white/10"
                        )}
                      >
                        <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                          <span className="text-xs font-medium text-white/90 leading-tight">{prod.name}</span>
                        </div>
                        {garmentPreview === prod.image && (
                          <motion.div
                            initial={{ scale: 0 }} animate={{ scale: 1 }}
                            className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg"
                          >
                            <Check className="w-4 h-4 text-black" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('MODEL')}
                disabled={!garmentFile}
                className="w-full max-w-md py-5 rounded-2xl bg-white text-black font-medium uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/90 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                Continue to Model Selection <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 'MODEL' && (
            <motion.div
              key="step-model"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <div className="flex items-center mb-10">
                <button onClick={() => setStep('GARMENT')} className="p-3 hover:bg-white/10 rounded-full transition-colors mr-4">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-light mb-2">
                    <Typewriter text="Step 02: The Muse" delay={0.03} />
                  </h2>
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                    className="text-white/50 text-sm md:text-base font-light"
                  >
                    Select a digital model for your Lookbook.
                  </motion.p>
                </div>
              </div>

              {!selectedMuse ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
                  {muses.map((muse, idx) => (
                    <motion.button
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      key={muse.id}
                      onClick={() => setSelectedMuse(muse)}
                      className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/10 transition-all text-left group glass-panel-hover"
                    >
                      {muse.defaultImage ? (
                        <img src={muse.defaultImage} alt={muse.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      ) : (
                        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/30 text-xs">No Photos</div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent p-4 flex flex-col justify-end">
                        <span className="font-serif text-xl mb-1">{muse.name}</span>
                        <span className="text-xs text-white/50">{musePhotos[muse.id]?.length || 0} photos</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedMuse(null);
                          setSelectedPhoto(null);
                        }}
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        ← Back to Models
                      </button>
                      <h3 className="text-xl font-serif">{selectedMuse.name}</h3>
                    </div>
                  </div>

                  <p className="text-sm text-white/50 mb-6">Select a base photo of {selectedMuse.name} to apply the garment to.</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 overflow-y-auto max-h-[400px] mb-8 pr-2">
                    {(musePhotos[selectedMuse.id] || []).map((photoUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhoto(photoUrl)}
                        className={cn(
                          "relative aspect-[3/4] rounded-xl overflow-hidden border transition-all text-left",
                          selectedPhoto === photoUrl ? "ring-2 ring-white border-transparent" : "border-white/10 opacity-70 hover:opacity-100"
                        )}
                      >
                        <img src={photoUrl} className="w-full h-full object-cover" />
                        {selectedPhoto === photoUrl && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-4 h-4 text-black" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="mt-auto flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-white/10 gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-white/70 uppercase tracking-widest">Fotos a generar:</span>
                      <select
                        value={imageCount}
                        onChange={(e) => setImageCount(Number(e.target.value))}
                        className="bg-black/50 border border-white/20 text-white rounded-lg px-3 py-2 outline-none focus:border-white transition-colors"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGenerate}
                      disabled={!selectedPhoto}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-black font-medium uppercase tracking-[0.2em] text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:bg-white/90 flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      <Sparkles className="w-4 h-4" /> Generate Lookbook
                    </motion.button>
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center"
                >
                  {error}
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
                <div className="absolute inset-0 border-t-2 border-white/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
                <div className="absolute inset-2 border-r-2 border-white/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
                <div className="absolute inset-4 border-b-2 border-white rounded-full animate-spin" style={{ animationDuration: '1s' }}></div>
              </div>
              <div className="h-8 mb-2">
                <Typewriter
                  text={progressText}
                  delay={0.02}
                  className="text-white uppercase tracking-[0.2em] text-sm md:text-base font-light"
                />
              </div>
              <p className="text-white/40 text-xs font-light tracking-widest">Crafting your editorial lookbook...</p>
            </motion.div>
          )}

          {step === 'RESULTS' && (
            <motion.div
              key="step-results"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col h-full"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
                <div>
                  <h2 className="text-3xl md:text-4xl font-serif font-light mb-2">
                    <Typewriter text="The Lookbook" delay={0.05} />
                  </h2>
                  <motion.p
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                    className="text-white/50 text-sm md:text-base font-light"
                  >
                    Generated with {selectedMuse?.name}
                  </motion.p>
                </div>
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setStep('GARMENT');
                    setGarmentFile(null);
                    setGarmentPreview(null);
                    setSelectedMuse(null);
                    setResults([]);
                  }}
                  className="px-8 py-3 rounded-full border border-white/20 hover:bg-white hover:text-black transition-all text-sm uppercase tracking-[0.2em] font-medium"
                >
                  Start Over
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {results.map((res, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 + (idx * 0.2) }}
                    key={idx}
                    className="relative aspect-[4/5] rounded-3xl overflow-hidden group glass-panel"
                  >
                    <img src={res.url} alt={res.location} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70 mb-2 font-light">Location 0{idx + 1}</p>
                      <p className="text-2xl font-serif text-white mb-6">{res.location}</p>
                      <div className="flex gap-3">
                        <a
                          href={res.url}
                          download={`clangstore-${res.location.toLowerCase().replace(/\s+/g, '-')}.jpg`}
                          className="flex items-center justify-center gap-2 w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-sm uppercase tracking-widest transition-colors font-medium border border-white/10"
                        >
                          <Download className="w-4 h-4" /> Download High-Res
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
