/** Línea de tiempo del hero de terminal (lógica pura, sin React). */

/**
 * "final" es el estado de reposo: todo visible y sin cursor (no invita a
 * escribir). Es lo que renderiza el servidor; si el hero no se ha visto
 * en esta sesión, el CSS lo oculta hasta que la animación toma el control.
 */
export type Step = "final" | "command" | "name" | "tagline" | "extras";

export type Frame = { step: Step; command: number; name: number };
export type Scheduled = { at: number; patch: Partial<Frame> };

const ORDER: Step[] = ["command", "name", "tagline", "extras", "final"];
export const reached = (current: Step, target: Step) => ORDER.indexOf(current) >= ORDER.indexOf(target);

// Tiempos (ms). Total < 3 s: el ritmo del nombre se ajusta a su largo.
export const BUDGET = 2900;
const PAUSE_BEFORE_COMMAND = 250;
const PAUSE_BEFORE_NAME = 300;
const PAUSE_BEFORE_TAGLINE = 200;
const PAUSE_BEFORE_EXTRAS = 300;
const PAUSE_BEFORE_FINAL = 450;
export const MIN_CHAR = 40;
export const MAX_CHAR = 60;
const JITTER = 8;

function charDelay(base: number): number {
  const jittered = base + (Math.random() * 2 - 1) * JITTER;
  return Math.min(MAX_CHAR, Math.max(MIN_CHAR, jittered));
}

export function buildTimeline(commandLength: number, nameLength: number): Scheduled[] {
  const fixed =
    PAUSE_BEFORE_COMMAND + PAUSE_BEFORE_NAME + PAUSE_BEFORE_TAGLINE + PAUSE_BEFORE_EXTRAS + PAUSE_BEFORE_FINAL;
  const commandBase = 50;
  const nameBase = Math.min(
    MAX_CHAR - JITTER,
    Math.max(MIN_CHAR + JITTER, (BUDGET - fixed - commandLength * commandBase) / Math.max(1, nameLength)),
  );

  const timeline: Scheduled[] = [];
  let t = PAUSE_BEFORE_COMMAND;
  for (let i = 1; i <= commandLength; i++) {
    t += charDelay(commandBase);
    timeline.push({ at: t, patch: { command: i } });
  }
  t += PAUSE_BEFORE_NAME;
  timeline.push({ at: t, patch: { step: "name" } });
  for (let i = 1; i <= nameLength; i++) {
    t += charDelay(nameBase);
    timeline.push({ at: t, patch: { name: i } });
  }
  t += PAUSE_BEFORE_TAGLINE;
  timeline.push({ at: t, patch: { step: "tagline" } });
  t += PAUSE_BEFORE_EXTRAS;
  timeline.push({ at: t, patch: { step: "extras" } });
  t += PAUSE_BEFORE_FINAL;
  timeline.push({ at: t, patch: { step: "final" } });
  return timeline;
}
