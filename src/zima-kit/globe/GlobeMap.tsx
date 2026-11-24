"use client";

import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";
import { Map as MapLibreMap, Marker, setWorkerUrl } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { buildGlobeStyle, type GlobeStyleOptions } from "./globeStyle";
import type { GlobePalette } from "./globePalettes";
import {
  INITIAL_CENTER,
  fitGlobeZoom,
  flyToView,
  jumpToView,
  returnToWholeGlobe,
  startSpin,
  watchMapHold,
} from "./camera";
import { LiveGlobeContext, type GlobeBackdropHandle, type LiveGlobe } from "./globeTypes";

// Turbopack ships the worker without its relative import; serve both copies from public/ instead (scripts/copy-maplibre-worker.mjs).
setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const DEFAULT_FLY_TO_ZOOM = 10;

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export type GlobeMapProps = {
  ref?: Ref<GlobeBackdropHandle>;
  className?: string;
  children?: ReactNode;
  palette: GlobePalette;
  styleOptions: GlobeStyleOptions;
  globeFill: number;
  initialCenter?: [number, number];
  spin: boolean;
  onGlobeTilesLoaded?: () => void;
  onGlobeFailedToStart?: (error: unknown) => void;
  onHoldChange?: (held: boolean) => void;
};

export default function GlobeMap({
  ref,
  className,
  children,
  palette,
  styleOptions,
  globeFill,
  initialCenter = INITIAL_CENTER,
  spin,
  onGlobeTilesLoaded,
  onGlobeFailedToStart,
  onHoldChange,
}: GlobeMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MapLibreMap | null>(null);
  const [liveGlobe, setLiveGlobe] = useState<LiveGlobe | null>(null);
  const cancelFlightRef = useRef<(() => void) | null>(null);
  const spinStoppedByCallerRef = useRef(false);
  const globeFillRef = useRef(globeFill);
  const callbacksRef = useRef({ onGlobeTilesLoaded, onGlobeFailedToStart, onHoldChange });
  useEffect(() => {
    globeFillRef.current = globeFill;
    callbacksRef.current = { onGlobeTilesLoaded, onGlobeFailedToStart, onHoldChange };
  }, [globeFill, onGlobeTilesLoaded, onGlobeFailedToStart, onHoldChange]);

  useImperativeHandle(ref, () => ({
    flyTo(coordinates, options = {}) {
      const map = mapRef.current;
      if (!map) return;
      cancelFlightRef.current?.();
      cancelFlightRef.current = null;
      // Landing must not hand the camera back to the idle spin; only resumeSpinning does that.
      spinStoppedByCallerRef.current = true;
      const view = {
        center: coordinates,
        zoom: options.zoom ?? DEFAULT_FLY_TO_ZOOM,
        pitch: options.pitch,
        bearing: options.bearing,
      };
      if (prefersReducedMotion()) {
        jumpToView(map, view);
        options.onFlightFinished?.(true);
        return;
      }
      const cancel = flyToView(map, view, {
        durationMs: options.durationMs,
        extraTurns: options.extraTurns,
        spinZoom: fitGlobeZoom(map.getContainer(), globeFillRef.current),
        onDone: (landed) => {
          if (cancelFlightRef.current === cancel) cancelFlightRef.current = null;
          options.onFlightFinished?.(landed);
        },
      });
      cancelFlightRef.current = cancel;
    },
    resumeSpinning(options = {}) {
      const map = mapRef.current;
      if (!map) return;
      cancelFlightRef.current?.();
      spinStoppedByCallerRef.current = false;
      // Under reduced motion MapLibre jumps and fires moveend inside flyTo, so
      // onDone runs before returnToWholeGlobe has returned its cancel function.
      let returnToWholeGlobeFinished = false;
      const cancelReturnToWholeGlobe = returnToWholeGlobe(
        map,
        fitGlobeZoom(map.getContainer(), globeFillRef.current),
        {
          onDone: (landed) => {
            returnToWholeGlobeFinished = true;
            cancelFlightRef.current = null;
            options.onFlightFinished?.(landed);
          },
        },
      );
      if (!returnToWholeGlobeFinished) cancelFlightRef.current = cancelReturnToWholeGlobe;
    },
    stopSpinning() {
      spinStoppedByCallerRef.current = true;
    },
    getMap() {
      return mapRef.current;
    },
  }));

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    let cancelled = false;
    let map: MapLibreMap | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let stopSpin: () => void = () => {};
    let stopHoldWatch: () => void = () => {};

    const resizeIfVisible = () => {
      if (!map || container.clientWidth < 2 || container.clientHeight < 2) return;
      map.resize();
    };

    const mountMap = () => {
      if (cancelled || map || container.clientWidth < 2 || container.clientHeight < 2) return;

      try {
        map = new MapLibreMap({
          container,
          style: buildGlobeStyle(palette, styleOptions),
          center: initialCenter,
          zoom: fitGlobeZoom(container, globeFillRef.current),
          attributionControl: false,
        });
      } catch (error) {
        callbacksRef.current.onGlobeFailedToStart?.(error);
        return;
      }
      mapRef.current = map;
      setLiveGlobe({ map, MarkerConstructor: Marker });
      const live = map;

      const bumpResize = () => {
        requestAnimationFrame(() => {
          resizeIfVisible();
          requestAnimationFrame(resizeIfVisible);
        });
      };
      live.once("load", bumpResize);
      live.once("idle", () => callbacksRef.current.onGlobeTilesLoaded?.());
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) bumpResize();
        },
        { threshold: 0.01 },
      );
      visibilityObserver.observe(container);

      stopSpin = spin
        ? startSpin(live, () => cancelFlightRef.current !== null || spinStoppedByCallerRef.current)
        : () => {};
      stopHoldWatch = watchMapHold(live, (held) => callbacksRef.current.onHoldChange?.(held));
    };

    const resizeObserver = new ResizeObserver(() => {
      if (!map) mountMap();
      else resizeIfVisible();
    });
    resizeObserver.observe(container);
    mountMap();

    return () => {
      cancelled = true;
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      stopSpin();
      stopHoldWatch();
      cancelFlightRef.current?.();
      cancelFlightRef.current = null;
      map?.remove();
      mapRef.current = null;
      setLiveGlobe(null);
    };
    // The map is built once; palette and framing are fixed for its lifetime, as in Hopamine.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // MapLibre's stylesheet sets `position: relative` on the map element and, being
  // unlayered, it overrides Tailwind's layered position utilities. Keep layout on
  // the wrapper and let MapLibre own the inner element.
  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full" style={{ backgroundColor: palette.land }} />
      <LiveGlobeContext.Provider value={liveGlobe}>{liveGlobe && children}</LiveGlobeContext.Provider>
    </div>
  );
}
