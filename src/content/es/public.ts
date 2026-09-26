export const publicContent = {
  brand: "martojs",
  skipToContent: "Saltar al contenido",

  nav: {
    label: "Navegación principal",
    open: "Abrir menú",
    close: "Cerrar menú",
    items: [
      { href: "/proyectos", label: "Proyectos", icon: "projects" },
      { href: "/servicios", label: "Servicios", icon: "services" },
      { href: "/cv", label: "CV", icon: "cv" },
      { href: "/contacto", label: "Contacto", icon: "contact" },
    ],
  },

  hero: {
    windowTitle: "martojs@portafolio: ~",
    prompt: "martojs@m2air:~$",
    command: "whoami",
    ctaPrimary: { href: "/contacto", label: "Trabajemos juntos" },
    ctaSecondary: { href: "/cv", label: "Ver CV" },
    badges: {
      freelance: "Disponible para freelance",
      internship: "Disponible para práctica",
      internshipFrom: (desde: string) => `Práctica desde ${desde}`,
    },
  },

  categorias: {
    cliente: "Cliente",
    propio: "Propio",
    academico: "Académico",
  },

  home: {
    featured: {
      eyebrow: "Proyectos",
      title: "Trabajo destacado",
      description: "Una selección de lo que he construido: para clientes, por mi cuenta y en la universidad.",
      viewAll: "Ver todos los proyectos",
    },
    services: {
      eyebrow: "Servicios",
      title: "Cómo puedo ayudarte",
      viewAll: "Ver servicios",
    },
    testimonials: {
      eyebrow: "Testimonios",
      title: "Lo que dicen",
    },
  },

  contactStrip: {
    eyebrow: "Contacto",
    title: "¿Tienes un proyecto en mente?",
    description: "Cuéntame qué necesitas y te respondo con una propuesta concreta.",
    cta: "Trabajemos juntos",
    whatsapp: "Escríbeme por WhatsApp",
    email: "O por correo",
  },

  projects: {
    metaTitle: "Proyectos",
    eyebrow: "Portafolio",
    title: "Proyectos",
    description: "Casos de estudio con el problema, lo que construí y el resultado.",
    filterLabel: "Filtrar por categoría",
    all: "Todos",
    viewCase: "Ver caso",
    empty: {
      command: "ls proyectos/",
      output: "total 0",
      message: "Todavía no hay proyectos publicados.",
    },
    emptyFilter: {
      command: (categoria: string) => `ls proyectos/ | grep ${categoria}`,
      output: "(sin coincidencias)",
      message: "No hay proyectos en esta categoría.",
      reset: "Ver todos",
    },
  },

  caseStudy: {
    back: "Todos los proyectos",
    client: "Cliente",
    category: "Categoría",
    sections: {
      problem: "El problema",
      role: "Qué construí y mi rol",
      result: "Resultado",
      technical: "Detalle técnico",
      stack: "Stack",
      links: "Enlaces",
      gallery: "Galería",
    },
    demo: "Ver demo",
    repo: "Ver repositorio",
    coverAlt: (titulo: string) => `Portada de ${titulo}`,
    galleryAlt: (titulo: string, n: number) => `${titulo}: imagen ${n}`,
    lightbox: {
      label: "Galería de imágenes",
      open: (n: number) => `Ampliar imagen ${n}`,
      close: "Cerrar",
      previous: "Imagen anterior",
      next: "Imagen siguiente",
      counter: (current: number, total: number) => `${current} / ${total}`,
    },
    cta: {
      title: "¿Necesitas algo parecido?",
      action: "Conversemos",
    },
  },

  services: {
    metaTitle: "Servicios",
    eyebrow: "Servicios",
    title: "Qué puedo hacer por ti",
    description:
      "Desarrollo web a medida para negocios y equipos: desde una página que trae clientes hasta sistemas que ordenan tu operación.",
    cta: {
      title: "¿Listo para empezar?",
      description: "Cuéntame tu idea y te envío una cotización sin compromiso.",
      action: "Cotiza tu proyecto",
      href: "/contacto?tipo=freelance",
    },
    empty: {
      command: "ls servicios/",
      output: "total 0",
      message: "Pronto publicaré los servicios disponibles. Mientras, puedes escribirme.",
    },
  },

  cv: {
    metaTitle: "CV",
    eyebrow: "Currículum",
    title: "CV",
    download: "Descargar CV en PDF",
    downloadName: (nombre: string) => `CV ${nombre}.pdf`,
    about: "Sobre mí",
    availability: {
      eyebrow: "Disponibilidad",
      internshipTitle: "Busco práctica profesional",
      internshipFrom: (desde: string) => `Desde ${desde}`,
      internshipDuration: (duracion: string) => `Duración: ${duracion}`,
      freelanceTitle: "Disponible para proyectos freelance",
      freelanceText: "Sitios, sistemas a medida e integraciones.",
      contact: "Contáctame",
    },
    timeline: {
      title: "Trayectoria",
      current: "Actual",
      tipos: {
        experiencia: "Experiencia",
        freelance: "Freelance",
        ayudantia: "Ayudantía",
        formacion: "Formación",
      },
      empty: "La trayectoria se publicará pronto.",
    },
    skills: {
      title: "Habilidades",
      areas: {
        frontend: "Frontend",
        backend: "Backend",
        hardware: "Hardware",
        ia: "IA",
        infra: "Infraestructura",
        otras: "Otras",
      },
      empty: "Las habilidades se publicarán pronto.",
    },
  },

  notFound: {
    metaTitle: "Página no encontrada",
    windowTitle: "martojs@portafolio: ~",
    prompt: "martojs@m2air:~$",
    error: (path: string) => `bash: cd: ${path}: No such file or directory`,
    hint: "La página que buscas no existe o cambió de lugar.",
    home: "Volver al inicio",
    projects: "Ver proyectos",
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
