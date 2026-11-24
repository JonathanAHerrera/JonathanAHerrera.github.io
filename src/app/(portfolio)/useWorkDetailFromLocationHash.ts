"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { flushSync } from "react-dom";
import { useHexagonTransition, type HexagonCoverOrigin } from "@/zima-kit";
import { useSetCoverOverlayCaption } from "./EditorialTransitionShell";
import { WORK_DETAIL_HASH_PREFIX, findWorkPiece, readWorkIdFromLocationHash, workDetailHash, workPieceKindLabel } from "./workPieces";

const HOLD_COVER_BEFORE_REVEAL_MS = 260;

export const WORK_HEXAGON_LINK_ATTRIBUTE = "data-work-hexagon-link";
export const WORK_DETAIL_HEADING_ID = "work-detail-heading";

function findVisibleWorkHexagonLink(workId: string): HTMLElement | null {
  const candidates = document.querySelectorAll<HTMLElement>(`[${WORK_HEXAGON_LINK_ATTRIBUTE}="${workId}"]`);
  return [...candidates].find((candidate) => candidate.getClientRects().length > 0) ?? null;
}

export function centerOfElement(element: Element): HexagonCoverOrigin {
  const rectangle = element.getBoundingClientRect();
  return { x: rectangle.left + rectangle.width / 2, y: rectangle.top + rectangle.height / 2 };
}

// Enter or Space on a link or button dispatches a click with detail 0 and clientX/Y at 0,0.
function activationCameFromKeyboard(event: MouseEvent | ReactMouseEvent): boolean {
  return event.detail === 0;
}

export function coverOriginFromActivation(event: MouseEvent | ReactMouseEvent, activatedElement: Element): HexagonCoverOrigin {
  return activationCameFromKeyboard(event) ? centerOfElement(activatedElement) : { x: event.clientX, y: event.clientY };
}

function centerOfViewport(): HexagonCoverOrigin {
  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

export function useWorkDetailFromLocationHash() {
  const { coverRunAndReveal } = useHexagonTransition();
  const setCoverOverlayCaption = useSetCoverOverlayCaption();
  const [shownWorkId, setShownWorkId] = useState<string | null>(null);
  const [workDetailRevealFinished, setWorkDetailRevealFinished] = useState(false);
  const shownWorkIdRef = useRef<string | null>(null);
  const runningWorkDetailTransitionRef = useRef(false);
  const queuedAnotherSyncRef = useRef(false);
  const nextCoverOriginRef = useRef<HexagonCoverOrigin | null>(null);
  const detailEnteredFromGalleryInThisPageRef = useRef(false);
  const lastShownWorkIdRef = useRef<string | null>(null);

  const runOneWorkDetailTransition = useCallback(async (syncTrigger: "page-load" | "in-page-navigation") => {
    const targetWorkId = readWorkIdFromLocationHash();
    const previousWorkId = shownWorkIdRef.current;
    if (targetWorkId === previousWorkId) return;

    const hexagonLinkOfClosingPiece = targetWorkId === null && previousWorkId ? findVisibleWorkHexagonLink(previousWorkId) : null;
    const coverOrigin =
      nextCoverOriginRef.current ?? (hexagonLinkOfClosingPiece ? centerOfElement(hexagonLinkOfClosingPiece) : centerOfViewport());
    nextCoverOriginRef.current = null;
    const targetWorkPiece = findWorkPiece(targetWorkId);
    setCoverOverlayCaption(
      targetWorkPiece
        ? {
            coverCaptionLabel: `${workPieceKindLabel(targetWorkPiece.kind)} ${targetWorkPiece.workPieceNumber}`,
            title: targetWorkPiece.title,
          }
        : { coverCaptionLabel: "Back to", title: "Selected work" },
    );
    if (previousWorkId === null && targetWorkId !== null) {
      detailEnteredFromGalleryInThisPageRef.current = syncTrigger === "in-page-navigation";
    }

    await coverRunAndReveal(
      () => {
        flushSync(() => {
          setWorkDetailRevealFinished(false);
          setShownWorkId(targetWorkId);
        });
        shownWorkIdRef.current = targetWorkId;
        if (targetWorkId) lastShownWorkIdRef.current = targetWorkId;
        if (targetWorkId) document.getElementById(WORK_DETAIL_HEADING_ID)?.closest("[data-scroll-root]")?.scrollTo(0, 0);
      },
      { origin: coverOrigin, holdBeforeRevealMs: HOLD_COVER_BEFORE_REVEAL_MS },
    );

    if (targetWorkId) {
      setWorkDetailRevealFinished(true);
      document.getElementById(WORK_DETAIL_HEADING_ID)?.focus({ preventScroll: true });
    } else {
      detailEnteredFromGalleryInThisPageRef.current = false;
      const workIdToReturnTo = lastShownWorkIdRef.current;
      const hexagonLinkToFocus = workIdToReturnTo ? findVisibleWorkHexagonLink(workIdToReturnTo) : null;
      hexagonLinkToFocus?.focus({ preventScroll: true });
      hexagonLinkToFocus?.scrollIntoView({ block: "nearest" });
    }
  }, [coverRunAndReveal, setCoverOverlayCaption]);

  const syncWorkDetailWithLocationHash = useCallback(
    async (syncTrigger: "page-load" | "in-page-navigation") => {
      if (runningWorkDetailTransitionRef.current) {
        queuedAnotherSyncRef.current = true;
        return;
      }
      runningWorkDetailTransitionRef.current = true;
      let nextSyncTrigger = syncTrigger;
      do {
        queuedAnotherSyncRef.current = false;
        await runOneWorkDetailTransition(nextSyncTrigger);
        nextSyncTrigger = "in-page-navigation";
      } while (queuedAnotherSyncRef.current);
      runningWorkDetailTransitionRef.current = false;
    },
    [runOneWorkDetailTransition],
  );

  useEffect(() => {
    const syncAfterHashChange = () => void syncWorkDetailWithLocationHash("in-page-navigation");
    window.addEventListener("hashchange", syncAfterHashChange);
    // Deferred a frame: Strict Mode's simulated unmount destroys the provider's cover animation,
    // and a cover started before that never resolves, which would wedge every later transition.
    const pageLoadSyncFrameId = window.requestAnimationFrame(() => void syncWorkDetailWithLocationHash("page-load"));
    return () => {
      window.cancelAnimationFrame(pageLoadSyncFrameId);
      window.removeEventListener("hashchange", syncAfterHashChange);
    };
  }, [syncWorkDetailWithLocationHash]);

  useEffect(() => {
    const rememberCoverOriginOfClickedWorkDetailLink = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const workDetailLink = event.target.closest<HTMLAnchorElement>(`a[href^="${WORK_DETAIL_HASH_PREFIX}"]`);
      if (!workDetailLink || workDetailLink.getAttribute("href") === window.location.hash) return;
      nextCoverOriginRef.current = coverOriginFromActivation(event, workDetailLink);
    };
    document.addEventListener("click", rememberCoverOriginOfClickedWorkDetailLink, { capture: true });
    return () => document.removeEventListener("click", rememberCoverOriginOfClickedWorkDetailLink, { capture: true });
  }, []);

  const showAdjacentWorkDetail = useCallback((workId: string, coverOrigin: HexagonCoverOrigin) => {
    nextCoverOriginRef.current = coverOrigin;
    window.location.replace(workDetailHash(workId));
  }, []);

  const closeWorkDetail = useCallback(
    (coverOrigin?: HexagonCoverOrigin) => {
      const workIdBeingClosed = shownWorkIdRef.current;
      if (!workIdBeingClosed) return;
      const hexagonLink = findVisibleWorkHexagonLink(workIdBeingClosed);
      nextCoverOriginRef.current = coverOrigin ?? (hexagonLink ? centerOfElement(hexagonLink) : null);
      if (detailEnteredFromGalleryInThisPageRef.current) {
        window.history.back();
        return;
      }
      window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);
      void syncWorkDetailWithLocationHash("in-page-navigation");
    },
    [syncWorkDetailWithLocationHash],
  );

  return {
    shownWorkPiece: findWorkPiece(shownWorkId),
    workDetailRevealFinished,
    showAdjacentWorkDetail,
    closeWorkDetail,
  };
}
