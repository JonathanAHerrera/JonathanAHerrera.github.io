import type { GlobePalette } from "./globePalettes";

type StaticGlobeFallbackProps = {
  palette: GlobePalette;
  /** Matches the live globe's `globeFill` so the swap does not jump. */
  globeFill: number;
  className?: string;
};

const MERIDIAN_HALF_WIDTHS = [0.3, 0.62, 0.88];
const PARALLEL_LATITUDES = [-0.6, -0.3, 0, 0.3, 0.6];

/**
 * A flat drawing of the sphere in the globe's own palette: shown while the map
 * loads, and kept when WebGL is unavailable.
 */
export function StaticGlobeFallback({ palette, globeFill, className = "" }: StaticGlobeFallbackProps) {
  return (
    <div
      aria-hidden
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ backgroundColor: palette.land }}
    >
      <svg
        viewBox="-1 -1 2 2"
        className="aspect-square max-h-full max-w-full"
        style={{ height: `${Math.min(globeFill, 1) * 100}%`, width: `${Math.min(globeFill, 1) * 100}%` }}
      >
        <circle r="1" fill={palette.water} />
        <g fill="none" stroke={palette.halo} strokeOpacity={0.55} strokeWidth={0.008}>
          <line x1="0" y1="-1" x2="0" y2="1" />
          {MERIDIAN_HALF_WIDTHS.map((halfWidth) => (
            <ellipse key={halfWidth} rx={halfWidth} ry="1" />
          ))}
          {PARALLEL_LATITUDES.map((latitude) => {
            const halfChord = Math.sqrt(1 - latitude * latitude);
            return <line key={latitude} x1={-halfChord} y1={latitude} x2={halfChord} y2={latitude} />;
          })}
        </g>
      </svg>
    </div>
  );
}
