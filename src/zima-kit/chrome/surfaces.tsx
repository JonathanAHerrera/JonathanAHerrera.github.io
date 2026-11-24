"use client";

import { useEffect, type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { jetbrainsMono } from "../fonts";
import { HOPAMINE_BLUE, PAPER_PANEL_BACKGROUNDS, RADII_PX, SHADOWS, TOAST_DURATION_MS, WHITE } from "../tokens";
import { CloseIcon } from "./icons";

const CARD_FILLS = {
  white: { backgroundColor: WHITE, color: HOPAMINE_BLUE },
  blue: { backgroundColor: HOPAMINE_BLUE, color: WHITE },
} as const;

export type ZimaCardFill = keyof typeof CARD_FILLS;

/** Type scale of Zima's result card, in its own JetBrains Mono. Use inside `ZimaCard`. */
export const ZIMA_CARD_TEXT = {
  title: "line-clamp-2 text-[24px] leading-[1] tracking-[-0.01em]",
  subtitle: "truncate text-[15px] leading-[0.93] tracking-[-0.01em]",
  body: "line-clamp-3 text-[13px] font-extralight leading-[1.15] tracking-[-0.01em]",
} as const;

export type ZimaCardProps = HTMLMotionProps<"article"> & {
  /** `blue` on white pages, `white` on blue surfaces; nothing else changes. */
  fill: ZimaCardFill;
};

/**
 * Zima's result card shell: 14px corners, the design's drop shadow, padding
 * from Figma, JetBrains Mono. Layout inside is the caller's; Zima's own card
 * is `flex flex-col justify-between` with title on top.
 */
export function ZimaCard({ fill, className = "", style, ...articleProps }: ZimaCardProps) {
  return (
    <motion.article
      {...articleProps}
      className={`${jetbrainsMono.className} rounded-card px-[13px] pt-[17px] pb-[16px] ${className}`}
      style={{ ...CARD_FILLS[fill], boxShadow: SHADOWS.card, ...style }}
    />
  );
}

const PAPER_PANEL_SIZES = {
  hero: { className: "rounded-paper-panel pt-[30px] pr-8 pb-[18px] pl-[36px]", backgroundColor: PAPER_PANEL_BACKGROUNDS.hero },
  compact: {
    className: "rounded-card pt-[18px] pr-[14px] pb-[14px] pl-[18px] backdrop-blur-sm",
    backgroundColor: PAPER_PANEL_BACKGROUNDS.compact,
  },
} as const;

export type PaperPanelProps = HTMLMotionProps<"div"> & {
  /** `hero`: the wide translucent box floating over the globe. `compact`: the smaller box docked in a white panel. */
  size?: keyof typeof PAPER_PANEL_SIZES;
};

/** Zima's prompt box surface: translucent pale blue with a hard offset shadow. */
export function PaperPanel({ size = "hero", className = "", style, ...divProps }: PaperPanelProps) {
  const panelSize = PAPER_PANEL_SIZES[size];
  return (
    <motion.div
      {...divProps}
      className={`${panelSize.className} ${className}`}
      style={{ backgroundColor: panelSize.backgroundColor, boxShadow: SHADOWS.paperPanel, ...style }}
    />
  );
}

/** Zima's results panel surface: white, 31px corners, the 4px-below shadow. */
export function WhitePanel({ className = "", style, ...divProps }: HTMLMotionProps<"div">) {
  return (
    <motion.div
      {...divProps}
      className={`overflow-hidden bg-white ${className}`}
      style={{ boxShadow: SHADOWS.panel, borderRadius: RADII_PX.panel, ...style }}
    />
  );
}

const TOAST_TONES = {
  brand: { backgroundColor: HOPAMINE_BLUE },
  // Tailwind 4 red-600, what Hopamine's toast uses (bg-red-600).
  error: { backgroundColor: "oklch(57.7% 0.245 27.325)" },
} as const;

export type RiseToastProps = {
  message: ReactNode;
  /** Hopamine's toast is the red error tone; `brand` swaps in Hopamine blue. */
  tone?: keyof typeof TOAST_TONES;
  onToastFinished?: () => void;
  onDismiss?: () => void;
};

/**
 * Hopamine's chat dock toast. Sits at the bottom of a `relative
 * overflow-hidden` parent, rises from behind whatever is below it, holds,
 * sinks back. Unmount it on `onToastFinished`.
 */
export function RiseToast({ message, tone = "brand", onToastFinished, onDismiss }: RiseToastProps) {
  useEffect(() => {
    if (!onToastFinished) return;
    const finishTimerId = window.setTimeout(onToastFinished, TOAST_DURATION_MS);
    return () => window.clearTimeout(finishTimerId);
  }, [onToastFinished]);

  return (
    <div
      role="alert"
      className={`${jetbrainsMono.className} absolute inset-x-3 bottom-2 flex animate-rise-toast items-start gap-3 rounded-xl px-4 py-3 text-[11px] leading-snug font-semibold text-white`}
      style={TOAST_TONES[tone]}
    >
      <span className="flex-1">{message}</span>
      {onDismiss ? (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss"
          className="shrink-0 text-white transition-opacity hover:opacity-70"
        >
          <CloseIcon />
        </button>
      ) : null}
    </div>
  );
}
