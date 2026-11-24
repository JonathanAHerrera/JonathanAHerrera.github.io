import type { Metadata } from "next";
import type { ReactNode } from "react";
import { resume } from "@/content/resume";
import { EditorialTransitionShell } from "./EditorialTransitionShell";

export const metadata: Metadata = {
  title: `${resume.name}: selected work`,
  description: `${resume.name}, Computer Science at Texas A&M: selected work, background and contact.`,
};

export default function PortfolioLayout({ children }: { children: ReactNode }) {
  return <EditorialTransitionShell>{children}</EditorialTransitionShell>;
}
