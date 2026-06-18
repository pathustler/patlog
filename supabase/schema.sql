create extension if not exists pgcrypto;

create table if not exists public.blogs (
  md_name text primary key,
  md_content text not null
);

alter table public.blogs enable row level security;

drop policy if exists "Public read access to blogs" on public.blogs;
drop policy if exists "Public insert blogs" on public.blogs;
drop policy if exists "Public update blogs" on public.blogs;
drop policy if exists "Public delete blogs" on public.blogs;

create policy "Public read access to blogs"
on public.blogs
for select
using (true);

create policy "Public insert blogs"
on public.blogs
for insert
with check (true);

create policy "Public update blogs"
on public.blogs
for update
using (true)
with check (true);

create policy "Public delete blogs"
on public.blogs
for delete
using (true);

create table if not exists public.blog_images (
  id uuid primary key default gen_random_uuid(),
  md_name text not null,
  image_name text not null,
  image_url text not null,
  created_at timestamptz not null default now()
);

create index if not exists blog_images_md_name_idx on public.blog_images(md_name);

alter table public.blog_images enable row level security;

drop policy if exists "Public read access to blog images" on public.blog_images;
drop policy if exists "Public insert blog images" on public.blog_images;
drop policy if exists "Public delete blog images" on public.blog_images;

create policy "Public read access to blog images"
on public.blog_images
for select
using (true);

create policy "Public insert blog images"
on public.blog_images
for insert
with check (true);

create policy "Public delete blog images"
on public.blog_images
for delete
using (true);

insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Public read blog images bucket" on storage.objects;
drop policy if exists "Public insert blog images bucket" on storage.objects;
drop policy if exists "Public update blog images bucket" on storage.objects;
drop policy if exists "Public delete blog images bucket" on storage.objects;

create policy "Public read blog images bucket"
on storage.objects
for select
using (bucket_id = 'blog-images');

create policy "Public insert blog images bucket"
on storage.objects
for insert
with check (bucket_id = 'blog-images');

create policy "Public update blog images bucket"
on storage.objects
for update
using (bucket_id = 'blog-images')
with check (bucket_id = 'blog-images');

create policy "Public delete blog images bucket"
on storage.objects
for delete
using (bucket_id = 'blog-images');