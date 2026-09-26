"use client";

import { m } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Retraso en segundos, para escalonar elementos de una grilla. */
  delay?: number;
  className?: string;
};

/** Entrada sutil al aparecer en pantalla. Solo opacity/transform: no afecta CLS. */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  return (
    <m.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
