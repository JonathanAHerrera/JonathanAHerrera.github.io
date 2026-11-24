import { findWorkPiece, workDetailHash } from "./workPieces";

export function SeeMoreAboutWorkLink({ workId, className = "" }: { workId: string; className?: string }) {
  const workPiece = findWorkPiece(workId);
  if (!workPiece) return null;
  return (
    <a
      href={workDetailHash(workId)}
      aria-label={`See more about ${workPiece.title}`}
      className={`inline-flex w-fit items-center gap-1 rounded-full font-mono text-[11px] tracking-[0.08em] text-blue-600 uppercase underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-blue-600 ${className}`}
    >
      See more <span aria-hidden>→</span>
    </a>
  );
}
