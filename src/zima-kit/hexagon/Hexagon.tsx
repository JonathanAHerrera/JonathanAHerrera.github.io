"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { HEXAGON_CLIP_PATHS, POINTY_HEXAGON_ASPECT_RATIO, type HexagonOrientation } from "./hexagonGeometry";

export type HexagonProps = HTMLMotionProps<"div"> & {
  orientation?: HexagonOrientation;
};

/**
 * A div clipped to a hexagon with the right aspect ratio for its width. Set
 * the width (or height) and background through `className`/`style`; children
 * are clipped with it. It is a motion.div, so it takes variants directly.
 * Clip-path also clips box-shadow and borders: wrap it to get either.
 */
export function Hexagon({ orientation = "pointy", style, ...motionDivProps }: HexagonProps) {
  return (
    <motion.div
      {...motionDivProps}
      style={{
        clipPath: HEXAGON_CLIP_PATHS[orientation],
        aspectRatio: orientation === "pointy" ? POINTY_HEXAGON_ASPECT_RATIO : 1 / POINTY_HEXAGON_ASPECT_RATIO,
        ...style,
      }}
    />
  );
}
