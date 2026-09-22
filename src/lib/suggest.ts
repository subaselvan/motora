import {
  CATEGORIES,
  INVENTORY_CITIES,
  VEHICLES,
  type Category,
  type Vehicle,
} from "@/lib/vehicles";

/**
 * Type-ahead for the search box, modelled on how Cars24, BikeWale and OLX
 * answer a partial query: suggestions grouped by what they are (a category,
 * a brand, a specific model, a place) rather than one flat list, each with
 * a count so the renter knows what a choice leads to before making it.
 *
 * Pure and synchronous over the catalogue. At 22 vehicles that is instant;
 * at 20,000 it becomes a /api/suggest route over a search index, and the
 * `suggest()` signature is what that route returns.
 */

/* ── Vocabulary ────────────────────────────────────────────────── */

/**
 * The words people actually type, mapped to what we call things. This is
 * the India-specific half of type-ahead that a generic fuzzy matcher gets
 * wrong: "scooty" is the everyday word for a scooter, "bullet" means a
 * Royal Enfield, a backhoe loader is "a JCB" whoever made it, and half the
 * country still says Bangalore and Madras.
 *
 * Keys are matched whole-word against the query; values are what the
 * catalogue calls it.
 */
export const ALIASES: Record<string, string> = {
  scooty: "scooters",
  scooter: "scooters",
  bike: "bikes",
  motorcycle: "bikes",
  motorbike: "bikes",
  bullet: "royal enfield",
  re: "royal enfield",
  enfield: "royal enfield",
  car: "cars",
  suv: "cars",
  ev: "evs",
  electric: "evs",
  truck: "trucks",
  tempo: "trucks",
  lorry: "trucks",
  pickup: "trucks",
  jcb: "jcbs",
  backhoe: "jcbs",
  excavator: "jcbs",
  earthmover: "jcbs",
  tractor: "tractors",
  bangalore: "bengaluru",
  blr: "bengaluru",
  madras: "chennai",
  kovai: "coimbatore",
  hyd: "hyderabad",
};

const norm = (text: string) =>
  text.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

/**
 * The query as a list of alternative search terms: itself, plus the
 * canonical form of any alias it contains. "scooty in madras" searches for
 * that string and for "scooters in chennai". Used by the results filter as
 * well as by suggestions, so a suggestion never promises a match the
 * results page then fails to find.
 */
export function expandQuery(query: string): string[] {
  const q = norm(query);
  if (!q) return [];
  const words = q.split(" ");
  const replaced = words.map((w) => ALIASES[w] ?? w).join(" ");
  const terms = new Set([q, replaced]);
  // A single-word alias also stands alone: "jcb" should find the category
  // even though no model name contains the word "jcbs".
  for (const w of words) if (ALIASES[w]) terms.add(ALIASES[w]);
  return [...terms];
}

/* ── Ranking ───────────────────────────────────────────────────── */

/**
 * How well `candidate` answers `term`: exact beats whole-string prefix
 * beats a word-start match beats a match mid-word. Returns 0 for no match.
 * The tiers are why typing "ro" puts Royal Enfield first; a mid-word hit
 * only counts from three characters, since two letters appear inside
 * almost every name.
 */
function score(candidate: string, term: string): number {
  const c = norm(candidate);
  if (!term || !c) return 0;
  if (c === term) return 4;
  if (c.startsWith(term)) return 3;
  if (c.split(" ").some((w) => w.startsWith(term))) return 2;
  if (term.length >= 3 && c.includes(term)) return 1;
  return 0;
}

function best(candidate: string, terms: string[]): number {
  return Math.max(0, ...terms.map((t) => score(candidate, t)));
}

/* ── Suggestions ───────────────────────────────────────────────── */

export type Suggestion =
  | { kind: "category"; id: Category; label: string; count: number }
  | { kind: "brand"; label: string; count: number }
  | { kind: "model"; slug: string; label: string; brand: string; city: string }
  | { kind: "city"; label: string; count: number }
  | { kind: "recent"; label: string }
  | { kind: "popular"; slug: string; label: string; brand: string };

export type SuggestionGroup = { title: string; items: Suggestion[] };

const MAX_PER_GROUP = 4;

export function suggest(
  query: string,
  inventory: Vehicle[] = VEHICLES,
): SuggestionGroup[] {
  const terms = expandQuery(query);
  if (terms.length === 0) return [];

  const categories = CATEGORIES.map((c) => ({
    s: Math.max(best(c.label, terms), best(c.id, terms)),
    item: {
      kind: "category" as const,
      id: c.id,
      label: c.label,
      count: inventory.filter((v) => v.category === c.id).length,
    },
  }));

  const brandCounts = new Map<string, number>();
  for (const v of inventory)
    brandCounts.set(v.brand, (brandCounts.get(v.brand) ?? 0) + 1);
  const brands = [...brandCounts].map(([brand, count]) => ({
    s: best(brand, terms),
    item: { kind: "brand" as const, label: brand, count },
  }));

  const models = inventory.map((v) => ({
    // A model is findable by its own name or by "brand model", and a
    // bare engine size ("350") finds the bikes that carry it.
    s: Math.max(
      best(v.model, terms),
      best(`${v.brand} ${v.model}`, terms),
      v.track === "ride-drive" && v.specs.engineCc
        ? best(String(v.specs.engineCc), terms)
        : 0,
    ),
    // Popularity breaks ties, so among equal matches the one people
    // actually book comes first.
    t: v.trips,
    item: {
      kind: "model" as const,
      slug: v.slug,
      label: v.model,
      brand: v.brand,
      city: v.city,
    },
  }));

  const cities = INVENTORY_CITIES.map((city) => ({
    s: best(city, terms),
    item: {
      kind: "city" as const,
      label: city,
      count: inventory.filter((v) => v.city === city).length,
    },
  }));

  const pick = <T extends { s: number; t?: number }>(rows: T[]) =>
    rows
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s || (b.t ?? 0) - (a.t ?? 0))
      .slice(0, MAX_PER_GROUP);

  const ranked = [
    { title: "Categories", rows: pick(categories) },
    { title: "Brands", rows: pick(brands) },
    { title: "Vehicles", rows: pick(models) },
    { title: "Cities", rows: pick(cities) },
  ];

  // The group holding the strongest match leads, rather than a fixed
  // order: typing "chen" should open on Chennai, not on a Categories
  // header with nothing relevant under it. Ties keep the order above.
  return ranked
    .map((g, i) => ({ ...g, i, top: g.rows[0]?.s ?? 0 }))
    .filter((g) => g.rows.length > 0)
    .sort((a, b) => b.top - a.top || a.i - b.i)
    .map((g) => ({ title: g.title, items: g.rows.map((r) => r.item) }));
}

/** What the box offers before anything is typed: the renter's own recent
 *  searches first (OLX), then the most-booked vehicles (Cars24's
 *  "popular" row). Recents are theirs, so they outrank ours. */
export function emptyStateGroups(
  recent: string[],
  inventory: Vehicle[] = VEHICLES,
): SuggestionGroup[] {
  const groups: SuggestionGroup[] = [];
  if (recent.length)
    groups.push({
      title: "Recent",
      items: recent.map((label) => ({ kind: "recent", label })),
    });
  groups.push({
    title: "Most booked",
    items: [...inventory]
      .sort((a, b) => b.trips - a.trips)
      .slice(0, recent.length ? 3 : 5)
      .map((v) => ({
        kind: "popular",
        slug: v.slug,
        label: v.model,
        brand: v.brand,
      })),
  });
  return groups;
}

/* ── Recent searches ───────────────────────────────────────────── */

const RECENT_KEY = "motora.recent.v1";
const RECENT_MAX = 5;

/** Wrapped like every storage access in the app: private windows throw,
 *  and a list of recent searches is never worth breaking the page for. */
export function readRecent(): string[] {
  try {
    const raw = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(raw)
      ? raw.filter((v): v is string => typeof v === "string").slice(0, RECENT_MAX)
      : [];
  } catch {
    return [];
  }
}

export function pushRecent(query: string) {
  const q = query.trim();
  if (!q) return;
  try {
    const next = [q, ...readRecent().filter((r) => norm(r) !== norm(q))];
    localStorage.setItem(RECENT_KEY, JSON.stringify(next.slice(0, RECENT_MAX)));
  } catch {
    // Storage unavailable; the search itself still goes through.
  }
}

export function clearRecent() {
  try {
    localStorage.removeItem(RECENT_KEY);
  } catch {
    // Nothing to clear if storage is unavailable.
  }
}
