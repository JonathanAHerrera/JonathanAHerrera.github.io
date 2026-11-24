"use client";

import { useEffect, useState } from "react";
import { resume } from "@/content/resume";
import { Hexagon } from "@/zima-kit";
import { BackgroundSection } from "./BackgroundSection";
import { instrumentSerifItalic } from "./editorialFonts";
import { FramedGlobeFigure } from "./FramedGlobeFigure";
import { InterestsSpecimen } from "./InterestsSpecimen";
import { SectionHeading } from "./SectionHeading";
import { useWorkDetailFromLocationHash } from "./useWorkDetailFromLocationHash";
import { WorkDetailView } from "./WorkDetailView";
import { WorkHoneycomb } from "./WorkHoneycomb";
import { WORK_PIECES, workDetailHash } from "./workPieces";

const [EDUCATION] = resume.education;
const [FIRST_NAME, ...REMAINING_NAMES] = resume.name.split(" ");

const SECTION_LINKS = [
  { sectionNumber: "01", label: "Work", href: "#work" },
  { sectionNumber: "02", label: "Background", href: "#background" },
  { sectionNumber: "03", label: "Interests", href: "#interests" },
  { sectionNumber: "04", label: "Contact", href: "#contact" },
];

function MetadataItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-t border-neutral-900/15 pt-2">
      <dt className="font-mono text-[10px] tracking-[0.16em] text-neutral-900/55 uppercase">{label}</dt>
      <dd className="font-mono text-xs text-neutral-900">{value}</dd>
    </div>
  );
}

function OpeningSpread() {
  return (
    <header className="flex flex-col">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-900 py-3 font-mono text-[11px] tracking-[0.08em] uppercase">
        <p>
          JH <span className="text-neutral-900/45">/ Portfolio</span>
        </p>
        <nav aria-label="Sections">
          <ul className="flex gap-3 sm:gap-6">
            {SECTION_LINKS.map((sectionLink) => (
              <li key={sectionLink.href}>
                <a
                  href={sectionLink.href}
                  className="rounded-sm outline-none hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
                >
                  <span className="hidden text-neutral-900/45 sm:inline">{sectionLink.sectionNumber} </span>
                  {sectionLink.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="grid grid-cols-1 gap-x-12 gap-y-10 pt-10 pb-14 lg:grid-cols-12 lg:pt-16 lg:pb-20">
        <div className="flex flex-col lg:col-span-8">
          <h1 className="font-serif text-[clamp(6.25rem,14vw,14rem)] leading-[0.8] tracking-[-0.035em]">
            {FIRST_NAME}
            <br />
            <span className={`${instrumentSerifItalic.className} pl-[0.55em]`}>{REMAINING_NAMES.join(" ")}</span>
          </h1>
          <p className="mt-10 max-w-[26ch] font-serif text-[clamp(1.625rem,2.6vw,2.5rem)] leading-[1.08] text-pretty lg:mt-14 lg:ml-[18%]">
            Computer Science at Texas A&amp;M. I build full-stack and AI systems, and I bring a designer’s eye from{" "}
            <span className={`${instrumentSerifItalic.className} text-blue-600`}>UI/UX, fashion and poetry.</span>
          </p>
        </div>
        <div className="flex flex-col gap-8 lg:col-span-4">
          <div className="mx-auto w-full max-w-[420px] lg:max-w-none">
            <FramedGlobeFigure />
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <MetadataItem label="Based" value={EDUCATION.location.name} />
            <MetadataItem label="Graduating" value={EDUCATION.dates.end} />
            <MetadataItem label="Degree" value="B.S. Computer Science" />
            <MetadataItem label="Minor" value={EDUCATION.minor} />
          </dl>
        </div>
      </div>
    </header>
  );
}

function SelectedWorkSection({
  highlightedWorkId,
  onHighlightWork,
}: Parameters<typeof WorkHoneycomb>[0]) {
  return (
    <section id="work" aria-labelledby="work-heading" className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
      <div className="flex flex-col gap-8 lg:col-span-3">
        <SectionHeading
          sectionNumber="01"
          headingId="work-heading"
          title="Selected work"
          note={
            <span className="flex gap-4 text-neutral-900">
              <span className="flex items-center gap-1.5">
                <Hexagon aria-hidden className="w-2.5 bg-blue-600" /> Role
              </span>
              <span className="flex items-center gap-1.5">
                <Hexagon aria-hidden className="w-2.5 bg-blue-200" /> Project
              </span>
            </span>
          }
        />
        <ol aria-label="Index of selected work" className="hidden border-b border-neutral-900/15 lg:block">
          {WORK_PIECES.map((workPiece) => (
            <li key={workPiece.id}>
              <a
                href={workDetailHash(workPiece.id)}
                onPointerEnter={() => onHighlightWork(workPiece.id)}
                onPointerLeave={() => onHighlightWork(null)}
                onFocus={() => onHighlightWork(workPiece.id)}
                onBlur={() => onHighlightWork(null)}
                className={`grid grid-cols-[2rem_1fr_auto] items-baseline border-t border-neutral-900/15 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${
                  highlightedWorkId === workPiece.id ? "text-blue-600" : ""
                }`}
              >
                <span className="font-mono text-[11px] text-neutral-900/55">{workPiece.workPieceNumber}</span>
                <span className="font-serif text-lg leading-tight">{workPiece.title}</span>
                <span className="font-mono text-[11px] text-neutral-900/55">{workPiece.yearLabel}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
      <div className="lg:col-span-9">
        <WorkHoneycomb
          highlightedWorkId={highlightedWorkId}
          onHighlightWork={onHighlightWork}
        />
      </div>
    </section>
  );
}

function ContactFooter() {
  const { contact } = resume;
  const [emailLocalPart, emailDomain] = contact.email.split("@");
  return (
    <footer id="contact" aria-labelledby="contact-heading" className="border-t border-neutral-900 pt-3 pb-10">
      <p className="font-mono text-[11px] tracking-[0.16em] text-neutral-900/55 uppercase">§ 04 Contact</p>
      <h2 id="contact-heading" className="sr-only">
        Contact
      </h2>
      <a
        href={contact.emailUrl}
        className="mt-6 block w-fit rounded-md font-serif text-[clamp(2rem,7.2vw,7.5rem)] leading-[0.95] tracking-[-0.02em] break-words outline-none hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
      >
        {emailLocalPart}
        <wbr />
        <span className={instrumentSerifItalic.className}>@{emailDomain}</span>
      </a>
      <dl className="mt-12 flex flex-col gap-2 border-t border-neutral-900/15 pt-4 font-mono text-xs sm:flex-row sm:gap-16">
          <div className="flex gap-3">
            <dt className="w-20 text-neutral-900/55 sm:w-auto">LinkedIn</dt>
            <dd>
              <a href={contact.linkedInUrl} className="underline-offset-4 outline-none hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600">
                {contact.linkedInHandle}
              </a>
            </dd>
          </div>
          <div className="flex gap-3">
            <dt className="w-20 text-neutral-900/55 sm:w-auto">GitHub</dt>
            <dd>
              <a href={contact.gitHubUrl} className="underline-offset-4 outline-none hover:text-blue-600 hover:underline focus-visible:ring-2 focus-visible:ring-blue-600">
                {contact.gitHubHandle}
              </a>
            </dd>
          </div>
      </dl>
      <p className="mt-8 font-mono text-[10px] text-neutral-900/45">
        Map data ©{" "}
        <a
          href="https://www.openstreetmap.org/copyright"
          className="underline underline-offset-2 outline-none hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          OpenStreetMap
        </a>{" "}
        contributors, tiles by{" "}
        <a
          href="https://openfreemap.org"
          className="underline underline-offset-2 outline-none hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          OpenFreeMap
        </a>
        .
      </p>
    </footer>
  );
}

export function EditorialPortfolio() {
  const { shownWorkPiece, workDetailRevealFinished, showAdjacentWorkDetail, closeWorkDetail } = useWorkDetailFromLocationHash();
  const [highlightedWorkId, setHighlightedWorkId] = useState<string | null>(null);
  const showWorkDetail = shownWorkPiece !== null;

  useEffect(() => {
    if (!showWorkDetail) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [showWorkDetail]);

  return (
    <>
      <div inert={showWorkDetail} aria-hidden={showWorkDetail || undefined} className="overflow-x-clip">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-24 px-4 sm:px-8 lg:gap-32 lg:px-12">
          <OpeningSpread />
          <main className="flex flex-col gap-24 lg:gap-32">
            <SelectedWorkSection
              highlightedWorkId={highlightedWorkId}
              onHighlightWork={setHighlightedWorkId}
            />
            <BackgroundSection />
            <InterestsSpecimen />
          </main>
          <ContactFooter />
        </div>
      </div>
      {shownWorkPiece ? (
        <WorkDetailView
          workPiece={shownWorkPiece}
          workDetailRevealFinished={workDetailRevealFinished}
          onCloseWorkDetail={closeWorkDetail}
          onShowAdjacentWorkDetail={showAdjacentWorkDetail}
        />
      ) : null}
    </>
  );
}
