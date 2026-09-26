export const contactContent = {
  metaTitle: "Contacto",
  metaDescription: "Escríbeme para cotizar un proyecto, conversar sobre una práctica o cualquier consulta.",
  eyebrow: "Contacto",
  title: "Conversemos",
  description: "Cuéntame qué necesitas. Respondo en menos de 48 horas hábiles.",

  tipos: {
    freelance: "Proyecto freelance",
    practica: "Práctica profesional",
    otro: "Otra consulta",
  },

  form: {
    nombre: "Nombre",
    nombrePlaceholder: "Tu nombre",
    email: "Correo",
    emailPlaceholder: "tu@correo.com",
    tipo: "Tipo de consulta",
    mensaje: "Mensaje",
    mensajePlaceholder: {
      freelance: "¿Qué quieres construir? Cuéntame sobre tu negocio, plazos y presupuesto aproximado.",
      practica: "Cuéntame sobre la empresa, el equipo y el tipo de práctica.",
      otro: "Escribe tu consulta.",
    },
    honeypot: "Sitio web",
    submit: "Enviar mensaje",
    submitting: "Enviando…",
    privacy: "Solo uso tus datos para responderte.",
  },

  success: {
    title: "¡Mensaje enviado!",
    body: "Gracias por escribir. Te responderé pronto al correo que dejaste.",
    again: "Enviar otro mensaje",
  },

  errors: {
    generic: "No se pudo enviar. Revisa los campos marcados.",
    tooFast: "Tu mensaje se envió demasiado rápido. Espera unos segundos e inténtalo de nuevo.",
    unexpected: "Ocurrió un error al enviar. Inténtalo de nuevo o escríbeme por WhatsApp.",
    nombre: "Ingresa tu nombre.",
    nombreMax: "Máximo 120 caracteres.",
    email: "Ingresa un correo válido.",
    tipo: "Elige un tipo de consulta.",
    mensajeMin: "Cuéntame un poco más (mínimo 10 caracteres).",
    mensajeMax: "Máximo 5000 caracteres.",
  },

  aside: {
    title: "Otras formas de contacto",
    whatsapp: "Escribir por WhatsApp",
    whatsappHint: "El mensaje se prellena según el tipo de consulta.",
    email: "Correo",
    github: "GitHub",
    linkedin: "LinkedIn",
  },

  whatsappMessage: {
    freelance: (nombre: string) => `Hola ${nombre}, vi tu portafolio y me gustaría cotizar un proyecto.`,
    practica: (nombre: string) => `Hola ${nombre}, vi tu portafolio y quería conversar sobre una práctica profesional.`,
    otro: (nombre: string) => `Hola ${nombre}, vi tu portafolio y quería hacerte una consulta.`,
  },

  email: {
    subject: (tipo: string, nombre: string) => `Nuevo mensaje (${tipo}) de ${nombre}`,
    heading: "Nuevo mensaje desde el portafolio",
    from: "De",
    type: "Tipo",
    reply: "Responde directamente a este correo para contestarle.",
    panel: "Ver en el panel",
  },
} as const;
