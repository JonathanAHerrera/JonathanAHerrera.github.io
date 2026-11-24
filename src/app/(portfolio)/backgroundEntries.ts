import { resume, type ResumeBullet } from "@/content/resume";
import { findWorkPiece, skillItemsMentionedInBullets } from "./workPieces";

export type BackgroundEntry = {
  key: string;
  dateLine: string | null;
  placeName: string | null;
  title: string;
  subtitle: string;
  stackItems: string[];
  bullets: ResumeBullet[];
  workDetailId: string | null;
};

export type BackgroundEntryGroup = {
  label: string;
  entries: BackgroundEntry[];
};

const EXPERIENCE_ENTRIES: BackgroundEntry[] = resume.experience.map((experience) => ({
  key: experience.id,
  dateLine: `${experience.dates.start} – ${experience.dates.end}`,
  placeName: experience.location.name,
  title: experience.organization,
  subtitle: experience.role,
  stackItems: skillItemsMentionedInBullets(experience.bullets),
  bullets: experience.bullets,
  workDetailId: findWorkPiece(experience.id) ? experience.id : null,
}));

const PROJECT_ENTRIES: BackgroundEntry[] = resume.projects.map((project) => ({
  key: project.id,
  dateLine: project.dates.end ? `${project.dates.start} – ${project.dates.end}` : project.dates.start,
  placeName: null,
  title: project.name,
  subtitle: project.technologies.join(", "),
  stackItems: project.technologies,
  bullets: project.bullets,
  workDetailId: findWorkPiece(project.id) ? project.id : null,
}));

const LEADERSHIP_ENTRIES: BackgroundEntry[] = resume.leadership.map((leadership) => ({
  key: leadership.id,
  dateLine: `${leadership.dates.start} – ${leadership.dates.end}`,
  placeName: leadership.location.name,
  title: leadership.role.replace(/ Vice President$/, ""),
  subtitle: `Vice President, ${leadership.organization}`,
  stackItems: skillItemsMentionedInBullets(leadership.bullets),
  bullets: leadership.bullets,
  workDetailId: null,
}));

const TEACHING_ENTRIES: BackgroundEntry[] = resume.teaching.map((teaching) => ({
  key: teaching.id,
  dateLine: teaching.dates ? `${teaching.dates.start} – ${teaching.dates.end}` : null,
  placeName: teaching.location.name,
  title: "Peer Teacher",
  subtitle: `${teaching.role.replace(/^Peer Teacher, /, "")}, ${teaching.organization}`,
  stackItems: skillItemsMentionedInBullets(teaching.bullets),
  bullets: teaching.bullets,
  workDetailId: null,
}));

export const BACKGROUND_ENTRY_GROUPS: BackgroundEntryGroup[] = [
  { label: "Experience", entries: EXPERIENCE_ENTRIES },
  { label: "Projects", entries: PROJECT_ENTRIES },
  { label: "Leadership", entries: LEADERSHIP_ENTRIES },
  { label: "Teaching", entries: TEACHING_ENTRIES },
];
