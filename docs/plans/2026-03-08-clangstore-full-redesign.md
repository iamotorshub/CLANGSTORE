# CLANGSTORE Full UI Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform CLANGSTORE from a functional MVP into an ultra-premium dark editorial fashion e-commerce that matches or exceeds world-class fashion brands (CELINE, Bottega Veneta, Rick Owens aesthetic).

**Architecture:** Purely frontend redesign — no backend changes. All AI features (VirtualFitting.tsx, VirtualTryOn.tsx, AIStudio.tsx) and API integrations remain untouched. Changes are isolated to visual components, CSS, and animations using existing Framer Motion + Tailwind stack.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion (already installed), shadcn/ui, Vite, Bun

**Working directory:** `/Users/francolarrarte/CLANGSTORE/.claude/worktrees/dazzling-black`

**DO NOT TOUCH:** `src/pages/VirtualFitting.tsx`, `src/pages/AIStudio.tsx`, `src/components/VirtualTryOn.tsx`, all Supabase/Gemini integrations

---

## Design Direction

**Aesthetic:** Ultra-luxury dark editorial — noir with warmth. Think Rick Owens website meets Bottega Veneta's editorial photography.
**Palette (keep existing CSS vars, enhance):** Near-black `#080808`, warm cream `#F5F0E8`, muted gold `#C4A97A`
**Fonts:** Keep Playfair Display (headings) + DM Sans (body). Add `Cormorant Garamond` for oversized editorial numerals/accents.
**Differentiators:**
- Custom cursor (dot + ring follower)
- Grain texture overlay across all pages
- Editorial asymmetric product grid (not just 4-col)
- Parallax hero with cinematic text reveal
- Magnetic hover on all buttons
- Staggered scroll reveals with clip-path animations
- Horizontal category marquee strip
- Full-bleed editorial "lookbook" strip section

---

## Task 1: Global CSS Foundation — Grain, Cursor, New Tokens

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.ts`

**Step 1: Add grain texture overlay + custom cursor styles + new animation utilities to `src/index.css`**

Add after existing utilities:
```css
/* Grain texture */
.grain-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: 0.03;
  animation: grain 0.5s steps(1) infinite;
}
@keyframes grain {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -3%); }
  20% { transform: translate(3%, 2%); }
  30% { transform: translate(-1%, 4%); }
  40% { transform: translate(2%, -1%); }
  50% { transform: translate(-3%, 2%); }
  60% { transform: translate(1%, -4%); }
  70% { transform: translate(-2%, 1%); }
  80% { transform: translate(3%, -2%); }
  90% { transform: translate(-1%, 3%); }
}

/* Custom cursor */
.cursor-dot {
  position: fixed;
  width: 6px;
  height: 6px;
  background: hsl(var(--primary));
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: transform 0.1s ease, width 0.3s ease, height 0.3s ease, opacity 0.3s ease;
}
.cursor-ring {
  position: fixed;
  width: 32px;
  height: 32px;
  border: 1px solid hsl(var(--primary) / 0.4);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9997;
  transform: translate(-50%, -50%);
  transition: left 0.12s ease, top 0.12s ease, width 0.3s ease, height 0.3s ease, border-color 0.3s ease;
}

/* Clip path reveal animation */
@keyframes clip-reveal {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0% 0 0); }
}
.clip-reveal { animation: clip-reveal 1.2s cubic-bezier(0.77, 0, 0.175, 1) forwards; }

/* Marquee */
@keyframes marquee-left {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee-slow {
  animation: marquee-left 40s linear infinite;
  will-change: transform;
}

/* Magnetic button base */
.magnetic-btn {
  transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}

/* Image hover scale utility */
.img-hover-scale img {
  transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.img-hover-scale:hover img {
  transform: scale(1.07);
}

/* Cormorant Garamond for editorial numbers */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap');
.font-editorial { font-family: 'Cormorant Garamond', serif; }
```

**Step 2: Update tailwind.config.ts** — add `fontFamily.editorial` and `animation.marquee-slow`

**Step 3: Commit**
```bash
git add src/index.css tailwind.config.ts
git commit -m "style: add grain overlay, custom cursor, clip-reveal, editorial font tokens"
```

---

## Task 2: Custom Cursor Component

**Files:**
- Create: `src/components/CustomCursor.tsx`
- Modify: `src/App.tsx` (add `<CustomCursor />` and `<div className="grain-overlay" />`)

**Step 1: Create `src/components/CustomCursor.tsx`**

```tsx
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;

    const move = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
      // ring follows with slight delay (handled by CSS transition)
      ring.style.left = `${mouseX}px`;
      ring.style.top = `${mouseY}px`;
    };

    const onEnterLink = () => {
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.borderColor = "hsl(var(--primary) / 0.8)";
      dot.style.opacity = "0";
    };
    const onLeaveLink = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.borderColor = "hsl(var(--primary) / 0.4)";
      dot.style.opacity = "1";
    };

    document.addEventListener("mousemove", move);
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    return () => {
      document.removeEventListener("mousemove", move);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
```

**Step 2: In `src/App.tsx`** — import and add `<CustomCursor />` and `<div className="grain-overlay" />` inside the BrowserRouter, before the Navbar.

**Step 3: Add `cursor-none` to body in `src/index.css`**:
```css
body { @apply bg-background text-foreground antialiased cursor-none; }
```

**Step 4: Commit**
```bash
git add src/components/CustomCursor.tsx src/App.tsx src/index.css
git commit -m "feat: add custom cursor and grain overlay"
```

---

## Task 3: Navbar Elevation

**Files:**
- Modify: `src/components/Navbar.tsx`

**Goal:** Thinner, more refined. Logo slightly larger. Nav links more spaced. Mobile menu more polished. Add a thin gold top border line.

**Key changes:**
- Add `border-t-2 border-primary/60` at very top of header (replaces marquee bg tone)
- Increase logo tracking: `tracking-[0.5em]`
- Nav link hover: underline animates from left using `after:` pseudo-element via Tailwind
- Mobile menu: slide down with a blurred backdrop that fills screen, links animate in one by one with stagger

**Step 1: Rewrite Navbar with refined styles** (preserve all existing links, cart, admin logic — only change visual classes and layout)

**Step 2: Commit**
```bash
git add src/components/Navbar.tsx
git commit -m "style: elevate Navbar — refined typography, animated underlines, polished mobile menu"
```

---

## Task 4: HeroCarousel — Cinematic Overhaul

**Files:**
- Modify: `src/components/HeroCarousel.tsx`

**Goal:** Full-viewport cinematic hero. Text animates in character-by-character. Ken Burns effect on every image. Gold decorative line element. Slide counter in editorial style (01/05). Progress bar replacing dots.

**Key changes:**
- Text reveal: split title into chars, each animates with stagger using Framer Motion `variants`
- Image: subtle scale from 1.0 → 1.08 over 6s (existing `animate: true` logic extended to ALL slides)
- Bottom-left: Editorial slide number `01 — EDITORIAL` in `font-editorial` italic
- Bottom-right: thin progress bar filling across 6s (CSS animation reset on slide change with `key`)
- Overlay: gradient from `rgba(0,0,0,0.5)` at bottom to transparent at top (existing)
- Remove old dot indicators; replace with: `01 / 05` numeric counter

**Step 1: Implement cinematic HeroCarousel** (preserve all slide data, links, auto-advance logic)

**Step 2: Commit**
```bash
git add src/components/HeroCarousel.tsx
git commit -m "feat: cinematic hero — char-by-char text reveal, editorial counter, Ken Burns"
```

---

## Task 5: ProductCard — Luxury Hover

**Files:**
- Modify: `src/components/ProductCard.tsx`

**Goal:** On hover: image slightly zooms, a second overlay appears with product name and "AGREGAR" button that slides up from bottom. Size selector dots if sizes available. Wishlist heart more prominent on hover only.

**Key changes:**
- Wrap image in `overflow-hidden` div with `group` → existing pattern enhanced
- Hover overlay: `absolute inset-0 flex flex-col justify-end p-4` with black gradient from bottom
- "AGREGAR" button: `translate-y-full group-hover:translate-y-0 transition-transform duration-500`
- Product name on card: `font-body text-xs tracking-[0.2em] uppercase` (more refined than current)
- Price: keep gold, add strikethrough original price if available
- Add subtle top-right corner badge animation

**Step 1: Rewrite ProductCard** (preserve all props, cart add logic, wishlist, navigation)

**Step 2: Commit**
```bash
git add src/components/ProductCard.tsx
git commit -m "style: luxury ProductCard — slide-up hover overlay, refined typography"
```

---

## Task 6: Index Page — Editorial Homepage

**Files:**
- Modify: `src/pages/Index.tsx`

**Goal:** Completely restructure homepage layout:

```
[HeroCarousel - full height]
[Marquee Strip - category names scrolling]
[Novedades - 2+2 asymmetric grid]
[Full-bleed Editorial Banner - text + image split]
[AI Studio Teaser - existing, enhanced]
[Destacados - horizontal scroll on mobile, 4-col on desktop]
[Brand Values Strip - 3 icons + text]
[Newsletter - editorial full-width]
[Footer]
```

**New sections to add:**

**A) Category Marquee Strip:**
```tsx
<div className="py-4 border-y border-border overflow-hidden bg-card">
  <div className="flex animate-marquee-slow whitespace-nowrap">
    {[...categories, ...categories].map((cat, i) => (
      <span key={i} className="mx-12 font-editorial italic text-2xl text-muted-foreground/40">
        {cat}
      </span>
    ))}
  </div>
</div>
```

**B) Editorial Banner (between novedades and AI teaser):**
```tsx
<section className="grid lg:grid-cols-2 min-h-[70vh]">
  <div className="bg-card flex flex-col justify-center px-16 py-20">
    <p className="font-editorial italic text-8xl text-primary/20 leading-none mb-6">SS26</p>
    <h2 className="font-display text-4xl lg:text-5xl mb-6">La Nueva Colección</h2>
    <p className="font-body text-muted-foreground max-w-sm mb-8">...</p>
    <Link to="/productos" ...>Ver Colección →</Link>
  </div>
  <div className="relative min-h-[50vh] lg:min-h-0 overflow-hidden">
    <img src={hero1} className="absolute inset-0 w-full h-full object-cover" />
  </div>
</section>
```

**C) Brand Values Strip:**
```tsx
// 3 columns: Envío Express | Cuotas sin Interés | Cambios Gratis
// Each with a thin gold line above and large editorial number (01, 02, 03)
```

**Step 1: Rewrite Index.tsx** with all new sections (preserve existing imports and functional logic)

**Step 2: Commit**
```bash
git add src/pages/Index.tsx
git commit -m "feat: editorial homepage — marquee strip, split banner, brand values, restructured layout"
```

---

## Task 7: AIStudioTeaser — Dramatic Presentation

**Files:**
- Modify: `src/components/AIStudioTeaser.tsx`

**Goal:** Make the AI Studio teaser feel like a technological luxury feature, not an afterthought. Full dark card with animated preview grid, glow effects, and stronger CTA.

**Key changes:**
- Background: `bg-background` with subtle radial gold glow (already has this, enhance)
- Left column: larger headline `text-5xl lg:text-7xl`, more editorial
- Right column: animated preview cards that cycle/pulse
- CTA: larger, more prominent with hover state
- Add `BETA` badge to the section

**Step 1: Enhance AIStudioTeaser.tsx** (do NOT touch VirtualTryOn.tsx or AIStudio.tsx)

**Step 2: Commit**
```bash
git add src/components/AIStudioTeaser.tsx
git commit -m "style: dramatic AIStudioTeaser — editorial headline, animated preview, enhanced CTA"
```

---

## Task 8: Products Page — Editorial Grid

**Files:**
- Modify: `src/pages/Products.tsx`

**Goal:** Replace uniform 4-col grid with an editorial mixed grid where every 7th product is featured (large) and the rest are standard size.

**Pattern (repeating block of 7):**
```
[Large - col-span-2 row-span-2] [Small] [Small]
                                [Small] [Small]
```

**Filter bar:** Replace plain buttons with a more refined horizontal scrollable pill bar with a decorative `|` separator between categories.

**Header:** Add product count `24 prendas` in muted text next to title.

**Step 1: Rewrite Products.tsx** (preserve useProducts hook, filter state, Footer)

**Step 2: Commit**
```bash
git add src/pages/Products.tsx
git commit -m "feat: editorial product grid — mixed sizes, refined filter bar"
```

---

## Task 9: CartDrawer — Polish

**Files:**
- Modify: `src/components/CartDrawer.tsx`

**Goal:** More refined cart experience — better item layout, quantity controls, subtotal formatting, WhatsApp checkout CTA.

**Key changes:**
- Item row: product image thumbnail + name + size + price + qty controls
- Footer: subtotal + "Finalizar por WhatsApp" button (already exists, improve styling)
- Empty state: editorial message

**Step 1: Enhance CartDrawer** (preserve all cart context usage)

**Step 2: Commit**
```bash
git add src/components/CartDrawer.tsx
git commit -m "style: refined CartDrawer — better item layout, WhatsApp CTA"
```

---

## Task 10: Footer Enhancement

**Files:**
- Modify: `src/components/Footer.tsx`

**Goal:** More complete footer with logo statement, Instagram link with icon, payment methods icons, a tagline.

**Key changes:**
- Logo: larger `CLANG` wordmark with tagline "Moda con IA"
- Add Instagram grid preview placeholder (3 colored boxes linking to IG)
- Payment methods: cash, card, transfer icons (text-based)
- Tagline at bottom: "Diseñado en Argentina · Potenciado por IA"

**Step 1: Enhance Footer** (preserve all existing links)

**Step 2: Commit**
```bash
git add src/components/Footer.tsx
git commit -m "style: enhanced footer — wordmark, instagram strip, payment badges"
```

---

## Task 11: ProductDetail Page

**Files:**
- Modify: `src/pages/ProductDetail.tsx` (read first to understand current state)

**Goal:** Make product detail feel like a luxury brand PDP (Product Detail Page):
- Full-width image on left (60%), details on right (40%)
- Image with subtle zoom on hover
- Breadcrumb: `Inicio > Shop > [Category] > [Name]`
- Size selector: radio pill buttons
- Add to cart: large full-width button with subtle glow
- Description: expandable with smooth accordion
- Related products at bottom (same category, 4 items)

**Step 1: Read current ProductDetail.tsx**
**Step 2: Rewrite ProductDetail.tsx**
**Step 3: Commit**
```bash
git add src/pages/ProductDetail.tsx
git commit -m "feat: luxury ProductDetail — editorial layout, size picker, related products"
```

---

## Task 12: Global Scroll Animations + Page Transitions

**Files:**
- Modify: `src/components/PageTransition.tsx`
- Modify: `src/App.tsx` (if needed)

**Goal:** Ensure page transitions feel silky. Sections across all pages reveal with consistent `viewport once: true` motion. The PageTransition component wraps each page with a consistent fade + slight Y movement.

**Key changes:**
- PageTransition: use `opacity: 0 → 1, y: 16 → 0` over 0.4s
- All section headers: `initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}`

**Step 1: Update PageTransition and verify App.tsx uses it**

**Step 2: Commit**
```bash
git add src/components/PageTransition.tsx
git commit -m "style: silky page transitions and consistent section reveals"
```

---

## Task 13: Final Build Check

**Step 1: Run dev server to verify no console errors**
```bash
cd /Users/francolarrarte/CLANGSTORE/.claude/worktrees/dazzling-black && bun run dev
```

**Step 2: Run TypeScript check**
```bash
bun run build 2>&1 | head -50
```

**Step 3: Fix any TypeScript errors**

**Step 4: Final commit**
```bash
git add -A
git commit -m "feat: CLANGSTORE full UI redesign — premium editorial fashion e-commerce"
```

---

## Execution Notes

- **Package manager:** `bun` (use `bun install`, `bun run dev`, `bun run build`)
- **Working dir:** `/Users/francolarrarte/CLANGSTORE/.claude/worktrees/dazzling-black`
- **Read before edit:** Always read the current file before rewriting
- **Preserve:** All TypeScript types, all context usage, all API calls
- **Test visually:** Each task should be visually verifiable in the dev server
