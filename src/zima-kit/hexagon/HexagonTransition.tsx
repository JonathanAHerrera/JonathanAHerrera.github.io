"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createHexagonCoverAnimation,
  type HexagonCoverAnimation,
  type HexagonCoverOrigin,
} from "./hexagonCoverAnimation";

const HOLD_BEFORE_ARRIVAL_REVEAL_MS = 400;
const DEFAULT_HOLD_BEFORE_REVEAL_MS = 400;
// Overlay timings from Hopamine's /loading playground, where the "zima" mark fades in over the hexagons.
const COVER_OVERLAY_APPEAR_DELAY_MS = 280;
const COVER_OVERLAY_FADE_MS = 420;
const REVEAL_ON_ARRIVAL_STORAGE_KEY = "zima-kit-hexagon-reveal-on-arrival";

export type HexagonCenterMark = {
  imageSrc?: string;
  imageWidthPx?: number;
  imageHeightPx?: number;
};

export type CoverRunAndRevealOptions = {
  origin?: HexagonCoverOrigin;
  holdBeforeRevealMs?: number;
};

export type HexagonTransitionApi = {
  /** Resolves once the screen is fully covered. Resolves at once, covering nothing, under reduced motion. */
  cover(origin?: HexagonCoverOrigin): Promise<void>;
  /** Shows the fully covered state in one frame. */
  coverInstantly(): void;
  /** Resolves when the last hexagon is gone. Waits for a running cover first. */
  reveal(): Promise<void>;
  /** Covers, awaits `callback` while hidden, holds, then reveals. A throw lifts the cover and rethrows. */
  coverRunAndReveal(
    callback: () => unknown | Promise<unknown>,
    options?: CoverRunAndRevealOptions,
  ): Promise<void>;
};

const HexagonTransitionContext = createContext<HexagonTransitionApi | null>(null);

/**
 * Call after `cover()` and right before a navigation that swaps in a different
 * provider (another layout, or a full page load): the destination's provider
 * mounts covered and flips open on arrival instead of flashing.
 */
export function markHexagonRevealOnArrival() {
  try {
    window.sessionStorage.setItem(REVEAL_ON_ARRIVAL_STORAGE_KEY, "1");
  } catch {
    // Storage blocked: the destination simply renders without the reveal.
  }
}

function consumeRevealOnArrivalFlag(): boolean {
  try {
    const flagged = window.sessionStorage.getItem(REVEAL_ON_ARRIVAL_STORAGE_KEY) === "1";
    if (flagged) window.sessionStorage.removeItem(REVEAL_ON_ARRIVAL_STORAGE_KEY);
    return flagged;
  } catch {
    return false;
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function waitMilliseconds(durationMs: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, durationMs));
}

export type HexagonTransitionProviderProps = {
  children: ReactNode;
  /** Shown centred over the hexagons while covered, e.g. a name or monogram. White text reads best. */
  coverOverlay?: ReactNode;
  /** Hopamine's auth transition pops a white centre hexagon holding the logo; pass this to get it. */
  centerMark?: HexagonCenterMark;
  /** Extra classes for the full-screen canvas (z-index, opacity). */
  canvasClassName?: string;
};

export function HexagonTransitionProvider({
  children,
  coverOverlay,
  centerMark,
  canvasClassName = "z-[200]",
}: HexagonTransitionProviderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<HexagonCoverAnimation | null>(null);
  const overlayTimerIdRef = useRef(0);
  const [showCoverOverlay, setShowCoverOverlay] = useState(false);
  const centerMarkRef = useRef(centerMark);

  const getAnimation = useCallback((): HexagonCoverAnimation | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    if (!animationRef.current) {
      const mark = centerMarkRef.current;
      animationRef.current = createHexagonCoverAnimation(canvas, {
        showCenterMark: Boolean(mark),
        centerLogoSrc: mark?.imageSrc,
        centerLogoWidthPx: mark?.imageWidthPx,
        centerLogoHeightPx: mark?.imageHeightPx,
      });
    }
    return animationRef.current;
  }, []);

  const showCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.visibility = "visible";
  }, []);

  const hideCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (canvas) canvas.style.visibility = "hidden";
  }, []);

  const cover = useCallback(
    async (origin?: HexagonCoverOrigin) => {
      const animation = getAnimation();
      if (!animation || prefersReducedMotion()) return;
      showCanvas();
      window.clearTimeout(overlayTimerIdRef.current);
      overlayTimerIdRef.current = window.setTimeout(
        () => setShowCoverOverlay(true),
        COVER_OVERLAY_APPEAR_DELAY_MS,
      );
      await animation.cover(origin);
    },
    [getAnimation, showCanvas],
  );

  const coverInstantly = useCallback(() => {
    const animation = getAnimation();
    if (!animation || prefersReducedMotion()) return;
    showCanvas();
    animation.coverInstantly();
    setShowCoverOverlay(true);
  }, [getAnimation, showCanvas]);

  const reveal = useCallback(async () => {
    window.clearTimeout(overlayTimerIdRef.current);
    setShowCoverOverlay(false);
    const animation = animationRef.current;
    if (animation) await animation.reveal();
    hideCanvas();
  }, [hideCanvas]);

  const coverRunAndReveal = useCallback(
    async (callback: () => unknown | Promise<unknown>, options: CoverRunAndRevealOptions = {}) => {
      if (prefersReducedMotion()) {
        await callback();
        return;
      }
      await cover(options.origin);
      try {
        await callback();
      } catch (error) {
        await reveal();
        throw error;
      }
      await waitMilliseconds(options.holdBeforeRevealMs ?? DEFAULT_HOLD_BEFORE_REVEAL_MS);
      await reveal();
    },
    [cover, reveal],
  );

  // The storage flag is read once into a ref so React Strict Mode's second effect run
  // (after the simulated unmount destroys the first animation) can still play the reveal.
  const arrivalRevealPendingRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (arrivalRevealPendingRef.current === null) {
      arrivalRevealPendingRef.current = consumeRevealOnArrivalFlag();
    }
    if (!arrivalRevealPendingRef.current || prefersReducedMotion()) return;
    const animation = getAnimation();
    if (!animation) return;
    showCanvas();
    animation.coverInstantly();
    const revealTimerId = window.setTimeout(() => {
      arrivalRevealPendingRef.current = false;
      void reveal();
    }, HOLD_BEFORE_ARRIVAL_REVEAL_MS);

    return () => {
      window.clearTimeout(revealTimerId);
      animationRef.current?.destroy();
      animationRef.current = null;
      hideCanvas();
    };
  }, [getAnimation, showCanvas, hideCanvas, reveal]);

  useEffect(() => {
    return () => {
      window.clearTimeout(overlayTimerIdRef.current);
      animationRef.current?.destroy();
      animationRef.current = null;
    };
  }, []);

  const api = useMemo<HexagonTransitionApi>(
    () => ({ cover, coverInstantly, reveal, coverRunAndReveal }),
    [cover, coverInstantly, reveal, coverRunAndReveal],
  );

  return (
    <HexagonTransitionContext.Provider value={api}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none fixed inset-0 h-full w-full ${canvasClassName}`}
        style={{ visibility: "hidden" }}
      />
      {coverOverlay ? (
        <div
          aria-hidden
          className={`pointer-events-none fixed inset-0 z-[210] flex items-center justify-center transition-opacity ease-out ${
            showCoverOverlay ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDuration: `${COVER_OVERLAY_FADE_MS}ms` }}
        >
          {coverOverlay}
        </div>
      ) : null}
    </HexagonTransitionContext.Provider>
  );
}

/** Outside a provider this degrades to running callbacks with no animation, so callers never need to guard. */
export function useHexagonTransition(): HexagonTransitionApi {
  const context = useContext(HexagonTransitionContext);
  return useMemo<HexagonTransitionApi>(() => {
    if (context) return context;
    return {
      cover: async () => undefined,
      coverInstantly: () => undefined,
      reveal: async () => undefined,
      coverRunAndReveal: async (callback) => {
        await callback();
      },
    };
  }, [context]);
}
