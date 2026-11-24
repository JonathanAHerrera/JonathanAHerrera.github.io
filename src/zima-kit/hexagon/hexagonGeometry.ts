/**
 * Pointy-top hexagon geometry shared by the cover animation and the layout
 * primitives. Numbers are Hopamine's hexLoadAnimation.ts values.
 */
export const HEXAGON_WIDTH_PX = 64;
export const HEXAGON_CIRCUMRADIUS_PX = HEXAGON_WIDTH_PX / Math.sqrt(3);
export const HEXAGON_HEIGHT_PX = HEXAGON_CIRCUMRADIUS_PX * 2;
export const HEXAGON_ROW_STEP_PX = HEXAGON_CIRCUMRADIUS_PX * 2 * 0.75;
/** Width over height of a pointy-top hexagon. */
export const POINTY_HEXAGON_ASPECT_RATIO = Math.sqrt(3) / 2;

export type HexagonOrientation = "pointy" | "flat";

/** Corners of a unit hexagon (circumradius 1) centred on the origin, starting at the top. */
export function unitHexagonCorners(orientation: HexagonOrientation = "pointy"): Array<[x: number, y: number]> {
  const startAngleDegrees = orientation === "pointy" ? -90 : 0;
  return Array.from({ length: 6 }, (_, corner) => {
    const angle = (Math.PI / 180) * (60 * corner + startAngleDegrees);
    return [Math.cos(angle), Math.sin(angle)];
  });
}

export const HEXAGON_CLIP_PATHS: Record<HexagonOrientation, string> = {
  pointy: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
  flat: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
};

/** `points` for an SVG `<polygon>` of a hexagon with the given circumradius, centred on (centerX, centerY). */
export function hexagonSvgPoints(
  circumradius: number,
  centerX = 0,
  centerY = 0,
  orientation: HexagonOrientation = "pointy",
): string {
  return unitHexagonCorners(orientation)
    .map(([x, y]) => `${centerX + x * circumradius},${centerY + y * circumradius}`)
    .join(" ");
}

export type HoneycombCellPosition = {
  index: number;
  row: number;
  column: number;
  /** Centre of the hexagon, from the top-left of the honeycomb. */
  centerX: number;
  centerY: number;
};

/**
 * Centres for `count` pointy-top hexagons laid out `columns` per row, odd rows
 * shifted half a hexagon right, the same packing the cover animation uses.
 * `gapPx` is the even gap between every pair of neighbours.
 */
export function honeycombCellPositions({
  count,
  columns,
  hexagonWidthPx = HEXAGON_WIDTH_PX,
  gapPx = 0,
}: {
  count: number;
  columns: number;
  hexagonWidthPx?: number;
  gapPx?: number;
}): HoneycombCellPosition[] {
  const columnStep = hexagonWidthPx + gapPx;
  const rowStep = columnStep * POINTY_HEXAGON_ASPECT_RATIO;
  const hexagonHeight = hexagonWidthPx / POINTY_HEXAGON_ASPECT_RATIO;
  return Array.from({ length: count }, (_, index) => {
    const row = Math.floor(index / columns);
    const column = index % columns;
    const rowOffset = row % 2 === 1 ? columnStep / 2 : 0;
    return {
      index,
      row,
      column,
      centerX: hexagonWidthPx / 2 + column * columnStep + rowOffset,
      centerY: hexagonHeight / 2 + row * rowStep,
    };
  });
}
