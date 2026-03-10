
-- ==========================================
-- Table: products
-- ==========================================
CREATE TABLE public.products (
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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (true);
CREATE POLICY "Products can be inserted by anyone (MVP)" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Products can be updated by anyone (MVP)" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Products can be deleted by anyone (MVP)" ON public.products FOR DELETE USING (true);

-- Seed data
INSERT INTO public.products (name, slug, price, category, description, image_url, sizes, colors, is_featured, is_new, free_shipping) VALUES
  ('VESTIDO ARMANI', 'vestido-armani', 89900, 'Vestidos', 'Vestido elegante estilo Armani, ideal para eventos y ocasiones especiales.', '/assets/products/vestido-armani.webp', '{}', '{}', true, true, true),
  ('REMERON BUNNY', 'remeron-bunny', 39900, 'Remeras', 'Remerón oversize con estampa exclusiva, perfecto para un look casual y cómodo.', '/assets/products/remeron-bunny.webp', '{}', '{}', false, true, true),
  ('TOP RIHANA', 'top-rihana', 32900, 'Tops', 'Top con diseño moderno y versátil, disponible en blanco y negro.', '/assets/products/top-rihana.webp', '{}', '{Blanca,Negra}', false, true, true),
  ('CAMISA LOREANA', 'camisa-loreana', 79900, 'Camisas', 'Camisa de corte clásico con detalles contemporáneos para un look sofisticado.', '/assets/products/camisa-loreana.webp', '{}', '{}', true, false, true),
  ('VESTIDO GIME', 'vestido-gime', 99900, 'Vestidos', 'Vestido de gasa con print y hebilla, perfecto para eventos al aire libre.', '/assets/products/vestido-gime.webp', '{}', '{}', true, false, true),
  ('VESTIDO PILAR', 'vestido-pilar', 89900, 'Vestidos', 'Vestido de tul con glitter y lazo audaz, ideal para fiestas y celebraciones.', '/assets/products/vestido-pilar.webp', '{}', '{}', true, false, true),
  ('CHAQUETA OASIS', 'chaqueta-oasis', 189900, 'Abrigos', 'Chaqueta premium de cuero ecológico, la pieza estrella de la colección FW26.', '/assets/products/chaqueta-oasis.jpg', '{}', '{}', true, false, true),
  ('TOP VIENA', 'top-viena', 69900, 'Tops', 'Top elegante con detalles únicos, perfecto para combinar con cualquier outfit.', '/assets/products/top-viena.webp', '{}', '{Blanca,Negra}', false, false, true),
  ('SHORT KENDAL', 'short-kendal', 54900, 'Shorts', 'Short de jean con corte moderno y cómodo, ideal para el día a día.', '/assets/products/short-kendal.webp', '{24,26,28,30,32}', '{}', false, false, true),
  ('SET RINA', 'set-rina', 129900, 'Sets', 'Conjunto de dos piezas con diseño coordinado, elegante y versátil.', '/assets/products/set-rina.jpg', '{}', '{Blanca,Marrón}', true, false, true);

-- ==========================================
-- Table: ai_models
-- ==========================================
CREATE TABLE public.ai_models (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  photo_url text,
  prompt_description text,
  tags text[] DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI models are viewable by everyone" ON public.ai_models FOR SELECT USING (true);
CREATE POLICY "AI models can be inserted by anyone (MVP)" ON public.ai_models FOR INSERT WITH CHECK (true);
CREATE POLICY "AI models can be updated by anyone (MVP)" ON public.ai_models FOR UPDATE USING (true);
CREATE POLICY "AI models can be deleted by anyone (MVP)" ON public.ai_models FOR DELETE USING (true);

-- ==========================================
-- Table: ai_books
-- ==========================================
CREATE TABLE public.ai_books (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE,
  model_id uuid REFERENCES public.ai_models(id) ON DELETE CASCADE,
  photo_count integer NOT NULL DEFAULT 4,
  locations text[] DEFAULT '{}',
  status text NOT NULL DEFAULT 'pending',
  result_photos jsonb DEFAULT '[]',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "AI books are viewable by everyone" ON public.ai_books FOR SELECT USING (true);
CREATE POLICY "AI books can be inserted by anyone (MVP)" ON public.ai_books FOR INSERT WITH CHECK (true);
CREATE POLICY "AI books can be updated by anyone (MVP)" ON public.ai_books FOR UPDATE USING (true);
CREATE POLICY "AI books can be deleted by anyone (MVP)" ON public.ai_books FOR DELETE USING (true);
