"use client";

import { Fragment, useRef } from "react";
import { useInView } from "framer-motion";
import { HexagonGrid, SETTLE_SPRING, hexagonSvgPoints } from "@/zima-kit";
import { WORK_HEXAGON_LINK_ATTRIBUTE } from "./useWorkDetailFromLocationHash";
import { WORK_PIECES, workDetailHash, workPieceKindLabel, type WorkPiece } from "./workPieces";

const LONGEST_STACK_ITEM_LENGTH_KEPT_ON_ONE_LINE = 16;
const HEXAGON_VIEWBOX_WIDTH = 86.6025;
const HEXAGON_VIEWBOX_HEIGHT = 100;
const FOCUS_RING_POINTS = hexagonSvgPoints(
  46,
  HEXAGON_VIEWBOX_WIDTH / 2,
  HEXAGON_VIEWBOX_HEIGHT / 2,
);

export const WORK_PIECE_FILL_CLASS_NAMES: Record<WorkPiece["kind"], string> = {
  role: "bg-blue-600 text-white",
  project: "bg-blue-200 text-neutral-900",
};

const WORK_PIECE_HIGHLIGHT_FILL_CLASS_NAMES: Record<WorkPiece["kind"], string> =
  {
    role: "bg-blue-500 text-white",
    project: "bg-blue-300 text-neutral-900",
  };

export function workPieceAccessibleName(workPiece: WorkPiece): string {
  const roleTitleOrKindLabel = workPiece.roleTitle ?? workPieceKindLabel(workPiece.kind);
  return `${workPiece.title}, ${roleTitleOrKindLabel}, ${workPiece.yearLabel}. Show details.`;
}

type WorkHoneycombProps = {
  highlightedWorkId: string | null;
  onHighlightWork: (workId: string | null) => void;
};

function WorkHexagonFace({ workPiece }: { workPiece: WorkPiece }) {
  const focusRingStrokeClassName =
    workPiece.kind === "role" ? "stroke-white" : "stroke-neutral-900";
  return (
    <>
      <svg
        aria-hidden
        viewBox={`0 0 ${HEXAGON_VIEWBOX_WIDTH} ${HEXAGON_VIEWBOX_HEIGHT}`}
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-0 transition-opacity duration-150 group-focus-visible:opacity-100"
      >
        <polygon
          points={FOCUS_RING_POINTS}
          fill="none"
          strokeWidth={3}
          vectorEffect="non-scaling-stroke"
          className={focusRingStrokeClassName}
        />
      </svg>
      <span
        aria-hidden
        className="absolute inset-x-0 top-[9%] text-center font-mono text-[max(10px,5.6cqw)] tracking-[0.08em]"
      >
        {workPiece.workPieceNumber}
      </span>
      <span className="absolute inset-x-[9%] top-1/2 flex -translate-y-1/2 flex-col items-center gap-[4cqw] text-center">
        <span className="font-mono text-[max(9px,4.2cqw)] tracking-[0.14em] uppercase">
          {workPieceKindLabel(workPiece.kind)}
        </span>
        <span className="font-serif text-[max(19px,14cqw)] leading-[0.95] text-balance">
          {workPiece.title}
        </span>
        <span className="max-w-full font-mono text-[max(9px,4.8cqw)] leading-snug text-balance">
          {workPiece.stackItems.map((stackItem, stackItemIndex) => (
            <Fragment key={stackItem}>
              <span className={stackItem.length <= LONGEST_STACK_ITEM_LENGTH_KEPT_ON_ONE_LINE ? "whitespace-nowrap" : ""}>
                {stackItem}
              </span>
              {stackItemIndex < workPiece.stackItems.length - 1 ? <span className="opacity-60">{"\u00a0· "}</span> : null}
            </Fragment>
          ))}
        </span>
      </span>
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-[10%] text-center font-mono text-[max(9px,5cqw)] tracking-[0.04em]"
      >
        {workPiece.yearLabel}
      </span>
    </>
  );
}

function WorkHexagonGrid({
  columns,
  className,
  highlightedWorkId,
  onHighlightWork,
}: WorkHoneycombProps & { columns: number; className: string }) {
  const honeycombRef = useRef<HTMLDivElement>(null);
  const honeycombScrolledIntoView = useInView(honeycombRef, {
    once: true,
    amount: 0.2,
  });
  return (
    <div ref={honeycombRef} className={className}>
      <HexagonGrid
        items={WORK_PIECES}
        columns={columns}
        gap={columns > 2 ? "12px" : "8px"}
        getItemKey={(workPiece) => workPiece.id}
        hexagonClassName={(workPiece) =>
          `relative transition-colors duration-200 ${
            highlightedWorkId === workPiece.id
              ? WORK_PIECE_HIGHLIGHT_FILL_CLASS_NAMES[workPiece.kind]
              : WORK_PIECE_FILL_CLASS_NAMES[workPiece.kind]
          }`
        }
        getHexagonProps={(workPiece, index) => ({
          initial: { opacity: 0, y: 28 },
          animate: {
            opacity: honeycombScrolledIntoView ? 1 : 0,
            y: honeycombScrolledIntoView ? 0 : 28,
            scale: highlightedWorkId === workPiece.id ? 1.045 : 1,
          },
          transition: {
            ...SETTLE_SPRING,
            opacity: { duration: 0.35, delay: index * 0.06 },
            y: { ...SETTLE_SPRING, delay: index * 0.06 },
          },
          style: { containerType: "inline-size" },
        })}
        renderHexagonContent={(workPiece) => (
          <a
            href={workDetailHash(workPiece.id)}
            {...{ [WORK_HEXAGON_LINK_ATTRIBUTE]: workPiece.id }}
            aria-label={workPieceAccessibleName(workPiece)}
            className="group absolute inset-0 block outline-none"
            onPointerEnter={() => onHighlightWork(workPiece.id)}
            onPointerLeave={() => onHighlightWork(null)}
            onFocus={() => onHighlightWork(workPiece.id)}
            onBlur={() => onHighlightWork(null)}
          >
            <WorkHexagonFace workPiece={workPiece} />
          </a>
        )}
      />
    </div>
  );
}

export function WorkHoneycomb(props: WorkHoneycombProps) {
  return (
    <>
      <WorkHexagonGrid {...props} columns={2} className="sm:hidden" />
      <WorkHexagonGrid {...props} columns={4} className="hidden sm:block" />
    </>
  );
}
