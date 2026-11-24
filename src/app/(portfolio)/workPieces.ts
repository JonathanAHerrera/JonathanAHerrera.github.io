import { resume, type ResumeBullet, type ResumeDateRange, type ResumeExperience, type ResumeProject } from "@/content/resume";
import { WORK_SCREENSHOTS_BY_WORK_PIECE_ID, type WorkScreenshot } from "./workScreenshots";

export type WorkPieceKind = "role" | "project";

export type WorkPiece = {
  id: string;
  workPieceNumber: string;
  kind: WorkPieceKind;
  title: string;
  roleTitle: string | null;
  yearLabel: string;
  dateLine: string;
  placeName: string | null;
  stackItems: string[];
  bullets: ResumeBullet[];
  screenshots: WorkScreenshot[];
};

export function workPieceKindLabel(kind: WorkPieceKind): string {
  return kind === "role" ? "Role" : "Project";
}

function yearOf(resumeDate: string): string {
  return resumeDate.match(/\d{4}/)?.[0] ?? resumeDate;
}

function yearRangeLabel(dates: ResumeDateRange): string {
  const startYear = yearOf(dates.start);
  const endYear = yearOf(dates.end);
  return startYear === endYear ? startYear : `${startYear}–${endYear}`;
}

function findExperience(id: string): ResumeExperience {
  const experience = resume.experience.find((candidate) => candidate.id === id);
  if (!experience) throw new Error(`No experience with id ${id} in the resume`);
  return experience;
}

function findProject(id: string): ResumeProject {
  const project = resume.projects.find((candidate) => candidate.id === id);
  if (!project) throw new Error(`No project with id ${id} in the resume`);
  return project;
}

function escapeForRegularExpression(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function namesThatCountAsMentionOfSkill(skillItem: string): string[] {
  const nameWithoutParenthetical = skillItem.replace(/\s*\(.*\)$/, "");
  return nameWithoutParenthetical.includes("/") ? nameWithoutParenthetical.split("/") : [nameWithoutParenthetical];
}

function bulletTextMentionsName(bulletText: string, name: string): number {
  const match = new RegExp(`(?<![\\w])${escapeForRegularExpression(name)}(?![\\w+])`, "i").exec(bulletText);
  return match ? match.index : -1;
}

const ALL_SKILL_ITEMS = resume.skills.flatMap((skillGroup) => skillGroup.items);

export function skillItemsMentionedInBullets(bullets: ResumeBullet[]): string[] {
  const allBulletText = bullets.map((bullet) => bullet.text).join(" \n ");
  return ALL_SKILL_ITEMS.map((skillItem) => ({
    skillItem,
    firstMentionIndex: Math.min(
      ...namesThatCountAsMentionOfSkill(skillItem)
        .map((name) => bulletTextMentionsName(allBulletText, name))
        .map((index) => (index < 0 ? Infinity : index)),
    ),
  }))
    .filter(({ firstMentionIndex }) => Number.isFinite(firstMentionIndex))
    .sort((first, second) => first.firstMentionIndex - second.firstMentionIndex)
    .map(({ skillItem }) => skillItem);
}

// Hand-picked to fit inside a hexagon; skillItemsMentionedInBullets gives the full list for roomier layouts.
const ROLE_STACK_QUOTED_FROM_BULLETS: Record<string, string[]> = {
  bumble: ["TypeScript", "Swift", "Kotlin", "Go"],
  "encando-ai": ["FastAPI", "Next.js", "MongoDB", "AWS"],
  paycom: ["TensorFlow", "PyTorch", "Scikit-learn"],
};

function roleWorkPiece(id: string): Omit<WorkPiece, "workPieceNumber"> {
  const experience = findExperience(id);
  return {
    id: experience.id,
    kind: "role",
    title: experience.organization,
    roleTitle: experience.role,
    yearLabel: yearRangeLabel(experience.dates),
    dateLine: `${experience.dates.start} – ${experience.dates.end}`,
    placeName: experience.location.name,
    stackItems: ROLE_STACK_QUOTED_FROM_BULLETS[id] ?? [],
    bullets: experience.bullets,
    screenshots: WORK_SCREENSHOTS_BY_WORK_PIECE_ID[id] ?? [],
  };
}

function projectWorkPiece(id: string): Omit<WorkPiece, "workPieceNumber"> {
  const project = findProject(id);
  const dateLine = project.dates.end ? `${project.dates.start} – ${project.dates.end}` : project.dates.start;
  return {
    id: project.id,
    kind: "project",
    title: project.name,
    roleTitle: null,
    yearLabel: project.dates.end ? `${project.dates.start}–${project.dates.end}` : project.dates.start,
    dateLine,
    placeName: null,
    stackItems: project.technologies,
    bullets: project.bullets,
    screenshots: WORK_SCREENSHOTS_BY_WORK_PIECE_ID[id] ?? [],
  };
}

// Ordered so the two kinds alternate across the honeycomb's first row.
export const WORK_PIECES: WorkPiece[] = [
  roleWorkPiece("bumble"),
  projectWorkPiece("hopamine"),
  roleWorkPiece("encando-ai"),
  projectWorkPiece("websocket-server"),
  roleWorkPiece("paycom"),
  projectWorkPiece("vita-ai"),
  projectWorkPiece("developer-news-agent"),
].map((workPiece, index) => ({ ...workPiece, workPieceNumber: String(index + 1).padStart(2, "0") }));

export function findWorkPiece(id: string | null): WorkPiece | null {
  return WORK_PIECES.find((workPiece) => workPiece.id === id) ?? null;
}

export const WORK_DETAIL_HASH_PREFIX = "#work/";

export function workDetailHash(id: string): string {
  return `${WORK_DETAIL_HASH_PREFIX}${id}`;
}

export function readWorkIdFromLocationHash(): string | null {
  const hash = window.location.hash;
  if (!hash.startsWith(WORK_DETAIL_HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(WORK_DETAIL_HASH_PREFIX.length));
  return findWorkPiece(id) ? id : null;
}
