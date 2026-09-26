-- =====================================================================
-- Portafolio martodev: esquema inicial
-- Tablas, enums, administrador, RLS y Storage (ver docs/portafolio-spec.md)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------

create type public.categoria_proyecto as enum ('cliente', 'propio', 'academico');
create type public.tipo_trayectoria as enum ('formacion', 'experiencia', 'freelance', 'ayudantia');
create type public.area_habilidad as enum ('frontend', 'backend', 'hardware', 'ia', 'infra', 'otras');
create type public.tipo_consulta as enum ('freelance', 'practica', 'otro');

-- ---------------------------------------------------------------------
-- Tablas
-- ---------------------------------------------------------------------

-- Ajustes generales (una sola fila)
create table public.site_settings (
  id int primary key default 1 check (id = 1),
  nombre text not null,
  tagline text,
  hero_descripcion text,
  bio jsonb,                        -- Tiptap
  disponible_freelance boolean not null default true,
  disponible_practica boolean not null default true,
  practica_desde date,
  practica_duracion text,           -- ej. "360 horas" / "3 meses"
  email text,
  whatsapp text check (whatsapp ~ '^[0-9]{8,15}$'),  -- formato internacional sin "+"
  github_url text,
  linkedin_url text,
  cv_pdf_path text,                 -- ruta en Storage
  updated_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo text not null,
  resumen text not null,            -- 1–2 líneas para tarjetas
  categoria public.categoria_proyecto not null,
  cliente text,
  rol text,                         -- qué hice yo
  problema text,
  resultado text,
  contenido jsonb,                  -- Tiptap: detalle técnico
  stack text[] not null default '{}',
  portada_path text,
  galeria_paths text[] not null default '{}',
  demo_url text,
  repo_url text,
  destacado boolean not null default false,
  publicado boolean not null default false,
  orden int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_publicado_orden_idx on public.projects (publicado, orden);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  icono text,                       -- nombre de ícono (lucide)
  orden int not null default 0,
  publicado boolean not null default true
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  cargo text,
  texto text not null,
  project_id uuid references public.projects (id) on delete set null,
  orden int not null default 0,
  publicado boolean not null default true
);

create index testimonials_project_id_idx on public.testimonials (project_id);

create table public.timeline_items (
  id uuid primary key default gen_random_uuid(),
  tipo public.tipo_trayectoria not null,
  titulo text not null,
  organizacion text,
  inicio date,
  fin date,                         -- null = actual
  descripcion text,
  orden int not null default 0,
  check (fin is null or inicio is null or fin >= inicio)
);

create table public.skills (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  area public.area_habilidad not null,
  orden int not null default 0
);

-- Los límites de largo protegen la tabla aunque alguien use la API directo
-- con la clave pública, saltándose la server action.
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 1 and 120),
  email text not null check (char_length(email) between 3 and 254 and email like '%_@_%'),
  tipo public.tipo_consulta not null,
  mensaje text not null check (char_length(mensaje) between 1 and 5000),
  leido boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_leido_created_at_idx on public.messages (leido, created_at desc);

-- Administrador
create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade
);

-- ---------------------------------------------------------------------
-- Funciones y triggers
-- ---------------------------------------------------------------------

create function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger site_settings_set_updated_at
  before update on public.site_settings
  for each row execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- RLS
-- `(select public.is_admin())` se evalúa una vez por consulta, no por fila.
-- ---------------------------------------------------------------------

alter table public.site_settings enable row level security;
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.timeline_items enable row level security;
alter table public.skills enable row level security;
alter table public.messages enable row level security;
alter table public.admins enable row level security;

-- admins: sin políticas; solo se consulta vía is_admin() (security definer).
revoke all on public.admins from anon, authenticated;

-- site_settings, timeline_items, skills: lectura pública completa
create policy "Lectura pública" on public.site_settings
  for select to anon, authenticated using (true);
create policy "Lectura pública" on public.timeline_items
  for select to anon, authenticated using (true);
create policy "Lectura pública" on public.skills
  for select to anon, authenticated using (true);

-- projects, services, testimonials: público ve lo publicado, admin ve todo
create policy "Lectura pública de publicados" on public.projects
  for select to anon, authenticated using (publicado);
create policy "Admin lee todo" on public.projects
  for select to authenticated using ((select public.is_admin()));

create policy "Lectura pública de publicados" on public.services
  for select to anon, authenticated using (publicado);
create policy "Admin lee todo" on public.services
  for select to authenticated using ((select public.is_admin()));

create policy "Lectura pública de publicados" on public.testimonials
  for select to anon, authenticated using (publicado);
create policy "Admin lee todo" on public.testimonials
  for select to authenticated using ((select public.is_admin()));

-- Escritura solo admin en todas las tablas de contenido
do $$
declare
  t text;
begin
  foreach t in array array[
    'site_settings', 'projects', 'services', 'testimonials', 'timeline_items', 'skills'
  ]
  loop
    execute format(
      'create policy "Admin inserta" on public.%I for insert to authenticated with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin actualiza" on public.%I for update to authenticated using ((select public.is_admin())) with check ((select public.is_admin()))', t);
    execute format(
      'create policy "Admin borra" on public.%I for delete to authenticated using ((select public.is_admin()))', t);
  end loop;
end;
$$;

-- messages: cualquiera inserta (sin poder marcarlo como leído); solo admin lee/edita/borra
create policy "Cualquiera envía mensajes" on public.messages
  for insert to anon, authenticated with check (leido = false);
create policy "Admin lee mensajes" on public.messages
  for select to authenticated using ((select public.is_admin()));
create policy "Admin actualiza mensajes" on public.messages
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admin borra mensajes" on public.messages
  for delete to authenticated using ((select public.is_admin()));

-- ---------------------------------------------------------------------
-- Storage
-- Buckets públicos: la lectura es por URL pública, sin pasar por RLS.
-- ---------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-media', 'public-media', true, 5242880,
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('cv', 'cv', true, 10485760,
    array['application/pdf']);

-- select es necesario para que el admin pueda listar y hacer upsert (CV con nombre estable).
create policy "Admin lee media" on storage.objects
  for select to authenticated
  using (bucket_id in ('public-media', 'cv') and (select public.is_admin()));
create policy "Admin sube media" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('public-media', 'cv') and (select public.is_admin()));
create policy "Admin actualiza media" on storage.objects
  for update to authenticated
  using (bucket_id in ('public-media', 'cv') and (select public.is_admin()))
  with check (bucket_id in ('public-media', 'cv') and (select public.is_admin()));
create policy "Admin borra media" on storage.objects
  for delete to authenticated
  using (bucket_id in ('public-media', 'cv') and (select public.is_admin()));
