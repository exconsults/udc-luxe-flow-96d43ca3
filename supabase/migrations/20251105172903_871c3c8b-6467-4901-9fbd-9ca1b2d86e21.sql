-- Storage policies for avatars bucket (using correct syntax)
-- Public read access
CREATE POLICY "Public read access to avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Authenticated users can upload files to their own folder (userId/...)
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Authenticated users can update files in their own folder
CREATE POLICY "Users can update own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Authenticated users can delete files in their own folder
CREATE POLICY "Users can delete own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);