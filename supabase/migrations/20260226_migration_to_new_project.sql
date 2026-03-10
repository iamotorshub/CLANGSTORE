-- ==========================================
-- 1. Create Tables
-- ==========================================

-- Table: products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  price integer NOT NULL,
  original_price integer,
  category text NOT NULL,
  description text,
  image_url text,
  sizes text[] DEFAULT '{}',
  colors text[] DEFAULT '{}',
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  free_shipping boolean DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: ai_models
CREATE TABLE IF NOT EXISTS public.ai_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  photo_url text,
  prompt_description text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Table: ai_books
CREATE TABLE IF NOT EXISTS public.ai_books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  model_id uuid REFERENCES public.ai_models(id) ON DELETE CASCADE,
  photo_count integer NOT NULL DEFAULT 4,
  locations text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  result_photos jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ==========================================
-- 2. Security (RLS)
-- ==========================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public read models" ON public.ai_models FOR SELECT USING (true);
CREATE POLICY "Public read books" ON public.ai_books FOR SELECT USING (true);

-- MVP: Allow full access (for testing)
CREATE POLICY "Full access products" ON public.products FOR ALL USING (true);
CREATE POLICY "Full access models" ON public.ai_models FOR ALL USING (true);
CREATE POLICY "Full access books" ON public.ai_books FOR ALL USING (true);

-- ==========================================
-- 3. Storage
-- ==========================================

-- Bucket for AI assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('ai-assets', 'ai-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read ai-assets" ON storage.objects FOR SELECT USING (bucket_id = 'ai-assets');
CREATE POLICY "Public all ai-assets" ON storage.objects FOR ALL USING (bucket_id = 'ai-assets');

-- ==========================================
-- 4. Seed Data
-- ==========================================

-- Products
INSERT INTO public.products (name, slug, price, category, description, image_url, is_featured, is_new) VALUES
('CAMISA LOREANA', 'camisa-loreana', 79900, 'Camisas', 'De Poplin, talle único. Oversize.', '/assets/products/camisa-loreana.webp', true, true),
('TOP RIHANA', 'top-rihana', 32900, 'Tops', 'Top moderno.', false, true),
('VESTIDO ARMANI', 'vestido-armani', 89900, 'Vestidos', 'Vestido elegante.', false, false),
('CHAQUETA OASIS', 'chaqueta-oasis', 189900, 'Abrigos', 'Chaqueta premium de eco cuero.', true, false);

-- Models (Descriptions only, photos to be uploaded or linked)
INSERT INTO public.ai_models (name, prompt_description, tags) VALUES
('LOLA', 'An edgy fashion model with short dark hair, freckles.', ARRAY['lola', 'consistency-ref']),
('MARTINA', 'A classic elegant fashion model with long brown hair.', ARRAY['martina', 'consistency-ref']),
('MIA', 'A rock-chic inspired fashion model.', ARRAY['mia', 'consistency-ref']),
('SOFIA', 'A boho-chic fashion model with a natural sun-kissed look.', ARRAY['sofia', 'consistency-ref']),
('VALENTINA', 'A luxury boss style fashion model.', ARRAY['valentina', 'consistency-ref']);
