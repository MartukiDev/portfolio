import type { Rgba } from "./contrast";

export const BASE_RGB: Rgba = [7, 9, 15];
export const TEAL_RGB: Rgba = [94, 234, 212];
export const VIOLET_RGB: Rgba = [167, 139, 250];

/**
 * Opacidad en el centro de cada mancha. Techo fijado por contraste: text-muted
 * sobre vidrio hover en el pico de una mancha debe mantener AA (≥ 4.5:1).
 * Si se suben, revisar la tabla de /design-system.
 */
export const BLOB_ALPHA = {
  teal: 0.09,
  violet: 0.11,
  tealSoft: 0.05,
} as const;

export function radialBlob([r, g, b]: Rgba, alpha: number): string {
  return `radial-gradient(closest-side, rgb(${r} ${g} ${b} / ${alpha}), transparent)`;
}
