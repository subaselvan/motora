import {
  isAvailable,
  parseWindow,
  quoteTrip,
  type ParsedWindow,
  type Quote,
} from "@/lib/rental";
import {
  CATEGORIES,
  VEHICLES,
  type Category,
  type LicenceClass,
  type Track,
  type Vehicle,
} from "@/lib/vehicles";

/**
 * The search layer.
 *
 * Deliberately pure: no React, no DOM, no fetch. Today `searchVehicles`
 * filters the in-memory demo fleet; when the database lands, only the body
 * of that one function becomes a query. Every caller — the server page, the
 * filter bar's facet counts, a future /api/search route — keeps working
 * against the same signature.
 *
 * That is the whole reason this file exists rather than the filter logic
 * living inline in the page, where swapping the data source would mean
 * rewriting the page.
 */

export type SortKey =
  | "recommended"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "trips";

export const SORTS: { id: SortKey; label: string }[] = [
  { id: "recommended", label: "Recommended" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "rating", label: "Highest rated" },
  { id: "trips", label: "Most booked" },
];

export type SearchQuery = {
  q: string;
  city: string;
  category?: Category;
  track?: Track;
  /** Inclusive rupees-per-day bounds. Undefined means unbounded that side. */
  minPrice?: number;
  maxPrice?: number;
  licence?: LicenceClass;
  /** Ride & Drive carries a `verified` flag; Heavy & Farm carries
   *  `rtoRegistered`. Both mean "we checked the paperwork", so one control
   *  drives both rather than making the renter learn our schema. */
  verifiedOnly: boolean;
  /** Hide anything the current trust score cannot book. */
  unlockedOnly: boolean;
  sort: SortKey;
  /** Raw trip window as it arrived, kept so an invalid entry can be shown
   *  back to the renter with the reason, rather than silently dropped. */
  from: string;
  to: string;
  /** The validated reading of from/to. Only a "valid" window filters. */
  when: ParsedWindow;
};

export const EMPTY_QUERY: SearchQuery = {
  q: "",
  city: "",
  verifiedOnly: false,
  unlockedOnly: false,
  sort: "recommended",
  from: "",
  to: "",
  when: { state: "none" },
};

/* ── URL <-> query ─────────────────────────────────────────────── */

const CATEGORY_IDS = new Set<string>(CATEGORIES.map((c) => c.id));
const SORT_IDS = new Set<string>(SORTS.map((s) => s.id));
const LICENCE_IDS = new Set<string>([
  "none",
  "two-wheeler",
  "lmv",
  "commercial",
]);

type RawParams = Record<string, string | string[] | undefined>;

const one = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value)?.trim() ?? "";

/** A positive integer, or undefined. Rejects NaN, negatives and junk so a
 *  hand-edited URL degrades to "no filter" rather than to zero results. */
function int(value: string): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : undefined;
}

export function parseSearchQuery(params: RawParams): SearchQuery {
  const category = one(params.category);
  const track = one(params.track);
  const licence = one(params.licence);
  const sort = one(params.sort);
  const minPrice = int(one(params.min));
  const maxPrice = int(one(params.max));
  const from = one(params.from);
  const to = one(params.to);

  return {
    from,
    to,
    when: parseWindow(from, to),
    q: one(params.q),
    city: one(params.city),
    category: CATEGORY_IDS.has(category) ? (category as Category) : undefined,
    track:
      track === "ride-drive" || track === "heavy-farm"
        ? (track as Track)
        : undefined,
    licence: LICENCE_IDS.has(licence) ? (licence as LicenceClass) : undefined,
    // Swap inverted bounds rather than returning nothing. ?min=9000&max=500
    // is a user dragging two thumbs past each other, not a request for zero.
    minPrice:
      minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice
        ? maxPrice
        : minPrice,
    maxPrice:
      minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice
        ? minPrice
        : maxPrice,
    verifiedOnly: one(params.verified) === "1",
    unlockedOnly: one(params.unlocked) === "1",
    sort: SORT_IDS.has(sort) ? (sort as SortKey) : "recommended",
  };
}

/** Only non-default values are written, so a cleared filter leaves no trace
 *  in the URL and "/search" stays the canonical unfiltered address. */
export function serializeSearchQuery(query: SearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.city) params.set("city", query.city);
  if (query.category) params.set("category", query.category);
  if (query.track) params.set("track", query.track);
  if (query.licence) params.set("licence", query.licence);
  if (query.minPrice !== undefined) params.set("min", String(query.minPrice));
  if (query.maxPrice !== undefined) params.set("max", String(query.maxPrice));
  if (query.verifiedOnly) params.set("verified", "1");
  if (query.unlockedOnly) params.set("unlocked", "1");
  if (query.sort !== "recommended") params.set("sort", query.sort);
  // Both or neither: half a window is not a search.
  if (query.from && query.to) {
    params.set("from", query.from);
    params.set("to", query.to);
  }
  return params;
}

export function isEmptyQuery(query: SearchQuery): boolean {
  return serializeSearchQuery(query).toString() === "";
}

/* ── Filtering ─────────────────────────────────────────────────── */

/** One vehicle's searchable text, lowercased once per call. Includes the
 *  category label as well as its id so "two wheeler" style searches on the
 *  human word work, and the engine size so "350" finds a Classic 350. */
function haystack(vehicle: Vehicle): string {
  const label = CATEGORIES.find((c) => c.id === vehicle.category)?.label ?? "";
  const cc =
    vehicle.track === "ride-drive" ? (vehicle.specs.engineCc ?? "") : "";
  return `${vehicle.brand} ${vehicle.model} ${vehicle.category} ${label} ${vehicle.city} ${cc}`.toLowerCase();
}

/** "We checked the paperwork", across both tracks. */
export function isVerified(vehicle: Vehicle): boolean {
  return vehicle.track === "ride-drive"
    ? vehicle.verified
    : vehicle.rtoRegistered;
}

export function isLocked(vehicle: Vehicle, trustScore: number): boolean {
  return trustScore < vehicle.minTrustScore;
}

/**
 * Every predicate except one. Splitting it this way is what makes honest
 * facet counts possible: to count how many bikes a renter would get, we
 * apply the whole query *except* the category clause, then count bikes.
 * Counting with the category applied would only ever return the current
 * selection, which is the bug every naive facet UI ships with.
 */
function matches(
  vehicle: Vehicle,
  query: SearchQuery,
  trustScore: number,
  skip?: "category" | "track" | "city",
): boolean {
  if (skip !== "category" && query.category && vehicle.category !== query.category)
    return false;
  if (skip !== "track" && query.track && vehicle.track !== query.track)
    return false;
  if (
    skip !== "city" &&
    query.city &&
    !vehicle.city.toLowerCase().includes(query.city.toLowerCase())
  )
    return false;
  if (query.licence && vehicle.requiredLicence !== query.licence) return false;
  if (query.minPrice !== undefined && vehicle.perDay < query.minPrice)
    return false;
  if (query.maxPrice !== undefined && vehicle.perDay > query.maxPrice)
    return false;
  if (query.verifiedOnly && !isVerified(vehicle)) return false;
  if (query.unlockedOnly && isLocked(vehicle, trustScore)) return false;
  if (query.q && !haystack(vehicle).includes(query.q.toLowerCase()))
    return false;
  // Last: the only clause that does per-day work.
  if (query.when.state === "valid" && !isAvailable(vehicle, query.when.window))
    return false;
  return true;
}

/** With a trip window, "price" means what this trip costs, not the day
 *  rate: a scooter billed hourly and a car billed daily do not sort
 *  correctly by per-day figures once the hourly rate is cheaper. */
function compare(
  a: Vehicle,
  b: Vehicle,
  sort: SortKey,
  price: (v: Vehicle) => number,
): number {
  switch (sort) {
    case "price-asc":
      return price(a) - price(b);
    case "price-desc":
      return price(b) - price(a);
    case "rating":
      // Rating alone puts a 5.0 with two trips above a 4.8 with three
      // hundred. Trips break the tie, which is what every marketplace
      // that has been burned by this ends up doing.
      return b.rating - a.rating || b.trips - a.trips;
    case "trips":
      return b.trips - a.trips;
    case "recommended":
    default:
      // Rating weighted by how much evidence sits behind it. log10 keeps a
      // 300-trip listing ahead of a 30-trip one without letting volume
      // swamp quality outright.
      return (
        b.rating * Math.log10(b.trips + 10) -
        a.rating * Math.log10(a.trips + 10)
      );
  }
}

export function searchVehicles(
  query: SearchQuery,
  trustScore: number,
  inventory: Vehicle[] = VEHICLES,
): Vehicle[] {
  const quotes = quotesFor(query, inventory);
  const price = (v: Vehicle) => quotes?.get(v.id)?.total ?? v.perDay;
  return inventory
    .filter((v) => matches(v, query, trustScore))
    .sort((a, b) => compare(a, b, query.sort, price));
}

/** A trip quote per vehicle for the query's window, or null without one. */
export function quotesFor(
  query: SearchQuery,
  inventory: Vehicle[] = VEHICLES,
): Map<string, Quote> | null {
  if (query.when.state !== "valid") return null;
  const hours = query.when.hours;
  return new Map(inventory.map((v) => [v.id, quoteTrip(v, hours)]));
}

/* ── Facets ────────────────────────────────────────────────────── */

export type Facets = {
  categories: Record<Category, number>;
  tracks: Record<Track, number>;
  cities: { name: string; count: number }[];
  /** Price bounds of the whole inventory, for the slider's endpoints. They
   *  do not narrow with the query — a slider whose track moves under the
   *  thumb as you drag it is unusable. */
  priceFloor: number;
  priceCeiling: number;
};

export function computeFacets(
  query: SearchQuery,
  trustScore: number,
  inventory: Vehicle[] = VEHICLES,
): Facets {
  const categories = Object.fromEntries(
    CATEGORIES.map((c) => [c.id, 0]),
  ) as Record<Category, number>;
  const tracks: Record<Track, number> = { "ride-drive": 0, "heavy-farm": 0 };
  const cityCounts = new Map<string, number>();

  for (const vehicle of inventory) {
    if (matches(vehicle, query, trustScore, "category"))
      categories[vehicle.category] += 1;
    if (matches(vehicle, query, trustScore, "track"))
      tracks[vehicle.track] += 1;
    if (matches(vehicle, query, trustScore, "city"))
      cityCounts.set(vehicle.city, (cityCounts.get(vehicle.city) ?? 0) + 1);
  }

  const prices = inventory.map((v) => v.perDay);

  return {
    categories,
    tracks,
    cities: [...cityCounts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
    priceFloor: Math.floor(Math.min(...prices) / 50) * 50,
    priceCeiling: Math.ceil(Math.max(...prices) / 100) * 100,
  };
}

/* ── Price scale ───────────────────────────────────────────────── */

/**
 * The fleet runs ₹379 to ₹18,900 — a fiftyfold spread, because a scooter and
 * a backhoe are in the same list. On a linear slider the first 60% of the
 * track would cover four vehicles and the rest would cover nineteen, so the
 * useful range is a few pixels wide. Mapping position through a logarithm
 * gives each price *decade* equal travel, which is how the control ends up
 * matching the way people actually think about it: "under a thousand",
 * "a few thousand", "ten and up".
 */
export function priceToSlider(price: number, floor: number, ceiling: number) {
  const lo = Math.log(Math.max(floor, 1));
  const hi = Math.log(Math.max(ceiling, floor + 1));
  return ((Math.log(Math.max(price, 1)) - lo) / (hi - lo)) * 100;
}

export function sliderToPrice(position: number, floor: number, ceiling: number) {
  const lo = Math.log(Math.max(floor, 1));
  const hi = Math.log(Math.max(ceiling, floor + 1));
  const raw = Math.exp(lo + (position / 100) * (hi - lo));
  // Round to something a person would say out loud, at a granularity that
  // scales with the number: ₹50 steps down low, ₹500 steps up high.
  const step = raw < 1000 ? 50 : raw < 5000 ? 100 : 500;
  return Math.round(raw / step) * step;
}
