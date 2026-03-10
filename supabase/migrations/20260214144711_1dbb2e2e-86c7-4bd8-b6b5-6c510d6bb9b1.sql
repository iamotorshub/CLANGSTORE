
-- Create storage bucket for AI assets
INSERT INTO storage.buckets (id, name, public) VALUES ('ai-assets', 'ai-assets', true);

-- Allow anyone to read from ai-assets
CREATE POLICY "Public read ai-assets" ON storage.objects FOR SELECT USING (bucket_id = 'ai-assets');

-- Allow authenticated users to upload to ai-assets
CREATE POLICY "Authenticated upload ai-assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ai-assets');

-- Allow authenticated users to update their uploads
CREATE POLICY "Authenticated update ai-assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'ai-assets');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Authenticated delete ai-assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'ai-assets');
