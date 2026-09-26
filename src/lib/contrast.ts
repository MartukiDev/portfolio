export type Rgba = readonly [r: number, g: number, b: number, a?: number];

export function hexToRgb(hex: string): Rgba {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

/** Compone capas semitransparentes de abajo hacia arriba sobre un fondo opaco. */
export function composite(base: Rgba, ...layers: Rgba[]): Rgba {
  return layers.reduce<Rgba>((under, [r, g, b, a = 1]) => {
    return [
      r * a + under[0] * (1 - a),
      g * a + under[1] * (1 - a),
      b * a + under[2] * (1 - a),
    ];
  }, base);
}

function luminance([r, g, b]: Rgba): number {
  const [lr, lg, lb] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * lr + 0.7152 * lg + 0.0722 * lb;
}

/** Razón de contraste WCAG 2.x entre dos colores opacos. */
export function contrastRatio(fg: Rgba, bg: Rgba): number {
  const [light, dark] = [luminance(fg), luminance(bg)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
}
