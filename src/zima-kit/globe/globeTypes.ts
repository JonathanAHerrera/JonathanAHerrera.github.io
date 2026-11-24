"use client";

import { createContext, useContext } from "react";
import type { Map as MapLibreMap, Marker } from "maplibre-gl";

export type LongitudeLatitude = [longitude: number, latitude: number];

export type GlobeFlightFinishedCallback = (landed: boolean) => void;

export type GlobeFlyToOptions = {
  zoom?: number;
  pitch?: number;
  bearing?: number;
  durationMs?: number;
  extraTurns?: number;
  onFlightFinished?: GlobeFlightFinishedCallback;
};

export type GlobeBackdropHandle = {
  flyTo(coordinates: LongitudeLatitude, options?: GlobeFlyToOptions): void;
  resumeSpinning(options?: { onFlightFinished?: GlobeFlightFinishedCallback }): void;
  stopSpinning(): void;
  getMap(): MapLibreMap | null;
};

// The Marker class rides along in context so marker components never import
// maplibre-gl themselves, which would pull it into the first-paint bundle.
export type LiveGlobe = {
  map: MapLibreMap;
  MarkerConstructor: typeof Marker;
};

export const LiveGlobeContext = createContext<LiveGlobe | null>(null);

export function useLiveGlobe(): LiveGlobe | null {
  return useContext(LiveGlobeContext);
}
