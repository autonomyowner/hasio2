-- ============================================
-- HASIO STORAGE SETUP
-- Run this to create storage buckets
-- ============================================

-- Create moments bucket for user photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('moments', 'moments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for moments bucket
CREATE POLICY "Anyone can view moment images"
ON storage.objects FOR SELECT
USING (bucket_id = 'moments');

CREATE POLICY "Authenticated users can upload moment images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'moments'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own moment images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'moments'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Create content bucket for admin uploads (lodging, food, events images)
INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for content
CREATE POLICY "Anyone can view content images"
ON storage.objects FOR SELECT
USING (bucket_id = 'content');
