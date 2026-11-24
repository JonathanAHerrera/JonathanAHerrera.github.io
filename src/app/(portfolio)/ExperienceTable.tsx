import type { BackgroundEntry } from "./backgroundEntries";
import { EmphasizedBulletText } from "./EmphasizedBulletText";
import { SeeMoreAboutWorkLink } from "./SeeMoreAboutWorkLink";

function ExperienceTableRow({ entry }: { entry: BackgroundEntry }) {
  return (
    <article className="grid grid-cols-1 gap-x-8 gap-y-2 border-t border-neutral-900/15 py-4 first:border-t-0 first:pt-0 md:grid-cols-[minmax(0,15rem)_1fr]">
      <header className="flex flex-col">
        <h4 className="font-serif text-[1.75rem] leading-none">{entry.title}</h4>
        <p className="mt-1.5 font-mono text-xs text-neutral-900">{entry.subtitle}</p>
        <p className="mt-1 font-mono text-[11px] text-neutral-900/55">
          {[entry.dateLine, entry.placeName].filter(Boolean).join(" · ")}
        </p>
        {entry.workDetailId ? <SeeMoreAboutWorkLink workId={entry.workDetailId} className="mt-2" /> : null}
      </header>
      <ul className="flex flex-col gap-1.5">
        {entry.bullets.map((bullet) => (
          <li key={bullet.text} className="grid grid-cols-[0.9rem_1fr] font-serif text-[1.1875rem] leading-[1.28] text-pretty">
            <span aria-hidden className="text-neutral-900/35">–</span>
            <span>
              <EmphasizedBulletText bullet={bullet} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export function ExperienceTable({ entries }: { entries: BackgroundEntry[] }) {
  return (
    <div className="flex flex-col">
      {entries.map((entry) => (
        <ExperienceTableRow key={entry.key} entry={entry} />
      ))}
    </div>
  );
}
