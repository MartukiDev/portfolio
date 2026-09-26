import { BASE_RGB, BLOB_ALPHA, TEAL_RGB, VIOLET_RGB } from "@/lib/background";
import type { Rgba } from "@/lib/contrast";

export const designSystem = {
  metaTitle: "Sistema de diseño",
  eyebrow: "Fase 1 · temporal",
  title: "Sistema de diseño",
  description:
    "Tokens, tipografía y componentes base del portafolio. Página interna para revisión.",

  colors: {
    eyebrow: "Tokens",
    title: "Color",
    items: [
      { token: "bg", cssVar: "--bg", hex: "#07090F", use: "Fondo base" },
      { token: "text-primary", cssVar: "--fg", hex: "#E6EAF2", use: "Texto principal" },
      { token: "text-muted", cssVar: "--muted", hex: "#8B93A7", use: "Texto secundario" },
      { token: "accent", cssVar: "--accent", hex: "#5EEAD4", use: "Links, CTA, foco, cursor" },
      { token: "accent-2", cssVar: "--accent-2", hex: "#A78BFA", use: "Detalles y manchas" },
      { token: "success", cssVar: "--success", hex: "#4ADE80", use: "Badge Disponible" },
      { token: "surface", cssVar: "--surface-solid", hex: "#0F131C", use: "Fallback sin blur" },
    ],
  },

  glass: {
    eyebrow: "Tokens",
    title: "Vidrio",
    items: [
      { token: "glass-bg", value: "rgba(255,255,255,0.04)" },
      { token: "glass-bg-hover", value: "rgba(255,255,255,0.07)" },
      { token: "glass-border", value: "rgba(255,255,255,0.10)" },
      { token: "glass-highlight", value: "inset 0 1px rgba(255,255,255,0.15)" },
      { token: "glass-blur", value: "18px" },
      { token: "glass-shadow", value: "0 24px 64px -16px rgba(0,0,0,0.6)" },
    ],
    cardTitle: "GlassCard",
    cardBody: "Tarjeta de vidrio con blur. Pasa el cursor sobre la versión interactiva.",
    cardInteractiveTitle: "GlassCard interactiva",
    cardFlatTitle: "GlassCard sin blur",
    cardFlatBody: "Para usar dentro de otra superficie de vidrio o en listas largas.",
    panelTitle: "GlassPanel",
    panelBody:
      "Contenedor principal de sección. Es la única capa con blur; lo de adentro usa glass-flat.",
  },

  typography: {
    eyebrow: "Oswald · Geist Sans · Geist Mono",
    title: "Tipografía",
    h1: "Construyo productos web",
    h2: "Proyectos destacados",
    h3: "Qué construí y mi rol",
    h4: "Detalle técnico",
    sectionEyebrow: "Servicios",
    sectionTitle: "Cómo puedo ayudarte",
    sectionDescription:
      "Título de sección con etiqueta pequeña en mayúsculas y bajada en texto secundario.",
    body: "Geist Sans para cuerpo e interfaz. Texto de párrafo con interlineado cómodo para lectura larga en casos de estudio y en la bio.",
    muted: "Texto secundario en text-muted para descripciones y metadatos.",
    mono: "martojs@m2air:~$ whoami",
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind"],
    labels: {
      h1: "h1 · Oswald 600",
      h2: "h2 · Oswald 600",
      h3: "h3 · Oswald 500",
      h4: "h4 · Oswald 500",
      section: "SectionTitle",
      body: "Cuerpo · Geist Sans",
      mono: "Mono · Geist Mono",
    },
  },

  buttons: {
    eyebrow: "Componentes",
    title: "Botones",
    primary: "Trabajemos juntos",
    secondary: "Ver CV",
    ghost: "Ghost",
    disabled: "Deshabilitado",
    small: "Pequeño",
    large: "Grande",
  },

  badges: {
    eyebrow: "Componentes",
    title: "Badges",
    available: "Disponible para freelance",
    availableInternship: "Práctica desde marzo 2027",
    accent: "Destacado",
    default: "Académico",
  },

  form: {
    eyebrow: "Componentes",
    title: "Formulario",
    name: "Nombre",
    namePlaceholder: "Tu nombre",
    email: "Correo",
    emailPlaceholder: "tu@correo.com",
    type: "Tipo de consulta",
    typeOptions: [
      { value: "freelance", label: "Proyecto freelance" },
      { value: "practica", label: "Práctica profesional" },
      { value: "otro", label: "Otro" },
    ],
    message: "Mensaje",
    messagePlaceholder: "Cuéntame sobre tu proyecto…",
    invalid: "Campo con error",
    invalidValue: "correo-invalido",
    disabled: "Campo deshabilitado",
    submit: "Enviar mensaje",
  },

  contrast: {
    eyebrow: "Accesibilidad",
    title: "Contraste",
    description:
      "Razón WCAG calculada contra cada superficie. AA exige 4.5:1 en texto normal y 3:1 en texto grande.",
    headers: { pair: "Par", surface: "Superficie", ratio: "Razón", result: "AA" },
    pass: "Cumple",
    fail: "No cumple",
  },
} as const;

const glass: Rgba = [255, 255, 255, 0.04];
const glassHover: Rgba = [255, 255, 255, 0.07];
const withAlpha = ([r, g, b]: Rgba, a: number): Rgba => [r, g, b, a];

/**
 * Superficies a evaluar. Los peores casos son vidrio hover sobre el centro de
 * cada mancha y sobre la zona donde ambas se cruzan (~mitad de intensidad).
 */
export const contrastSurfaces = {
  glass: { label: "Vidrio sobre base", layers: [BASE_RGB, glass] },
  teal: {
    label: "Vidrio hover sobre mancha teal",
    layers: [BASE_RGB, withAlpha(TEAL_RGB, BLOB_ALPHA.teal), glassHover],
  },
  violet: {
    label: "Vidrio hover sobre mancha violeta",
    layers: [BASE_RGB, withAlpha(VIOLET_RGB, BLOB_ALPHA.violet), glassHover],
  },
  overlap: {
    label: "Vidrio hover sobre cruce de manchas",
    layers: [
      BASE_RGB,
      withAlpha(TEAL_RGB, BLOB_ALPHA.teal / 2),
      withAlpha(VIOLET_RGB, BLOB_ALPHA.violet / 2),
      glassHover,
    ],
  },
  fallback: { label: "Fallback sólido", layers: [[15, 19, 28]] },
} as const satisfies Record<string, { label: string; layers: readonly Rgba[] }>;

export const contrastPairs = [
  { label: "text-primary", fg: "#E6EAF2" },
  { label: "text-muted", fg: "#8B93A7" },
  { label: "accent", fg: "#5EEAD4" },
  { label: "accent-2", fg: "#A78BFA" },
  { label: "success", fg: "#4ADE80" },
] as const;

export const primaryButtonContrast = {
  label: "bg sobre accent (botón primario)",
  fg: "#07090F",
  bg: "#5EEAD4",
} as const;
