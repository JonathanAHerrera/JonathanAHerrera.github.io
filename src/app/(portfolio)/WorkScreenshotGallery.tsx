"use client";

import { useEffect, useRef, type RefObject } from "react";
import { motion } from "framer-motion";
import type { WorkScreenshot } from "./workScreenshots";

export const ENLARGE_SCREENSHOT_INDEX_ATTRIBUTE = "data-enlarge-screenshot-index";
const WORK_SCREENSHOTS_HEADING_ID = "work-screenshots-heading";
const ENLARGED_SCREENSHOT_CAPTION_ID = "enlarged-screenshot-caption";

function figureLabel(screenshotIndex: number): string {
  return `Fig. ${screenshotIndex + 1}`;
}

function ScreenshotCaption({ screenshotIndex, caption, captionId }: { screenshotIndex: number; caption: string; captionId?: string }) {
  return (
    <figcaption id={captionId} className="mt-3 flex gap-3 font-mono text-[11px] leading-snug text-neutral-900/65">
      <span className="shrink-0 tracking-[0.08em] text-blue-600 uppercase">{figureLabel(screenshotIndex)}</span>
      <span>{caption}</span>
    </figcaption>
  );
}

type WorkScreenshotGalleryProps = {
  screenshots: WorkScreenshot[];
  onShowScreenshotEnlarged: (screenshotIndex: number) => void;
};

export function WorkScreenshotGallery({ screenshots, onShowScreenshotEnlarged }: WorkScreenshotGalleryProps) {
  const showPortraitScreenshotColumns = screenshots.every((screenshot) => screenshot.heightPx > screenshot.widthPx);
  const firstFigureSpansBothColumns = !showPortraitScreenshotColumns && screenshots.length % 2 === 1;
  const portraitColumnsClassName =
    screenshots.length === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3";
  return (
    <section aria-labelledby={WORK_SCREENSHOTS_HEADING_ID}>
      <h3
        id={WORK_SCREENSHOTS_HEADING_ID}
        className="flex items-baseline justify-between border-t border-neutral-900 pt-3 font-mono text-[11px] tracking-[0.16em] text-neutral-900/55 uppercase"
      >
        Screenshots
        <span aria-hidden>{String(screenshots.length).padStart(2, "0")}</span>
      </h3>
      <div
        className={`mt-6 grid items-start gap-x-6 gap-y-10 ${
          showPortraitScreenshotColumns ? portraitColumnsClassName : "grid-cols-1 sm:grid-cols-2"
        }`}
      >
        {screenshots.map((screenshot, screenshotIndex) => (
          <figure
            key={screenshot.imageSrc}
            className={screenshotIndex === 0 && firstFigureSpansBothColumns ? "sm:col-span-2" : ""}
          >
            <button
              type="button"
              {...{ [ENLARGE_SCREENSHOT_INDEX_ATTRIBUTE]: screenshotIndex }}
              onClick={() => onShowScreenshotEnlarged(screenshotIndex)}
              className="group block w-full cursor-zoom-in overflow-hidden rounded-card border border-neutral-900/15 bg-blue-50 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2"
            >
              <span className="sr-only">Enlarge {figureLabel(screenshotIndex)}: </span>
              <img
                src={screenshot.imageSrc}
                width={screenshot.widthPx}
                height={screenshot.heightPx}
                alt={screenshot.alternativeText}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition-transform duration-300 ease-out group-hover:scale-[1.015] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </button>
            <ScreenshotCaption screenshotIndex={screenshotIndex} caption={screenshot.caption} />
          </figure>
        ))}
      </div>
    </section>
  );
}

type EnlargedScreenshotViewProps = {
  screenshots: WorkScreenshot[];
  screenshotIndex: number;
  enlargedScreenshotViewRef: RefObject<HTMLDivElement | null>;
  onHideEnlargedScreenshot: () => void;
};

export function EnlargedScreenshotView({
  screenshots,
  screenshotIndex,
  enlargedScreenshotViewRef,
  onHideEnlargedScreenshot,
}: EnlargedScreenshotViewProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const screenshot = screenshots[screenshotIndex];

  useEffect(() => {
    closeButtonRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <motion.div
      ref={enlargedScreenshotViewRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={ENLARGED_SCREENSHOT_CAPTION_ID}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.18 }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onHideEnlargedScreenshot();
      }}
      className="fixed inset-0 z-20 flex flex-col overflow-y-auto overscroll-contain bg-white px-4 sm:px-8 lg:px-12"
    >
      <div className="flex items-center justify-between gap-4 border-b border-neutral-900 py-3 font-mono text-xs">
        <p className="tracking-[0.08em] text-neutral-900/60 uppercase">
          {figureLabel(screenshotIndex)}{" "}
          <span className="text-neutral-900/35">/ {screenshots.length}</span>
        </p>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onHideEnlargedScreenshot}
          className="-mx-2 rounded-full px-2 py-1.5 tracking-[0.08em] uppercase outline-none hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          Close <span className="hidden text-neutral-900/50 sm:inline">(Esc)</span>
        </button>
      </div>
      <figure
        onClick={(event) => {
          if (event.target === event.currentTarget) onHideEnlargedScreenshot();
        }}
        className="flex flex-1 flex-col items-center justify-center py-6"
      >
        <img
          src={screenshot.imageSrc}
          width={screenshot.widthPx}
          height={screenshot.heightPx}
          alt={screenshot.alternativeText}
          decoding="async"
          className="block h-auto max-h-[calc(100dvh-9rem)] w-auto max-w-full rounded-card border border-neutral-900/15"
        />
        <ScreenshotCaption
          screenshotIndex={screenshotIndex}
          caption={screenshot.caption}
          captionId={ENLARGED_SCREENSHOT_CAPTION_ID}
        />
      </figure>
    </motion.div>
  );
}
