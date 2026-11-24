"use client";

import { useEffect, useRef, useState } from "react";
import {
  BLUE_GLOBE_PALETTE,
  GlobeBackdrop,
  GlobeMarker,
  useLiveGlobe,
  type GlobeBackdropHandle,
} from "@/zima-kit";
import { RESUME_LOCATIONS, type ResumeLocation } from "@/content/resume";

const PLACES_STUDIED_AND_WORKED: ResumeLocation[] = [
  RESUME_LOCATIONS.collegeStation,
  RESUME_LOCATIONS.austin,
  RESUME_LOCATIONS.oklahomaCity,
];
const TEXAS_FACING_CENTER: [number, number] = [-97, 30];

function KeepPageScrollingOverGlobe() {
  const liveGlobe = useLiveGlobe();
  useEffect(() => {
    const map = liveGlobe?.map;
    if (!map) return;
    map.scrollZoom.disable();
    // A one-finger drag on a phone must scroll the page, not spin a globe sitting mid-page.
    if (window.matchMedia("(pointer: coarse)").matches) {
      map.dragPan.disable();
      map.touchZoomRotate.disable();
    }
  }, [liveGlobe]);
  return null;
}

export function FramedGlobeFigure() {
  const globeBackdropRef = useRef<GlobeBackdropHandle>(null);
  const [focusedPlaceName, setFocusedPlaceName] = useState<string | null>(null);

  const togglePlaceOnGlobe = (place: ResumeLocation) => {
    if (focusedPlaceName === place.name) {
      setFocusedPlaceName(null);
      globeBackdropRef.current?.resumeSpinning();
      return;
    }
    setFocusedPlaceName(place.name);
    globeBackdropRef.current?.flyTo(place.coordinates, { zoom: 4.2, durationMs: 2200 });
  };

  return (
    <figure className="flex flex-col gap-3">
      <GlobeBackdrop
        ref={globeBackdropRef}
        className="relative aspect-[5/4] w-full lg:aspect-square"
        frameRadiusClassName="rounded-frame"
        palette={BLUE_GLOBE_PALETTE}
        initialCenter={TEXAS_FACING_CENTER}
        globeFill={0.86}
      >
        <KeepPageScrollingOverGlobe />
        {PLACES_STUDIED_AND_WORKED.map((place) => (
          <GlobeMarker key={place.name} coordinates={place.coordinates}>
            <span
              aria-hidden
              className={`block rounded-full border-2 border-white bg-blue-900 transition-[width,height] duration-300 ${
                focusedPlaceName === place.name ? "h-4 w-4" : "h-2.5 w-2.5"
              }`}
            />
          </GlobeMarker>
        ))}
      </GlobeBackdrop>
      <figcaption className="flex flex-col gap-2 font-mono text-[11px] leading-relaxed text-neutral-900/65">
        <span>
          <span className="text-neutral-900">Fig. 1</span> Where I have studied and worked. Choose one to fly there.
        </span>
        <span className="flex flex-wrap gap-1.5">
          {PLACES_STUDIED_AND_WORKED.map((place) => (
            <button
              key={place.name}
              type="button"
              aria-pressed={focusedPlaceName === place.name}
              onClick={() => togglePlaceOnGlobe(place)}
              className="rounded-full border border-neutral-900/20 px-2.5 py-1 text-neutral-900 outline-none transition-colors hover:border-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 aria-pressed:border-blue-500 aria-pressed:bg-blue-500 aria-pressed:text-white"
            >
              {place.name}
            </button>
          ))}
        </span>
      </figcaption>
    </figure>
  );
}
