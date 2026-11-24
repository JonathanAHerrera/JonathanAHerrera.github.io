import { BLUE, WHITE } from "../tokens";

/**
 * Colour roles for the globe style. Every layer in globeStyle.ts reads from one
 * of these, so the palette fully determines the look.
 */
export type GlobePalette = {
  land: string;
  water: string;
  ice: string;
  park: string;
  building: string;
  roadMinor: string;
  roadMajor: string;
  motorway: string;
  border: string;
  text: string;
  halo: string;
};

/** Near-white land, brand blue water, mid-tint buildings, tinted roads. */
export const BLUE_GLOBE_PALETTE: GlobePalette = {
  land: BLUE[50],
  water: BLUE[500],
  ice: WHITE,
  park: BLUE[200],
  building: BLUE[300],
  roadMinor: BLUE[400],
  roadMajor: BLUE[600],
  motorway: BLUE[800],
  border: BLUE[600],
  text: BLUE[900],
  halo: WHITE,
};

/**
 * What the live Zima home backdrop actually renders with (ZimaGlobeBackdrop
 * passes this, not the blue palette). Copied verbatim from Hopamine.
 */
export const NATURAL_GLOBE_PALETTE: GlobePalette = {
  land: "#ffffff",
  water: "#c8dff2",
  ice: "#ffffff",
  park: "#d4ecd0",
  building: "#eceae4",
  roadMinor: "#ffffff",
  roadMajor: "#fffce8",
  motorway: "#fae8a8",
  border: "#e3e0d8",
  text: "#7a7a7a",
  halo: "#ffffff",
};
