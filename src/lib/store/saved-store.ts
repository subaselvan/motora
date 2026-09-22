/**
 * The shortlist: vehicles a renter has set aside to compare.
 *
 * An external store rather than React context, read through
 * `useSyncExternalStore`. Context would need a provider high enough to
 * cover the navbar badge, every card and the compare page, which means
 * wrapping the whole app in a client component and pulling the entire tree
 * across the server boundary. This keeps the pages server-rendered and
 * makes only the handful of components that actually read the shortlist
 * into client components.
 *
 * `getServerSnapshot` returns a frozen empty array, so the server renders
 * "nothing saved" and React swaps in the real list after hydration without
 * a mismatch — rather than the usual `mounted` boolean, which does the same
 * thing with an extra render and a flash.
 *
 * Persistence is localStorage today. When accounts land this becomes the
 * cache in front of a `saved_vehicles` table; `subscribe`/`getSnapshot`/
 * `toggle` keep their signatures and no component changes.
 */

import { VEHICLES } from "@/lib/vehicles";

const KEY = "motora.saved.v1";
/** Bumped alongside KEY if the stored shape ever changes. */
const MAX = 24;

const EMPTY: readonly string[] = Object.freeze([]);

/**
 * Stored slugs are validated against the catalogue on read, so a slug that
 * outlives the vehicle it names disappears everywhere at once.
 *
 * Without this the navbar badge counts raw slugs while the compare page
 * counts the ones it could resolve, and the two disagree — six in the
 * badge, four in the table. Pruning at the single point where storage
 * enters the app is what keeps every reader agreeing.
 *
 * Against a database this check moves server-side and this set goes away.
 */
const KNOWN_SLUGS = new Set(VEHICLES.map((v) => v.slug));

let cache: readonly string[] = EMPTY;
let hydrated = false;
const listeners = new Set<() => void>();

/** Every localStorage access is wrapped: it throws outright in a Safari
 *  private window and returns null under blocked site data. A shortlist is
 *  a convenience, so failing to read one must never break the page. */
function readStorage(): readonly string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY;
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const slugs = parsed.filter(
      (v): v is string => typeof v === "string" && KNOWN_SLUGS.has(v),
    );
    return slugs.length ? Object.freeze(slugs.slice(0, MAX)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function writeStorage(slugs: readonly string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(slugs));
  } catch {
    // Quota or a blocked store. The in-memory cache still holds for this
    // session, which is the useful half of the behaviour.
  }
}

function emit() {
  for (const listener of listeners) listener();
}

function setCache(next: readonly string[]) {
  cache = next.length ? Object.freeze([...next]) : EMPTY;
  writeStorage(cache);
  emit();
}

export function subscribe(listener: () => void): () => void {
  // First subscriber pulls from storage. Doing it here rather than at module
  // scope keeps this file importable from a server component without
  // touching localStorage.
  if (!hydrated) {
    hydrated = true;
    cache = readStorage();
  }
  listeners.add(listener);

  // Another tab changing the shortlist fires `storage` here. Four lines to
  // keep two open tabs agreeing with each other.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== null && event.key !== KEY) return;
    cache = readStorage();
    emit();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Must return a stable reference: React compares snapshots by identity and
 *  will loop forever on a fresh array each call. */
export function getSnapshot(): readonly string[] {
  return cache;
}

export function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

export function toggleSaved(slug: string): boolean {
  if (!hydrated) {
    hydrated = true;
    cache = readStorage();
  }
  const has = cache.includes(slug);
  if (has) {
    setCache(cache.filter((s) => s !== slug));
    return false;
  }
  // Newest first, and capped — a shortlist you cannot read is not one.
  setCache([slug, ...cache].slice(0, MAX));
  return true;
}

export function removeSaved(slug: string) {
  setCache(cache.filter((s) => s !== slug));
}

export function clearSaved() {
  setCache(EMPTY);
}

export const SAVED_LIMIT = MAX;
