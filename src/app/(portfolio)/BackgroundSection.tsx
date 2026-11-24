"use client";

import type { ReactNode } from "react";
import { resume } from "@/content/resume";
import { BACKGROUND_ENTRY_GROUPS, type BackgroundEntry } from "./backgroundEntries";
import { ExperienceTable } from "./ExperienceTable";
import { ExperienceTimeline } from "./ExperienceTimeline";
import { SectionHeading } from "./SectionHeading";
import {
  EXPERIENCE_PRESENTATIONS,
  useExperiencePresentationChoice,
  type ExperiencePresentation,
} from "./useExperiencePresentationChoice";

const EXPERIENCE_PRESENTATION_LABELS: Record<ExperiencePresentation, string> = {
  table: "Table",
  timeline: "Timeline",
};

const EXPERIENCE_PRESENTATION_COMPONENTS: Record<ExperiencePresentation, (props: { entries: BackgroundEntry[] }) => ReactNode> = {
  table: ExperienceTable,
  timeline: ExperienceTimeline,
};

function BackgroundSubsection({
  label,
  showLabelAboveContent = false,
  children,
}: {
  label: string;
  showLabelAboveContent?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      aria-label={label}
      className={`grid grid-cols-1 gap-x-8 border-t border-neutral-900 pt-3 ${showLabelAboveContent ? "gap-y-8" : "lg:grid-cols-[9rem_1fr]"}`}
    >
      <h3 className={`font-mono text-[11px] tracking-[0.16em] uppercase ${showLabelAboveContent ? "" : "pb-3 lg:pb-0"}`}>{label}</h3>
      <div className="flex flex-col">{children}</div>
    </section>
  );
}

function ExperiencePresentationSwitch({
  experiencePresentation,
  chooseExperiencePresentation,
}: ReturnType<typeof useExperiencePresentationChoice>) {
  return (
    <div role="group" aria-label="Experience layout" className="mt-2 flex w-fit rounded-full border border-neutral-900/20 p-0.5">
      {EXPERIENCE_PRESENTATIONS.map((presentation) => (
        <button
          key={presentation}
          type="button"
          aria-pressed={experiencePresentation === presentation}
          onClick={() => chooseExperiencePresentation(presentation)}
          className="rounded-full px-3 py-1 font-mono text-[11px] tracking-[0.08em] text-neutral-900 uppercase outline-none transition-colors hover:text-blue-600 focus-visible:ring-2 focus-visible:ring-blue-600 aria-pressed:bg-neutral-900 aria-pressed:text-white"
        >
          {EXPERIENCE_PRESENTATION_LABELS[presentation]}
        </button>
      ))}
    </div>
  );
}

export function BackgroundSection() {
  const [education] = resume.education;
  const experiencePresentationChoice = useExperiencePresentationChoice();
  const { experiencePresentation } = experiencePresentationChoice;
  const ExperiencePresentationComponent = EXPERIENCE_PRESENTATION_COMPONENTS[experiencePresentation];
  const showExperienceTimeline = experiencePresentation === "timeline";
  return (
    <section id="background" aria-labelledby="background-heading" className="grid grid-cols-1 gap-x-12 gap-y-8 lg:grid-cols-12">
      <SectionHeading
        sectionNumber="02"
        headingId="background-heading"
        title="Background"
        className="lg:col-span-3"
        stickOnDesktopWhileSectionScrolls
        note="Education, experience, projects, leadership, teaching and skills."
      >
        <ExperiencePresentationSwitch {...experiencePresentationChoice} />
      </SectionHeading>
      <div className="flex flex-col gap-10 lg:col-span-9">
        <BackgroundSubsection label="Education">
          <article className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-[minmax(0,15rem)_1fr]">
            <header>
              <h4 className="font-serif text-[1.75rem] leading-none">{education.institution}</h4>
              <p className="mt-1.5 font-mono text-[11px] text-neutral-900/55">
                {education.dates.start} – {education.dates.end} · {education.location.name}
              </p>
            </header>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1 font-serif text-[1.1875rem] leading-[1.28]">
              <dt className="pt-1 font-mono text-[11px] tracking-[0.08em] text-neutral-900/55 uppercase">Degree</dt>
              <dd>{education.degree}</dd>
              <dt className="pt-1 font-mono text-[11px] tracking-[0.08em] text-neutral-900/55 uppercase">Minor</dt>
              <dd>{education.minor}</dd>
              <dt className="pt-1 font-mono text-[11px] tracking-[0.08em] text-neutral-900/55 uppercase">GPA</dt>
              <dd>{education.gpa}</dd>
            </dl>
          </article>
        </BackgroundSubsection>

        {BACKGROUND_ENTRY_GROUPS.map((entryGroup) => (
          <BackgroundSubsection key={entryGroup.label} label={entryGroup.label} showLabelAboveContent={showExperienceTimeline}>
            <ExperiencePresentationComponent entries={entryGroup.entries} />
          </BackgroundSubsection>
        ))}

        <BackgroundSubsection label="Skills">
          <dl className="flex flex-col">
            {resume.skills.map((skillGroup) => (
              <div
                key={skillGroup.label}
                className="grid grid-cols-1 gap-x-8 gap-y-1 border-t border-neutral-900/15 py-2.5 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,15rem)_1fr]"
              >
                <dt className="pt-1 font-mono text-[11px] tracking-[0.08em] text-neutral-900/55 uppercase">{skillGroup.label}</dt>
                <dd className="font-serif text-[1.1875rem] leading-[1.28]">
                  {skillGroup.items.map((item, itemIndex) => (
                    <span key={item}>
                      {item}
                      {itemIndex < skillGroup.items.length - 1 ? (
                        <span aria-hidden className="px-1.5 text-blue-600">
                          /
                        </span>
                      ) : null}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </BackgroundSubsection>
      </div>
    </section>
  );
}
