export const HOPAMINE_BLUE = "#00A6F3";
export const WHITE = "#FFFFFF";

/**
 * Tints and shades of Hopamine blue, darkest to lightest. Lighter steps mix
 * toward white and darker steps toward black, so every step keeps the brand
 * hue. Copied from Hopamine's globePalettes.ts.
 */
export const BLUE = {
  900: "#00354E",
  800: "#005075",
  600: "#0088C7",
  500: HOPAMINE_BLUE,
  400: "#61C8F8",
  300: "#99DBFA",
  200: "#C2EAFC",
  100: "#E0F4FE",
  50: "#F0FAFE",
} as const;

export type BlueScaleStep = keyof typeof BLUE;

export function withAlpha(hex: string, alpha: number): string {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export const RADII_PX = {
  card: 14,
  toggleButton: 21,
  frame: 24,
  paperPanel: 24,
  panel: 31,
} as const;

export const SHADOWS = {
  card: "0 4px 4px rgba(0, 0, 0, 0.25)",
  marker: "0 4px 4px rgba(0, 0, 0, 0.25)",
  // 2px spread pushed 2px down: reads as 4px below, 2px either side, nothing above.
  panel: "0 2px 2px 2px rgba(0, 0, 0, 0.25)",
  toggleButton: "0 0 0 1px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.18)",
  paperPanel: `0 5px 0 ${withAlpha(BLUE[800], 0.28)}`,
  paperBar: `0 3px 0 ${withAlpha(BLUE[800], 0.28)}`,
  header: "0 2px 4px rgba(0, 0, 0, 0.25)",
} as const;

export const PAPER_PANEL_BACKGROUNDS = {
  hero: withAlpha(BLUE[100], 0.72),
  compact: withAlpha(BLUE[50], 0.8),
  bar: withAlpha(BLUE[100], 0.85),
} as const;

export const MORPH_EASING = [0.32, 0.72, 0, 1] as const;
export const MORPH_DURATION_SECONDS = 0.4;

/** Firm and slightly overdamped, so it lands without bounce. */
export const SETTLE_SPRING = { type: "spring", stiffness: 400, damping: 40 } as const;
/** Quick and overdamped: feels attached to whatever it follows. */
export const MOVE_SPRING = { type: "spring", stiffness: 500, damping: 45 } as const;

export const TOAST_DURATION_MS = 5000;
