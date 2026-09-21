"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchNav } from "@/components/search/search-transition";
import {
  SORTS,
  isEmptyQuery,
  priceToSlider,
  serializeSearchQuery,
  sliderToPrice,
  type Facets,
  type SearchQuery,
  type SortKey,
} from "@/lib/search";
import { CATEGORIES, formatINR, type Category, type Track } from "@/lib/vehicles";

const TRACKS: { id: Track; label: string }[] = [
  { id: "ride-drive", label: "Ride & Drive" },
  { id: "heavy-farm", label: "Heavy & Farm" },
];

/** Every filter surface below reads the query from props rather than from
 *  `useSearchParams`. The server already parsed and validated it; parsing it
 *  a second time on the client is how the two drift apart. */
export function FilterBar({
  query,
  facets,
  resultCount,
}: {
  query: SearchQuery;
  facets: Facets;
  resultCount: number;
}) {
  const { navigate } = useSearchNav();

  const update = useCallback(
    (patch: Partial<SearchQuery>) => {
      navigate(serializeSearchQuery({ ...query, ...patch }));
    },
    [navigate, query],
  );

  const activeCount = countActive(query);

  return (
    <>
      {/* Mobile: a disclosure rather than a drawer. A drawer needs a focus
          trap, a scroll lock and an escape handler to be correct; <details>
          is all three for free and degrades without JavaScript. */}
      <details className="filter-disclosure lg:hidden">
        <summary className="filter-summary">
          <SlidersHorizontal size={15} aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="filter-count">{activeCount}</span>
          )}
        </summary>
        <div className="pt-5">
          <FilterFields query={query} facets={facets} update={update} />
        </div>
      </details>

      {/* Desktop: a sticky rail. Sticks below the 56px condensed navbar. */}
      <aside
        aria-label="Filters"
        className="hidden lg:sticky lg:top-24 lg:block lg:self-start"
      >
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-heading text-sm font-semibold text-pearl">
            Filters
          </h2>
          {!isEmptyQuery(query) && (
            <ClearAll onClear={() => navigate(new URLSearchParams())} />
          )}
        </div>
        <div className="mt-5">
          <FilterFields query={query} facets={facets} update={update} />
        </div>
        <p className="mt-6 border-t border-charcoal-1 pt-4 text-xs text-pearl-muted">
          {resultCount} of {facets.tracks["ride-drive"] + facets.tracks["heavy-farm"]}{" "}
          shown
        </p>
      </aside>
    </>
  );
}

function ClearAll({ onClear }: { onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="rounded-[var(--radius-sm)] text-xs font-medium text-orange transition-colors duration-[var(--duration-short)] hover:text-orange-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
    >
      Clear all
    </button>
  );
}

function FilterFields({
  query,
  facets,
  update,
}: {
  query: SearchQuery;
  facets: Facets;
  update: (patch: Partial<SearchQuery>) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      <TextFilter query={query} update={update} />
      <CityFilter query={query} facets={facets} update={update} />

      <Field label="Track">
        <div className="flex flex-wrap gap-1.5">
          <Chip
            active={!query.track}
            onClick={() => update({ track: undefined, category: undefined })}
          >
            All
          </Chip>
          {TRACKS.map((track) => (
            <Chip
              key={track.id}
              active={query.track === track.id}
              count={facets.tracks[track.id]}
              onClick={() =>
                update({
                  track: query.track === track.id ? undefined : track.id,
                  // A category belongs to exactly one track, so keeping it
                  // while switching tracks guarantees zero results. Drop it.
                  category: undefined,
                })
              }
            >
              {track.label}
            </Chip>
          ))}
        </div>
      </Field>

      <Field label="Category">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.filter(
            (c) => !query.track || c.track === query.track,
          ).map((c) => (
            <Chip
              key={c.id}
              active={query.category === c.id}
              count={facets.categories[c.id as Category]}
              onClick={() =>
                update({
                  category: query.category === c.id ? undefined : c.id,
                  // Selecting a category implies its track, which keeps the
                  // two controls from ever showing a contradictory pair.
                  track: query.category === c.id ? query.track : c.track,
                })
              }
            >
              {c.label}
            </Chip>
          ))}
        </div>
      </Field>

      <PriceFilter query={query} facets={facets} update={update} />

      <Field label="Only show">
        <div className="flex flex-col gap-2.5">
          <Toggle
            checked={query.verifiedOnly}
            onChange={(v) => update({ verifiedOnly: v })}
          >
            Verified paperwork
          </Toggle>
          <Toggle
            checked={query.unlockedOnly}
            onChange={(v) => update({ unlockedOnly: v })}
          >
            Unlocked at my trust score
          </Toggle>
        </div>
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-body text-xs font-medium uppercase tracking-[0.14em] text-pearl-muted">
          {label}
        </p>
        {hint && (
          <p data-figure className="text-xs tabular-nums text-pearl-dim">
            {hint}
          </p>
        )}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count?: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  // A category with nothing behind it is shown disabled rather than hidden.
  // Removing it would make the row reflow on every adjacent filter change,
  // and "Tractors (0)" is a real answer to "do you have tractors".
  const empty = count === 0 && !active;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={empty}
      aria-pressed={active}
      className={[
        "inline-flex items-center gap-1.5 rounded-[var(--radius-sm)] border px-2.5 py-1.5 text-xs transition-colors duration-[var(--duration-short)] ease-[var(--ease-base)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime",
        active
          ? "border-lime bg-lime/10 text-lime"
          : empty
            ? "cursor-not-allowed border-charcoal-1 text-pearl-muted opacity-45"
            : "border-charcoal-2 text-pearl-dim hover:border-charcoal-3 hover:text-pearl",
      ].join(" ")}
    >
      {children}
      {count !== undefined && (
        <span
          data-figure
          className={[
            "tabular-nums",
            active ? "text-lime/70" : "text-pearl-muted",
          ].join(" ")}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-2.5 text-sm text-pearl-dim transition-colors duration-[var(--duration-short)] hover:text-pearl">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      {/* `peer-checked:` compiles to `.peer:checked ~ &`, so it only reaches
          siblings of the input. The tick is a child of this span, not a
          sibling of the input — it has to be targeted through the span. */}
      <span
        aria-hidden="true"
        className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border border-charcoal-3 transition-colors duration-[var(--duration-short)] peer-checked:border-lime peer-checked:bg-lime peer-checked:[&>svg]:scale-100 peer-focus-visible:ring-2 peer-focus-visible:ring-lime peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-obsidian"
      >
        <svg
          viewBox="0 0 12 12"
          className="h-3 w-3 scale-0 text-lime-ink transition-transform duration-[var(--duration-short)] ease-[var(--ease-base)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
        </svg>
      </span>
      {children}
    </label>
  );
}

/* ── Debounced text ────────────────────────────────────────────── */

/**
 * Typing must not fire a navigation per keystroke. Local state drives the
 * input so it stays responsive; a 300ms idle commits it to the URL.
 *
 * `lastPushed` is what keeps this from oscillating: the effect only pushes
 * when the local value differs from what we last sent, and only adopts the
 * incoming prop when *that* differs from what we last sent. Without it, our
 * own push comes back as a prop change and restarts the cycle.
 */
function useDebouncedField(
  value: string,
  commit: (next: string) => void,
  delay = 300,
) {
  const [local, setLocal] = useState(value);
  const lastPushed = useRef(value);

  useEffect(() => {
    if (value === lastPushed.current) return;
    lastPushed.current = value;
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (local === lastPushed.current) return;
    const timer = setTimeout(() => {
      lastPushed.current = local;
      commit(local);
    }, delay);
    return () => clearTimeout(timer);
  }, [local, commit, delay]);

  return [local, setLocal] as const;
}

function TextFilter({
  query,
  update,
}: {
  query: SearchQuery;
  update: (patch: Partial<SearchQuery>) => void;
}) {
  const id = useId();
  const commit = useCallback((q: string) => update({ q }), [update]);
  const [text, setText] = useDebouncedField(query.q, commit);

  return (
    <Field label="Search">
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Search by model, brand or engine size
        </label>
        <Search
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pearl-muted"
        />
        <Input
          id={id}
          type="search"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Model, brand or cc"
          className="h-10 pl-9 pr-9 text-sm"
        />
        {text && (
          <button
            type="button"
            onClick={() => setText("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-[var(--radius-sm)] text-pearl-muted transition-colors hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            <X size={13} aria-hidden="true" />
          </button>
        )}
      </div>
    </Field>
  );
}

function CityFilter({
  query,
  facets,
  update,
}: {
  query: SearchQuery;
  facets: Facets;
  update: (patch: Partial<SearchQuery>) => void;
}) {
  const id = useId();
  return (
    <Field label="City">
      <div className="relative">
        <label htmlFor={id} className="sr-only">
          Filter by city
        </label>
        <MapPin
          size={15}
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pearl-muted"
        />
        <select
          id={id}
          value={query.city}
          onChange={(e) => update({ city: e.target.value })}
          className="field-select h-10 w-full pl-9 text-sm"
        >
          <option value="">Anywhere</option>
          {facets.cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name} ({city.count})
            </option>
          ))}
        </select>
      </div>
    </Field>
  );
}

/* ── Price ─────────────────────────────────────────────────────── */

function PriceFilter({
  query,
  facets,
  update,
}: {
  query: SearchQuery;
  facets: Facets;
  update: (patch: Partial<SearchQuery>) => void;
}) {
  const { priceFloor: floor, priceCeiling: ceiling } = facets;

  const fromQuery = useCallback(
    (): [number, number] => [
      priceToSlider(query.minPrice ?? floor, floor, ceiling),
      priceToSlider(query.maxPrice ?? ceiling, floor, ceiling),
    ],
    [query.minPrice, query.maxPrice, floor, ceiling],
  );

  const [pos, setPos] = useState<[number, number]>(fromQuery);
  const dragging = useRef(false);

  // Adopt external changes (Clear all, a shared link, the back button) but
  // never while a thumb is under the pointer — the URL update we just sent
  // would otherwise yank the thumb out from under the drag.
  useEffect(() => {
    if (dragging.current) return;
    setPos(fromQuery());
  }, [fromQuery]);

  const commit = useCallback(
    ([lo, hi]: [number, number]) => {
      update({
        // Snapping the ends back to "unbounded" keeps a full-width range out
        // of the URL entirely, so /search stays the canonical address.
        minPrice: lo <= 0.5 ? undefined : sliderToPrice(lo, floor, ceiling),
        maxPrice: hi >= 99.5 ? undefined : sliderToPrice(hi, floor, ceiling),
      });
    },
    [update, floor, ceiling],
  );

  // Dragging fires change continuously; 180ms of stillness commits. Short
  // enough to feel immediate, long enough that a drag across the track is
  // one navigation rather than forty.
  useEffect(() => {
    const [lo, hi] = pos;
    const [qLo, qHi] = fromQuery();
    if (Math.abs(lo - qLo) < 0.01 && Math.abs(hi - qHi) < 0.01) return;
    const timer = setTimeout(() => {
      dragging.current = false;
      commit(pos);
    }, 180);
    return () => clearTimeout(timer);
  }, [pos, fromQuery, commit]);

  const lowPrice = pos[0] <= 0.5 ? floor : sliderToPrice(pos[0], floor, ceiling);
  const highPrice =
    pos[1] >= 99.5 ? ceiling : sliderToPrice(pos[1], floor, ceiling);

  return (
    <Field
      label="Price per day"
      hint={`${formatINR(lowPrice)} – ${formatINR(highPrice)}`}
    >
      <div className="price-range">
        {/* The filled span between the thumbs. Positioned from the same two
            numbers that drive the inputs, so it can never disagree. */}
        <span aria-hidden="true" className="price-range-track" />
        <span
          aria-hidden="true"
          className="price-range-fill"
          style={{ left: `${pos[0]}%`, right: `${100 - pos[1]}%` }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos[0]}
          aria-label="Minimum price per day"
          aria-valuetext={formatINR(lowPrice)}
          onPointerDown={() => (dragging.current = true)}
          onChange={(e) =>
            setPos(([, hi]) => [Math.min(Number(e.target.value), hi - 2), hi])
          }
        />
        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos[1]}
          aria-label="Maximum price per day"
          aria-valuetext={formatINR(highPrice)}
          onPointerDown={() => (dragging.current = true)}
          onChange={(e) =>
            setPos(([lo]) => [lo, Math.max(Number(e.target.value), lo + 2)])
          }
        />
      </div>
      <p className="mt-2.5 text-xs leading-relaxed text-pearl-muted">
        Logarithmic — a scooter and a backhoe share this list, so each price
        decade gets equal travel.
      </p>
    </Field>
  );
}

/* ── Sort ──────────────────────────────────────────────────────── */

export function SortSelect({ query }: { query: SearchQuery }) {
  const { navigate } = useSearchNav();
  const id = useId();
  return (
    <div className="flex items-center gap-2">
      <label
        htmlFor={id}
        className="shrink-0 font-body text-xs font-medium uppercase tracking-[0.14em] text-pearl-muted"
      >
        Sort
      </label>
      <select
        id={id}
        value={query.sort}
        onChange={(e) =>
          navigate(
            serializeSearchQuery({ ...query, sort: e.target.value as SortKey }),
          )
        }
        className="field-select h-9 pl-3 text-sm"
      >
        {SORTS.map((sort) => (
          <option key={sort.id} value={sort.id}>
            {sort.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ── Active filter pills ───────────────────────────────────────── */

function countActive(query: SearchQuery): number {
  return describeActive(query).length;
}

/** One pill per removable clause. Sort is excluded: it is always set to
 *  something, so a "Recommended ×" pill would be noise. */
function describeActive(
  query: SearchQuery,
): { key: string; label: string; clear: Partial<SearchQuery> }[] {
  const pills: { key: string; label: string; clear: Partial<SearchQuery> }[] =
    [];
  if (query.q)
    pills.push({ key: "q", label: `“${query.q}”`, clear: { q: "" } });
  if (query.city)
    pills.push({ key: "city", label: query.city, clear: { city: "" } });
  if (query.track)
    pills.push({
      key: "track",
      label: query.track === "ride-drive" ? "Ride & Drive" : "Heavy & Farm",
      clear: { track: undefined },
    });
  if (query.category)
    pills.push({
      key: "category",
      label:
        CATEGORIES.find((c) => c.id === query.category)?.label ?? query.category,
      clear: { category: undefined },
    });
  if (query.minPrice !== undefined || query.maxPrice !== undefined)
    pills.push({
      key: "price",
      label:
        query.minPrice !== undefined && query.maxPrice !== undefined
          ? `${formatINR(query.minPrice)}–${formatINR(query.maxPrice)}`
          : query.minPrice !== undefined
            ? `Over ${formatINR(query.minPrice)}`
            : `Under ${formatINR(query.maxPrice!)}`,
      clear: { minPrice: undefined, maxPrice: undefined },
    });
  if (query.verifiedOnly)
    pills.push({
      key: "verified",
      label: "Verified",
      clear: { verifiedOnly: false },
    });
  if (query.unlockedOnly)
    pills.push({
      key: "unlocked",
      label: "Unlocked",
      clear: { unlockedOnly: false },
    });
  return pills;
}

export function ActiveFilters({ query }: { query: SearchQuery }) {
  const { navigate } = useSearchNav();
  const pills = describeActive(query);
  if (pills.length === 0) return null;

  return (
    <ul className="flex flex-wrap items-center gap-1.5">
      {pills.map((pill) => (
        <li key={pill.key}>
          <button
            type="button"
            onClick={() =>
              navigate(serializeSearchQuery({ ...query, ...pill.clear }))
            }
            className="inline-flex items-center gap-1.5 rounded-full border border-charcoal-2 bg-obsidian-light py-1 pl-3 pr-2 text-xs text-pearl-dim transition-colors duration-[var(--duration-short)] hover:border-charcoal-3 hover:text-pearl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime"
          >
            {pill.label}
            <X size={12} aria-hidden="true" className="text-pearl-muted" />
            <span className="sr-only">Remove filter</span>
          </button>
        </li>
      ))}
      {pills.length > 1 && (
        <li>
          <ClearAll onClear={() => navigate(new URLSearchParams())} />
        </li>
      )}
    </ul>
  );
}
