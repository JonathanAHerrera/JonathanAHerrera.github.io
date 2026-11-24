"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import type { Marker } from "maplibre-gl";
import { useLiveGlobe, type LongitudeLatitude } from "./globeTypes";

export type GlobeMarkerAnchor =
  | "center"
  | "top"
  | "bottom"
  | "left"
  | "right"
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type GlobeMarkerProps = {
  coordinates: LongitudeLatitude;
  children: ReactNode;
  /** Which point of the children sits on the coordinates. */
  anchor?: GlobeMarkerAnchor;
  offsetPx?: [x: number, y: number];
  /** Hides the marker while it is on the far side of the sphere, as Zima's people markers do. */
  hideOnFarSideOfGlobe?: boolean;
};

/** Renders `children` pinned to a coordinate. Only works inside `<GlobeBackdrop>`. */
export function GlobeMarker({
  coordinates,
  children,
  anchor = "center",
  offsetPx = [0, 0],
  hideOnFarSideOfGlobe = true,
}: GlobeMarkerProps) {
  const liveGlobe = useLiveGlobe();
  const [markerElement] = useState(() => document.createElement("div"));
  const markerRef = useRef<Marker | null>(null);
  const [longitude, latitude] = coordinates;
  const [offsetX, offsetY] = offsetPx;

  useEffect(() => {
    if (!liveGlobe) return;
    const marker = new liveGlobe.MarkerConstructor({
      element: markerElement,
      anchor,
      offset: [offsetX, offsetY],
      opacityWhenCovered: hideOnFarSideOfGlobe ? 0 : 1,
    })
      .setLngLat([longitude, latitude])
      .addTo(liveGlobe.map);
    markerRef.current = marker;
    return () => {
      marker.remove();
      markerRef.current = null;
    };
    // Position and offset update in place below rather than rebuilding the marker.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [liveGlobe, markerElement, anchor, hideOnFarSideOfGlobe]);

  useEffect(() => {
    markerRef.current?.setLngLat([longitude, latitude]);
  }, [longitude, latitude]);

  useEffect(() => {
    markerRef.current?.setOffset([offsetX, offsetY]);
  }, [offsetX, offsetY]);

  return createPortal(children, markerElement);
}
