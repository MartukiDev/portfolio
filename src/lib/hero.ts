/** Clave en sessionStorage: la animación del hero corre una vez por sesión (pestaña). */
export const HERO_STORAGE_KEY = "martodev:hero-played";
/** Atributo en <html> que indica mostrar el hero directamente en su estado final. */
export const HERO_PLAYED_ATTR = "data-hero-played";

/**
 * Script inline para <head>: marca <html> antes del primer pintado si el hero
 * ya se vio en esta sesión, si hay prefers-reduced-motion o si no hay acceso
 * a sessionStorage. El CSS decide el estado inicial según ese atributo.
 */
export const heroInitScript = `(function(){var d=document.documentElement;try{if(sessionStorage.getItem(${JSON.stringify(
  HERO_STORAGE_KEY,
)})||window.matchMedia("(prefers-reduced-motion: reduce)").matches){d.setAttribute(${JSON.stringify(
  HERO_PLAYED_ATTR,
)},"")}}catch(e){d.setAttribute(${JSON.stringify(HERO_PLAYED_ATTR)},"")}})();`;
