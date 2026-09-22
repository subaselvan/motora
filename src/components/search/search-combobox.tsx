"use client";

import { Fragment, useId, useMemo, useState } from "react";
import { Clock, LayoutGrid, MapPin, Search, Tag, TrendingUp, Car } from "lucide-react";
import {
  clearRecent,
  emptyStateGroups,
  readRecent,
  suggest,
  type Suggestion,
  type SuggestionGroup,
} from "@/lib/suggest";

/**
 * The search box with type-ahead.
 *
 * WAI-ARIA 1.2 combobox: focus never leaves the input. Arrow keys move a
 * virtual highlight that aria-activedescendant points at, so a screen
 * reader announces each option as it is reached while the caret stays
 * where the renter is typing. Options sit in labelled groups, so "Royal
 * Enfield, Brands, 2 vehicles" is read with its group, not as a bare word.
 *
 * Mouse selection uses onMouseDown + preventDefault: a click would blur the
 * input first, close the list, and the click would land on nothing.
 */
export function SearchCombobox({
  value,
  onChange,
  onSelect,
  placeholder,
  inputClassName,
}: {
  value: string;
  onChange: (text: string) => void;
  onSelect: (suggestion: Suggestion) => void;
  placeholder: string;
  inputClassName?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  // Read on focus, not on mount: it is only needed once the list opens,
  // and reading localStorage during render would differ from the server.
  const [recent, setRecent] = useState<string[]>([]);

  const groups: SuggestionGroup[] = useMemo(
    () => (value.trim() ? suggest(value) : emptyStateGroups(recent)),
    [value, recent],
  );
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);
  // Where each group's options start in the flat list, so an option's
  // index is known without a counter mutated during render.
  const offsets = useMemo(
    () =>
      groups.map((_, gi) =>
        groups.slice(0, gi).reduce((n, g) => n + g.items.length, 0),
      ),
    [groups],
  );
  const optionId = (i: number) => `${id}-opt-${i}`;
  const showList = open && flat.length > 0;

  function choose(index: number) {
    const item = flat[index];
    if (!item) return;
    setOpen(false);
    setActive(-1);
    onSelect(item);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      const step = e.key === "ArrowDown" ? 1 : -1;
      setActive((i) => (flat.length ? (i + step + flat.length) % flat.length : -1));
    } else if (e.key === "Enter") {
      // Only intercept Enter when an option is highlighted. With nothing
      // highlighted it submits the form — typing a query and pressing
      // Enter must still just search.
      if (showList && active >= 0) {
        e.preventDefault();
        choose(active);
      } else {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      // First Escape closes the list; a second clears the field, which is
      // the native behaviour of type="search" and what people expect.
      if (showList) {
        e.preventDefault();
        setOpen(false);
        setActive(-1);
      }
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <label htmlFor={`${id}-input`} className="sr-only">
        Search by model, brand, category or city
      </label>
      <Search
        size={16}
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-pearl-muted"
      />
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        autoComplete="off"
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={listId}
        aria-activedescendant={showList && active >= 0 ? optionId(active) : undefined}
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => {
          setRecent(readRecent());
          setOpen(true);
        }}
        onBlur={() => {
          setOpen(false);
          setActive(-1);
        }}
        onKeyDown={onKeyDown}
        className={[
          "flex w-full rounded-[var(--radius-sm)] border border-charcoal-2 bg-obsidian-sunken px-3 py-2 text-pearl shadow-[var(--elev-sunken)] placeholder:text-pearl-muted transition-colors",
          "focus-visible:outline-none focus-visible:border-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian",
          inputClassName ?? "",
        ].join(" ")}
      />

      {/* Always in the DOM so aria-controls resolves; hidden when closed.
          data-lenis-prevent lets the list scroll under the wheel on the
          homepage, where smooth scroll would otherwise move the page. */}
      <div
        id={listId}
        role="listbox"
        aria-label="Search suggestions"
        data-lenis-prevent
        hidden={!showList}
        className="combobox-list"
      >
        {groups.map((group, gi) => (
          <div key={group.title} role="group" aria-labelledby={`${id}-${group.title}`}>
            <div className="flex items-center justify-between px-3 pb-1 pt-2.5">
              <p
                id={`${id}-${group.title}`}
                className="font-body text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-pearl-muted"
              >
                {group.title}
              </p>
              {group.title === "Recent" && (
                <button
                  type="button"
                  // A listbox may only contain options and groups, so this
                  // mouse convenience is kept out of both the tab order and
                  // the accessibility tree rather than breaking the pattern.
                  tabIndex={-1}
                  aria-hidden="true"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    clearRecent();
                    setRecent([]);
                  }}
                  className="text-[0.6875rem] text-orange transition-colors hover:text-orange-hover"
                >
                  Clear
                </button>
              )}
            </div>
            {group.items.map((item, ii) => {
              const i = offsets[gi] + ii;
              return (
                <div
                  key={`${item.kind}-${"slug" in item ? item.slug : item.label}`}
                  id={optionId(i)}
                  role="option"
                  aria-selected={i === active}
                  data-active={i === active || undefined}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    choose(i);
                  }}
                  onMouseMove={() => setActive(i)}
                  className="combobox-option"
                >
                  <OptionBody item={item} query={value} />
                </div>
              );
            })}
          </div>
        ))}
        <p
          aria-hidden="true"
          // Keyboard hints mean nothing on a touch screen.
          className="border-t border-charcoal-1 px-3 py-2 text-[0.6875rem] text-pearl-muted max-sm:hidden"
        >
          <kbd className="font-body">↑</kbd> <kbd className="font-body">↓</kbd> to move ·{" "}
          <kbd className="font-body">Enter</kbd> to choose ·{" "}
          <kbd className="font-body">Esc</kbd> to close
        </p>
      </div>
    </div>
  );
}

const ICON = {
  category: LayoutGrid,
  brand: Tag,
  model: Car,
  city: MapPin,
  recent: Clock,
  popular: TrendingUp,
} as const;

function OptionBody({ item, query }: { item: Suggestion; query: string }) {
  const Icon = ICON[item.kind];
  const meta =
    item.kind === "category" || item.kind === "brand" || item.kind === "city"
      ? `${item.count} ${item.count === 1 ? "vehicle" : "vehicles"}`
      : item.kind === "model"
        ? item.city
        : null;

  return (
    <>
      <Icon size={14} aria-hidden="true" className="shrink-0 text-pearl-muted" />
      <span className="min-w-0 flex-1 truncate">
        {item.kind === "model" || item.kind === "popular" ? (
          <>
            <span className="text-pearl-dim">{item.brand} </span>
            <Highlight text={item.label} query={query} />
          </>
        ) : (
          <Highlight text={item.label} query={query} />
        )}
      </span>
      {meta && (
        <span data-figure className="shrink-0 text-xs tabular-nums text-pearl-muted">
          {meta}
        </span>
      )}
    </>
  );
}

/** Bolds the part of a suggestion that matches what was typed — the
 *  Cars24 treatment, which lets the eye confirm a match without reading
 *  the whole row. Aliases ("scooty" -> Scooters) have no literal overlap
 *  and render plain, which is correct: nothing typed appears in them. */
function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim().toLowerCase();
  const at = q ? text.toLowerCase().indexOf(q) : -1;
  if (at < 0) return <>{text}</>;
  return (
    <Fragment>
      {text.slice(0, at)}
      <mark className="bg-transparent font-semibold text-lime">
        {text.slice(at, at + q.length)}
      </mark>
      {text.slice(at + q.length)}
    </Fragment>
  );
}
