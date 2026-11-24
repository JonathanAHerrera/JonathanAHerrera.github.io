"use client";

import { useEffect, useRef, useState } from "react";
import { resume } from "@/content/resume";
import { instrumentSerifItalic } from "./editorialFonts";
import { SectionHeading } from "./SectionHeading";

const WATERFALL_SIZES_IN_CONTAINER_WIDTH_PERCENT = [12.5, 10.75, 9.25, 8, 6.9, 5.9, 5.1, 4.4, 3.8];
const SMALLEST_SIZE_REM = 1.375;

function useRenderedFontSizesInPixels(elementCount: number) {
  const listRef = useRef<HTMLOListElement>(null);
  const [renderedFontSizesInPixels, setRenderedFontSizesInPixels] = useState<number[]>([]);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const measureFontSizes = () =>
      setRenderedFontSizesInPixels(
        [...list.querySelectorAll<HTMLElement>("[data-specimen-line]")].map((line) =>
          Math.round(parseFloat(getComputedStyle(line).fontSize)),
        ),
      );
    const resizeObserver = new ResizeObserver(measureFontSizes);
    resizeObserver.observe(list);
    return () => resizeObserver.disconnect();
  }, [elementCount]);
  return { listRef, renderedFontSizesInPixels };
}

export function InterestsSpecimen() {
  const { listRef, renderedFontSizesInPixels } = useRenderedFontSizesInPixels(resume.interests.length);
  return (
    <section id="interests" aria-labelledby="interests-heading" className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
      <SectionHeading
        sectionNumber="03"
        headingId="interests-heading"
        title="Interests"
        className="lg:col-span-3"
        stickOnDesktopWhileSectionScrolls
      />
      <ol ref={listRef} className="flex flex-col border-b border-neutral-900 lg:col-span-9" style={{ containerType: "inline-size" }}>
        {resume.interests.map((interest, interestIndex) => {
          const setInItalic = interestIndex % 2 === 0;
          const sizeInContainerWidthPercent = WATERFALL_SIZES_IN_CONTAINER_WIDTH_PERCENT[interestIndex] ?? WATERFALL_SIZES_IN_CONTAINER_WIDTH_PERCENT.at(-1);
          return (
            <li
              key={interest}
              className="grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 border-t border-neutral-900/15 py-2 first:border-neutral-900 sm:grid-cols-[3.5rem_1fr_auto]"
            >
              <span className="font-mono text-[11px] text-neutral-900/55">{String(interestIndex + 1).padStart(2, "0")}</span>
              <span
                data-specimen-line
                className={`${setInItalic ? instrumentSerifItalic.className : "font-serif"} leading-[1.02] tracking-[-0.01em] ${
                  interestIndex === 0 ? "text-blue-600" : ""
                }`}
                style={{ fontSize: `max(${SMALLEST_SIZE_REM}rem, ${sizeInContainerWidthPercent}cqw)` }}
              >
                {interest}
              </span>
              <span aria-hidden className="hidden font-mono text-[11px] text-neutral-900/45 sm:block">
                {setInItalic ? "Italic" : "Roman"}
                {renderedFontSizesInPixels[interestIndex] ? ` · ${renderedFontSizesInPixels[interestIndex]} px` : ""}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
