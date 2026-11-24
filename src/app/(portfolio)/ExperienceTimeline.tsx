import { Hexagon } from "@/zima-kit";
import type { BackgroundEntry } from "./backgroundEntries";
import { EmphasizedBulletText } from "./EmphasizedBulletText";
import { SeeMoreAboutWorkLink } from "./SeeMoreAboutWorkLink";

function StackChips({ stackItems, className = "" }: { stackItems: string[]; className?: string }) {
  if (stackItems.length === 0) return null;
  return (
    <div className={`flex-col gap-2 ${className}`}>
      <p className="font-mono text-[10px] tracking-[0.18em] text-neutral-900/55 uppercase">Stack</p>
      <ul aria-label="Stack" className="flex flex-wrap gap-1.5">
        {stackItems.map((stackItem) => (
          <li
            key={stackItem}
            className="rounded-full border border-blue-200 bg-white px-2 py-0.5 font-mono text-[11px] leading-[1.4] text-neutral-900"
          >
            {stackItem}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExperienceTimelineRow({ entry }: { entry: BackgroundEntry }) {
  const subtitleOnlyRepeatsStack = entry.subtitle === entry.stackItems.join(", ");
  return (
    <li className="grid grid-cols-[18px_minmax(0,1fr)] gap-x-4 xl:grid-cols-[260px_72px_minmax(0,1fr)] xl:gap-x-0">
      <div className="col-start-2 row-start-1 flex flex-col xl:col-start-1">
        {entry.dateLine ? <p className="font-mono text-[13px] text-neutral-900">{entry.dateLine}</p> : null}
        {entry.placeName ? <p className="mt-0.5 font-mono text-xs text-neutral-900/55">{entry.placeName}</p> : null}
        <StackChips stackItems={entry.stackItems} className="mt-6 hidden xl:flex" />
      </div>

      <Hexagon aria-hidden className="w-[18px] bg-blue-600 col-start-1 row-start-1 xl:col-start-2 xl:mt-[11px] xl:justify-self-center" />

      <div className="col-start-2 row-start-2 flex flex-col xl:col-start-3 xl:row-start-1">
        <h4 className="mt-3 font-serif text-[clamp(2rem,3vw,2.5rem)] leading-none xl:mt-0">{entry.title}</h4>
        {subtitleOnlyRepeatsStack ? null : (
          <p className="mt-2 font-mono text-[13px] font-bold text-neutral-900">{entry.subtitle}</p>
        )}
        <StackChips stackItems={entry.stackItems} className="mt-4 flex xl:hidden" />
        <ul className="mt-5 flex flex-col gap-3">
          {entry.bullets.map((bullet) => (
            <li
              key={bullet.text}
              className="grid grid-cols-[1.125rem_1fr] font-serif text-[1.1875rem] leading-[1.35] text-pretty sm:text-[1.25rem]"
            >
              <Hexagon aria-hidden className="mt-[0.5em] w-[7px] bg-blue-600" />
              <span>
                <EmphasizedBulletText bullet={bullet} emphasisStyle="mono" />
              </span>
            </li>
          ))}
        </ul>
        {entry.workDetailId ? <SeeMoreAboutWorkLink workId={entry.workDetailId} className="mt-4" /> : null}
      </div>
    </li>
  );
}

export function ExperienceTimeline({ entries }: { entries: BackgroundEntry[] }) {
  return (
    <ol className="relative flex flex-col gap-14 xl:gap-20">
      <span
        aria-hidden
        className="absolute top-2 bottom-0 left-[8.5px] w-px bg-blue-200 xl:left-[295.5px]"
      />
      {entries.map((entry) => (
        <ExperienceTimelineRow key={entry.key} entry={entry} />
      ))}
    </ol>
  );
}
