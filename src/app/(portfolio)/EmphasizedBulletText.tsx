import type { ResumeBullet } from "@/content/resume";
import { instrumentSerifItalic } from "./editorialFonts";

type BulletSegment = { text: string; emphasized: boolean };

function splitBulletIntoSegments({ text, emphasizedPhrases }: ResumeBullet): BulletSegment[] {
  const emphasizedRanges = emphasizedPhrases
    .map((phrase) => ({ start: text.indexOf(phrase), end: text.indexOf(phrase) + phrase.length }))
    .filter((range) => range.start >= 0)
    .sort((first, second) => first.start - second.start);

  const segments: BulletSegment[] = [];
  let cursor = 0;
  for (const range of emphasizedRanges) {
    if (range.start < cursor) continue;
    if (range.start > cursor) segments.push({ text: text.slice(cursor, range.start), emphasized: false });
    segments.push({ text: text.slice(range.start, range.end), emphasized: true });
    cursor = range.end;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), emphasized: false });
  return segments;
}

const EMPHASIS_CLASS_NAMES = {
  serifItalic: `${instrumentSerifItalic.className} font-normal text-blue-600`,
  mono: "font-zima-mono text-[0.8em] font-normal text-blue-600",
} as const;

export function EmphasizedBulletText({
  bullet,
  emphasisStyle = "serifItalic",
}: {
  bullet: ResumeBullet;
  emphasisStyle?: keyof typeof EMPHASIS_CLASS_NAMES;
}) {
  return (
    <>
      {splitBulletIntoSegments(bullet).map((segment, index) =>
        segment.emphasized ? (
          <strong key={index} className={EMPHASIS_CLASS_NAMES[emphasisStyle]}>
            {segment.text}
          </strong>
        ) : (
          <span key={index}>{segment.text}</span>
        ),
      )}
    </>
  );
}
