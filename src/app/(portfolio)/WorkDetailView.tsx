"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { motion } from "framer-motion";
import { Hexagon, SETTLE_SPRING, type HexagonCoverOrigin } from "@/zima-kit";
import { EmphasizedBulletText } from "./EmphasizedBulletText";
import { WORK_DETAIL_HEADING_ID, centerOfElement, coverOriginFromActivation } from "./useWorkDetailFromLocationHash";
import { WORK_PIECE_FILL_CLASS_NAMES } from "./WorkHoneycomb";
import { WORK_PIECES, workDetailHash, workPieceKindLabel, type WorkPiece } from "./workPieces";
import { ENLARGE_SCREENSHOT_INDEX_ATTRIBUTE, EnlargedScreenshotView, WorkScreenshotGallery } from "./WorkScreenshotGallery";

type WorkDetailViewProps = {
  workPiece: WorkPiece;
  workDetailRevealFinished: boolean;
  onCloseWorkDetail: (coverOrigin?: HexagonCoverOrigin) => void;
  onShowAdjacentWorkDetail: (workId: string, coverOrigin: HexagonCoverOrigin) => void;
};

function riseInAfterReveal(workDetailRevealFinished: boolean, order: number) {
  return {
    initial: false as const,
    animate: workDetailRevealFinished ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 },
    transition: { ...SETTLE_SPRING, delay: workDetailRevealFinished ? order * 0.06 : 0 },
  };
}

function SpecificationRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[6.5rem_1fr] gap-3 border-t border-neutral-900/15 py-2.5">
      <dt className="font-mono text-[11px] tracking-[0.14em] text-neutral-900/55 uppercase">{label}</dt>
      <dd className="font-mono text-[13px] text-neutral-900">{value}</dd>
    </div>
  );
}

export function WorkDetailView({
  workPiece,
  workDetailRevealFinished,
  onCloseWorkDetail,
  onShowAdjacentWorkDetail,
}: WorkDetailViewProps) {
  const workPieceNumberHexagonRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const enlargedScreenshotViewRef = useRef<HTMLDivElement>(null);
  const screenshotIndexToRefocusRef = useRef<number | null>(null);
  const [enlargedScreenshot, setEnlargedScreenshot] = useState<{ workPieceId: string; screenshotIndex: number } | null>(null);
  const enlargedScreenshotIndex = enlargedScreenshot?.workPieceId === workPiece.id ? enlargedScreenshot.screenshotIndex : null;
  const showScreenshotEnlarged = enlargedScreenshotIndex !== null;
  const workPieceIndex = WORK_PIECES.findIndex((candidate) => candidate.id === workPiece.id);
  const previousWorkPiece = WORK_PIECES[(workPieceIndex - 1 + WORK_PIECES.length) % WORK_PIECES.length];
  const nextWorkPiece = WORK_PIECES[(workPieceIndex + 1) % WORK_PIECES.length];
  const workPieceCountLabel = String(WORK_PIECES.length).padStart(2, "0");

  const hideEnlargedScreenshot = () => {
    screenshotIndexToRefocusRef.current = enlargedScreenshotIndex;
    setEnlargedScreenshot(null);
  };

  useEffect(() => {
    if (showScreenshotEnlarged || screenshotIndexToRefocusRef.current === null) return;
    dialogRef.current
      ?.querySelector<HTMLElement>(`[${ENLARGE_SCREENSHOT_INDEX_ATTRIBUTE}="${screenshotIndexToRefocusRef.current}"]`)
      ?.focus({ preventScroll: true });
    screenshotIndexToRefocusRef.current = null;
  }, [showScreenshotEnlarged]);

  useEffect(() => {
    const closeOnEscapeAndKeepTabbingInside = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        if (showScreenshotEnlarged) {
          screenshotIndexToRefocusRef.current = enlargedScreenshotIndex;
          setEnlargedScreenshot(null);
          return;
        }
        onCloseWorkDetail(workPieceNumberHexagonRef.current ? centerOfElement(workPieceNumberHexagonRef.current) : undefined);
        return;
      }
      const focusTrapContainer = showScreenshotEnlarged ? enlargedScreenshotViewRef.current : dialogRef.current;
      if (event.key !== "Tab" || !focusTrapContainer) return;
      const tabbableElements = [...focusTrapContainer.querySelectorAll<HTMLElement>("a[href], button")];
      const firstTabbableElement = tabbableElements[0];
      const lastTabbableElement = tabbableElements[tabbableElements.length - 1];
      const focusIsOnFirstOrOutside =
        document.activeElement === firstTabbableElement || !tabbableElements.includes(document.activeElement as HTMLElement);
      if (event.shiftKey && focusIsOnFirstOrOutside) {
        event.preventDefault();
        lastTabbableElement?.focus();
      } else if (!event.shiftKey && (document.activeElement === lastTabbableElement || !tabbableElements.includes(document.activeElement as HTMLElement))) {
        event.preventDefault();
        firstTabbableElement?.focus();
      }
    };
    document.addEventListener("keydown", closeOnEscapeAndKeepTabbingInside);
    return () => document.removeEventListener("keydown", closeOnEscapeAndKeepTabbingInside);
  }, [onCloseWorkDetail, showScreenshotEnlarged, enlargedScreenshotIndex]);

  const showAdjacentFromLink = (event: MouseEvent<HTMLAnchorElement>, workId: string) => {
    event.preventDefault();
    onShowAdjacentWorkDetail(workId, coverOriginFromActivation(event, event.currentTarget));
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={WORK_DETAIL_HEADING_ID}
      data-scroll-root
      className="fixed inset-0 z-[100] overflow-x-hidden overflow-y-auto overscroll-contain bg-white"
    >
      <div inert={showScreenshotEnlarged} className="mx-auto flex min-h-full max-w-[1440px] flex-col px-4 sm:px-8 lg:px-12">
        <nav
          aria-label="Selected work"
          className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-neutral-900 bg-white py-3 font-mono text-xs"
        >
          <button
            type="button"
            onClick={(event) => onCloseWorkDetail(coverOriginFromActivation(event, event.currentTarget))}
            className="-mx-2 rounded-full px-2 py-1.5 tracking-[0.08em] uppercase outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <span aria-hidden>←</span> All work <span className="hidden text-neutral-900/50 sm:inline">(Esc)</span>
          </button>
          <p className="tracking-[0.08em] text-neutral-900/60 uppercase">
            {workPieceKindLabel(workPiece.kind)}{" "}
            <span className="ml-1.5">
              {workPiece.workPieceNumber} <span className="text-neutral-900/35">/ {workPieceCountLabel}</span>
            </span>
          </p>
          <div className="flex items-center gap-1">
            <a
              href={workDetailHash(previousWorkPiece.id)}
              onClick={(event) => showAdjacentFromLink(event, previousWorkPiece.id)}
              aria-label={`Previous: ${previousWorkPiece.title}, ${workPieceKindLabel(previousWorkPiece.kind).toLowerCase()} ${previousWorkPiece.workPieceNumber}`}
              className="rounded-full px-2 py-1.5 outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              ← <span className="hidden md:inline">{previousWorkPiece.title}</span>
            </a>
            <a
              href={workDetailHash(nextWorkPiece.id)}
              onClick={(event) => showAdjacentFromLink(event, nextWorkPiece.id)}
              aria-label={`Next: ${nextWorkPiece.title}, ${workPieceKindLabel(nextWorkPiece.kind).toLowerCase()} ${nextWorkPiece.workPieceNumber}`}
              className="rounded-full px-2 py-1.5 outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600"
            >
              <span className="hidden md:inline">{nextWorkPiece.title}</span> →
            </a>
          </div>
        </nav>

        <article className="grid flex-1 grid-cols-1 gap-x-12 gap-y-10 py-10 lg:grid-cols-12 lg:py-16">
          <aside className="flex flex-row items-start gap-5 lg:col-span-4 lg:flex-col lg:gap-8">
            <motion.div {...riseInAfterReveal(workDetailRevealFinished, 0)} className="w-[34%] max-w-[180px] shrink-0 lg:w-full lg:max-w-[340px]">
              <Hexagon
                ref={workPieceNumberHexagonRef}
                className={`relative flex w-full flex-col items-center justify-center ${WORK_PIECE_FILL_CLASS_NAMES[workPiece.kind]}`}
                style={{ containerType: "inline-size" }}
              >
                <span className="font-mono text-[max(9px,5cqw)] tracking-[0.16em] uppercase">{workPieceKindLabel(workPiece.kind)}</span>
                <span className="font-serif text-[46cqw] leading-[0.85]">{workPiece.workPieceNumber}</span>
              </Hexagon>
            </motion.div>
            <motion.dl {...riseInAfterReveal(workDetailRevealFinished, 1)} className="min-w-0 flex-1 self-center lg:w-full lg:max-w-[340px] lg:self-auto">
              <SpecificationRow label="Kind" value={workPieceKindLabel(workPiece.kind)} />
              <SpecificationRow label="Dates" value={workPiece.dateLine} />
              {workPiece.placeName ? <SpecificationRow label="Place" value={workPiece.placeName} /> : null}
              <SpecificationRow label="Stack" value={workPiece.stackItems.join(", ")} />
            </motion.dl>
          </aside>

          <div className="lg:col-span-8">
            <motion.p
              {...riseInAfterReveal(workDetailRevealFinished, 1)}
              className="font-mono text-xs tracking-[0.14em] text-neutral-900/60 uppercase"
            >
              {workPiece.roleTitle ?? "Independent project"}
            </motion.p>
            <motion.h2
              {...riseInAfterReveal(workDetailRevealFinished, 2)}
              id={WORK_DETAIL_HEADING_ID}
              tabIndex={-1}
              className="mt-3 font-serif text-[clamp(3.5rem,11vw,10rem)] leading-[0.88] tracking-[-0.02em] outline-none"
            >
              {workPiece.title}
            </motion.h2>
            <ol className="mt-10 border-b border-neutral-900/15 lg:mt-14">
              {workPiece.bullets.map((bullet, bulletIndex) => (
                <motion.li
                  key={bullet.text}
                  {...riseInAfterReveal(workDetailRevealFinished, 3 + bulletIndex)}
                  className="grid grid-cols-[2.75rem_1fr] gap-2 border-t border-neutral-900/15 py-5 sm:grid-cols-[4.5rem_1fr] lg:py-7"
                >
                  <span aria-hidden className="pt-2 font-mono text-xs text-neutral-900/50">
                    {workPiece.workPieceNumber}.{bulletIndex + 1}
                  </span>
                  <p className="font-serif text-[clamp(1.375rem,2.4vw,2.125rem)] leading-[1.18] text-pretty">
                    <EmphasizedBulletText bullet={bullet} />
                  </p>
                </motion.li>
              ))}
            </ol>
            {workPiece.screenshots.length > 0 ? (
              <motion.div {...riseInAfterReveal(workDetailRevealFinished, 3 + workPiece.bullets.length)} className="mt-14 lg:mt-20">
                <WorkScreenshotGallery
                  screenshots={workPiece.screenshots}
                  onShowScreenshotEnlarged={(screenshotIndex) =>
                    setEnlargedScreenshot({ workPieceId: workPiece.id, screenshotIndex })
                  }
                />
              </motion.div>
            ) : null}
          </div>
        </article>
      </div>
      {enlargedScreenshotIndex !== null ? (
        <EnlargedScreenshotView
          screenshots={workPiece.screenshots}
          screenshotIndex={enlargedScreenshotIndex}
          enlargedScreenshotViewRef={enlargedScreenshotViewRef}
          onHideEnlargedScreenshot={hideEnlargedScreenshot}
        />
      ) : null}
    </div>
  );
}
