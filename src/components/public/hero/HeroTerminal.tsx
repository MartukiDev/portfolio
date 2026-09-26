"use client";

import { domAnimation, LazyMotion, m } from "framer-motion";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { HERO_PLAYED_ATTR, HERO_STORAGE_KEY } from "@/lib/hero";
import { buildTimeline, reached, type Frame } from "@/lib/hero-timeline";

type HeroTerminalProps = {
  windowTitle: string;
  prompt: string;
  command: string;
  name: string;
  tagline: string | null;
  /** Badges y CTA: contenido real (accesible) que entra con fade. */
  children: ReactNode;
};

/** Texto a medio escribir: lo pendiente queda invisible pero ocupa su espacio (sin layout shift). */
function Typed({ chars, count, caret }: { chars: string[]; count: number; caret: boolean }) {
  return (
    <>
      {chars.slice(0, count).join("")}
      {caret && <span className="hero-caret" />}
      <span className="invisible">{chars.slice(count).join("")}</span>
    </>
  );
}

export function HeroTerminal({ windowTitle, prompt, command, name, tagline, children }: HeroTerminalProps) {
  const commandChars = Array.from(command);
  const nameChars = Array.from(name);
  const [frame, setFrame] = useState<Frame>({
    step: "final",
    command: commandChars.length,
    name: nameChars.length,
  });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (root.hasAttribute(HERO_PLAYED_ATTR)) return;

    const timers: number[] = [];
    const skipEvents = ["pointerdown", "keydown", "wheel", "touchmove", "scroll"] as const;

    const stop = () => {
      timers.forEach(window.clearTimeout);
      skipEvents.forEach((type) => window.removeEventListener(type, finish));
    };
    function finish() {
      stop();
      setFrame({ step: "final", command: commandChars.length, name: nameChars.length });
    }

    const timeline = buildTimeline(commandChars.length, nameChars.length);
    // Todo arranca en un timer: si el efecto se limpia antes (StrictMode en dev), no quedan marcas.
    timers.push(
      window.setTimeout(() => {
        // Una vez por sesión: se marca al empezar (recargar a mitad muestra el final).
        root.setAttribute(HERO_PLAYED_ATTR, "");
        try {
          sessionStorage.setItem(HERO_STORAGE_KEY, "1");
        } catch {
          // Sin storage: igual corre esta vez.
        }
        // Mismo callback que setStarted: React agrupa ambos en un render, sin frame intermedio visible.
        setFrame({ step: "command", command: 0, name: 0 });
        setStarted(true);
        skipEvents.forEach((type) => window.addEventListener(type, finish, { passive: true }));
      }, 0),
    );
    for (const { at, patch } of timeline) {
      timers.push(
        window.setTimeout(() => {
          setFrame((current) => ({ ...current, ...patch }));
          if (patch.step === "final") finish();
        }, at),
      );
    }

    return stop;
    // Solo al montar: el texto viene del servidor y no cambia en esta vista.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { step } = frame;
  const isFinal = step === "final";
  const showTagline = reached(step, "tagline");
  const showExtras = reached(step, "extras");
  // En la transición a "command" lo que se oculta desaparece al instante; solo las entradas tienen fade.
  const fade = (visible: boolean) => ({
    animate: { opacity: visible ? 1 : 0 },
    initial: false as const,
    transition: { duration: visible && started ? 0.45 : 0, ease: "easeOut" as const },
  });

  return (
    <LazyMotion features={domAnimation} strict>
      <div
        data-hero-state={started ? "running" : "idle"}
        className="glass overflow-hidden rounded-2xl sm:rounded-3xl"
      >
        <div aria-hidden="true" className="relative flex h-10 items-center border-b border-glass-border px-4">
          <div className="flex gap-2">
            <span className="size-3 rounded-full bg-[#ff5f57]/80" />
            <span className="size-3 rounded-full bg-[#febc2e]/80" />
            <span className="size-3 rounded-full bg-[#28c840]/80" />
          </div>
          <span className="absolute inset-x-16 truncate text-center font-mono text-xs text-muted">{windowTitle}</span>
        </div>

        <div className="px-5 py-7 font-mono sm:px-10 sm:py-10">
          <div aria-hidden="true">
            <p className="text-sm sm:text-base">
              <span className="text-accent">{prompt}</span>{" "}
              <span data-hero-part>
                <Typed chars={commandChars} count={frame.command} caret={step === "command"} />
              </span>
            </p>
            <p
              data-hero-part
              className="mt-5 text-[clamp(2rem,1.2rem+4.2vw,4.25rem)] leading-[1.05] font-semibold tracking-tight break-words text-fg"
            >
              <Typed
                chars={nameChars}
                count={reached(step, "name") ? frame.name : 0}
                caret={step === "name" || step === "tagline" || step === "extras"}
              />
            </p>
            {tagline && (
              <m.p data-hero-part className="mt-3 text-base text-muted sm:text-xl" {...fade(showTagline)}>
                {tagline}
              </m.p>
            )}
          </div>

          <m.div data-hero-part className="mt-8 flex flex-col gap-6" {...fade(showExtras)}>
            {children}
          </m.div>

          <p aria-hidden="true" data-hero-part className={cn("mt-8 text-sm sm:text-base", !isFinal && "invisible")}>
            <span className="text-accent">{prompt}</span>{"\u00a0"}
            <span className="hero-caret hero-caret--blink" />
          </p>
        </div>
      </div>
    </LazyMotion>
  );
}
