export interface TagCategory {
  id: string;
  label: string;
  icon: string;
  tags: Tag[];
}

export interface Tag {
  id: string;
  label: string;
  promptFragment: string;
}

export const tagCategories: TagCategory[] = [
  {
    id: "physique",
    label: "Físico",
    icon: "👤",
    tags: [
      { id: "blonde-tall", label: "Rubia 1.70m", promptFragment: "platinum blonde hair, tall slim build 170cm, light eyes" },
      { id: "brunette-curvy", label: "Morena curvy", promptFragment: "dark brown wavy hair, warm skin, curvy voluptuous body type" },
      { id: "redhead-tall", label: "Pelirroja alta", promptFragment: "red auburn hair, fair skin with freckles, tall lean build" },
      { id: "asian-features", label: "Rasgos asiáticos", promptFragment: "East Asian features, straight black hair, slim elegant build" },
      { id: "dark-athletic", label: "Piel oscura atlética", promptFragment: "dark skin, athletic toned body, short natural hair, strong features" },
    ],
  },
  {
    id: "style",
    label: "Estilo",
    icon: "✨",
    tags: [
      { id: "editorial-chic", label: "Editorial Chic", promptFragment: "editorial high fashion pose, sophisticated and elegant, Vogue aesthetic" },
      { id: "street-style", label: "Street Style", promptFragment: "urban street style, confident casual attitude, cool and relaxed" },
      { id: "grunge", label: "Grunge/Underground", promptFragment: "grunge underground aesthetic, edgy attitude, raw authentic vibe" },
      { id: "delicate-feminine", label: "Delicado/Femenino", promptFragment: "soft feminine aesthetic, delicate graceful poses, romantic dreamy mood" },
      { id: "minimal-clean", label: "Minimal Clean", promptFragment: "minimalist clean aesthetic, neutral expression, understated elegance" },
    ],
  },
  {
    id: "age",
    label: "Edad",
    icon: "🎂",
    tags: [
      { id: "20-25", label: "20-25 años", promptFragment: "young woman age 20-25, youthful fresh appearance" },
      { id: "26-30", label: "26-30 años", promptFragment: "woman age 26-30, mature confident presence" },
      { id: "30-35", label: "30-35 años", promptFragment: "woman age 30-35, sophisticated refined look" },
    ],
  },
];

import studioWhite from "@/assets/ai-results/studio-white.jpg";
import urbanBa from "@/assets/ai-results/urban-ba.jpg";
import lifestyle from "@/assets/ai-results/lifestyle.jpg";
import closeup from "@/assets/ai-results/closeup.jpg";

export const studioLocations = [
  {
    id: "studio-white",
    label: "Estudio Blanco",
    icon: "◻️",
    image: studioWhite,
    prompt: "clean white photography studio, professional softbox lighting, infinite white cyclorama background",
  },
  {
    id: "callejon-urbano",
    label: "Callejón Urbano",
    icon: "🏙️",
    image: urbanBa,
    prompt: "gritty urban alleyway, brick walls with street art, moody dramatic lighting, cinematic shadows, raw urban atmosphere",
  },
  {
    id: "balcon-parisino",
    label: "Balcón Parisino",
    icon: "🗼",
    image: lifestyle,
    prompt: "elegant Parisian balcony with wrought iron railings, Haussmann building facade, soft morning light, romantic Paris rooftops in background",
  },
  {
    id: "loft-industrial",
    label: "Loft Industrial",
    icon: "🏭",
    image: closeup,
    prompt: "industrial loft space with exposed brick, steel beams, large factory windows, warm natural light streaming in, concrete floors",
  },
];

export const cameraAngles = [
  { id: "general", label: "Plano General", prompt: "full body shot, wide angle, showing complete outfit head to toe" },
  { id: "detalle", label: "Plano Detalle", prompt: "medium close-up shot, focusing on garment details, fabric texture, and fit from waist up" },
  { id: "contrapicado", label: "Contrapicado", prompt: "low angle shot looking up, dramatic perspective, powerful and commanding presence" },
  { id: "cenital", label: "Cenital", prompt: "slightly elevated overhead angle, three-quarter view from above, elegant perspective" },
];

export const campaignCombos = [
  {
    outfit: "Falda de cuero negra + botas altas",
    location: "Noche en París",
    prompt: "wearing the garment paired with a black leather mini skirt and knee-high boots, nighttime Paris streets with Eiffel Tower lights in bokeh background, dramatic warm streetlight",
  },
  {
    outfit: "Pantalón sastre beige + stilettos",
    location: "Museo de Arte Moderno",
    prompt: "wearing the garment paired with tailored beige trousers and stiletto heels, inside a modern art museum gallery, white walls with contemporary art, natural skylight illumination",
  },
  {
    outfit: "Jean wide-leg + zapatillas blancas",
    location: "Café en Buenos Aires",
    prompt: "wearing the garment paired with wide-leg denim jeans and white sneakers, sitting at a Buenos Aires sidewalk café, warm golden hour sunlight, marble table with espresso",
  },
  {
    outfit: "Vestido midi + sandalias doradas",
    location: "Playa al atardecer",
    prompt: "wearing the garment as a layering piece over a midi dress with golden sandals, Mediterranean beach at sunset, warm orange and pink sky, gentle waves",
  },
];
