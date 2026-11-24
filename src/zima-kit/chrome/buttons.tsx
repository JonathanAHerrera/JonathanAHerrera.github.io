"use client";

import type { CSSProperties } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { BLUE, HOPAMINE_BLUE, RADII_PX, SHADOWS } from "../tokens";

type RoundButtonProps = HTMLMotionProps<"button"> & {
  /** An accessible name is required: these buttons only hold an icon. */
  "aria-label": string;
};

/**
 * Zima's send button: a brand-blue circle that darkens one step on hover.
 * Size it through `className` (equal height and width, e.g. `size-[60px]`).
 */
export function BlueRoundButton({ className = "", style, type = "button", ...buttonProps }: RoundButtonProps) {
  return (
    <motion.button
      type={type}
      {...buttonProps}
      className={`flex items-center justify-center rounded-full bg-(--round-button-fill) text-white transition-colors hover:bg-(--round-button-fill-hover) disabled:cursor-default disabled:hover:bg-(--round-button-fill) ${className}`}
      style={
        {
          "--round-button-fill": HOPAMINE_BLUE,
          "--round-button-fill-hover": BLUE[600],
          ...style,
        } as CSSProperties
      }
    />
  );
}

/**
 * Zima's results-panel toggle: white, ringed, blue icon, greys a touch on
 * hover. `shape="circle"` is the open-panel toggle, `"rounded"` the minimised
 * button it morphs into.
 */
export function WhiteRoundButton({
  className = "size-[42px]",
  style,
  type = "button",
  shape = "circle",
  ...buttonProps
}: RoundButtonProps & { shape?: "circle" | "rounded" }) {
  return (
    <motion.button
      type={type}
      {...buttonProps}
      className={`flex shrink-0 items-center justify-center bg-white transition-colors hover:bg-neutral-50 ${className}`}
      style={{
        boxShadow: SHADOWS.toggleButton,
        color: HOPAMINE_BLUE,
        borderRadius: shape === "circle" ? 9999 : RADII_PX.toggleButton,
        ...style,
      }}
    />
  );
}
