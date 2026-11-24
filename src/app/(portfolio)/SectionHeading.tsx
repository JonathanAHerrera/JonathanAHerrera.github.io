import type { ReactNode } from "react";

type SectionHeadingProps = {
  sectionNumber: string;
  headingId: string;
  title: string;
  note?: ReactNode;
  stickOnDesktopWhileSectionScrolls?: boolean;
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  sectionNumber,
  headingId,
  title,
  note,
  stickOnDesktopWhileSectionScrolls = false,
  className = "",
  children,
}: SectionHeadingProps) {
  return (
    <header
      className={`flex flex-col gap-3 ${stickOnDesktopWhileSectionScrolls ? "lg:sticky lg:top-10 lg:self-start" : ""} ${className}`}
    >
      <p className="font-mono text-[11px] tracking-[0.16em] text-neutral-900/55 uppercase">§ {sectionNumber}</p>
      <h2 id={headingId} className="font-serif text-[clamp(2.75rem,5vw,4.5rem)] leading-[0.92] tracking-[-0.01em]">
        {title}
      </h2>
      {note ? <div className="max-w-[24rem] font-mono text-xs leading-relaxed text-neutral-900/65">{note}</div> : null}
      {children}
    </header>
  );
}
