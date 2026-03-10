# CLANGSTORE v3 — Editorial Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the homepage into a Vogue/Gucci editorial magazine-commerce experience with a video hero, editorial product grid, and update the Desktop sales materials to USD pricing.

**Architecture:** Three independent feature areas — (1) HeroCarousel gets video slide support by extending the Slide interface and rendering a `<video>` element in the background layer; (2) a new EditorialProductGrid component replaces the standard 4-col grid in the "Destacados" section of Index.tsx; (3) six static HTML files in the Desktop folder get rewritten with USD pricing, 4-step speech framework, and ROI argument.

**Tech Stack:** React 18, TypeScript, Framer Motion, Tailwind CSS, Vite — NO new dependencies needed.

---

## Pre-Flight Checklist

Before starting, confirm you are in the worktree:
```bash
pwd
# expected: /Users/francolarrarte/CLANGSTORE/.claude/worktrees/sharp-sutherland
git branch
# expected: * claude/sharp-sutherland
```

---

## Task 1: Copy Video Asset to public/

The hero video is 26MB — too large to bundle with Vite imports. Use `public/` so it's served directly without hashing/processing.

**Files:**
- Create: `public/video/hero-models-walking.mp4` (copy from Downloads)

**Step 1: Create the directory and copy the file**
```bash
mkdir -p public/video
cp "/Users/francolarrarte/Downloads/CLANG STORE/Models_walking_towards_camera_delpmaspu_.mp4" \
   public/video/hero-models-walking.mp4
```

**Step 2: Verify the file is in place**
```bash
ls -lh public/video/hero-models-walking.mp4
# expected: -rw-r--r--  1 ...  26M ... public/video/hero-models-walking.mp4
```

In Vite, files in `public/` are served at the root path. Reference the video in code as `"/video/hero-models-walking.mp4"` (no import needed).

**Step 3: Commit**
```bash
git add public/video/hero-models-walking.mp4
git commit -m "feat: add hero video asset to public/video"
```

---

## Task 2: Update HeroCarousel — Add Video Slide Support

**Files:**
- Modify: `src/components/HeroCarousel.tsx` (full rewrite of interface + slides + background layer)

**Current state:** The Slide interface has `image?: string`. The background layer renders `<motion.img>` only.

**What changes:**
- `Slide` interface: add `video?: string` and `fallbackImage?: string`
- Background layer: `if (slide.video)` → render `<video>`, else → render `<motion.img>` (Ken Burns)
- `HERO_SLIDES`: reduce from 6 slides to 3 focused editorial slides
- Video slide timer: 8s instead of 6s (video needs more time to breathe)
- `progressKey` timer: sync with current slide's duration

**Step 1: Read the current file first (required before edit)**
```bash
cat src/components/HeroCarousel.tsx
```

**Step 2: Replace the Slide interface and HERO_SLIDES constant**

Find and replace the entire block from line 10 to line 68:

```typescript
interface Slide {
  image?: string;
  video?: string;
  fallbackImage?: string;   // shown if video fails or on mobile
  title: string;
  subtitle: string;
  cta: string;
  link: string;
  tag?: string;
  duration?: number;        // auto-advance ms, default 6000
}

import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2-clean.png";
// (these imports already exist at lines 4-8 — no change needed)

const HERO_SLIDES: Slide[] = [
  {
    image: hero1,
    title: "Nueva Temporada",
    subtitle: "PRENDAS QUE HABLAN POR VOS",
    cta: "Ver Colección",
    link: "/productos",
    tag: "Editorial",
    duration: 7000,
  },
  {
    video: "/video/hero-models-walking.mp4",
    fallbackImage: hero1,
    title: "AI Lookbook",
    subtitle: "21 PIEZAS. INFINITAS FORMAS DE USARLAS.",
    cta: "Explorar",
    link: "/productos",
    tag: "Studio",
    duration: 9000,
  },
  {
    image: hero2,
    title: "Editorial",
    subtitle: "FOTOGRAFÍA QUE ELEVA LA MARCA",
    cta: "Ver Todo",
    link: "/productos",
    tag: "Fashion",
    duration: 7000,
  },
];
```

**Step 3: Update the useEffect timer to use slide duration**

Replace the `useEffect` at line 102:
```typescript
useEffect(() => {
  const duration = HERO_SLIDES[current].duration ?? 6000;
  const timer = setTimeout(() => {
    setCurrent((prev) => (prev + 1) % total);
    setProgressKey((k) => k + 1);
  }, duration);
  return () => clearTimeout(timer);
}, [current, total]);
```

**Step 4: Update the background rendering layer**

Replace the block that renders `{slide.image && <motion.img ...>}` with:

```tsx
{/* Background: video or Ken-Burns image */}
{slide.video ? (
  <>
    <video
      key={slide.video}
      autoPlay
      muted
      loop
      playsInline
      className="w-full h-full object-cover"
      poster={slide.fallbackImage}
    >
      <source src={slide.video} type="video/mp4" />
      {/* Fallback for browsers that can't play video */}
      {slide.fallbackImage && (
        <img src={slide.fallbackImage} alt={slide.title} className="w-full h-full object-cover" />
      )}
    </video>
  </>
) : slide.image ? (
  <motion.img
    src={slide.image}
    alt={slide.title}
    initial={{ scale: 1.0 }}
    animate={{ scale: 1.08 }}
    transition={{ duration: 7.5, ease: "linear" }}
    className="w-full h-full object-cover"
  />
) : null}
```

**Step 5: Update progress bar duration to match slide**

The progress bar `transition={{ duration: 6, ease: "linear" }}` must sync with slide duration.

Replace the `<motion.div>` progress bar with:
```tsx
<motion.div
  key={progressKey}
  initial={{ width: "0%" }}
  animate={{ width: "100%" }}
  transition={{ duration: (HERO_SLIDES[current].duration ?? 6000) / 1000, ease: "linear" }}
  className="h-full bg-primary"
/>
```

**Step 6: Remove unused imports**

Remove these imports (they were used by old slides, no longer needed):
```typescript
// DELETE these lines:
import hero4 from "@/assets/hero-4.jpg";
import hero5 from "@/assets/hero-5.jpg";
import heroPromo from "@/assets/hero-promo-photoshoot-v3.png";
```

**Step 7: Start the dev server and visually verify**
```bash
npm run dev
# open http://localhost:8080
```

Expected:
- Hero auto-advances through 3 slides
- Slide 2 shows video playing in background
- On slide 2, progress bar runs for 9 seconds instead of 6/7
- No console errors about missing files
- Video slide still shows text overlay and CTA button

**Step 8: Commit**
```bash
git add src/components/HeroCarousel.tsx
git commit -m "feat: video hero slide support, 3 editorial slides"
```

---

## Task 3: Create EditorialProductGrid Component

This new component replaces the uniform 4-col grid in the "Destacados" section. Layout: featured product at 60% width, 2 stacked products at 40%, then 3-col grid for remaining products.

**Files:**
- Create: `src/components/EditorialProductGrid.tsx`

**Step 1: Create the file**

```tsx
// src/components/EditorialProductGrid.tsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";

interface EditorialProductGridProps {
  products: Product[];
  title?: string;
  label?: string;
}

export default function EditorialProductGrid({
  products,
  title = "Destacados",
  label = "Selección",
}: EditorialProductGridProps) {
  const { addItem } = useCart();

  if (!products.length) return null;

  // First 3 form the hero row, rest go in the standard grid
  const [featured, second, third, ...rest] = products;

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <p className="font-body text-[10px] tracking-[0.35em] uppercase text-primary mb-2">{label}</p>
            <h2 className="font-display text-3xl lg:text-4xl text-foreground">{title}</h2>
          </div>
          <Link
            to="/productos"
            className="font-body text-[10px] tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors border-b border-muted-foreground/20 hover:border-primary pb-0.5"
          >
            Ver todo →
          </Link>
        </motion.div>

        {/* Hero row: featured (60%) + 2 stacked (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 mb-5">
          {/* Featured — 3 cols */}
          {featured && (
            <EditorialCard product={featured} colSpan="lg:col-span-3" index={0} isLarge onAdd={() => addItem(featured)} />
          )}

          {/* Two stacked — 2 cols */}
          <div className="lg:col-span-2 grid grid-cols-2 lg:grid-cols-1 gap-4 lg:gap-5">
            {second && <EditorialCard product={second} index={1} onAdd={() => addItem(second)} />}
            {third && <EditorialCard product={third} index={2} onAdd={() => addItem(third)} />}
          </div>
        </div>

        {/* Rest of products — 3-col grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {rest.map((product, i) => (
              <EditorialCard
                key={product.id}
                product={product}
                index={i + 3}
                editorialNumber={String(i + 4).padStart(2, "0")}
                onAdd={() => addItem(product)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── Internal card component ───────────────────────────────────────────────

interface EditorialCardProps {
  product: Product;
  index: number;
  isLarge?: boolean;
  colSpan?: string;
  editorialNumber?: string;
  onAdd: () => void;
}

function EditorialCard({ product, index, isLarge, editorialNumber, onAdd }: EditorialCardProps) {
  const aspectClass = isLarge ? "aspect-[3/4] lg:aspect-[4/5]" : "aspect-[3/4]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative"
    >
      <Link to={`/producto/${product.slug}`} className="block">
        {/* Image container */}
        <div className={`relative ${aspectClass} overflow-hidden bg-secondary`}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            loading="lazy"
          />

          {/* Bottom gradient overlay — always visible */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/75 to-transparent" />

          {/* Always-visible product info at bottom */}
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="font-body text-[10px] tracking-[0.25em] uppercase text-white/70 mb-1">
              {product.name}
            </p>
            <p className="font-body text-sm text-primary font-medium">
              {formatPrice(product.price)}
            </p>
          </div>

          {/* Editorial number — top right */}
          {editorialNumber && (
            <p className="absolute top-3 right-3 font-display italic text-2xl text-white/15 leading-none select-none">
              {editorialNumber}
            </p>
          )}

          {/* New badge */}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-primary text-primary-foreground font-body text-[9px] tracking-[0.25em] uppercase px-2 py-1">
              Nuevo
            </span>
          )}

          {/* Discount badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm text-foreground font-body text-[9px] tracking-[0.2em] uppercase px-2 py-1">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}

          {/* Add to cart — slides up on hover */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-out">
            <button
              onClick={(e) => { e.preventDefault(); onAdd(); }}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-body text-[10px] tracking-[0.3em] uppercase py-3 hover:bg-primary/90 transition-colors"
            >
              <ShoppingBag size={12} />
              Agregar
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
```

**Step 2: Verify the file saved correctly**
```bash
cat src/components/EditorialProductGrid.tsx | head -20
# expected: import { motion } from "framer-motion";...
```

**Step 3: Commit**
```bash
git add src/components/EditorialProductGrid.tsx
git commit -m "feat: EditorialProductGrid component — Enfoque C editorial layout"
```

---

## Task 4: Integrate EditorialProductGrid into Index.tsx

**Files:**
- Modify: `src/pages/Index.tsx`

**Step 1: Add the import at the top of Index.tsx**

After line 4 (`import AIStudioTeaser from ...`), add:
```typescript
import EditorialProductGrid from "@/components/EditorialProductGrid";
```

**Step 2: Replace the "Destacados" section (section 6)**

Find this block (around lines 129–140):
```tsx
{/* 6. Destacados */}
{featured.length > 0 && (
  <section className="py-20 lg:py-28">
    <div className="container mx-auto px-4 lg:px-8">
      <SectionHeader label="Selección" title="Productos Destacados" linkTo="/productos" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {featured.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} />
        ))}
      </div>
    </div>
  </section>
)}
```

Replace it with:
```tsx
{/* 6. Editorial Destacados */}
{featured.length > 0 && (
  <EditorialProductGrid
    products={featured}
    title="Productos Destacados"
    label="Selección"
  />
)}
```

**Step 3: Check in browser**

With the dev server running at http://localhost:8080, scroll to "Selección / Productos Destacados".

Expected:
- First row: large card (60%) + 2 stacked cards (40%)
- Remaining products in 3-col grid
- Product names and prices visible on cards at all times (no hover needed)
- Editorial numbers (`04`, `05`...) visible in top-right of grid cards
- "Agregar" button slides up from bottom on hover

**Step 4: Commit**
```bash
git add src/pages/Index.tsx
git commit -m "feat: replace standard grid with EditorialProductGrid on homepage"
```

---

## Task 5: Update Desktop Sales Materials — USD Pricing

**Files:**
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/💰 PRESUPUESTOS Y PLANES.html`
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/🎤 SPEECH DE VENTA — CLANGSTORE.html`
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/📄 PROPUESTA DE VENTA.html`
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/📧 EMAIL CAMPAIGN — CLANGSTORE.html`
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/🎯 PRESENTACIÓN DEL PROYECTO.html`
- Modify: `/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/🎨 BRAND CANVAS.html`

**NOTE:** These are standalone HTML files — no build process. Edit the HTML content directly. Preserve all CSS/styling, only update the content sections.

### Step 1: Read each file to find the pricing/content sections (before editing)

Read the relevant section of each file:
```bash
grep -n "precio\|price\|plan\|tier\|\$\|ARS\|299\|499\|799\|mensual\|setup" \
  "/Users/francolarrarte/Desktop/CLANGSTORE — Proyecto/💰 PRESUPUESTOS Y PLANES.html" | head -30
```

### Step 2: USD Pricing Table to use (for all files)

Use this data for all files:

```
TIER I — Web Store
  Setup: USD $800 (pago único)
  Mensual: $0 (solo hosting ~$15/mes por cuenta propia)
  Incluye: tienda online completa, catálogo 21 productos, carrito, WhatsApp
  Ideal para: empezar con presencia digital profesional

TIER II — Web + Asistente IA
  Setup: USD $1,100 (pago único)
  Mensual: USD $99/mes (facturado trimestralmente)
  Incluye: todo Tier I + chatbot LLM (asesor 24/7 vía web y WhatsApp)
  Ideal para: eliminar tiempo de atención manual

TIER III — Suite Completa + Modelos IA ★ RECOMENDADO
  Setup: USD $1,500 (pago único)
  Mensual: USD $149/mes (facturado trimestralmente)
  Incluye: todo Tier II + AI Studio (5 modelos de IA) + Probador Virtual
  Ideal para: reemplazar fotoshoots y escalar sin costos variables

CONDICIONES:
  - 50% al inicio, 50% al entregar
  - 2 meses de mantenimiento incluidos como regalo de lanzamiento
  - Renovación mensual sin contrato
  - Soporte prioritario en los primeros 90 días
```

### Step 3: ROI Argument (include in PRESUPUESTOS and PROPUESTA)

```
TU COSTO ACTUAL (mensual estimado):
  Fotógrafo profesional:           USD $400–500/mes
  Tiempo de gestión (16h × $20):   USD $320/mes
  Pérdidas por devoluciones (5%):  USD ~$200/mes
  TOTAL PHANTOM COST:              USD ~$530–1,020/mes

CON CLANGSTORE SUITE (Tier III):
  Costo mensual:                   USD $149/mes
  Break-even:                      Día 1
  ROI año 1:                       USD ~$4,500 ahorrados
```

### Step 4: Speech Framework (for SPEECH file)

```
EL SPEECH DE 4 PASOS:

1. DOLOR (abrir con la verdad):
"Cada vez que actualizás tu colección, ¿qué pasa?
Fotógrafo, $500, 3 días de espera, edición, subir todo.
Y mientras tanto, tu competencia ya publicó.
¿Cuántas horas le dedicás a eso por mes?"

2. AGITAR (hacer que duela un poco más):
"En Tienda Nube pagás comisión por cada venta más foto propia.
Acá eso se termina. Tu foto ES tu local.
Con IA generás las imágenes en minutos, sin fotógrafo, sin esperar.
Y no le pagás comisión a nadie."

3. SOLUCIÓN (mostrar el demo en vivo):
[Abrir CLANGSTORE en el celular]
"Mirá esto. Estas 21 prendas, estas fotos... son todas generadas con IA.
¿Ves la calidad? Podés tener esto para tu ropa en 48 horas.
Y el Probador Virtual — tu clienta se prueba la ropa antes de comprar,
la tasa de devolución cae a la mitad."

4. CIERRE CON ANCLA Y REGALO:
"Para vos especialmente, arrancaríamos con la Suite Completa.
El setup es USD $1,500, y el mantenimiento mensual USD $149.
Eso es menos de lo que gastás en UN fotógrafo por mes.
Y como es el lanzamiento, los primeros 2 meses de mantenimiento van de regalo.
Solo necesito que me des el OK esta semana porque tengo agenda limitada."

OBJECCIÓN: "¿Y si no funciona?"
→ "El sitio lo ves antes de pagar el segundo 50%.
Si no te gusta, no lo pagás. Sin letra chica."

OBJECCIÓN: "Es mucho dinero"
→ "Recordá que el fotógrafo solo te sale $500 por MES.
Esto es un pago único de $1,500 y después $149/mes.
En el segundo mes ya recuperaste la inversión."
```

### Step 5: Update each HTML file

For each of the 6 HTML files:
1. READ the full file
2. FIND the pricing/content section
3. REPLACE only the content (not the CSS/structure)
4. VERIFY the file opens correctly in browser

### Step 6: No git commit needed for Desktop files
Desktop HTML files are outside the git repo. Just save them.

---

## Task 6: Final Verification

**Step 1: Start dev server**
```bash
npm run dev
```

**Step 2: Visual checklist**
- [ ] Hero shows 3 slides with smooth transitions
- [ ] Slide 2 (video) plays the models walking video
- [ ] Progress bar syncs with each slide's duration
- [ ] Homepage editorial grid: featured card is large (left 60%), 2 stacked (right 40%)
- [ ] Product names/prices always visible on editorial cards
- [ ] "Agregar" button appears on card hover
- [ ] Editorial numbers visible on grid cards
- [ ] Filter by Jeans on /productos shows JEAN OXID + JEAN OFF WHITE
- [ ] Filter by Faldas shows FALDA CALIFORNIA

**Step 3: Mobile check**
```bash
# In browser, open DevTools → iPhone 14 Pro (390px)
```
- [ ] Hero video shows static fallback image on mobile (video is bandwidth-heavy)
- [ ] Editorial grid collapses to 2-col on mobile
- [ ] Featured card is full-width on mobile

**Step 4: Console check**
```bash
# In browser DevTools Console, look for errors
```
Expected: Zero errors, zero warnings about missing assets

**Step 5: Final commit**
```bash
git add -A
git status
git commit -m "$(cat <<'EOF'
feat: CLANGSTORE v3 — editorial redesign complete

- Video hero slide (models walking, 9s auto-advance)
- HeroCarousel: 3 focused editorial slides, per-slide duration
- EditorialProductGrid: Enfoque C layout (featured 60% + 2 stacked)
- Always-visible product info on editorial cards
- Editorial number overlays on grid cards

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

---

## Task 7: (Optional) Update Remaining Hero Slides Copy

The existing slide text uses English. If time permits, update `HERO_SLIDES` in `HeroCarousel.tsx` to use the final Spanish copy:

| Slide | Tag | Title | Subtitle |
|-------|-----|-------|---------|
| 1 | Editorial | "Nueva Temporada" | "PRENDAS QUE HABLAN POR VOS" |
| 2 | Studio | "AI Lookbook" | "21 PIEZAS. INFINITAS FORMAS DE USARLAS." |
| 3 | Fashion | "Editorial" | "FOTOGRAFÍA QUE ELEVA LA MARCA" |

Already included in Task 2, Step 2 above — this is a reminder to double-check the copy is correct.

---

## Notes for the Implementing Engineer

### About the video asset
The video file is referenced as `/video/hero-models-walking.mp4` (public folder path, not an import). If the video doesn't play in development, verify that `public/video/` directory exists and the file is there:
```bash
ls public/video/
```

### About mobile video
On mobile devices, `autoPlay` requires `muted` AND `playsInline` to work (both are set in the `<video>` tag). However, on very slow connections, the video may not buffer fast enough. The `poster` attribute on the `<video>` tag shows `fallbackImage` while the video loads — this is the graceful degradation path.

### About the EditorialProductGrid
The component destructures products as `[featured, second, third, ...rest]`. If `featured.length < 3`, some slots will be `undefined` and the component gracefully skips them (guarded by `{featured && ...}` and `{second && ...}`). The minimum to show the hero row is 1 product; minimum to show both columns is 3.

### About Desktop HTML files
These files are outside the git repository. They are standalone HTML/CSS/JS files. When editing, preserve all the existing `<style>` blocks and only modify the content inside `<section>` or `<div>` tags that contain the pricing/copy content. Do not remove any CSS variables or animations — those give the files their dark luxury aesthetic.

### What NOT to touch
- `src/components/VirtualFitting.tsx` — Gemini integration, do not modify
- `src/components/VirtualTryOn.tsx` — Gemini integration, do not modify
- `src/integrations/supabase/` — database config, do not modify
- `src/context/CartContext.tsx` — cart state, do not modify
