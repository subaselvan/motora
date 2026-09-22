"use client";

import { useSyncExternalStore } from "react";
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from "@/lib/store/saved-store";

/** The shortlist as slugs, newest first. Empty during SSR and the first
 *  hydration pass — see the note in saved-store.ts. */
export function useSavedSlugs(): readonly string[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsSaved(slug: string): boolean {
  return useSavedSlugs().includes(slug);
}
