# CLANGSTORE v3 — Editorial Redesign & Sales Strategy
**Date:** 2026-03-08
**Branch:** claude/sharp-sutherland
**Status:** Approved — ready for implementation

---

## 1. Overview

Transform CLANGSTORE from an MVP dark-themed store into a Vogue/Gucci-level editorial magazine-commerce hybrid. The visual upgrade supports a USD-denominated SaaS pitch targeting the store owner (female showroom, Bahía Blanca, no physical storefront).

**North star:** "Tu foto ES tu local" — a single AI-generated image replaces the $500/month traditional photoshoot, the 16h/week of CEO time, and the 30% return rate from bad sizing. The site itself is the proof of concept.

---

## 2. Assets Available

### Hero Video
- `Models_walking_towards_camera_delpmaspu_.mp4` (26MB) — cinematic, Models walking toward camera
- `AI STUDIO LOOKBOK SORA 2 VIDEOS.mp4` (11MB) — lookbook B-roll
- `Fashion_Editorial_Video_Generation.mp4` (4.8MB) — editorial

### Hero Images (existing in src/assets/)
- `hero-1.jpg` — cinematic AI model in leather biker jacket (Ken Burns candidate)
- `hero-2.jpg` — Vogue Argentina B&W editorial
- `hero-4.jpg` — model in black blazer, cobblestone

### Gemini Editorial Photos (in Downloads/CLANG STORE)
- `Gemini_Generated_Image_ht52z0*.png` — model in grey blazer suit, rooftop sunset (Shanghai)
- `Gemini_Generated_Image_eayj50*.png` — model in blue tropical co-ord, rooftop sunset (Bangkok)
- `Gemini_Generated_Image_lc8gt2*.png` — street style, navy top + white pants, NYC
- `Gemini_Generated_Image_nhly*.png` — grey linen blazer flat lay (product)
- `Gemini_Generated_Image_gvow*.png` — grey linen suit set flat lay (product)
- `Gemini_Generated_Image_5cms45*.png` — blue/grey linen suit flat lay (product)

### AI Model Photos (50 total)
- MÍA × 10 — rock chic
- SOFÍA × 10 — palermo girl
- VALENTINA × 10 — haute couture
- LOLA × 10 — edgy
- MARTINA × 10 — classic

### Sales Presentation Assets
- `SLIDEN 2 GEMINI.png` — slide: TIEMPO / COSTO / FRICCIÓN → NUEVA COLECCIÓN pain-point diagram
- `PIC COPILOT.png` — model in leather bomber + blue flare jeans (client's store style reference)

---

## 3. Visual Design — Enfoque C "Magazine + Commerce"

### 3.1 Hero Carousel (3 slides)
| Slide | Content | Effect |
|-------|---------|--------|
| 1 | `hero-1.jpg` — leather jacket model | Ken Burns zoom-in, gold editorial text overlay |
| 2 | `Models_walking_towards_camera_delpmaspu_.mp4` | autoPlay muted loop playsInline, dark overlay 40%, text centered |
| 3 | `hero-2.jpg` — B&W Vogue editorial | Ken Burns slow pan, white text |

Each slide has: headline (Cormorant Garamond italic), subline (DM Sans small caps), CTA button.
Navigation: bottom dot indicators + left/right ghost arrows (fade in on hover).
Video slide: `<video>` with `<img>` fallback if video fails to load.

### 3.2 Editorial Product Grid (Homepage)
```
Row 1 — Featured Hero:
  [ FEATURED PRODUCT — 60% width ]  [ Product 2 — 40% ]
                                     [ Product 3 — 40% ]

Row 2+ — 3-col editorial grid
  [ P4 ]  [ P5 ]  [ P6 ]
  [ P7 ]  [ P8 ]  [ P9 ]
```

Visual details:
- Featured product: full bleed image, product name in Cormorant italic overlaid at bottom-left
- Editorial number: `01`, `02`, `03`... in Cormorant small caps, top-right corner, `text-muted-foreground/20`
- Always-visible product name and price (no hover-only text — editorial, always shown)
- Hover: subtle scale 1.02 on the image only (not the card), overlay darkens slightly

### 3.3 Typography Refinements
- Display headlines: Cormorant Garamond italic (`font-display italic`)
- Labels/nav/prices: DM Sans small caps (`tracking-[0.3em] uppercase`)
- Drop `font-editorial` class — use `font-display italic` directly
- Add editorial italic quotes in section intros

### 3.4 Color / Atmosphere
- Background stays `#0a0a0a` (noir)
- Accent stays `#c4a97a` (warm gold)
- Add `#1a1a1a` as secondary surface (cards, drawers)
- Image overlays: `from-black/80 via-black/20 to-transparent` (bottom-to-top gradient)

---

## 4. New Components

### 4.1 `HeroCarousel.tsx` (rewrite)
Current: static image carousel
New:
- Accepts `slides: HeroSlide[]` where `HeroSlide = { type: 'image' | 'video', src: string, fallback?: string, headline: string, subline: string, cta: string }`
- Auto-advance: 6s for images, full video duration (capped at 12s) for video
- Pause on hover
- Framer Motion `AnimatePresence` for slide transitions (`opacity` + slight `y` drift)

### 4.2 `EditorialProductGrid.tsx` (new)
- Props: `products: Product[]`, `featuredId?: string`
- Featured product uses `col-span-1 row-span-2` in CSS grid
- Editorial number overlay (absolute positioned, top-right)
- Always-visible product info (no hover dependency)
- Mobile: single column, featured = full width first

### 4.3 `LookbookStrip.tsx` (new, optional)
- Horizontal scroll of editorial photos (Gemini rooftop images)
- Caption: city name + collection tag
- Mobile: snap-scroll
- Links to `/productos` with filtered category

---

## 5. Data / Content Updates

### 5.1 Copy updates in `HeroCarousel`
- Slide 1: `"nueva temporada"` / `"PRENDAS QUE HABLAN\nPOR VOS"` / CTA: `"Ver Colección"`
- Slide 2 (video): `"AI LOOKBOOK"` / `"21 PIEZAS. INFINITAS FORMAS\nDE USARLAS."` / CTA: `"Explorar"`
- Slide 3: `"editorial"` / `"FOTOGRAFÍA QUE\nELEVA LA MARCA"` / CTA: `"Ver Todo"`

### 5.2 Copy asset: SLIDEN 2 GEMINI integration
The pain-point diagram (TIEMPO / COSTO / FRICCIÓN) is a slide for the pitch deck, not the website. Copy it to the Desktop project folder and reference in SPEECH HTML.

---

## 6. Sales Materials — Desktop Folder Updates

### 6.1 USD Pricing Tiers
| Tier | Name | Setup | Monthly | Included |
|------|------|-------|---------|----------|
| I | Web Store | $800 | $0 | Store + catalog + hosting setup |
| II | Web + Assistant | $1,100 | $99 | Tier I + WhatsApp/web chatbot LLM |
| III | Full Suite + AI | $1,500 | $149 | Tier II + AI models + virtual fitting |

**Anchor strategy:** Present Tier III first. Let client "choose down."
**Payment:** 50% upfront, 50% on delivery. Monthly billed quarterly.
**Regalo de lanzamiento:** 2 months free maintenance (framed as exclusive, not discount).

### 6.2 ROI Argument (from analysis)
- Client phantom cost: $530 USD/month (16h CEO time @ $20/h + returns friction)
- Traditional photoshoot: $400–500 USD/month
- CLANGSTORE Full Suite: $149/month = 3.5× cheaper than photoshoot alone
- Break-even: Day 1 (the store replaces phantom costs immediately)

### 6.3 Speech Framework (4 steps)
1. **Dolor** — "Cada vez que actualizás tu colección, ¿qué pasa? Photoshoot, $500, 3 días de espera. Y mientras tanto, tu competencia ya publicó."
2. **Agitar** — "En Tienda Nube pagás comisión + foto de mierda. Acá tu foto ES tu local. Y no le pagás comisión a nadie."
3. **Solución** — Present Full Suite ($1,500 + $149/mes). Show CLANGSTORE demo live.
4. **Cierre** — "Para vos especialmente, los primeros 2 meses de mantenimiento van de regalo. Solo necesito que me des el OK esta semana."

### 6.4 Files to Update in Desktop Folder
- `💰 PRESUPUESTOS Y PLANES.html` — USD 3-tier table
- `🎤 SPEECH DE VENTA.html` — 4-step framework above
- `📄 PROPUESTA DE VENTA.html` — full proposal with ROI calc
- `📧 EMAIL CAMPAIGN.html` — subject: "Tu foto es tu local 📸"
- `🎯 PRESENTACIÓN DEL PROYECTO.html` — live demo flow
- `🎨 BRAND CANVAS.html` — updated with USD + AI positioning

---

## 7. Video Asset Pipeline

### Copy from Downloads to src/assets
```
/Users/francolarrarte/Downloads/CLANG STORE/Models_walking_towards_camera_delpmaspu_.mp4
→ /Users/francolarrarte/CLANGSTORE/src/assets/video/hero-models-walking.mp4
```
Video is 26MB — acceptable for hero (lazy loaded, only plays when in view on desktop).
On mobile: show `hero-1.jpg` static fallback instead of video (saves bandwidth).

### Gemini editorial photos → lookbook assets
Copy the 3 rooftop editorial photos (ht52z0, eayj50) to `src/assets/lookbook/` for use in `LookbookStrip`.

---

## 8. Implementation Order

1. **Copy video asset** to `src/assets/video/`
2. **HeroCarousel.tsx** — add video slide support, update slide data
3. **EditorialProductGrid.tsx** — new component, replace homepage grid
4. **LookbookStrip.tsx** — new component (optional, time-permitting)
5. **Desktop HTML files** — update all 6 with USD pricing + speech
6. **Preview verification** — screenshot, console check, responsive check
7. **Commit** — `feat: v3 editorial redesign, video hero, USD pricing materials`

---

## 9. Out of Scope (this sprint)
- AI model photo import to products (requires Supabase storage setup)
- Full chatbot LLM integration (Tier II feature — separate sprint)
- Virtual Fitting Room changes — DO NOT TOUCH Gemini integration
- New account creation / auth flows
