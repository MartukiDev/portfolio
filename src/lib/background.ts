type Rgb = readonly [r: number, g: number, b: number];

export const TEAL_RGB: Rgb = [94, 234, 212];
export const VIOLET_RGB: Rgb = [167, 139, 250];

/**
 * Opacidad en el centro de cada mancha. Techo fijado por contraste: text-muted
 * sobre vidrio hover en el pico de una mancha debe mantener AA (≥ 4.5:1).
 * Medido en la Fase 1: con estos valores el peor caso es 4.62:1. Si se suben, recalcular.
 */
export const BLOB_ALPHA = {
  teal: 0.09,
  violet: 0.11,
  tealSoft: 0.05,
} as const;

export function radialBlob([r, g, b]: Rgb, alpha: number): string {
  return `radial-gradient(closest-side, rgb(${r} ${g} ${b} / ${alpha}), transparent)`;
}
