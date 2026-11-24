"use client";

import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { resume } from "@/content/resume";
import {
  BLUE,
  BLUE_GLOBE_PALETTE,
  BlueRoundButton,
  ChevronRightIcon,
  GlobeBackdrop,
  GlobeIcon,
  GlobeMarker,
  Hexagon,
  HexagonGrid,
  HexagonTransitionProvider,
  NATURAL_GLOBE_PALETTE,
  PaperPanel,
  RiseToast,
  SHADOWS,
  UpArrowIcon,
  WhitePanel,
  WhiteRoundButton,
  ZIMA_CARD_TEXT,
  ZimaCard,
  contentFadeAroundMorph,
  jetbrainsMono,
  layoutMorphTransition,
  slideUpFromBottomEdgeVariants,
  useHexagonTransition,
  type GlobeBackdropHandle,
} from "@/zima-kit";
import type { ResumeLocation } from "@/content/resume";

const UNIQUE_EXPERIENCE_LOCATIONS: ResumeLocation[] = [
  ...new Map(resume.experience.map((experience) => [experience.location.name, experience.location])).values(),
];

export function KitDemo() {
  return (
    <HexagonTransitionProvider
      coverOverlay={
        <p className={`${jetbrainsMono.className} text-7xl leading-none font-black tracking-[-0.02em] text-white`}>
          JH
        </p>
      }
    >
      <main className="mx-auto flex max-w-5xl flex-col gap-16 px-4 py-12 sm:px-8">
        <header className="flex flex-col gap-2">
          <h1 className="text-6xl">Zima kit</h1>
          <p className="font-mono text-sm text-neutral-600">
            Everything in <code>src/zima-kit</code>, running. Import from <code>@/zima-kit</code>.
          </p>
        </header>
        <GlobeSection />
        <HexagonTransitionSection />
        <HexagonPrimitivesSection />
        <MotionAndChromeSection />
        <TokensSection />
      </main>
    </HexagonTransitionProvider>
  );
}

function KitSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-4xl">{title}</h2>
      {children}
    </section>
  );
}

function KitButton({ children, onClick, testId }: { children: ReactNode; onClick: () => void; testId?: string }) {
  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onClick}
      className="rounded-full bg-blue-500 px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

function GlobeSection() {
  const globeBackdropRef = useRef<GlobeBackdropHandle>(null);
  const [loadingGlobeTiles, setLoadingGlobeTiles] = useState(true);
  const [useBlueGlobePalette, setUseBlueGlobePalette] = useState(false);
  const [lastFlightMessage, setLastFlightMessage] = useState("Spinning");

  return (
    <KitSection title="GlobeBackdrop">
      <div className="flex flex-wrap gap-2">
        {UNIQUE_EXPERIENCE_LOCATIONS.map((location) => (
          <KitButton
            key={location.name}
            testId={`fly-to-${location.name}`}
            onClick={() => {
              setLastFlightMessage(`Flying to ${location.name}`);
              globeBackdropRef.current?.flyTo(location.coordinates, {
                onFlightFinished: (landed) =>
                  setLastFlightMessage(landed ? `Landed on ${location.name}` : "Flight cut short"),
              });
            }}
          >
            Fly to {location.name}
          </KitButton>
        ))}
        <KitButton
          testId="resume-spinning"
          onClick={() => {
            setLastFlightMessage("Returning to the whole globe");
            globeBackdropRef.current?.resumeSpinning({
              onFlightFinished: () => setLastFlightMessage("Spinning"),
            });
          }}
        >
          Resume spinning
        </KitButton>
        <KitButton onClick={() => setUseBlueGlobePalette((current) => !current)}>
          {useBlueGlobePalette ? "Natural palette (Zima default)" : "Blue palette"}
        </KitButton>
      </div>
      <p className="font-mono text-xs text-neutral-500" data-testid="globe-status">
        {loadingGlobeTiles ? "Loading globe tiles" : "Globe tiles loaded"} · {lastFlightMessage}
      </p>
      <div className="relative h-[70vh] min-h-[420px] w-full">
        <GlobeBackdrop
          key={useBlueGlobePalette ? "blue" : "natural"}
          ref={globeBackdropRef}
          className="absolute inset-0"
          palette={useBlueGlobePalette ? BLUE_GLOBE_PALETTE : NATURAL_GLOBE_PALETTE}
          onGlobeTilesLoaded={() => setLoadingGlobeTiles(false)}
          onGlobeUnavailable={() => setLastFlightMessage("WebGL unavailable, showing the static globe")}
        >
          {UNIQUE_EXPERIENCE_LOCATIONS.map((location) => (
            <GlobeMarker key={location.name} coordinates={location.coordinates} anchor="bottom">
              <div
                className={`${jetbrainsMono.className} rounded-full bg-white px-3 py-1 text-xs text-blue-500`}
                style={{ boxShadow: SHADOWS.marker }}
              >
                {location.name}
              </div>
            </GlobeMarker>
          ))}
        </GlobeBackdrop>
      </div>
    </KitSection>
  );
}

function HexagonTransitionSection() {
  const { cover, reveal, coverRunAndReveal } = useHexagonTransition();
  const [hexagonCoverRunCount, setHexagonCoverRunCount] = useState(0);

  return (
    <KitSection title="Hexagon cover and reveal">
      <p className="font-mono text-sm text-neutral-600">
        The cover grows from wherever you click. Ran the callback {hexagonCoverRunCount} times.
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          data-testid="cover-run-and-reveal"
          className="rounded-full bg-blue-500 px-4 py-2 font-mono text-sm text-white transition-colors hover:bg-blue-600"
          onClick={(event) =>
            void coverRunAndReveal(() => setHexagonCoverRunCount((count) => count + 1), {
              origin: { x: event.clientX, y: event.clientY },
              holdBeforeRevealMs: 700,
            })
          }
        >
          Cover, run callback, reveal
        </button>
        <KitButton
          testId="cover-only"
          onClick={async () => {
            await cover();
            window.setTimeout(() => void reveal(), 1500);
          }}
        >
          Cover, then reveal after 1.5s
        </KitButton>
      </div>
    </KitSection>
  );
}

function HexagonPrimitivesSection() {
  const languages = resume.skills[0].items;
  return (
    <KitSection title="Hexagon and HexagonGrid">
      <div className="flex flex-wrap items-center gap-6">
        <Hexagon className="flex w-32 items-center justify-center bg-blue-500 font-mono text-white">pointy</Hexagon>
        <Hexagon orientation="flat" className="flex w-36 items-center justify-center bg-blue-200 font-mono text-blue-900">
          flat
        </Hexagon>
        <Hexagon className="w-32 bg-blue-900" whileHover={{ scale: 1.08 }} transition={{ type: "spring", stiffness: 400, damping: 40 }}>
          <div className="flex h-full items-center justify-center font-mono text-xs text-white">hover me</div>
        </Hexagon>
      </div>
      <div className="max-w-xl">
        <HexagonGrid
          items={languages}
          columns={4}
          gap="6px"
          getItemKey={(language) => language}
          hexagonClassName={(_, index) => (index % 3 === 0 ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-900")}
          getHexagonProps={(_, index) => ({
            initial: { opacity: 0, scale: 0.6 },
            animate: { opacity: 1, scale: 1 },
            transition: { delay: index * 0.04, type: "spring", stiffness: 400, damping: 40 },
            whileHover: { scale: 1.06 },
          })}
          renderHexagonContent={(language) => (
            <span className="flex h-full items-center justify-center px-2 text-center font-mono text-xs">{language}</span>
          )}
        />
      </div>
    </KitSection>
  );
}

function MotionAndChromeSection() {
  const [resultsPanelMinimized, setResultsPanelMinimized] = useState(false);
  const [showSlideUpSheet, setShowSlideUpSheet] = useState(false);
  const [showRiseToast, setShowRiseToast] = useState(false);
  const firstExperience = resume.experience[0];

  return (
    <KitSection title="Motion and chrome">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex h-[360px] justify-end rounded-3xl bg-blue-50 p-[26px]">
          <AnimatePresence initial={false} mode="popLayout">
            {resultsPanelMinimized ? (
              <motion.div key="minimized">
                <WhiteRoundButton
                  shape="rounded"
                  aria-label="Show panel"
                  onClick={() => setResultsPanelMinimized(false)}
                  layoutId="kit-results-shell"
                  transition={layoutMorphTransition}
                >
                  <motion.span {...contentFadeAroundMorph} className="flex">
                    <GlobeIcon />
                  </motion.span>
                </WhiteRoundButton>
              </motion.div>
            ) : (
              <WhitePanel
                key="panel"
                layoutId="kit-results-shell"
                transition={layoutMorphTransition}
                className="flex h-full w-[80%] flex-col gap-3 p-5"
              >
                <motion.div {...contentFadeAroundMorph} className="flex flex-col gap-3">
                  <WhiteRoundButton aria-label="Hide panel" onClick={() => setResultsPanelMinimized(true)}>
                    <ChevronRightIcon />
                  </WhiteRoundButton>
                  <p className="font-mono text-xs text-neutral-500">layoutMorphTransition + contentFadeAroundMorph</p>
                </motion.div>
              </WhitePanel>
            )}
          </AnimatePresence>
        </div>

        <div className="flex flex-col gap-4">
          <ZimaCard fill="blue" className="flex aspect-[345/223] flex-col justify-between">
            <h3 className={ZIMA_CARD_TEXT.title}>{firstExperience.organization}</h3>
            <div className="flex flex-col gap-[6px]">
              <p className={ZIMA_CARD_TEXT.subtitle}>{firstExperience.location.name}</p>
              <p className={ZIMA_CARD_TEXT.body}>{firstExperience.bullets[0].text}</p>
            </div>
          </ZimaCard>
          <ZimaCard fill="white" className="flex flex-col gap-2">
            <h3 className={ZIMA_CARD_TEXT.title}>fill=&quot;white&quot;</h3>
            <p className={ZIMA_CARD_TEXT.body}>For blue surfaces.</p>
          </ZimaCard>
        </div>

        <PaperPanel className="flex flex-col gap-4">
          <p className={`${jetbrainsMono.className} text-[18px] leading-7 text-neutral-800`}>PaperPanel size=&quot;hero&quot;</p>
          <BlueRoundButton aria-label="Send" className="size-[60px] self-end">
            <UpArrowIcon />
          </BlueRoundButton>
        </PaperPanel>

        <div className="relative flex h-[200px] flex-col items-start gap-3 overflow-hidden rounded-3xl bg-blue-100 p-5">
          <div className="flex flex-wrap gap-2">
            <KitButton testId="toggle-slide-up" onClick={() => setShowSlideUpSheet((current) => !current)}>
              Slide-up sheet
            </KitButton>
            <KitButton testId="show-toast" onClick={() => setShowRiseToast(true)}>
              Rise toast
            </KitButton>
          </div>
          <AnimatePresence>
            {showSlideUpSheet ? (
              <motion.div
                key="sheet"
                variants={slideUpFromBottomEdgeVariants}
                initial="hidden"
                animate="shown"
                exit="hidden"
                className="absolute inset-x-0 bottom-0 h-[60%] rounded-t-[31px] bg-blue-500 p-4 font-mono text-xs text-white"
              >
                slideUpFromBottomEdgeVariants (SETTLE_SPRING)
              </motion.div>
            ) : null}
          </AnimatePresence>
          {showRiseToast ? (
            <RiseToast
              message="RiseToast: rises, holds 5s, sinks."
              onToastFinished={() => setShowRiseToast(false)}
              onDismiss={() => setShowRiseToast(false)}
            />
          ) : null}
        </div>
      </div>
    </KitSection>
  );
}

function TokensSection() {
  return (
    <KitSection title="Tokens">
      <div className="flex flex-wrap gap-3">
        {Object.entries(BLUE).map(([step, hex]) => (
          <div key={step} className="flex flex-col items-center gap-1 font-mono text-xs">
            <div className="size-14 rounded-card" style={{ backgroundColor: hex, boxShadow: SHADOWS.card }} />
            <span>BLUE[{step}]</span>
            <span className="text-neutral-500">{hex}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-6">
        <p className="text-3xl">font-serif: Instrument Serif</p>
        <p className="font-mono text-lg">font-mono: Roboto Mono</p>
        <p className="font-zima-mono text-lg">font-zima-mono: JetBrains Mono</p>
      </div>
    </KitSection>
  );
}
