"use client";

import { useEffect, useState } from "react";

const TOP_ZONE = 80; // px: cerca del inicio siempre visible
const THRESHOLD = 6; // px: ignora micro-scrolls

/**
 * true mientras se hace scroll hacia abajo (fuera de la zona superior); false
 * al subir. El navegador ya limita los eventos de scroll a uno por frame y
 * React no re-renderiza si el valor no cambia.
 */
export function useHideOnScroll(): boolean {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      if (y < TOP_ZONE) {
        setHidden(false);
        lastY = y;
      } else if (Math.abs(delta) > THRESHOLD) {
        setHidden(delta > 0);
        lastY = y;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return hidden;
}
