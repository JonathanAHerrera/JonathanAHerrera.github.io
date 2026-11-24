"use client";

import { useCallback, useSyncExternalStore } from "react";

export const EXPERIENCE_PRESENTATIONS = ["table", "timeline"] as const;
export type ExperiencePresentation = (typeof EXPERIENCE_PRESENTATIONS)[number];

const DEFAULT_EXPERIENCE_PRESENTATION: ExperiencePresentation = "timeline";
const EXPERIENCE_PRESENTATION_QUERY_PARAMETER = "experience";
const EXPERIENCE_PRESENTATION_STORAGE_KEY = "personal-site:experience-presentation";
const EXPERIENCE_PRESENTATION_CHANGED_EVENT = "experience-presentation-changed";

function isExperiencePresentation(value: string | null): value is ExperiencePresentation {
  return EXPERIENCE_PRESENTATIONS.includes(value as ExperiencePresentation);
}

function readStoredExperiencePresentation(): string | null {
  try {
    return window.localStorage.getItem(EXPERIENCE_PRESENTATION_STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredExperiencePresentation(presentation: ExperiencePresentation) {
  try {
    window.localStorage.setItem(EXPERIENCE_PRESENTATION_STORAGE_KEY, presentation);
  } catch {
    // Storage can throw in private windows; the query string still carries the choice.
  }
}

function readExperiencePresentationInBrowser(): ExperiencePresentation {
  const presentationFromQuery = new URLSearchParams(window.location.search).get(EXPERIENCE_PRESENTATION_QUERY_PARAMETER);
  if (isExperiencePresentation(presentationFromQuery)) return presentationFromQuery;
  const storedPresentation = readStoredExperiencePresentation();
  return isExperiencePresentation(storedPresentation) ? storedPresentation : DEFAULT_EXPERIENCE_PRESENTATION;
}

function readExperiencePresentationDuringPrerender(): ExperiencePresentation {
  return DEFAULT_EXPERIENCE_PRESENTATION;
}

function subscribeToExperiencePresentationChanges(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(EXPERIENCE_PRESENTATION_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(EXPERIENCE_PRESENTATION_CHANGED_EVENT, onChange);
  };
}

export function useExperiencePresentationChoice() {
  const experiencePresentation = useSyncExternalStore(
    subscribeToExperiencePresentationChanges,
    readExperiencePresentationInBrowser,
    readExperiencePresentationDuringPrerender,
  );

  const chooseExperiencePresentation = useCallback((presentation: ExperiencePresentation) => {
    writeStoredExperiencePresentation(presentation);
    const url = new URL(window.location.href);
    url.searchParams.set(EXPERIENCE_PRESENTATION_QUERY_PARAMETER, presentation);
    window.history.replaceState(window.history.state, "", url);
    window.dispatchEvent(new Event(EXPERIENCE_PRESENTATION_CHANGED_EVENT));
  }, []);

  return { experiencePresentation, chooseExperiencePresentation };
}
