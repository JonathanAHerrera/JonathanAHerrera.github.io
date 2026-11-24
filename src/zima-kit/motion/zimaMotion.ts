import type { Transition, Variants } from "framer-motion";
import {
  MORPH_DURATION_SECONDS,
  MORPH_EASING,
  MOVE_SPRING,
  SETTLE_SPRING,
} from "../tokens";

export { MOVE_SPRING, SETTLE_SPRING };

/**
 * Zima's results panel and its minimised button share a `layoutId` and morph
 * into each other with this. Pass as `transition` on both elements.
 */
export const layoutMorphTransition: Transition = {
  layout: { duration: MORPH_DURATION_SECONDS, ease: MORPH_EASING },
};

/**
 * Contents fade out before a morph shrinks their box so they never visibly
 * squash, and fade back in once it has grown. Spread onto a motion element
 * inside `AnimatePresence`: `<motion.div {...contentFadeAroundMorph}>`.
 */
export const contentFadeAroundMorph = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, delay: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/**
 * Zima's mobile results sheet starts measured and parked below the screen,
 * then rises on the settle spring. Use with `initial="hidden" animate="shown"`.
 */
export const slideUpFromBottomEdgeVariants: Variants = {
  hidden: { y: "100%" },
  shown: { y: 0, transition: SETTLE_SPRING },
};

