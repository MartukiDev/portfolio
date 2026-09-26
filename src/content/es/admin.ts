export const admin = {
  metaTitle: "Panel",
  brand: "martojs",
  brandSuffix: "admin",

  login: {
    metaTitle: "Iniciar sesión",
    eyebrow: "Backoffice",
    title: "Iniciar sesión",
    description: "Acceso solo para administración del sitio.",
    email: "Correo",
    emailPlaceholder: "tu@correo.com",
    password: "Contraseña",
    submit: "Entrar",
    submitting: "Entrando…",
    backToSite: "Volver al sitio",
    errors: {
      invalidEmail: "Ingresa un correo válido.",
      passwordRequired: "Ingresa tu contraseña.",
      invalidCredentials: "Correo o contraseña incorrectos.",
      unauthorized: "Tu cuenta no tiene acceso al panel.",
    },
  },

  nav: {
    label: "Secciones del panel",
    open: "Abrir menú",
    close: "Cerrar menú",
    viewSite: "Ver sitio",
    signOut: "Cerrar sesión",
    items: [
      { href: "/admin", label: "Dashboard", icon: "dashboard" },
      { href: "/admin/proyectos", label: "Proyectos", icon: "projects" },
      { href: "/admin/servicios", label: "Servicios", icon: "services" },
      { href: "/admin/testimonios", label: "Testimonios", icon: "testimonials" },
      { href: "/admin/trayectoria", label: "Trayectoria", icon: "timeline" },
      { href: "/admin/habilidades", label: "Habilidades", icon: "skills" },
      { href: "/admin/mensajes", label: "Mensajes", icon: "messages" },
      { href: "/admin/ajustes", label: "Ajustes", icon: "settings" },
    ],
  },

  dashboard: {
    eyebrow: "Dashboard",
    title: "Hola de nuevo",
    description: "Resumen del sitio y accesos rápidos.",
    stats: {
      unread: "Mensajes sin leer",
      published: "Proyectos publicados",
      drafts: "Proyectos en borrador",
    },
    unreadTitle: "Mensajes sin leer",
    unreadEmpty: "No hay mensajes pendientes.",
    viewAllMessages: "Ver todos los mensajes",
    quickTitle: "Accesos rápidos",
    quick: [
      { href: "/admin/proyectos/nuevo", label: "Nuevo proyecto", icon: "plus" },
      { href: "/admin/mensajes", label: "Revisar mensajes", icon: "messages" },
      { href: "/admin/ajustes", label: "Editar ajustes", icon: "settings" },
      { href: "/", label: "Ver sitio público", icon: "external" },
    ],
    loadError: "No se pudieron cargar los datos. Intenta recargar la página.",
    consultaTipos: {
      freelance: "Freelance",
      practica: "Práctica",
      otro: "Otro",
    },
  },
} as const;

export type AdminIcon =
  | (typeof admin.nav.items)[number]["icon"]
  | (typeof admin.dashboard.quick)[number]["icon"];
