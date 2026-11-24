"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode, type Ref } from "react";
import { WHITE } from "../tokens";
import type { GlobeStyleOptions } from "./globeStyle";
import { NATURAL_GLOBE_PALETTE, type GlobePalette } from "./globePalettes";
import type { GlobeBackdropHandle, LongitudeLatitude } from "./globeTypes";
import { StaticGlobeFallback } from "./StaticGlobeFallback";

const GlobeMap = dynamic(() => import("./GlobeMap"), { ssr: false });

const ZIMA_BACKDROP_STYLE_OPTIONS: GlobeStyleOptions = {
  projection: "globe",
  natural: true,
  lightIntensity: 0.45,
};
const ZIMA_BACKDROP_GLOBE_FILL = 1.08;

let cachedWebglAvailable: boolean | null = null;
function detectWebglAvailable(): boolean {
  if (cachedWebglAvailable === null) {
    try {
      const probeCanvas = document.createElement("canvas");
      cachedWebglAvailable = Boolean(probeCanvas.getContext("webgl2") ?? probeCanvas.getContext("webgl"));
    } catch {
      cachedWebglAvailable = false;
    }
  }
  return cachedWebglAvailable;
}
const subscribeToNothing = () => () => {};
const assumeWebglOnServer = () => true;

export type GlobeBackdropProps = {
  ref?: Ref<GlobeBackdropHandle>;
  /** Placement and size of the frame. Must position it (fixed, absolute or relative). */
  className?: string;
  /** Rounding of the frame; the Firefox corner mask follows it. */
  frameRadiusClassName?: string;
  /** Colour around the frame, painted over the map's corners in Firefox. */
  pageBackgroundColor?: string;
  palette?: GlobePalette;
  styleOptions?: GlobeStyleOptions;
  /** Fraction of the frame's shorter side the sphere spans on load. */
  globeFill?: number;
  initialCenter?: LongitudeLatitude;
  spin?: boolean;
  onGlobeTilesLoaded?: () => void;
  /** Fires once if WebGL is missing or MapLibre fails to start; the static drawing stays up and handle calls do nothing. */
  onGlobeUnavailable?: () => void;
  onHoldChange?: (held: boolean) => void;
  /** `GlobeMarker`s go here. */
  children?: ReactNode;
};

/**
 * Port of Zima's framed spinning globe (ZimaGlobeBackdrop). MapLibre loads in
 * its own chunk after first paint; a static drawing stands in until the first
 * tiles are in, and for good if WebGL is unavailable.
 */
export function GlobeBackdrop({
  ref,
  className = "fixed inset-0",
  frameRadiusClassName = "rounded-3xl",
  pageBackgroundColor = WHITE,
  palette = NATURAL_GLOBE_PALETTE,
  styleOptions = ZIMA_BACKDROP_STYLE_OPTIONS,
  globeFill = ZIMA_BACKDROP_GLOBE_FILL,
  initialCenter,
  spin = true,
  onGlobeTilesLoaded,
  onGlobeUnavailable,
  onHoldChange,
  children,
}: GlobeBackdropProps) {
  const webglAvailable = useSyncExternalStore(subscribeToNothing, detectWebglAvailable, assumeWebglOnServer);
  const [globeFailedToStart, setGlobeFailedToStart] = useState(false);
  const [globeTilesLoaded, setGlobeTilesLoaded] = useState(false);
  const showLiveGlobe = webglAvailable && !globeFailedToStart;
  const onGlobeUnavailableRef = useRef(onGlobeUnavailable);
  useEffect(() => {
    onGlobeUnavailableRef.current = onGlobeUnavailable;
  }, [onGlobeUnavailable]);
  useEffect(() => {
    if (!showLiveGlobe) onGlobeUnavailableRef.current?.();
  }, [showLiveGlobe]);

  return (
    <div className={className}>
      <div className={`absolute inset-0 overflow-hidden ${frameRadiusClassName}`}>
        {showLiveGlobe ? (
          <GlobeMap
            ref={ref}
            className="absolute inset-0"
            palette={palette}
            styleOptions={styleOptions}
            globeFill={globeFill}
            initialCenter={initialCenter}
            spin={spin}
            onHoldChange={onHoldChange}
            onGlobeTilesLoaded={() => {
              setGlobeTilesLoaded(true);
              onGlobeTilesLoaded?.();
            }}
            onGlobeFailedToStart={() => setGlobeFailedToStart(true)}
          >
            {children}
          </GlobeMap>
        ) : null}
        <StaticGlobeFallback
          palette={palette}
          globeFill={globeFill}
          className={`pointer-events-none absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none ${
            showLiveGlobe && globeTilesLoaded ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      {/*
        Firefox on macOS hands the WebGL canvas straight to the system compositor,
        which ignores the rounded clip on its ancestors, so the map's square corners
        poke out of the frame. Paint over the corners with a page-coloured shadow.
      */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={`absolute inset-0 ${frameRadiusClassName}`}
          style={{ boxShadow: `0 0 0 64px ${pageBackgroundColor}` }}
        />
      </div>
    </div>
  );
}
