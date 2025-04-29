
-- Create storage bucket for user avatars
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- Create storage policy to allow authenticated users to upload their own avatar
create policy "Allow users to upload their avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow users to update their own avatar
create policy "Allow users to update their avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow users to read their own avatar
create policy "Allow users to read their avatar"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Create storage policy to allow public access to avatars
create policy "Allow public to read avatars"
on storage.objects
for select
using (bucket_id = 'avatars');
