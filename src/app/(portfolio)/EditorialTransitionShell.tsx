"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import { HexagonTransitionProvider } from "@/zima-kit";
import { instrumentSerifItalic } from "./editorialFonts";

export type CoverOverlayCaption = { coverCaptionLabel: string; title: string };

const SetCoverOverlayCaptionContext = createContext<(caption: CoverOverlayCaption) => void>(() => undefined);

export function useSetCoverOverlayCaption() {
  return useContext(SetCoverOverlayCaptionContext);
}

export function EditorialTransitionShell({ children }: { children: ReactNode }) {
  const [coverOverlayCaption, setCoverOverlayCaption] = useState<CoverOverlayCaption>({
    coverCaptionLabel: "Selected work",
    title: "Jonathan Herrera",
  });

  return (
    <SetCoverOverlayCaptionContext.Provider value={setCoverOverlayCaption}>
      <MotionConfig reducedMotion="user">
        <HexagonTransitionProvider
          coverOverlay={
            <div className="flex max-w-[90vw] flex-col items-center gap-3 text-center text-white">
              <p className="font-mono text-xs tracking-[0.2em] uppercase">{coverOverlayCaption.coverCaptionLabel}</p>
              <p className={`${instrumentSerifItalic.className} text-6xl leading-none sm:text-8xl`}>
                {coverOverlayCaption.title}
              </p>
            </div>
          }
        >
          {children}
        </HexagonTransitionProvider>
      </MotionConfig>
    </SetCoverOverlayCaptionContext.Provider>
  );
}
