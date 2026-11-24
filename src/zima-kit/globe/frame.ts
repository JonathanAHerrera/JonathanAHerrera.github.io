/**
 * Zima's home-globe framing, kept for layouts that want the same look: inset
 * from the page edges so the white page shows through as a rounded border,
 * top inset clearing a 96px desktop top bar (56px on mobile), values from
 * Hopamine's Figma frame. Pass to GlobeBackdrop as `className` and
 * `frameRadiusClassName`.
 */
export const ZIMA_HOME_FRAME_INSETS =
  "fixed inset-x-0 top-[calc(56px+env(safe-area-inset-top))] bottom-0 md:inset-x-2 md:top-[96px] md:bottom-3";

/** Square on mobile, where the map fills the screen; rounded inside the desktop border. */
export const ZIMA_HOME_FRAME_RADIUS = "md:rounded-3xl";
