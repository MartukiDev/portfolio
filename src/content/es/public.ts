export const publicContent = {
  brand: "martodev",
  skipToContent: "Saltar al contenido",

  nav: {
    label: "Navegación principal",
    open: "Abrir menú",
    close: "Cerrar menú",
    items: [
      { href: "/proyectos", label: "Proyectos" },
      { href: "/servicios", label: "Servicios" },
      { href: "/cv", label: "CV" },
      { href: "/contacto", label: "Contacto" },
    ],
  },

  hero: {
    windowTitle: "martodev@portafolio: ~",
    prompt: "martojs@m2air:~$",
    command: "whoami",
    ctaPrimary: { href: "/contacto", label: "Trabajemos juntos" },
    ctaSecondary: { href: "/cv", label: "Ver CV" },
    badges: {
      freelance: "Disponible para freelance",
      internship: "Disponible para práctica",
      internshipFrom: (desde: string) => `Práctica desde ${desde}`,
    },
    skipHint: "Clic o cualquier tecla para saltar la animación",
  },

  placeholder: {
    eyebrow: "En construcción",
    title: "Proyectos, servicios y más",
    description: "Esta sección se completa en las próximas fases.",
  },

  footer: {
    label: "Contacto y redes",
    email: "Correo",
    github: "GitHub",
    linkedin: "LinkedIn",
    whatsapp: "WhatsApp",
    rights: (year: number, name: string) => `© ${year} ${name}`,
  },
} as const;
