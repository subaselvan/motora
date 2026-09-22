"use client";

import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import {
  TIME_SLOTS,
  addMinutes,
  earliestPickup,
  formatSlot,
} from "@/lib/rental";

/**
 * Pick-up and drop-off, as a date plus a half-hour slot each.
 *
 * Not <input type="datetime-local">: it cannot restrict times to hub hours
 * or to a half-hour grid, so it would happily accept a 3:17 AM hand-over.
 * A native date input keeps the phone's own calendar picker, and a select
 * of real slots makes an impossible time unselectable instead of an error
 * after the fact — the Royal Brothers pattern, without its custom calendar.
 *
 * The parent only ever hears complete windows (both ends set) or an empty
 * one. Half-filled state lives here, because half a window is not a search.
 */
const DEFAULT_TIME = "10:00";

const noSubscribe = () => () => {};
const serverNull = () => null;

type Parts = { pd: string; pt: string; dd: string; dt: string };

function split(from: string, to: string): Parts {
  return {
    pd: from.slice(0, 10),
    pt: from.slice(11, 16) || DEFAULT_TIME,
    dd: to.slice(0, 10),
    dt: to.slice(11, 16) || DEFAULT_TIME,
  };
}

export function TripWindowFields({
  from,
  to,
  onChange,
  layout = "row",
}: {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  /** "row" puts pick-up and drop-off side by side from sm up; "stack"
   *  keeps them stacked, for the narrow filter rail. */
  layout?: "row" | "stack";
}) {
  const id = useId();
  const [parts, setParts] = useState<Parts>(() => split(from, to));

  // Adopt changes that come from outside (Clear all, a shared link, back
  // button) without clobbering an entry in progress that we never emitted.
  const lastEmitted = useRef(`${from}|${to}`);
  useEffect(() => {
    const incoming = `${from}|${to}`;
    if (incoming === lastEmitted.current) return;
    lastEmitted.current = incoming;
    setParts(split(from, to));
  }, [from, to]);

  // The earliest bookable slot depends on the clock, so the server renders
  // without it (null) and the client fills it in after hydration — a render
  // straddling a slot boundary would otherwise disagree by one option.
  // useSyncExternalStore rather than an effect: it is the hydration-safe
  // read of a client-only value, without the extra render.
  const earliest = useSyncExternalStore(noSubscribe, earliestPickup, serverNull);
  const minDate = earliest?.slice(0, 10);

  function commit(next: Parts) {
    setParts(next);
    const complete = next.pd && next.pt && next.dd && next.dt;
    const nextFrom = complete ? `${next.pd}T${next.pt}` : "";
    const nextTo = complete ? `${next.dd}T${next.dt}` : "";
    const key = `${nextFrom}|${nextTo}`;
    // Only tell the parent when the answer changes: clearing one field of
    // an already-empty window is not news, and would cost a navigation.
    if (key === lastEmitted.current) return;
    lastEmitted.current = key;
    onChange(nextFrom, nextTo);
  }

  function setPickupDate(pd: string) {
    const next = { ...parts, pd };
    if (!pd) {
      commit({ pd: "", pt: parts.pt, dd: "", dt: parts.dt });
      return;
    }
    // Picking today after 10 AM would default to a slot already gone;
    // start from the first one still bookable instead.
    if (earliest && pd === earliest.slice(0, 10) && next.pt < earliest.slice(11)) {
      next.pt = earliest.slice(11);
    }
    // Drop-off defaults to 24 hours later, and is pushed along if the new
    // pick-up would land after it. Every rental site the renter has used
    // does the first; not doing the second produces an invalid window from
    // one innocent click.
    const pickup = `${pd}T${next.pt}`;
    const drop = next.dd ? `${next.dd}T${next.dt}` : "";
    if (!drop || drop <= pickup) {
      const later = addMinutes(pickup, 24 * 60);
      next.dd = later.slice(0, 10);
      next.dt = later.slice(11, 16);
    }
    commit(next);
  }

  const stack = layout === "stack";

  return (
    <div
      role="group"
      aria-label="Trip dates"
      className={
        stack ? "flex flex-col gap-3" : "grid grid-cols-1 gap-3 sm:grid-cols-2"
      }
    >
      <WhenField
        label="Pick-up"
        dateId={`${id}-pd`}
        timeId={`${id}-pt`}
        date={parts.pd}
        time={parts.pt}
        minDate={minDate}
        // Slots before the earliest are disabled, not removed, only on the
        // earliest day — removing them would shift the list under a thumb.
        isSlotDisabled={(slot) =>
          Boolean(
            earliest &&
              parts.pd === earliest.slice(0, 10) &&
              slot < earliest.slice(11),
          )
        }
        onDate={setPickupDate}
        onTime={(pt) => commit({ ...parts, pt })}
      />
      <WhenField
        label="Drop-off"
        dateId={`${id}-dd`}
        timeId={`${id}-dt`}
        date={parts.dd}
        time={parts.dt}
        minDate={parts.pd || minDate}
        isSlotDisabled={(slot) =>
          Boolean(parts.pd && parts.dd === parts.pd && slot <= parts.pt)
        }
        onDate={(dd) => commit({ ...parts, dd })}
        onTime={(dt) => commit({ ...parts, dt })}
      />
    </div>
  );
}

function WhenField({
  label,
  dateId,
  timeId,
  date,
  time,
  minDate,
  isSlotDisabled,
  onDate,
  onTime,
}: {
  label: string;
  dateId: string;
  timeId: string;
  date: string;
  time: string;
  minDate?: string;
  isSlotDisabled: (slot: string) => boolean;
  onDate: (value: string) => void;
  onTime: (value: string) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-1.5 font-body text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-pearl-muted">
        {label}
      </legend>
      <div className="flex gap-1.5">
        <div className="min-w-0 flex-1">
          <label htmlFor={dateId} className="sr-only">
            {label} date
          </label>
          {/* No decorative calendar icon: the browser draws its own at the
              right edge, and that one is the button that opens the picker.
              Two calendars on one field reads as two controls. */}
          <input
            id={dateId}
            type="date"
            value={date}
            data-empty={!date || undefined}
            min={minDate}
            onChange={(e) => onDate(e.target.value)}
            // color-scheme:dark makes the browser draw its own calendar
            // popup and icon for a dark page instead of a white panel.
            className="field-date h-11 w-full px-3 text-sm"
          />
        </div>
        <div className="w-[7.25rem] shrink-0">
          <label htmlFor={timeId} className="sr-only">
            {label} time
          </label>
          <select
            id={timeId}
            value={time}
            onChange={(e) => onTime(e.target.value)}
            disabled={!date}
            className="field-select h-11 pl-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot} disabled={isSlotDisabled(slot)}>
                {formatSlot(slot)}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
