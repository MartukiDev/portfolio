-- Tests de RLS y Storage. Todo corre dentro de una transacción que se
-- revierte al final: no deja datos en la base.
begin;

-- El CLI entra con un rol de login que no hereda permisos: se asume
-- postgres para ver pgTAP (schema `extensions`) y crear datos de prueba.
set local role postgres;
set local search_path = public, extensions;

select plan(34);

-- ---------------------------------------------------------------------
-- Datos de prueba (como postgres, sin RLS)
-- ---------------------------------------------------------------------

insert into public.site_settings (id, nombre) values (1, 'Test') on conflict (id) do nothing;

insert into public.projects (id, slug, titulo, resumen, categoria, publicado) values
  ('00000000-0000-0000-0000-00000000a001', 'test-publicado', 'Publicado', 'r', 'propio', true),
  ('00000000-0000-0000-0000-00000000a002', 'test-borrador', 'Borrador', 'r', 'propio', false);

insert into public.services (id, titulo, descripcion, publicado) values
  ('00000000-0000-0000-0000-00000000b001', 'Publicado', 'd', true),
  ('00000000-0000-0000-0000-00000000b002', 'Borrador', 'd', false);

insert into public.testimonials (id, autor, texto, publicado) values
  ('00000000-0000-0000-0000-00000000c001', 'Publicado', 't', true),
  ('00000000-0000-0000-0000-00000000c002', 'Borrador', 't', false);

insert into public.timeline_items (id, tipo, titulo) values
  ('00000000-0000-0000-0000-00000000d001', 'formacion', 'Test');

insert into public.skills (id, nombre, area) values
  ('00000000-0000-0000-0000-00000000e001', 'Test', 'otras');

insert into public.messages (id, nombre, email, tipo, mensaje) values
  ('00000000-0000-0000-0000-00000000f001', 'Test', 'a@b.cl', 'otro', 'hola');

-- Usuario admin y usuario autenticado sin permisos
insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-0000000ad001', 'admin@test.local'),
  ('00000000-0000-0000-0000-0000000ad002', 'otro@test.local');
insert into public.admins (user_id) values ('00000000-0000-0000-0000-0000000ad001');

-- =====================================================================
-- Anónimo: lectura
-- =====================================================================

set local role anon;

select is((select count(*)::int from public.site_settings), 1, 'anon lee site_settings');
select is((select count(*)::int from public.timeline_items where id = '00000000-0000-0000-0000-00000000d001'), 1, 'anon lee timeline_items');
select is((select count(*)::int from public.skills where id = '00000000-0000-0000-0000-00000000e001'), 1, 'anon lee skills');

select is((select count(*)::int from public.projects where id = '00000000-0000-0000-0000-00000000a001'), 1, 'anon ve proyecto publicado');
select is((select count(*)::int from public.projects where id = '00000000-0000-0000-0000-00000000a002'), 0, 'anon NO ve proyecto borrador');
select is((select count(*)::int from public.projects where not publicado), 0, 'anon no ve ningún proyecto borrador');

select is((select count(*)::int from public.services where id = '00000000-0000-0000-0000-00000000b001'), 1, 'anon ve servicio publicado');
select is((select count(*)::int from public.services where not publicado), 0, 'anon no ve servicios borrador');

select is((select count(*)::int from public.testimonials where id = '00000000-0000-0000-0000-00000000c001'), 1, 'anon ve testimonio publicado');
select is((select count(*)::int from public.testimonials where not publicado), 0, 'anon no ve testimonios borrador');

select is((select count(*)::int from public.messages), 0, 'anon no lee messages');
select throws_ok('select * from public.admins', '42501', null, 'anon no accede a admins');

-- =====================================================================
-- Anónimo: escritura
-- =====================================================================

select throws_ok(
  $$insert into public.projects (slug, titulo, resumen, categoria) values ('x', 'x', 'x', 'propio')$$,
  '42501', null, 'anon no inserta projects');
select throws_ok(
  $$insert into public.services (titulo, descripcion) values ('x', 'x')$$,
  '42501', null, 'anon no inserta services');
select throws_ok(
  $$insert into public.testimonials (autor, texto) values ('x', 'x')$$,
  '42501', null, 'anon no inserta testimonials');
select throws_ok(
  $$insert into public.timeline_items (tipo, titulo) values ('formacion', 'x')$$,
  '42501', null, 'anon no inserta timeline_items');
select throws_ok(
  $$insert into public.skills (nombre, area) values ('x', 'otras')$$,
  '42501', null, 'anon no inserta skills');

-- update/delete sin política no fallan: simplemente no afectan filas
select results_eq(
  $$with u as (update public.projects set titulo = 'hack' returning 1) select count(*)::int from u$$,
  array[0], 'anon no actualiza projects');
select results_eq(
  $$with u as (update public.site_settings set nombre = 'hack' returning 1) select count(*)::int from u$$,
  array[0], 'anon no actualiza site_settings');
select results_eq(
  $$with d as (delete from public.skills returning 1) select count(*)::int from d$$,
  array[0], 'anon no borra skills');
select results_eq(
  $$with d as (delete from public.timeline_items returning 1) select count(*)::int from d$$,
  array[0], 'anon no borra timeline_items');
select results_eq(
  $$with u as (update public.messages set leido = true returning 1) select count(*)::int from u$$,
  array[0], 'anon no actualiza messages');

-- messages: insert permitido, pero no marcado como leído
select lives_ok(
  $$insert into public.messages (nombre, email, tipo, mensaje) values ('Ana', 'ana@test.cl', 'freelance', 'Hola')$$,
  'anon inserta en messages');
select throws_ok(
  $$insert into public.messages (nombre, email, tipo, mensaje, leido) values ('Ana', 'ana@test.cl', 'otro', 'Hola', true)$$,
  '42501', null, 'anon no inserta messages ya leídos');
select throws_ok(
  $$insert into public.messages (nombre, email, tipo, mensaje) values ('Ana', 'ana@test.cl', 'otro', repeat('x', 5001))$$,
  '23514', null, 'messages rechaza mensajes demasiado largos');

-- Storage
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('cv', 'cv.pdf')$$,
  '42501', null, 'anon no sube al bucket cv');
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('public-media', 'x.png')$$,
  '42501', null, 'anon no sube al bucket public-media');

-- =====================================================================
-- Autenticado sin ser admin
-- =====================================================================

set local role postgres;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000ad002", "role": "authenticated"}';
set local role authenticated;

select is(public.is_admin(), false, 'usuario común no es admin');
select throws_ok(
  $$insert into public.projects (slug, titulo, resumen, categoria) values ('y', 'y', 'y', 'propio')$$,
  '42501', null, 'usuario común no inserta projects');
select is((select count(*)::int from public.messages), 0, 'usuario común no lee messages');

-- =====================================================================
-- Admin
-- =====================================================================

set local role postgres;
set local request.jwt.claims = '{"sub": "00000000-0000-0000-0000-0000000ad001", "role": "authenticated"}';
set local role authenticated;

select is(public.is_admin(), true, 'admin es admin');
select is((select count(*)::int from public.projects where id = '00000000-0000-0000-0000-00000000a002'), 1, 'admin ve borradores');
select is((select count(*)::int from public.messages where id = '00000000-0000-0000-0000-00000000f001'), 1, 'admin lee messages');
select lives_ok(
  $$insert into public.projects (slug, titulo, resumen, categoria) values ('admin-test', 'z', 'z', 'propio')$$,
  'admin inserta projects');

select * from finish();

rollback;
