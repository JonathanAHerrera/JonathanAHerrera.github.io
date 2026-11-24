"use client";

import type { CSSProperties, ReactNode } from "react";
import { Hexagon, type HexagonProps } from "./Hexagon";

export type HexagonGridProps<Item> = {
  items: readonly Item[];
  columns: number;
  renderHexagonContent: (item: Item, index: number) => ReactNode;
  getItemKey?: (item: Item, index: number) => string | number;
  /** Even gap between every pair of neighbouring hexagons, as a CSS length. */
  gap?: string;
  className?: string;
  hexagonClassName?: string | ((item: Item, index: number) => string);
  /** Spread onto every Hexagon (motion props such as `variants`, `whileHover`). */
  getHexagonProps?: (item: Item, index: number) => Omit<HexagonProps, "children" | "className">;
};

/**
 * Pointy-top honeycomb that fills its container's width: `columns` per row,
 * odd rows shifted half a hexagon right, rows interlocked. All sizing is in
 * the grid's own width (it is a size container), so it scales with its parent.
 */
export function HexagonGrid<Item>({
  items,
  columns,
  renderHexagonContent,
  getItemKey = (_, index) => index,
  gap = "0px",
  className = "",
  hexagonClassName = "",
  getHexagonProps,
}: HexagonGridProps<Item>) {
  const rows: Array<Array<{ item: Item; index: number }>> = [];
  items.forEach((item, index) => {
    const rowIndex = Math.floor(index / columns);
    (rows[rowIndex] ??= []).push({ item, index });
  });

  // Every row is `columns` wide plus half a hexagon for the odd-row shift.
  // Container units, not %, so the odd rows' half-hexagon indent does not shrink their hexagons.
  const hexagonWidth = `calc((100cqw - ${columns - 1} * ${gap}) / ${columns + 0.5})`;
  const gridStyle = {
    "--hexagon-width": hexagonWidth,
    "--hexagon-gap": gap,
    containerType: "inline-size",
  } as CSSProperties;
  // Row step for an even gap is (width + gap) * sqrt(3)/2; a hexagon is width * 2/sqrt(3) tall.
  const rowOverlap = "calc((var(--hexagon-width) + var(--hexagon-gap)) * 0.8660254 - var(--hexagon-width) * 1.1547005)";

  return (
    <div className={`w-full ${className}`} style={gridStyle}>
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className="flex"
          style={{
            gap: "var(--hexagon-gap)",
            marginTop: rowIndex === 0 ? 0 : rowOverlap,
            paddingLeft: rowIndex % 2 === 1 ? "calc((var(--hexagon-width) + var(--hexagon-gap)) / 2)" : 0,
          }}
        >
          {row.map(({ item, index }) => (
            <Hexagon
              key={getItemKey(item, index)}
              {...getHexagonProps?.(item, index)}
              className={typeof hexagonClassName === "function" ? hexagonClassName(item, index) : hexagonClassName}
              style={{ width: "var(--hexagon-width)", flexShrink: 0, ...getHexagonProps?.(item, index).style }}
            >
              {renderHexagonContent(item, index)}
            </Hexagon>
          ))}
        </div>
      ))}
    </div>
  );
}
