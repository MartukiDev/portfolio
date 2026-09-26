-- =====================================================================
-- Seed de ejemplo. Todo el contenido se reemplaza desde el backoffice.
-- Clientes y testimonios son FICTICIOS: borrarlos antes de lanzar.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Ajustes generales
-- ---------------------------------------------------------------------

insert into public.site_settings (
  id, nombre, tagline, hero_descripcion, bio,
  disponible_freelance, disponible_practica, practica_desde, practica_duracion,
  email, whatsapp, github_url, linkedin_url, cv_pdf_path
) values (
  1,
  'Martín Maturana',
  'Constructor',
  'Estudiante de Ingeniería en Informática. Construyo aplicaciones web de punta a punta: desde la base de datos hasta la interfaz, y a veces también el hardware.',
  '{
    "type": "doc",
    "content": [
      {"type": "paragraph", "content": [
        {"type": "text", "text": "Soy estudiante de Ingeniería en Informática en la UPLA, en San Felipe. Me gusta construir cosas que la gente usa: sistemas para pequeños negocios, herramientas internas y proyectos que mezclan software con electrónica."}
      ]},
      {"type": "paragraph", "content": [
        {"type": "text", "text": "Trabajo principalmente con "},
        {"type": "text", "marks": [{"type": "bold"}], "text": "Next.js, TypeScript y Postgres"},
        {"type": "text", "text": ", y me importa entregar productos rápidos, accesibles y fáciles de mantener."}
      ]}
    ]
  }'::jsonb,
  true,
  true,
  '2027-03-01',
  '360 horas',
  'contacto@example.com',   -- reemplazar desde /admin/ajustes
  '56900000000',            -- reemplazar desde /admin/ajustes
  'https://github.com/',    -- reemplazar desde /admin/ajustes
  'https://www.linkedin.com/',
  null
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- Proyectos (2 destacados, 1 borrador)
-- ---------------------------------------------------------------------

insert into public.projects (
  slug, titulo, resumen, categoria, cliente, rol, problema, resultado,
  contenido, stack, demo_url, repo_url, destacado, publicado, orden
) values
(
  'reservas-centro-deportivo',
  'Sistema de reservas para centro deportivo',
  'Reemplacé la agenda en papel y WhatsApp por reservas online de canchas con pago y recordatorios.',
  'cliente',
  'Centro Deportivo Aconcagua (ejemplo)',
  'Desarrollo completo: levantamiento de requisitos, diseño de la base de datos, frontend, panel de administración y despliegue.',
  'Las reservas se tomaban por WhatsApp y se anotaban en un cuaderno. Había choques de horario, canchas vacías por inasistencias y nadie sabía cuánto se recaudaba por mes.',
  'Las reservas dobles desaparecieron, las inasistencias bajaron cerca de un 40 % gracias a los recordatorios y la administración ve la ocupación y los ingresos en un panel.',
  '{
    "type": "doc",
    "content": [
      {"type": "heading", "attrs": {"level": 3}, "content": [{"type": "text", "text": "Disponibilidad sin choques"}]},
      {"type": "paragraph", "content": [
        {"type": "text", "text": "Cada reserva es un rango de tiempo con una restricción de exclusión en Postgres, así que dos personas no pueden tomar la misma cancha a la misma hora aunque confirmen al mismo tiempo."}
      ]},
      {"type": "heading", "attrs": {"level": 3}, "content": [{"type": "text", "text": "Recordatorios"}]},
      {"type": "paragraph", "content": [
        {"type": "text", "text": "Un cron diario envía un recordatorio 24 horas antes con un link para cancelar, lo que libera la cancha para otra persona."}
      ]}
    ]
  }'::jsonb,
  array['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS', 'Resend'],
  null,
  null,
  true,
  true,
  1
),
(
  'monitor-invernadero-iot',
  'Monitor de invernadero con ESP32',
  'Sensores de temperatura y humedad que envían datos a un panel web con alertas cuando algo se sale de rango.',
  'propio',
  null,
  'Proyecto personal: diseño del circuito, firmware del ESP32, API de ingesta y panel web.',
  'En un invernadero familiar las heladas y los golpes de calor se detectaban tarde, cuando las plantas ya estaban dañadas.',
  'El panel muestra las lecturas cada cinco minutos y envía una alerta al celular cuando la temperatura baja de 3 °C o sube de 35 °C.',
  '{
    "type": "doc",
    "content": [
      {"type": "paragraph", "content": [
        {"type": "text", "text": "El ESP32 lee un sensor DHT22 y publica las lecturas por HTTPS a un endpoint que valida una clave por dispositivo. Si pierde el WiFi, guarda las lecturas en memoria y las reenvía al reconectarse."}
      ]}
    ]
  }'::jsonb,
  array['ESP32', 'C++', 'Next.js', 'PostgreSQL', 'Recharts'],
  null,
  'https://github.com/',
  true,
  true,
  2
),
(
  'asistente-estudio-ia',
  'Asistente de estudio con IA',
  'Chat que responde preguntas sobre los apuntes de un ramo, citando la parte del material de donde sale cada respuesta.',
  'academico',
  null,
  'Proyecto de curso en equipo de tres: me encargué del pipeline de indexación y de la interfaz del chat.',
  'Los apuntes del ramo estaban repartidos en decenas de PDF y era difícil encontrar dónde se explicaba cada concepto antes de una prueba.',
  'El asistente responde con referencias a la página exacta del material. Lo usaron cerca de 30 compañeros durante el semestre.',
  '{
    "type": "doc",
    "content": [
      {"type": "paragraph", "content": [
        {"type": "text", "text": "Los PDF se dividen en fragmentos, se indexan con embeddings en Postgres (pgvector) y cada pregunta recupera los fragmentos más cercanos antes de generar la respuesta."}
      ]}
    ]
  }'::jsonb,
  array['Python', 'FastAPI', 'pgvector', 'React'],
  null,
  'https://github.com/',
  false,
  true,
  3
),
(
  'catalogo-emprendimiento-local',
  'Catálogo web para emprendimiento local',
  'Landing y catálogo de productos con pedidos por WhatsApp para una tienda de cerámica.',
  'cliente',
  'Taller de cerámica (ejemplo)',
  'Diseño y desarrollo del sitio y un panel simple para que la dueña actualice productos y precios.',
  'La tienda vendía solo por Instagram y respondía a mano las mismas preguntas de precio y stock.',
  'Pendiente: el sitio está en revisión con la clienta.',
  null,
  array['Next.js', 'Tailwind CSS', 'Supabase'],
  null,
  null,
  false,
  false,   -- borrador: no debe verse en el sitio público
  4
);

-- ---------------------------------------------------------------------
-- Servicios (3 publicados, 1 borrador)
-- ---------------------------------------------------------------------

insert into public.services (titulo, descripcion, icono, orden, publicado) values
(
  'Sitios web para tu negocio',
  'Una página rápida y bien hecha que explica lo que haces, aparece en Google y te trae contactos por WhatsApp o correo.',
  'globe',
  1,
  true
),
(
  'Sistemas a medida',
  'Reservas, inventario, fichas de clientes o lo que tu negocio hoy lleva en planillas: un sistema web simple que ahorra tiempo y errores.',
  'layout-dashboard',
  2,
  true
),
(
  'Automatización e integraciones',
  'Conecto tus herramientas para que los datos pasen solos de un lado a otro: formularios, correos, pagos y reportes.',
  'workflow',
  3,
  true
),
(
  'Prototipos con hardware',
  'Sensores y dispositivos conectados a un panel web. En preparación.',
  'cpu',
  4,
  false
);

-- ---------------------------------------------------------------------
-- Testimonios (FICTICIOS)
-- ---------------------------------------------------------------------

insert into public.testimonials (autor, cargo, texto, project_id, orden, publicado) values
(
  'Carolina Rojas (ejemplo)',
  'Administradora, Centro Deportivo Aconcagua',
  'Antes pasábamos el día respondiendo WhatsApp para agendar canchas. Ahora la gente reserva sola y yo solo reviso el panel. Martín entendió cómo funcionábamos antes de proponer nada.',
  (select id from public.projects where slug = 'reservas-centro-deportivo'),
  1,
  true
),
(
  'Diego Fuentes (ejemplo)',
  'Compañero de proyecto',
  'Martín tomó la parte más difícil del proyecto y además dejó todo documentado para que el resto pudiera seguir. Siempre explicaba sus decisiones.',
  (select id from public.projects where slug = 'asistente-estudio-ia'),
  2,
  true
);

-- ---------------------------------------------------------------------
-- Trayectoria (un ítem o más de cada tipo)
-- ---------------------------------------------------------------------

insert into public.timeline_items (tipo, titulo, organizacion, inicio, fin, descripcion, orden) values
(
  'formacion',
  'Ingeniería en Informática',
  'Universidad de Playa Ancha, San Felipe',
  '2022-03-01',
  null,
  'Cursando. Énfasis en desarrollo de software y bases de datos.',
  1
),
(
  'freelance',
  'Desarrollador web freelance',
  'Independiente',
  '2024-01-01',
  null,
  'Sitios y sistemas a medida para pequeños negocios de la región de Valparaíso.',
  2
),
(
  'ayudantia',
  'Ayudante de Sistemas de Bases de Datos',
  'Universidad de Playa Ancha',
  '2025-03-01',
  '2025-07-31',
  'Apoyo en laboratorios de SQL (Oracle), corrección de talleres y resolución de dudas.',
  3
),
(
  'experiencia',
  'Soporte TI',
  'Municipalidad (ejemplo)',
  '2023-12-01',
  '2024-02-29',
  'Trabajo de verano: soporte a usuarios, mantenimiento de equipos e inventario de hardware.',
  4
);

-- ---------------------------------------------------------------------
-- Habilidades por área
-- ---------------------------------------------------------------------

insert into public.skills (nombre, area, orden) values
  ('Next.js', 'frontend', 1),
  ('React', 'frontend', 2),
  ('TypeScript', 'frontend', 3),
  ('Tailwind CSS', 'frontend', 4),
  ('Node.js', 'backend', 1),
  ('PostgreSQL', 'backend', 2),
  ('Supabase', 'backend', 3),
  ('Oracle SQL', 'backend', 4),
  ('Python', 'backend', 5),
  ('ESP32', 'hardware', 1),
  ('Arduino', 'hardware', 2),
  ('Electrónica básica', 'hardware', 3),
  ('APIs de LLM', 'ia', 1),
  ('RAG con pgvector', 'ia', 2),
  ('Vercel', 'infra', 1),
  ('Docker', 'infra', 2),
  ('Git y GitHub', 'infra', 3),
  ('Figma', 'otras', 1),
  ('Scrum', 'otras', 2);
