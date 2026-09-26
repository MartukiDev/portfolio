# Portafolio Martín (martodev) — Especificación técnica

## Objetivo

Sitio personal que cumple tres funciones a la vez:

1. **Conseguir clientes freelance** → servicios, casos de estudio con resultados, contacto fácil (formulario + WhatsApp).
2. **Currículum** → página de CV en web + PDF descargable.
3. **Práctica profesional** → disponibilidad visible (desde cuándo, cuánto tiempo), profundidad técnica en los proyectos, links a repos.

La portada tiene dos llamados a la acción claros: **"Trabajemos juntos"** (clientes) y **"Ver CV"** (empresas).

Todo el contenido se edita desde un **backoffice sencillo** (un solo usuario administrador).

---

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Supabase: Postgres, Auth, Storage
- Tiptap (editor de texto enriquecido para casos de estudio y bio)
- Framer Motion (animaciones sutiles)
- Solo modo oscuro (sin next-themes ni toggle de tema)
- Resend (aviso por correo cuando llega un mensaje; plan free)
- Zod (validación de formularios y server actions)
- Deploy en Vercel, dominio propio

Principios: mutaciones con **server actions**, páginas públicas estáticas/ISR y **revalidación bajo demanda** (`revalidatePath` / `revalidateTag`) después de cada cambio en el backoffice. Sin librerías de UI pesadas.

---

## Mapa del sitio público

| Ruta | Contenido |
|---|---|
| `/` | Hero (nombre, tagline "Constructor", badges de disponibilidad), 2 CTA, proyectos destacados (3–4), servicios resumidos, testimonios, franja de contacto |
| `/proyectos` | Grilla de todos los proyectos publicados, filtro por categoría (cliente / propio / académico) |
| `/proyectos/[slug]` | Caso de estudio: resumen → problema → qué construí y mi rol → resultado → detalle técnico (contenido Tiptap) → stack → links demo/repo → galería |
| `/servicios` | Servicios ofrecidos en lenguaje de cliente + CTA "Cotiza tu proyecto" |
| `/cv` | Versión web del CV: sobre mí, disponibilidad de práctica, trayectoria (formación, experiencia, ayudantía), habilidades por área, botón descargar PDF |
| `/contacto` | Formulario (nombre, correo, tipo de consulta, mensaje), botón WhatsApp, correo, GitHub, LinkedIn |

Componentes globales: header de vidrio fijo con navegación, footer con redes y correo.

---

## Backoffice

Protegido con Supabase Auth (email + contraseña). **Registro público deshabilitado** en Supabase; el único usuario se crea a mano.

| Ruta | Función |
|---|---|
| `/admin/login` | Inicio de sesión |
| `/admin` | Dashboard: mensajes no leídos, conteo de proyectos publicados/borrador, accesos rápidos |
| `/admin/proyectos` | Listado, crear, editar, publicar/despublicar, marcar destacado, reordenar |
| `/admin/proyectos/[id]` | Editor: campos simples + editor Tiptap para el detalle + subida de portada y galería |
| `/admin/servicios` | CRUD + orden |
| `/admin/testimonios` | CRUD + orden, opcionalmente asociado a un proyecto |
| `/admin/trayectoria` | CRUD de formación, experiencia, freelance y ayudantía |
| `/admin/habilidades` | CRUD de habilidades agrupadas por área |
| `/admin/mensajes` | Bandeja de mensajes del formulario, marcar leído, borrar |
| `/admin/ajustes` | Datos generales: textos del hero, bio, disponibilidad, contacto, redes, subir CV en PDF |

Protección de rutas `/admin/*` en `proxy.ts` (antes `middleware.ts`) + verificación de sesión en cada server action.

Orden de elementos: campo `orden` numérico con botones subir/bajar (sin drag & drop por ahora).

---

## Modelo de datos (Supabase)

```sql
-- Ajustes generales (una sola fila)
create table site_settings (
  id int primary key default 1 check (id = 1),
  nombre text not null,
  tagline text,
  hero_descripcion text,
  bio jsonb,                        -- Tiptap
  disponible_freelance boolean default true,
  disponible_practica boolean default true,
  practica_desde date,
  practica_duracion text,           -- ej. "360 horas" / "3 meses"
  email text,
  whatsapp text,                    -- formato internacional, ej. 569XXXXXXXX
  github_url text,
  linkedin_url text,
  cv_pdf_path text,                 -- ruta en Storage
  updated_at timestamptz default now()
);

create type categoria_proyecto as enum ('cliente', 'propio', 'academico');

create table projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  titulo text not null,
  resumen text not null,            -- 1–2 líneas para tarjetas
  categoria categoria_proyecto not null,
  cliente text,
  rol text,                         -- qué hice yo
  problema text,
  resultado text,
  contenido jsonb,                  -- Tiptap: detalle técnico
  stack text[] default '{}',
  portada_path text,
  galeria_paths text[] default '{}',
  demo_url text,
  repo_url text,
  destacado boolean default false,
  publicado boolean default false,
  orden int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table services (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descripcion text not null,
  icono text,                       -- nombre de ícono (lucide)
  orden int default 0,
  publicado boolean default true
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  cargo text,
  texto text not null,
  project_id uuid references projects(id) on delete set null,
  orden int default 0,
  publicado boolean default true
);

create type tipo_trayectoria as enum ('formacion', 'experiencia', 'freelance', 'ayudantia');

create table timeline_items (
  id uuid primary key default gen_random_uuid(),
  tipo tipo_trayectoria not null,
  titulo text not null,
  organizacion text,
  inicio date,
  fin date,                         -- null = actual
  descripcion text,
  orden int default 0
);

create type area_habilidad as enum ('frontend', 'backend', 'hardware', 'ia', 'infra', 'otras');

create table skills (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  area area_habilidad not null,
  orden int default 0
);

create type tipo_consulta as enum ('freelance', 'practica', 'otro');

create table messages (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text not null,
  tipo tipo_consulta not null,
  mensaje text not null,
  leido boolean default false,
  created_at timestamptz default now()
);

-- Administrador
create table admins (user_id uuid primary key references auth.users(id));

create function is_admin() returns boolean
language sql stable security definer as $$
  select exists (select 1 from admins where user_id = auth.uid());
$$;
```

### RLS

- Activar RLS en todas las tablas.
- **Lectura pública**: `site_settings`, `skills`, `timeline_items` completas; `projects`, `services`, `testimonials` solo `where publicado = true`.
- **Escritura**: solo `is_admin()` en todas las tablas.
- **messages**: `insert` permitido a anónimos (el envío pasa por server action con validación); `select/update/delete` solo `is_admin()`.

### Storage

- Bucket `public-media` (público): portadas, galería.
- Bucket `cv` (público): el PDF del CV, con nombre estable para que el link no cambie.
- Subida/borrado solo `is_admin()`.

---

## Formulario de contacto

- Server action con Zod.
- Anti-spam: campo honeypot + rechazo si el envío llega en menos de ~3 s desde que se cargó el formulario.
- Guarda en `messages` y envía aviso con Resend al correo de `site_settings.email`.
- Botón WhatsApp con mensaje prellenado según tipo de consulta.

---

## Estructura de carpetas (orientativa)

```
src/
  app/
    (public)/
      page.tsx
      proyectos/page.tsx
      proyectos/[slug]/page.tsx
      servicios/page.tsx
      cv/page.tsx
      contacto/page.tsx
      layout.tsx
    admin/
      login/page.tsx
      (panel)/
        layout.tsx
        page.tsx
        proyectos/...
        servicios/...
        testimonios/...
        trayectoria/...
        habilidades/...
        mensajes/...
        ajustes/...
    sitemap.ts
    robots.ts
  components/
    public/
    admin/
    ui/
  lib/
    supabase/ (server.ts, client.ts)
    actions/  (una por entidad)
    validations/ (schemas Zod)
    queries/  (lecturas públicas cacheadas)
  proxy.ts
supabase/
  migrations/
  seed.sql
```

---

## SEO

- `generateMetadata` por página; en proyectos usa título, resumen y portada.
- `sitemap.ts` dinámico con proyectos publicados, `robots.ts` excluyendo `/admin`.
- JSON-LD tipo `Person` en la portada.
- Imágenes OG por proyecto (portada) y una por defecto.

---

## Dirección visual: glassmorphism oscuro

### Fondo
- Base casi negra con un leve tinte azul: `#07090F`.
- 2–3 manchas de color difuminadas (blur grande, baja opacidad) detrás del contenido para que el vidrio tenga algo que refractar: teal y violeta. Movimiento muy lento con `transform` (nunca animar `filter`), desactivado con `prefers-reduced-motion`.
- Textura de ruido sutil opcional (SVG inline, opacidad ~3 %).

### Superficies de vidrio (tokens)
| Token | Valor |
|---|---|
| `glass-bg` | `rgba(255,255,255,0.04)` |
| `glass-bg-hover` | `rgba(255,255,255,0.07)` |
| `glass-border` | `rgba(255,255,255,0.10)` |
| `glass-highlight` | borde superior interno `rgba(255,255,255,0.15)` |
| `glass-blur` | `backdrop-blur` 16–20 px |
| `glass-shadow` | sombra oscura amplia y suave |

- Fallback con `@supports not (backdrop-filter: blur(1px))`: fondo sólido `#0F131C`.
- Rendimiento: no anidar capas con blur ni usar blur en listas largas; en el backoffice, vidrio solo en contenedores principales.

### Color
| Token | Valor | Uso |
|---|---|---|
| `text-primary` | `#E6EAF2` | Texto principal |
| `text-muted` | `#8B93A7` | Texto secundario |
| `accent` | `#5EEAD4` | Cursor de terminal, links, CTA principal, foco |
| `accent-2` | `#A78BFA` | Detalles y manchas de fondo |
| `success` | `#4ADE80` | Badge "Disponible" |

Contraste mínimo AA en todo texto sobre vidrio.

### Tipografía (next/font)
- **Oswald** (`next/font/google`, variable): títulos (h1–h4 y títulos de sección con etiqueta pequeña en mayúsculas).
- **Geist Sans**: interfaz y cuerpo.
- **Geist Mono**: hero de terminal, etiquetas de stack, detalles técnicos.

### Hero: nombre escribiéndose en terminal
La portada abre con una ventana de terminal de vidrio (barra con tres puntos y título `martodev@portafolio: ~`). Secuencia:

1. Aparece el prompt `martin@upla:~$` y se escribe `whoami`.
2. Salida: el nombre (desde `site_settings.nombre`) escribiéndose carácter a carácter en tamaño grande, en mono.
3. Debajo aparece la tagline (desde `site_settings.tagline`).
4. Entran con fade los badges de disponibilidad y los dos CTA.
5. Queda el cursor parpadeando al final.

Reglas:
- **Se ejecuta una sola vez por sesión** (`sessionStorage`). Si ya se vio, o si hay `prefers-reduced-motion`, se muestra directamente el estado final.
- Sin parpadeo al cargar: un script inline mínimo en `<head>` marca `data-hero-played` en `<html>` antes del primer pintado, y el CSS decide el estado inicial según ese atributo.
- Clic, tecla o scroll durante la animación la saltan al estado final.
- Duración total menor a ~3 s; escritura a ~40–60 ms por carácter con leve variación para que se sienta humana.
- Accesibilidad y SEO: el `<h1>` contiene el nombre completo en el HTML del servidor; el texto animado es decorativo (`aria-hidden`) con el texto real en un elemento solo para lectores de pantalla.
- Espacio reservado desde el inicio para que no haya salto de layout.
- Sin librerías de tipeo; lógica propia en un client component + Framer Motion para los fade.

---

## Fases de desarrollo

Los prompts por fase están en `docs/prompts.md`.

1. Base y sistema de diseño
2. Esquema de Supabase, RLS, Storage y seed
3. Auth y layout del backoffice
4. Backoffice: ajustes y proyectos
5. Backoffice: servicios, testimonios, trayectoria, habilidades y mensajes
6. Layout público y hero de terminal
7. Páginas públicas: proyectos, caso de estudio, servicios, CV
8. Contacto y Resend
9. Pulido, SEO y rendimiento
10. Deploy

---

## Pendiente de definir

- Dominio.
- Textos reales de hero, bio y casos de estudio (se cargan desde el backoffice).
- Permiso de clientes para mostrar sus proyectos.

## Fuera de alcance por ahora

- Versión en inglés (dejar textos fuera de los componentes para facilitarla después).
- Blog.
- Múltiples usuarios o roles en el backoffice.
- Modo claro.
